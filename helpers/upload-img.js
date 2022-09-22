const path = require('path')
const { v4: uuidv4 } = require('uuid');

const uploadImg = ( files, directory ) => {
    
    return new Promise( (res, rej) =>{
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

        const { img } = files;
    
        const splitName = img.name.split('.');
        const extension = splitName[ splitName.length -1 ].toLowerCase()
        
        if( !validExtensions.includes('*') ){
            if( !validExtensions.includes( extension ) ){
                return rej(`La extensión ${extension} no es valida, solo se permiten: ${validExtensions}`);
            }
        }
        
        const newName = uuidv4() + '.' + extension;
        
        const uploadPath = path.join(__dirname, '../uploads/', directory, newName);
        
        img.mv(uploadPath, (err) => {
            if (err) {
                return rej(err);
            }
            res( newName );
        });
    });
}

module.exports = {
    uploadImg
}