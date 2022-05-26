
const validateFiles = (request, response, next) => {
    if ( !request.files || Object.keys(request.files).length === 0 ) {
        return response.status(400).json({ 
            msg:'Sin archivos en la peticion'
        });

        
    }

    if ( !request.files.file ) {
        return response.status(400).json({ 
            msg:'Sin archivo FILE en la peticion'
        });

        return;
    }

    next();
}

module.exports = {
    validateFiles
}