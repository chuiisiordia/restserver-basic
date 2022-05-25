//Con express es mas facil generar rutas
const { Router } = require('express');
//Validaciones con check
const { check }  = require('express-validator');

const { validate_jwt, validateFields, isAdmin, hasRole } = require('../middlewares/'); 
const { categoryIdExists, productIdExists } = require('../helpers/db-validators');

const { postProduct, productsGet, productGet, productPut, productDelete } = require('../controllers/products.controller');
const product = require('../models/product');


//Inicializa el router
const router = Router();

//Guardar producto
router.post('/', [
    validate_jwt,
    check('name', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('category', 'La categoria es obligatoria').not().isEmpty(),
    check('category', 'La categoria no es un ID valido').isMongoId(),
    check('category').custom( categoryIdExists ),
    validateFields
], postProduct );

//Lista de productos, publico
router.get('/', productsGet );

//Obtener una categoria Publico, validar que el ID existe
router.get('/:id', [
    check('id').custom( productIdExists ),
    validateFields
], productGet );

router.put('/:id', [
    validate_jwt,
    check('name', 'El nombre del producto es obligatorio').not().isEmpty(),
    hasRole('ADMIN_ROLE', 'USER_ROLE'),
    check('category', 'La categoria no es un ID valido').isMongoId(),
    check('category').custom( categoryIdExists ),
    validateFields
], productPut );

router.delete('/:id', [
    validate_jwt,
    isAdmin,
    check('id').custom( productIdExists ),
    validateFields
], productDelete )

module.exports = router;