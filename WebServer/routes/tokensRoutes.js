const express = require('express');
var router = express.Router();
const tokensController = require('../controllers/tokensController');
router.route('/')
.post(tokensController.autentication);

module.exports = router;