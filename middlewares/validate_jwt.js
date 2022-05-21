const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validate_jwt = async( req = request, res = response, next ) => {
    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            msg:'No hay token en la peticion'
        });
    }

    try {
        const  payload = jwt.verify(token, process.env.SECRETKEY );
        const { uid } = payload;
        
        const session_user = await User.findById( uid );

        //Validar que el usuario del token exista en la BD
        if( !session_user ){
            return res.status(401).json({
                msg:'Token no valido - usuario de sesion no existe en BD'
            });
        }

        //Si el usuario de sesion esta desactivado
        if( !session_user.status ){
            return res.status(401).json({
                msg:'Token no valido - usuario de sesion desactivado'
            });
        }

        req.session_user = session_user;

        next();  
    } 
    catch (error) {
        console.log(error);

        res.status(401).json({
            msg:'Token no valido'
        });
    }

    
}

module.exports = {
    validate_jwt
}