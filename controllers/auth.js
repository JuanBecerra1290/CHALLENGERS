const bcryptjs = require('bcryptjs')

const {User} = require('../models/index')
const { createJWT } = require('../helpers/create-jwt');
const sendEmail = require('../helpers/send-email');


const login = async (req, res) =>{

    const { email, password } = req.body;

    try {
        //Verifica existe
        const user = await User.findOne({ 
            where: {
                email
            }
        });

        if( !user ){
            return res.status(400).json({
                status: 'error',
                result: 'Usuario / Contraseña incorrectos'
            })
        }

        //Verificar contraseña
        const passwordBcrypt = bcryptjs.compareSync( password, user.password )
        if( !passwordBcrypt ){
            return res.status(400).json({
                status: 'error',
                result: 'Usuario / Contraseña incorrectos'
            })
        }

        //Generar JWT
        const token = await createJWT( user.id );

        res.json({
            status: 'ok',
            result: user,
            token
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: 'error',
            result: 'Error en el servidor, contactar al administrador.'
        })
    }
}

const register = async (req, res) => {

    //Extrae los parametros deseados del body.
    const {name, email, password} = req.body
    try {
        //Verifica existe
        const user = await User.findAll({ 
            where: {
                email
            }
        });

        if( user.length !== 0 ){
            return res.status(400).json({
                status: 'error',
                result: 'Usuario registrado, intente con otro correo'
            })
        }

        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        passwordBcrypt = bcryptjs.hashSync( password, salt )

        //Crea una nueva instancia del Schema Usuario con los paramtros deseados.
        const newUser = await User.create({
            name,
            email,
            password: passwordBcrypt
        });

        sendEmail(email, name);
        
        res.json({
            status: 'ok',
            result: newUser
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 'error',
            result: 'Error en el servidor, contactar al administrador.'
        })
    }
}

module.exports = {
    login,
    register
}