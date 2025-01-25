const express = require('express');
var router = express.Router();
const tokensController = require('../controllers/tokensController');
router.route('/')
.post(tokensController.autentication);

// Define route for verifying token
router.post('/verifyToken', tokensController.verifyUserToken);

module.exports = router;