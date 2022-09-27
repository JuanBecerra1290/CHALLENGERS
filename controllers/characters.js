const { Op } = require('sequelize');

const {Character, Movie} = require('../models/index')

const { createJWT } = require('../helpers/create-jwt');
const { uploadImg } = require('../helpers/upload-img');
const { deleteImg } = require('../helpers/delete-img');
const extensionValidation = require('../helpers/extension-validation');

const characterList = async (req, res) =>{
    const { name='', age='', weight='', movie='' } = req.query

    if(name === ''){
        return res.status(400).json({
            status: 'error',
            result: 'Error se requiere el nombre para realizar la busqueda del personaje'
        })
    }

    try {
        const whereCondition = {
            attributes: ['id', 'img', 'name'],
            where: {
                [Op.and]:[
                    {name: {[Op.substring]: name.toUpperCase()}}
                ]
            }
        }

        if(age !== '' && weight !== ''){
            whereCondition.where = {
                [Op.and]:[
                    {name: {[Op.substring]: name.toUpperCase()}},
                    {age},
                    {weight}
                ]
            }
        }else if(age !== ''){
            whereCondition.where = {
                [Op.and]:[
                    {name: {[Op.substring]: name.toUpperCase()}},
                    {age}
                ]
            }
        }else if(weight !== ''){
            whereCondition.where = {
                [Op.and]:[
                    {name: {[Op.substring]: name.toUpperCase()}},
                    {weight}
                ]
            }
        }
        if(movie !== ''){
            whereCondition.include = {
                model: Movie,
                attributes: [],
                where: {
                    id: movie
                }
            }
        }

        const characters = await Character.findAll(whereCondition)

        // Generar JWT
        const token = await createJWT( req.userAuth.id );
        
        res.json({
            status: 'ok',
            result: characters,
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

const characterDetail = async ( req, res ) => {

    const { id } = req.params;

    try {

        const character = await Character.findOne({
            where: {
                id
            },
            include: {
                model: Movie,
                attributes: ['id', 'img', 'title'],
                through: {
                    attributes: []
                }
            }
        })

        const token = await createJWT( req.userAuth.id );
        
        res.json({
            status: 'ok',
            result: character,
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

const characterAdd = async (req, res) => {

    //extrae los datos del body.
    const data = req.body
    //Capitalizacion del nombre para usarlo como valor unico en BD.
    data.name = data.name.toUpperCase();
    data.age = Number.parseInt(data.age);
    data.weight = Number.parseInt(data.weight);

    
    try {
        //Consulta si ya existe el Character en la BD
        const character = await Character.findOne({ 
            where: { name: data.name }
        });
        if( character ){
            return res.status(400).json({
                status: 'error',
                result: 'El personaje ya existe.'
            })
        }
        
        const extValid = extensionValidation(req.files)
        console.log(extValid);
        if( extValid.status ){
            return res.status(400).json({
                status: 'error',
                result: `La extensión '${extValid.extension}' no es valida, solo se permiten las sigientes extensiones: ${extValid.validExtensions}`
            })
        }

        //Directorio de alojamiento raiz.
        const directory = 'character/';
        //Sube imagen y devuelve el path
        const pathImg = await uploadImg( req.files, directory );

        //añade path de la img a los satos del personaje
        data.img = pathImg;

        // Crea una nueva instancia del personaje.
        const newCharacter = await Character.create( data );

        if( data.hasOwnProperty('movies') && data.movies !== '' ){
            const idMovies = data.movies.split(',')

            const movies = await Movie.findAll({
                where: { id: idMovies }
            })
            newCharacter.addMovies(movies);
        };

        //Generar JWT
        const token = await createJWT( req.userAuth.id );
    
        res.json({
            status: 'ok',
            result: newCharacter,
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

const characterUpdate = async ( req, res ) => {

    const idCharacter = req.params.id

    //Prevencion en caso de que el usuario envie el id.
    const { name = '', age = '', weight = '', history = '', movies = '' } = req.body;

    const data = {}

    if( name !== '' ){
        const nameCap = name.toUpperCase();
        data.name = nameCap;
    }
    if( age !== '' ){
        const ageCap = Number.parseInt(age);
        data.age = ageCap;
    }
    if( weight !== '' ){
        const weightCap = Number.parseInt(weight);
        data.weight = weightCap
    }
    if( history !== '' ){
        data.history = history
    }
    
    try {
        if( req.files && Object.keys(req.files).length !== 0 && req.files.img && req.files.img !== ''){
            //Valida que la extension del archivo sea permitido
            const extValid = extensionValidation(req.files)
            
            if( extValid.status ){
                return res.status(400).json({
                    status: 'error',
                    result: `La extensión ${extension} no es valida, solo se permiten: ${extValid.validExtensions}`
                })
            }
            //Directorio de alojamiento raiz.
            const directory = 'character/';
            //Elimina las Imagenes previas del personaje
            await deleteImg( idCharacter, directory )

            //Sube imagen y devuelve el path
            const pathImg = await uploadImg( req.files, directory );
            //añade path de la imagen a los satos del personaje
            data.img = pathImg;
        }

        const character = await Character.findByPk( idCharacter )
    
        character.set( data )

        if(movies !== '' ){
            const idMovies = movies.split(',')

            const movies = await Movie.findAll({
                where: { id: idMovies }
            })
            character.addMovies(movies);
        };

        await character.save();

        const token = await createJWT( req.userAuth.id );

        res.json({
            status: 'ok',
            result: character,
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

const characterDelete = async ( req, res ) => {

    const { id } = req.params;

    try {
        const directory = 'character/';

        await deleteImg( id, directory )

        await Character.destroy({
            where: {
                id
            }
        });

        const token = await createJWT( req.userAuth.id );
        res.json({
            status: 'ok',
            result: `Personaje con id: ${id} eliminado`,
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
    characterList, 
    characterDetail,
    characterAdd, 
    characterUpdate, 
    characterDelete
}