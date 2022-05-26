const { Router } = require('express');
const { check } = require('express-validator');

const { uploadFile, updateImg, updateImgCloud, getImg } = require('../controllers/uploads.controller');

const { validateFields } = require('../middlewares/validate_fields');
const { validateFiles } = require('../middlewares/validate_files')

const { permitedColections } = require('../helpers/db-validators');

const { response } = require('express');
const req = require('express/lib/request');

const router = Router();

router.post( '/', validateFiles, uploadFile );

router.put( '/:colection/:id', [
    validateFiles,
    check('id', 'Id debe ser de mongo').isMongoId(),
    check('colection').custom( c => permitedColections( c, ['users', 'products'] ) ),
    validateFields
], updateImgCloud );

router.get('/:colection/:id', [ 
    check('id', 'Id debe ser de mongo').isMongoId(),
    check('colection').custom( c => permitedColections( c, ['users', 'products'] ) ),
    validateFields
], getImg );

module.exports = router;