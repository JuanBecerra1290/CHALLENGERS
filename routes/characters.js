const { Router } = require('express');
const { check } = require('express-validator');

const { 
    characterList, 
    characterDetail,
    characterAdd, 
    characterUpdate, 
    characterDelete
} = require('../controllers/characters');

const { validateJWT } = require('../middlewares/validate-jwt');
const { validateImg } = require('../middlewares/validate-img');
const { validateInputs } = require('../middlewares/validate-Inputs');

const { idCharacterValidation } = require('../helpers/db-validations');

const router = Router();

router.get('/', [
    validateJWT
], characterList)

router.get('/:id', [
    validateJWT,
    check('id').custom(idCharacterValidation),
    validateInputs
], characterDetail)

router.post('/', [
    validateJWT,
    validateImg,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('age', 'La edad es obligatoria').not().isEmpty(),
    check('weight', 'El peso es obligatorio').not().isEmpty(),
    check('history', 'la historia es obligatoria').not().isEmpty(),
    validateInputs
], characterAdd)


router.put('/:id', [
    validateJWT,
    check('id').custom(idCharacterValidation),
    validateInputs
], characterUpdate)

router.delete('/:id', [
    validateJWT,
    check('id').custom(idCharacterValidation),
    validateInputs
], characterDelete)

module.exports = router;