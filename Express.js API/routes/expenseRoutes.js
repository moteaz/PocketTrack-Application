const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const validate = require('../middleware/validation');
const validators = require('../utils/validators');
const { addExpense, getExpenses, deleteExpense, downloadExpenses } = require('../controllers/expenseController');

router.post('/', verifyToken, validators.addExpense, validate, addExpense);
router.get('/', verifyToken, getExpenses);
router.delete('/:expenseId', verifyToken, validators.deleteExpense, validate, deleteExpense);
router.get('/download', verifyToken, downloadExpenses);

module.exports = router;
