const { Router } = require('express');
const { check } = require('express-validator');

const { 
    gendersList,
    genderAdd, 
    genderUpdate, 
    genderDelete 
} = require('../controllers/genders');

const { validateJWT } = require('../middlewares/validate-jwt');
const { validateImg } = require('../middlewares/validate-img');
const { validateInputs } = require('../middlewares/validate-Inputs');

const { idGenderValidation } = require('../helpers/db-validations');

const router = Router();

router.get('/', [
    validateJWT
], gendersList)

router.post('/', [
    validateJWT,
    validateImg,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateInputs
], genderAdd)


router.put('/:id', [
    validateJWT,
    check('id').custom(idGenderValidation),
    validateInputs
], genderUpdate)

router.delete('/:id', [
    validateJWT,
    check('id').custom(idGenderValidation),
    validateInputs
], genderDelete)

module.exports = router;