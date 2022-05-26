const Role = require('../models/role');
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');

const isValidRole = async( role='' )  => {
    const role_exists = await Role.findOne({ role });

    if( !role_exists )
        throw new Error('El rol no esta registrado en la BD')
}

const userMailExists = async( mail ) => {
    const mail_exist = await User.findOne({ mail:mail });

    if( mail_exist )
        throw new Error(`El correo ${mail} ya existe en la DB`);
}

const userIdExists = async( id ) => {
    const user_exist = await User.findById(id);

    if( !user_exist )
        throw new Error(`El id ${id} no existe en la DB`);
}

const categoryIdExists = async( id ) => {
    const category_exist = await Category.findById( id );

    if( !category_exist )
        throw new Error(`El id ${id} no exite en las categorias`);
}

const productIdExists = async( id ) => {
    const product_exist = await Product.findById( id );

    if( !product_exist )
        throw new Error(`El id ${id} no exite en los productos`);
}

const permitedColections = ( colection='', colections = [] ) => {
    const is_included = colections.includes( colection );

    if( !is_included ){
        throw new Error(`La coleccion ${colection} no es permitida, (${colections})`);
    }

    return true;
}

module.exports = {
    isValidRole,
    userMailExists,
    userIdExists,
    categoryIdExists,
    productIdExists,
    permitedColections
}