const jwt = require('jsonwebtoken');

const gen_jwt = ( uid = '' ) => {
    return new Promise( (resolve, reject) => {
        const payload = { uid };
        const jwt_exp = {
            expiresIn:'4h'
        };

        jwt.sign( payload, process.env.SECRETKEY, jwt_exp, ( err, token ) => {
            if( err ){
                console.log(err);

                reject('No se pudo generar el toke')
            }
            else{
                resolve( token );
            }
        });
    })
}

module.exports = {
    gen_jwt
}