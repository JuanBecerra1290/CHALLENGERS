
const extensionValidation = (files) => {

    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    const { img } = files;

    const splitName = img.name.split('.');
    const extension = splitName[ splitName.length -1 ].toLowerCase()
    
    if( !validExtensions.includes('*') ){
        if( !validExtensions.includes( extension ) ){
            return {
                status: true,
                extension,
                validExtensions
            };
        }
        return {
            status: false
        };
    }
}

module.exports = extensionValidation