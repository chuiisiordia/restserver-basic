const { request } = require("express")
const { response } = require("express")

const isAdmin = ( req=request, res=response, next ) => {
    //Si no se ha disparado el middleware para validad el token marca error
    //Ese middleware polupa el session_user en la request
    if( !req.session_user ){
        return res.status(500).json({
            msg:'Se quiere verificar el rol sin validar el token antes'
        });
    }

    const { role, name } = req.session_user;

    if( role!=='ADMIN_ROLE' ){
        return res.status(401).json({
            msg:`El usuario ${name} no tiene rol de Admin (ROL: ${role} )`
        });
    }

    next();
}

const hasRole = ( ...roles ) => {
    return (req=request, res=response, next) =>{
        if( !req.session_user ){
            return res.status(500).json({
                msg:'Se quiere verificar el rol sin validar el token antes'
            });
        }

        if( !roles.includes( req.session_user.role ) ){
            return res.status(401).json({
                msg:'El usuario no tiene un rol autorizado'
            });
        }
        
        next();
    }
}

module.exports = {
    isAdmin, hasRole
}