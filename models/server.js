const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config.js');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usersRoutePath = '/api/user';

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
    }

    routes(){
        this.app.use(this.usersRoutePath, require('../routes/user.route'));
    }

    listen(){
        this.app.listen( this.port, () => {
            console.log( 'Servidor ejecutado en', this.port );
        });
    }
}

module.exports = Server;