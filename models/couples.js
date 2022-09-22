const { Character, Movie, Gender } = require('./index')

Character.belongsToMany(Movie, {through: 'Character_Movie'});
Movie.belongsToMany(Character, {through: 'Character_Movie'});

Movie.belongsToMany(Gender, {through: 'Movie_Gender'});
Gender.belongsToMany(Movie, {through: 'Movie_Gender'});