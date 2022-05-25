const { response, request } = require("express");

const { Category } = require('../models/');

//Crear nueva categoria
const categoryPost = async(req, res= response) => {
    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne( { name } );

    //Si la categoria ya existe no la guarda
    if( categoryDB ){
        return res.status(400).json({
            msg:`La categoria ${categoryDB.name} ya existe`
        });
    }

    /* console.clear();
    console.log('Entroooo: ', req.session_user); */

    const data = {
        name,
        user: req.session_user._id
    }

    const category = new Category( data );

    await category.save();

    res.status(201).json({
        category
    });
}

//Get categorias paginado - total - populate para ver quien grabo el user
const categoriesGet = async( req=request, res=response ) => {
    const { limit, from } = req.query;

    const query = { status:true };

    const [ total, categories ] = await Promise.all([ 
        Category.countDocuments( query ),
        Category.find( query )
            .populate('user', 'name')
            .skip( Number(from) )
            .limit( Number(limit) )
    ]);

    res.json({
        total,
        shown: categories.length,
        categories
    });
}

//Get categoria - Objecto de categorioa populate {}
const categoryGet = async( req=request, res=response ) => {
    const { id }  = req.params;
    
    const category = await Category.findById( id ).populate('user', 'name');

    console.log( 'Categoria', category );

    res.json({
        category
    });
}

const categoryPut = async( req=request, res=response ) => {
    const { id }  = req.params; 
    const { name, ...rest } = req.body;

    //Actualizar registro
    //El tercer parametro { new:true } es para que se regrese el objeto editado
    const category = await Category.findByIdAndUpdate( id, { name:name.toUpperCase(), user:req.session_user._id }, { new: true } );
    
    res.json({
        category
    });
}

const categoryDelete = async( req=request, res=response ) => {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate( id, { status:false } );

    const session_user = req.session_user;

    res.json({
        id,
        category,
        session_user
    });
}

module.exports = {
    categoryPost,
    categoriesGet,
    categoryGet,
    categoryPut, 
    categoryDelete
};