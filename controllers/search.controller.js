const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models');

const colections_available =[
    'users',
    'categories',
    'products',
    'roles'
]

const searchUsers = async( term='', response ) =>{
    const isMongoID = ObjectId.isValid( term );

    //Si es un ID de mongo entra aqui, independientementre de que sea id de usuario o de otro modelo
    if( isMongoID ){
        const user = await User.findById( term );

        return response.json({
            //Se valida si el id pertenese a un usuario, si no se regresa un arreglo vacio
            results: ( user ) ? [user] : []
        });
    }

    //Buscar usuarios por nombre
    //Se crea una expresion regular para que se busque tanto mayusculas y miniculas y usar algo parecido al like de mysq
    const regex = new RegExp( term, 'i' );

    const users = await User.find({ 
        $or: [{ name:regex }, { mail:regex }],
        $and:[{ status:true }]
    });
    
    return response.json({
       results: users
    });

}

const searchCategories = async( term='', response ) =>{
    const isMongoID = ObjectId.isValid( term );

    //Si es un ID de mongo entra aqui, independientementre de que sea id de usuario o de otro modelo
    if( isMongoID ){
        const category = await Category.findById( term );

        return response.json({
            //Se valida si el id pertenese a un usuario, si no se regresa un arreglo vacio
            results: ( category ) ? [category] : []
        });
    }

    const regex = new RegExp( term, 'i' )
    const categories = await Category.find({ name:regex, status:true })

    response.json({
        results: categories
    });
}

const searchProducts = async( term='', response ) => {
    const isMongoID = ObjectId.isValid( term );

    //Si es un ID de mongo entra aqui, independientementre de que sea id de usuario o de otro modelo
    if( isMongoID ){
        const product = await Product.findById( term ).populate('category', 'name');

        return response.json({
            //Se valida si el id pertenese a un usuario, si no se regresa un arreglo vacio
            results: ( product ) ? [product] : []
        });
    }

    //Si no es un mongo id se busca por texto
    const regex = new RegExp( term, 'i' )
    const products = await Product.find({ name:regex, status:true }).populate('category', 'name')

    response.json({
        results: products
    })
}
 
const search = async(request, response) => {
    const { colection, term } = request.params;

    if( !colections_available.includes( colection ) ){
        return response.status(400).json({
            msg:`Las colecciones permitidas son ${colections_available}`
        });
    }

    switch (colection) {
        case 'users':
            searchUsers( term, response );
        break;
        case 'categories':
            searchCategories( term, response );
        break;
        case 'products':
            searchProducts( term, response );
        break;
        /* case 'roles':
        
        break; */
    
        default:
            return response.status(500).json({
                msg:`Busqueda no configurada para ${colection.toUpperCase()} `
            })
        break;
    }
}

module.exports = {
    search
}