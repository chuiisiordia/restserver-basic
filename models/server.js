const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config.js');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usersRoutePath = '/api/user';
        this.authPath = '/api/auth';
        this.categoriesPath = '/api/categories/';
        this.productsPath = '/api/products/';
        this.searchPath = '/api/search/';
        this.uploadPath ='/api/uploads/'

        //Conectar DB
        this.connectDB();

        //Middlewares
        this.middlewares();

        //Genero las rutas de la aplicaciones
        this.routes();
    }

    async connectDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS
        this.app.use( cors() );

        //Lectura del body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use( express.static('public') );

        //Carga de archivos
        this.app.use( fileUpload({
            useTempFiles:true,
            tempFileDir:'/tmp/',
            createParentPath:true
        }) );
    }

    routes(){
        this.app.use(this.usersRoutePath, require('../routes/user.route'));

        this.app.use( this.authPath, require('../routes/auth.route') );

        this.app.use( this.categoriesPath, require('../routes/categories.route') );

        this.app.use( this.productsPath, require('../routes/products.route') );

        this.app.use( this.searchPath, require('../routes/search.route') );

        this.app.use( this.uploadPath, require('../routes/uploads.route') );
    }

    listen(){
        this.app.listen( this.port, () => {
            console.log( 'Servidor ejecutado en', this.port );
        });
    }
}

module.exports = Server;