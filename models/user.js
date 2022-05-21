const { Schema, model } = require('mongoose');

const userSchema = Schema({
    name:{
        type:String,
        required:[ true, 'Nombre obligatorio' ],
    },
    mail:{
        type:String,
        unique:true,
        required:[ true, 'Correo obligatorio' ]
    },
    password:{
        type:String,
        required:[ true, 'Contraseña obligatorio' ],
    },
    img:{
        type:String
    },
    role:{
        type:String,
        required:[ true, 'Rol obligatorio' ],
       // enum: [ 'ADMIN_ROLE', 'USER_ROLE' ]
    },
    status:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }
});

//El metodo toJSON del userSchema se sobrescribe por la funcion
userSchema.methods.toJSON = function(){
    //Se desesctructura el objeto y se scan el __v y la contraseña 
    const { __v, password, _id, ...user }  = this.toObject();

    user.uid = _id;

    //Se regresa a info del usuario sin la version y la contra
    return user;
}

module.exports = model( 'User', userSchema );