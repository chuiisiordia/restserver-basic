const { Router } = require('express');
const { check } = require('express-validator');

const { validate_jwt, validateFields, isAdmin, hasRole } = require('../middlewares/');

const { categoryPost, categoriesGet, categoryGet, categoryPut, categoryDelete } = require('../controllers/categories.controller');

const { categoryIdExists } = require('../helpers/db-validators');

const router = Router();

//Guardar categoria
router.post('/', [
    validate_jwt,
    check('name', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validateFields
], categoryPost );

//Obtener todas la categorias - Publico
router.get('/', categoriesGet );

//Obtener una categoria - Publico
router.get('/:id', [
    check('id').custom( categoryIdExists ),
    validateFields
], categoryGet );

//Actualizar categoria - Privado - Cualquiera con un rol valido
router.put('/:id', [
    validate_jwt,
    hasRole('ADMIN_ROLE', 'USER_ROLE'),
    check('id').custom( categoryIdExists ),
    check('name', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validateFields
], categoryPut);

//Borrar una categorio - Privado - Solo admin
router.delete('/:id', [
    validate_jwt,
    isAdmin,
    check('id').custom( categoryIdExists ),
    check('name', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validateFields
], categoryDelete);

module.exports = router;