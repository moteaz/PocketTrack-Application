const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const validate = require('../middleware/validation');
const validators = require('../utils/validators');
const { getBotResponse } = require('../controllers/chatBotController');

router.post('/', verifyToken, validators.chatbot, validate, getBotResponse);

module.exports = router;