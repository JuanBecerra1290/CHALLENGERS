const {Character, Movie, Gender} = require("../models/index");

const idCharacterValidation = async ( id ) => {
    //Verificar si el id exite en BD
    const idValidate = await Character.findByPk(id)
    
    if(!idValidate){
        throw new Error(`El id del personaje no existe`);
    }
}
const idMovieValidation = async ( id ) => {
    //Verificar si el id exite en BD
    const idValidate = await Movie.findByPk(id)
    
    if(!idValidate){
        throw new Error(`El id de la pelicula no existe`);
    }
}
const idGenderValidation = async ( id ) => {
    //Verificar si el id exite en BD
    const idValidate = await Gender.findByPk(id)
    
    if(!idValidate){
        throw new Error(`El id del genero no existe`);
    }
}

module.exports = {
    idCharacterValidation,
    idMovieValidation,
    idGenderValidation
}