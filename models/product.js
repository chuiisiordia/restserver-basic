const { Schema, model } = require('mongoose');

const productSchema = Schema({
    name:{
        type:String,
        required: [true, 'El nombre del productor es obligatorio'],
        unique:true
    },
    status:{
        type:Boolean,
        default:true,
        required:[ true, 'El estado es obligatorio' ]
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    category:{
        type: Schema.Types.ObjectId,
        ref:'Category',
        required: true
    },
    description:{
        type:String
    },
    available:{
        type:Boolean,
        default:true,
        required:true
    },
    img:{
        type:String
    }
});

productSchema.methods.toJSON = function(){
    const { __v, status, _id, ...rest } = this.toObject();

    rest.uid = _id;

    return rest;
}

module.exports = model( 'Product', productSchema );