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

        //Valida extension de imagen
        const extValid = extensionValidation(req.files)
            
        if( extValid.status ){
            return res.status(400).json({
                status: 'error',
                result: `La extensión '${extValid.extension}' no es valida, solo se permiten las sigientes extensiones: ${extValid.validExtensions}`
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
            result: 'Error en el servidor, contactarse con soporte.'
        })
    }
}

const genderUpdate = async ( req, res ) => {
    const idGender = req.params.id

    //Prevencion en caso de que el usuario envie el id.
    const { name, movies } = req.body;

    const data = {};

    if( name !== '' ){
        const nameCap = name.toUpperCase();
        data.name = nameCap;
    }
    
    try {
        if( req.files && Object.keys(req.files).length !== 0 && req.files.img && req.files.img !== '' ){
            //Valida extension de imagen
            const extValid = extensionValidation(req.files)
                
            if( extValid.status ){
                return res.status(400).json({
                    status: 'error',
                    result: `La extensión '${extValid.extension}' no es valida, solo se permiten las sigientes extensiones: ${extValid.validExtensions}`
                })
            }

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
        if( movies !== '' ){
            const idMovies = movies.split(',')
            const moviesArr = await Movie.findAll({
                where: { id: idMovies }
            })
            gender.addMovies(moviesArr);
        };

        await gender.save();

        res.json({
            status: 'ok',
            result: gender
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 'error',
            result: 'Error en el servidor, contactarse con soporte.'
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
            result: 'Error en el servidor, contactarse con soporte.'
        })
    }
}

module.exports = { 
    gendersList,
    genderAdd, 
    genderUpdate, 
    genderDelete 
}