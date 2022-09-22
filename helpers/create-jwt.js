const jwt = require('jsonwebtoken')

const createJWT = ( id ) => {
    return new Promise(( res, rej ) => {
        const payload = { id };

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if(err){
                console.log(err);
                rej('No se pudo generar el token')
            }else{
                res( token )
            }
        })
    })
}

module.exports = {
    createJWT
}