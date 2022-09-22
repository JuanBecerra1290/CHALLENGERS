const { Gender, Movie } = require('../models/index')

const { uploadImg } = require('../helpers/upload-img');
const { deleteImg } = require('../helpers/delete-img');

const gendersList = async ( req, res ) => {
       
    try {
        
        const genders = await Gender.findAll()
        
        res.json({
            status: 'ok',
            result: genders,
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: 'error',
            result: 'Error en el servidor, contactarse con soporte.'
        })
    }
}

const genderAdd = async ( req, res ) => {
    //extrae los datos del body.
    const data = req.body
    //Capitalizacion del nombre para usarlo como valor unico en BD.
    data.name = data.name.toUpperCase();
    
    try {
        //Consulta si ya existe el Character en la BD
        const gender = await Gender.findOne({ 
            where: { name: data.name }
        });
        if( gender ){
            return res.status(400).json({
                status: 'error',
                result: 'El genero ya existe.'
            })
        }
        
        //Directorio de alojamiento raiz.
        const directory = 'gender/';
        //Sube imagen y devuelve el path
        const pathImg = await uploadImg( req.files, directory );

        //añade path de la img a los satos del personaje
        data.img = pathImg;

        // Crea una nueva instancia del personaje.
        const newGender = await Gender.create( data );

        //Añade personajes asociados
        if( data.hasOwnProperty('movies') && data.movies !== '' ){
            const idMovies = data.movies.split(',')

            const movies = await Movie.findAll({
                where: { id: idMovies }
            })
            newGender.addCharacters(movies);
        };
    
        res.json({
            status: 'ok',
            result: newGender,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 'error',
            result:'Error del servidor al crear personaje, por favor comunicarse con el administrador'
        })
    }
}

const genderUpdate = async ( req, res ) => {
    const idGender = req.params.id

    //Prevencion en caso de que el usuario envie el id.
    const { id, ...data } = req.body;

    //comprobar que no hay datos vacios
    if((data.hasOwnProperty('name') && data.name === '') || (data.hasOwnProperty('img') && data.img === '')){
        return res.status(400).json({
            status: 'error',
            result:'No se permite enviar caracteres en blanco.'
        })
    }

    if(data.hasOwnProperty('name') && data.name !== ''){
        data.name = data.name.toUpperCase();
    }
    
    try {
        if( req.files && Object.keys(req.files).length !== 0 && req.files.img ){
            //Directorio de alojamiento raiz.
            const directory = 'gender/';
            //Elimina las Imagenes previas del personaje
            await deleteImg( idGender, directory )

            //Sube imagen y devuelve el path
            const pathImg = await uploadImg( req.files, directory );
            //añade path de la imagen a los satos del personaje
            data.img = pathImg;
        }

        const gender = await Gender.findByPk( idGender )
    
        gender.set( data )

        //Añade personajes asociados
        if( data.hasOwnProperty('movies') && data.movies !== '' ){
            const idMovies = data.movies.split(',')
            const movies = await Movie.findAll({
                where: { id: idMovies }
            })
            gender.addMovies(movies);
        };

        await gender.save();

        res.json({
            status: 'Personaje actualizado correctamente',
            result: gender
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 'error',
            result:'Error del servidor al actualizar personaje, por favor comunicarse con el administrador'
        })
    }
}

const genderDelete = async ( req, res ) => {
    const { id } = req.params;

    try {
        const directory = 'gender/';

        await deleteImg( id, directory )

        await Gender.destroy({
            where: {
                id
            }
        });
        res.json({
            status: 'ok',
            result: `Genero con id: ${id} eliminado`
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
    gendersList,
    genderAdd, 
    genderUpdate, 
    genderDelete 
}