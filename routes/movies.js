const { Router } = require('express');
const { check } = require('express-validator');

const { 
    moviesList, 
    movieDetail,
    movieAdd, 
    movieUpdate, 
    movieDelete 
} = require('../controllers/movies');

const { validateJWT } = require('../middlewares/validate-jwt');
const { validateImg } = require('../middlewares/validate-img');
const { validateInputs } = require('../middlewares/validate-Inputs');

const { idMovieValidation } = require('../helpers/db-validations');

const router = Router();

router.get('/', [
    validateJWT
], moviesList)

router.get('/:id', [
    validateJWT,
    check('id').custom(idMovieValidation),
    validateInputs
], movieDetail)

router.post('/', [
    validateJWT,
    validateImg,
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('createDate', 'La fecha de estreno es obligatoria, debe ser tipo text formato "AAAA/MM/DD"').not().isEmpty(),
    check('ratings', 'La Calificación es obligatoria, debe ser de tipo number').isNumeric(),
    validateInputs
], movieAdd)


router.put('/:id', [
    validateJWT,
    check('id').custom(idMovieValidation),
    validateInputs
], movieUpdate)

router.delete('/:id', [
    validateJWT,
    check('id').custom(idMovieValidation),
    validateInputs
], movieDelete)

module.exports = router;