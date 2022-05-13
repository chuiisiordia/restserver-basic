const { response } = require('express');

const userGet = (req, res=response ) => {
    const params = req.query;

    res.json({
        msj:'Get API - controller',
        params
    });
}

const userPut = (req, res=response ) => {
    const body = req.body;

    const id = parseInt(req.params.id);

    res.json({
        msj:'PUT API - controller',
        body,
        id
    });
}

const userPost = (req, res=response ) => {
    const body = req.body;

    const { nombre, edad } = body;

    res.json({
        msj:'POST API - controller',
        nombre,
        edad
    });
}

const userDelete = (req, res=response ) => {
    res.json({
        msj:'Delete API - controller'
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