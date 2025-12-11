const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const validate = require('../middleware/validation');
const validators = require('../utils/validators');
const { addIncome, getIncomes, deleteIncome, downloadIncomes } = require('../controllers/incomeController');

router.post('/', verifyToken, validators.addIncome, validate, addIncome);
router.get('/', verifyToken, getIncomes);
router.delete('/:incomeId', verifyToken, validators.deleteIncome, validate, deleteIncome);
router.get('/download', verifyToken, downloadIncomes);

module.exports = router;
