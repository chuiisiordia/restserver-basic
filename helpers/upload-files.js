const path = require('path');
const { v4: uuiv4 } = require('uuid');

const default_valid_extensions = [ 'jpg', 'png', 'jpeg', 'gif' ];

const upload_file = ( files, valid_extensions = default_valid_extensions, upload_folder='' ) => {
    return new Promise( (resolve, reject) => {

        //file es el nombre que se le puso al archivo que se manda en postman
        const { file } = files;
        const file_name = file.name.split('.');
        //Obtengo la ultima posicion del arreglo con la extension
        const extension = file_name[ file_name.length - 1 ];

        //Validad la extesion
        if( !valid_extensions.includes(extension) ){
            return reject(`La extension ${extension} no es permitida, solo (${ valid_extensions })`);
        }

        //Se genera un nombre nuevo para el archivo
        const file_temp_name = uuiv4()+'.'+extension;
        upload_path = path.join(__dirname, '../uploads/', upload_folder, file_temp_name);

        file.mv( upload_path, (err) =>{
            if( err )
                return reject( err );

            resolve( file_temp_name );
        } );

    } );
    
    
}

module.exports = {
    upload_file
}