const Role = require('../models/role');
const User = require('../models/user')

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

module.exports = {
    isValidRole,
    userMailExists,
    userIdExists
}