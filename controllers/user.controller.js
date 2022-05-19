const { response } = require('express');
const bcryptjs = require('bcryptjs');
//const { validationResult } = require('express-validator');

const User = require('../models/user');
const user = require('../models/user');

const userGet = async(req, res=response ) => {
    const { limit = 5, from=0 } = req.query;

    /* const users = await User.find({ status:true })
        .skip( from )
        .limit( Number(limit) );

    const total = await User.countDocuments({ status:true }); */
    

    const answer = [ total, users ] = await Promise.all([
        User.countDocuments({ status:true }),
        User.find({ status:true })
            .skip( from )
            .limit( Number(limit) )
    ]);

    const shown = users.length;

    res.json({
        total,
        shown,
        users,
        answer
    });
}

const userPut = async(req, res=response ) => {
    const { id }  = req.params; 
    const { _id, password, google, mail, ...rest } = req.body;

    //Validar id contra DB

    //Si se esta recibiendo el usuario se quiere actualizar la contra
    if(password){
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync( password, salt );
    }

    //Actualizar el registro
    const user_update = await User.findByIdAndUpdate( id, rest );

    const user_updated = await User.findById( id );

    res.json({
        id,
        before:user_update,
        now:user_updated
    });
}

const userPost = async(req, res=response ) => {
    /* const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json(errors);
    } */

    const { name, mail, password, role } = req.body;

    const user = new User( { name, mail, password, role } );

    //Verificar si correo exist
    /* const mail_exist = await User.findOne({ mail:mail });
    if( mail_exist ){
        return res.status(400).json({
            error:'El correo ya esta registrado en Mongo'
        });
    } */

    //Encriptar Pass
    const salt = bcryptjs.genSaltSync(15);
    user.password = bcryptjs.hashSync( password, salt )

    //Guardar DB
    await user.save();

    res.json({

        user
    });
}

const userDelete = async(req, res=response ) => {
    const { id } = req.params;

    //Borrar de la BD
    //const user = await User.findByIdAndDelete( id );

    const user = await User.findByIdAndUpdate( id, { status:false } );

    res.json({
        id,
        user
    });
}

const userPatch = (req, res=response ) => {
    res.json({
        msj:'PATCH API - controller'
    });
}

module.exports = {
    userGet,
    userPut,
    userPost,
    userPatch,
    userDelete
}