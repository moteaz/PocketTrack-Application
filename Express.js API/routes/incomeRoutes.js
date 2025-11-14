const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { addIncomeController, getIncomesController, deleteIncomeController, getIncomesForExcelController } = require('../controllers/incomeController');
const { body, param, validationResult } = require('express-validator');

const addIncomeValidation = [
  body('source').isString().notEmpty().withMessage('Source is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('icon').optional().isString(),
  body('date').isISO8601().withMessage('Date must be a valid ISO8601 date'),
];

const deleteIncomeValidation = [
  param('incomeId').isInt().withMessage('Income ID must be an integer'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Add an income
router.post('/', verifyToken, addIncomeValidation, validate, async (req, res) => {
  const { source, amount, icon, date } = req.body;
  try {
    const income = await addIncomeController(req.userId, source, amount, icon, date);
    res.status(201).json({ message: 'Income added successfully!', income });
  } catch (error) {
    res.status(500).json({ message: 'Error adding income', error: error.message });
  }
});

// Get all incomes
router.get('/', verifyToken, async (req, res) => {
  try {
    const incomes = await getIncomesController(req.userId);
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching incomes', error: error.message });
  }
});

// Delete an income
router.delete('/:incomeId', verifyToken, deleteIncomeValidation, validate, async (req, res) => {
  const { incomeId } = req.params;
  try {
    const deletedIncome = await deleteIncomeController(incomeId, req.userId);
    if (deletedIncome) {
      res.status(200).json({ message: 'Income deleted successfully!' });
    } else {
      res.status(404).json({ message: 'Income not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting income', error: error.message });
  }
});

// Download incomes as an Excel file
router.get('/download', verifyToken, async (req, res) => {
  try {
    const incomes = await getIncomesForExcelController(req.userId);

    const XLSX = require('xlsx');
    const ws = XLSX.utils.json_to_sheet(incomes);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Incomes');

    const fileBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Disposition', 'attachment; filename=incomes.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(fileBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading incomes', error: error.message });
  }
});

module.exports = router;
