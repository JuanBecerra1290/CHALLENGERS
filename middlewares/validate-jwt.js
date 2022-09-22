const jwt = require('jsonwebtoken');
const {User} = require('../models/index');

const validateJWT = async ( req, res, next ) => {

    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json({
            status: 'err',
            result: 'El token no existe'
        });
    }
    
    try {
        const { id } = jwt.verify( token, process.env.SECRETORPRIVATEKEY);

        const userAuth = await User.findOne( {
            where: { id }
        } )

        if( !userAuth ) {
            return res.status(401).json({
                status: 'error',
                result: 'Usuario no valido - no existe en BD'
            })
        }

        req.userAuth = userAuth;
        next();

    } catch (err) {
        console.log(err)
        res.status(401).json({
            status: 'error',
            result: 'token no valido'
        })
    }
}

module.exports = { validateJWT }