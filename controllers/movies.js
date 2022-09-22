const { Op } = require('sequelize');

const { Movie, Character, Gender } = require('../models/index')

const { uploadImg } = require('../helpers/upload-img');
const { deleteImg } = require('../helpers/delete-img');
const { createJWT } = require('../helpers/create-jwt');

const moviesList = async ( req, res ) => {
    const { title, gender, order } = req.query

    if(!title){
        return res.status(400).json({
            status: 'error',
            result: 'Error se requiere el titulo para realizar la busqueda.'
        })
    }
    
    try {
        const whereCondition = {
            attributes: ['img', 'title', 'createDate'],
            where: {
                title: {[Op.substring]: title.toUpperCase()}
            }
        }

        if(order){
            whereCondition.order = ['createDate', order]
        }
        if(gender){
            whereCondition.include = {
                model: Gender,
                attributes: [],
                where: {
                    id: gender
                }
            }
        }

        const movie = await Movie.findAll(whereCondition)

        // Generar JWT
        const token = await createJWT( req.userAuth.id );
        
        res.json({
            status: 'ok',
            result: movie,
            token
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: 'error',
            result: 'Error en el servidor, contactarse con soporte.'
        })
    }
}
const movieDetail = async ( req, res ) => {
    const { id } = req.params;

    try {
        const movie = await Movie.findOne({
            where: {
                id
            },
            include: [
                {
                    model: Character,
                    attributes: ['name'],
                    through: {
                        attributes: []
                    }
                },
                {
                    model: Gender,
                    attributes: ['name'],
                    through: {
                        attributes: []
                    }
                }
            ] 
        })

        const token = await createJWT( req.userAuth.id );
        
        res.json({
            status: 'ok',
            result: movie,
            token
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status:'error',
            result: 'Error en el servidor, contactarse con soporte.'
        })
    }
}
const movieAdd = async ( req, res ) => {
    //extrae los datos del body.
    const data = req.body
    //Capitalizacion del nombre para usarlo como valor unico en BD.
    data.title = data.title.toUpperCase();
    data.createDate = new Date(data.createDate);
    data.ratings = Number.parseFloat(data.ratings);
    
    try {
        //Consulta si ya existe el Character en la BD
        const movie = await Movie.findOne({ 
            where: { title: data.title }
        });
        if( movie ){
            return res.status(400).json({
                status: 'error',
                result: 'La pelicula ya existe.'
            })
        }
        
        //Directorio de alojamiento raiz.
        const directory = 'movie/';
        //Sube imagen y devuelve el path
        const pathImg = await uploadImg( req.files, directory );

        //añade path de la img a los satos del personaje
        data.img = pathImg;

        // Crea una nueva instancia del personaje.
        const newMovie = await Movie.create( data );

        //Añade personajes asociados
        if( data.hasOwnProperty('characters') && data.characters !== '' ){
            const idCharacters = data.characters.split(',')

            const characters = await Character.findAll({
                where: { id: idCharacters }
            })
            newMovie.addCharacters(characters);
        };

        //Añade generode pelicula
        if( data.hasOwnProperty('genders') && data.genders !== '' ){
            const idGenders = data.genders.split(',')

            const genders = await Character.findAll({
                where: { id: idGenders }
            })
            newMovie.addGenders(genders);
        };

        //Generar JWT
        const token = await createJWT( req.userAuth.id );
    
        res.json({
            status: 'ok',
            result: newMovie,
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 'error',
            result:'Error del servidor al crear personaje, por favor comunicarse con el administrador'
        })
    }
}
const movieUpdate = async ( req, res ) => {
    const idMovie = req.params.id

    //Prevencion en caso de que el usuario envie el id.
    const { id, ...data } = req.body;

    //comprobar que no hay datos vacios
    if((data.hasOwnProperty('title') && data.title === '') || (data.hasOwnProperty('createDate') && data.createDate === '') || (data.hasOwnProperty('ratings') && data.ratings === '') || (data.hasOwnProperty('characters') && data.characters === '') || (data.hasOwnProperty('genders') && data.genders === '') || (data.hasOwnProperty('img') && data.img === '')){
        return res.status(400).json({
            status: 'error',
            result:'No se permite enviar caracteres en blanco.'
        })
    }

    if(data.hasOwnProperty('title') && data.title !== ''){
        data.title = data.title.toUpperCase();
    }
    if(data.hasOwnProperty('createDate') && data.createDate !== ''){
        data.createDate = new Date(data.createDate);
    }
    if(data.hasOwnProperty('ratings') && data.ratings !== ''){
        data.ratings = Number.parseFloat(data.ratings);
    }
    
    try {
        if( req.files && Object.keys(req.files).length !== 0 && req.files.img ){
            //Directorio de alojamiento raiz.
            const directory = 'movie/';
            //Elimina las Imagenes previas del personaje
            await deleteImg( idMovie, directory )

            //Sube imagen y devuelve el path
            const pathImg = await uploadImg( req.files, directory );
            //añade path de la imagen a los satos del personaje
            data.img = pathImg;
        }

        const movie = await Movie.findByPk( idMovie )
    
        movie.set( data )

        //Añade personajes asociados
        if( data.hasOwnProperty('characters') && data.characters !== '' ){
            const idCharacters = data.characters.split(',')

            const characters = await Character.findAll({
                where: { id: idCharacters }
            })
            movie.addCharacters(characters);
        };

        //Añade generode pelicula
        if( data.hasOwnProperty('genders') && data.genders !== '' ){
            const idGenders = data.genders.split(',')

            const genders = await Character.findAll({
                where: { id: idGenders }
            })
            movie.addGenders(genders);
        };

        await movie.save();

        const token = await createJWT( req.userAuth.id );

        res.json({
            status: 'Personaje actualizado correctamente',
            result: movie,
            token
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 'error',
            result:'Error del servidor al actualizar personaje, por favor comunicarse con el administrador'
        })
    }
}
const movieDelete = async ( req, res ) => {
    const { id } = req.params;

    try {
        const directory = 'movie/';

        await deleteImg( id, directory )

        await Movie.destroy({
            where: {
                id
            }
        });

        const token = await createJWT( req.userAuth.id );
        res.json({
            status: 'ok',
            result: `Pelicula o serie con id: ${id} eliminada`,
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 'error',
            result:'Error del servidor al crear personaje, por favor comunicarse con el administrador'
        })
    }
}

module.exports = { 
    moviesList, 
    movieDetail,
    movieAdd, 
    movieUpdate, 
    movieDelete 
}