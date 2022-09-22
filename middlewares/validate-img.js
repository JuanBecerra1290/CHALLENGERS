
const validateImg = ( req, res, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.img) {
        return res.status(400).json({
            status: 'error',
            result: 'Es necesario una imagen.'
        });
    }

    next();
}

module.exports = {
    validateImg
}