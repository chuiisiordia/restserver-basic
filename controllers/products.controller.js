const { Product } = require('../models/');

const postProduct = async( request, response ) => {
    const name = request.body.name.toUpperCase();
    const category = request.body.category;
    const description = request.body.description;

    //Validar si el producto ya existe
    const productDB = await Product.findOne( { name } );
   
    if( productDB ){
        return response.status(400).json({
            msg:`El producto ${name} ya se encuentra registrado con el id ${productDB._id} `
        });
    }

    //Guardar la categoria
    const data ={
        name,
        user:request.session_user._id,
        category,
        description
    }

    const product = new Product( data );

    await product.save();

    response.json({
        msg:'Post producto',
        product
    })
}

const productsGet = async(request, response) =>{
    const { limit, from }  = request.query;
    const query = { status:true };

    const [ total, products ] = await Promise.all([
        Product.countDocuments( query ),
        Product.find( query )
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(from).limit(limit)
    ]);

    response.json({
        total,
        shown:products.length,
        products
    })
}

const productGet = async(request, response) => {
    const { id }  = request.params;

    const product = await Product.findById( id )
                    .populate('user', 'name')
                    .populate('category', 'name');

    response.json({
        product
    });
}

const productPut = async(request, response) => {
    const { id } = request.params;
    const { name, category, description, available } = request.body;

    const data = {
        name:name.toUpperCase(),
        category,
        description,
        available,
        user:request.session_user._id
    }

    const product = await Product.findByIdAndUpdate( id, data, { new:true } );

    response.json({
        product
    });
}

const productDelete = async(request, response) => {
    const { id } = request.params;
    
    const product = await Product.findByIdAndUpdate( id, { status:false, user:request.session_user._id } )
    
    response.json({
        product
    });
}

module.exports = {
    postProduct,
    productsGet,
    productGet,
    productPut,
    productDelete
}