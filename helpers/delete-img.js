const path = require('path');
const fs = require('fs')

const { Movie, Gender, Character } = require('../models/index');

const deleteImg = async ( id, directory ) => {

    let model;

    switch (directory) {
        case 'gender/':
            
            model = await Gender.findByPk( id )
            if( !model ){
                return res.status(400).json({
                    msg: `No existe un genero con id ${id}`
                })
            }
            break;
        case 'character/':
            
            model = await Character.findByPk( id )
            if( !model ){
                return res.status(400).json({
                    msg: `No existe un personaje con id ${id}`
                })
            }
            break;
        case 'movie/':
            
            model = await Movie.findByPk( id )
            if( !model ){
                return res.status(400).json({
                    msg: `No existe un pelicula o serie con id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg: 'No se le ha dado soporte al directorio, comunicarse con el administrador'
            })
    }

    
    //Limpiar img previos.
    if( model.img ){
        
        const pathImg = path.join( __dirname, '../uploads/', directory, model.img )

        if( fs.existsSync(pathImg) ){
            fs.unlinkSync( pathImg );
        }
    }
}

module.exports = {
    deleteImg
}