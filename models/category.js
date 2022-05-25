const { Schema, model } = require('mongoose');

const categorySchema = Schema({
    name:{
        type:String,
        required:[true, 'El nombre es obligatorio'],
        unique:true
    },
    status:{
        type:Boolean,
        default:true,
        required:[ true, 'El Estado es obligatorio' ]
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario de accion es requerido']
    }
});

categorySchema.methods.toJSON = function(){
    //Se desesctructura el objeto y se scan el __v y la contraseña 
    const { __v, _id, status, ...category }  = this.toObject();

    category.uid = _id;

    //Se regresa a info del usuario sin la version y la contra
    return category;
}

module.exports = model('Category', categorySchema);