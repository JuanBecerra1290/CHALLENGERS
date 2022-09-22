const { Router } = require('express');
const { check } = require('express-validator');

const { validateInputs } = require('../middlewares/validate-inputs');

const {
    login,
    register
 } = require('../controllers/auth')

const router = Router();

router.post('/login',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateInputs
], login)

router.post('/register', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser mayor a 6 digitos').isLength({min: 6}),
    check('email', 'El correo no es valido').isEmail(),    
    validateInputs
], register)

module.exports = router;