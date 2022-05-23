const {response} = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const { gen_jwt } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { json } = require('express/lib/response');




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

const google = async( req, res ) => {
    const { id_token } = req.body;

    try {
        const { mail, name, img } = await googleVerify( id_token );

        let user = await User.findOne({ mail });

        //Si el usuario no existe lo creamos
        if( !user ){
            const data = { 
                name,
                mail, 
                password:':p',
                google:true,
                role:'USER_ROLE'
            };

            user = new User( data );

            await user.save();
        }

        //SI esta bloqueado
        if( !user.status ){
            return res.status(400).json({
                msg:'Hable con el administrador, usuario bloquedado'
            });
        }

        //Generar JWS
        const token = await gen_jwt( user.uid );

        res.json({
            user,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg:'El token no se pudo verificar'
        });
    }

    
}

module.exports = {
    login, google
}