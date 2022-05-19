const { Router } = require('express');
const { check } = require('express-validator');

const { userGet, userPut, userPost, userDelete, userPatch } = require('../controllers/user.controller');
const { isValidRole, userMailExists, userIdExists } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate_fields');

const router = Router();

router.get('/', userGet );

router.put('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( userIdExists ),
    check('role').custom( isValidRole ),
    validateFields
], userPut );

router.post('/', 
[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe ser minimo de 6 caracteres').isLength({ min:6 }),
    check('mail', 'El correo no es valido').isEmail(),
    check('mail').custom( (mail) => userMailExists(mail)  ),
    //check('role', 'No es un rol valido').isIn([ 'ADMIN_ROLE', 'USER_ROLE' ]),
    check('role').custom( ( role ) => isValidRole(role) ),
    check('role').custom( isValidRole ),
    validateFields
]
,userPost );

router.delete('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( userIdExists ),
    validateFields
], userDelete );

router.patch('/', userPatch );

module.exports = router;