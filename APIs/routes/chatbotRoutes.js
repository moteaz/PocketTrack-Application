const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getBotResponse } = require('../controllers/chatBotController');

// Direct endpoint to handle chatbot response
router.post('/', verifyToken, getBotResponse);

module.exports = router;