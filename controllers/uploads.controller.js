const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary');
cloudinary.config( process.env.CLOUDINARY_URL );

const { upload_file } = require('../helpers/upload-files');

const { User, Product } = require('../models/index');

const uploadFile = async(request, response) => {
    try {
        const file_name = await upload_file( request.files, undefined, 'imgs' );

        return response.json({
            file_name
        });
    } catch (error) {
        response.status(400).json({
            error
        });
    }
}

const updateImg = async(request, response) => {
    const { id, colection } = request.params; 

    let model;

    switch ( colection ) {
        case 'users':
            model = await User.findById( id );

            if( !model ){
                return response.status(400).json({
                    msg:`No existe un usuario con Id ${id}`
                });
            }

        break;

        case 'products':
            model = await Product.findById( id );

            if( !model ){
                return response.status(400).json({
                    msg:`No existe un producto con Id ${id}`
                });
            }
        break;
    
        default:
            return response.status(500).json({ msg:'Opcion por defaul no configurada' })
        break;
    }

    //Limpiar imagen prebia si existe el registro en la bd
    if( model.img ){
        //Borrar arhchivo fisico
        const img_path = path.join( __dirname,'../uploads', colection, model.img );

        if( fs.existsSync(img_path) ){
            fs.unlinkSync( img_path );
        }
    }

    try {
        const file_name = await upload_file( request.files, undefined, colection );

        model.img = file_name;
    
        await model.save();
    
        response.json({ model });
    } catch (error) {
        response.status(400).json({
            error
        });
    }

    
};

const updateImgCloud = async(request, response) => {
    const { id, colection } = request.params; 

    let model;

    switch ( colection ) {
        case 'users':
            model = await User.findById( id );

            if( !model ){
                return response.status(400).json({
                    msg:`No existe un usuario con Id ${id}`
                });
            }

        break;

        case 'products':
            model = await Product.findById( id );

            if( !model ){
                return response.status(400).json({
                    msg:`No existe un producto con Id ${id}`
                });
            }
        break;
    
        default:
            return response.status(500).json({ msg:'Opcion por defaul no configurada' })
        break;
    }

    //Limpiar imagen prebia si existe el registro en la bd
    if( model.img ){
        const name_arr = model.img.split('/');
        const name = name_arr[ name_arr.length - 1 ];
        const [ cloud_id ]  = name.split('.');

        cloudinary.uploader.destroy( cloud_id );
    }

    //Se sube archivo a la nube
    const { tempFilePath } = request.files.file;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    model.img = secure_url;
    await model.save();

    response.json({
        model
    });
};

const getImg = async( request, response ) =>{
    const { id, colection } = request.params; 

    let model;

    switch ( colection ) {
        case 'users':
            model = await User.findById( id );

            if( !model ){
                return response.status(400).json({
                    msg:`No existe un usuario con Id ${id}`
                });
            }

        break;

        case 'products':
            model = await Product.findById( id );

            if( !model ){
                return response.status(400).json({
                    msg:`No existe un producto con Id ${id}`
                });
            }
        break;
    
        default:
            return response.status(500).json({ msg:'Opcion por defaul no configurada' })
        break;
    }

    //Limpiar imagen prebia si existe el registro en la bd
    if( model.img ){
        //Borrar arhchivo fisico
        const img_path = path.join( __dirname,'../uploads', colection, model.img );

        if( fs.existsSync(img_path) ){
            return response.sendFile( img_path );
        }
    }

    const img_placeholder = path.join( __dirname,'../assets/no-image.jpg' );
    return response.sendFile( img_placeholder );
}

module.exports = {
    uploadFile,
    updateImg,
    updateImgCloud,
    getImg
}