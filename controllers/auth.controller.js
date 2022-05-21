const {response} = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { gen_jwt } = require('../helpers/jwt');
const user = require('../models/user');


const login = async(req, res=response) =>{
    const { mail, password } = req.body;

    try {
        //Ver si el mail existe
        const user = await User.findOne({ mail:mail });

        if( !user ){
            return res.status(400).json({
                msj : 'Usuario / Password incorrectos - mail'
            });
        }

        //Validar usuario activo
        if( !user.status ){
            return res.status(400).json({
                msj : 'Usuario / Password incorrectos - status:false'
            });
        }

        //Verificar contraseña
        const validPassword = bcryptjs.compareSync( password, user.password );

        if( !validPassword ){
            return res.status(400).json({
                msj : 'Usuario / Password incorrectos - password'
            });
        }

        //Generar JWT
        const token = await gen_jwt( user.id );

        res.json({
            user,
            token
        });
    } 
    catch (error) {
        console.log(error);

        return res.status(500).json({
            user,
            token
        })
    }
};

module.exports = {
    login
}