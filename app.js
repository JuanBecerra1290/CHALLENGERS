const express = require('express');
const fileUpload = require('express-fileupload');
const sequelize = require('./db/config');
require('dotenv').config();
require('./models/couples')

//Instancia express
const app = express()

//Lectura y Parseo del Body
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true })); 

//Fileupload - Carga de archivos
app.use(fileUpload({
    createParentPath: true,
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

//Configuracion de Router
app.use('/api/auth', require('./routes/auth'))
app.use('/api/characters', require('./routes/characters'))
app.use('/api/genders', require('./routes/genders'))
app.use('/api/movies', require('./routes/movies'))


//Configurar Puerto del Servidor
const port = process.env.PORT || 3000;
app.listen(port, async () =>{
    console.log(`El servidor esta funcionando en el puerto: ${port}`)
    //Conecta a base de datos
    try {
        await sequelize.sync({ alter: true });
        console.log('Base de datos conectada.');
    } catch (error) {
        console.error('Error al conectar la base de datos:', error);
    }
})

