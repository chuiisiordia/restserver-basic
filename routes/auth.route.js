const { Router } = require('express');
const { check } = require('express-validator');

const { login, google } = require('../controllers/auth.controller');
const { validateFields } = require('../middlewares/validate_fields');

const router = Router();

router.post('/login', [
    check('mail', 'El correo es obligatorio').isEmail(),
    check('password', 'La clave es obligatorio').not().isEmpty(),
    validateFields
], login );

router.post('/google', [
    check('id_token', 'Token de google necesario').not().isEmpty(),
    validateFields
], google );

module.exports = router;