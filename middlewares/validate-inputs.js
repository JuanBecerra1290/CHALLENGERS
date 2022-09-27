const {validationResult} = require('express-validator')

const validateInputs = ( req, res, next ) =>{
    
    const err = validationResult(req)
    const errMsg = err.errors.map( (e) => {
        return e.msg
    })
    if(!err.isEmpty()){
        return res.status(400).json({
            status: 'error',
            result: errMsg
        });
    }
    next();
}

module.exports = {
    validateInputs
}