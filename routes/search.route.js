const { Router } = require('express');
const { check } = require('express-validator');

const { search } = require('../controllers/search.controller');

const router = Router();

router.get('/:colection/:term', search);

module.exports = router;