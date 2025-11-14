const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { addExpenseController, getExpensesController, deleteExpenseController, getExpensesForExcelController } = require('../controllers/expenseController');
const { body, param, validationResult } = require('express-validator');

const addExpenseValidation = [
  body('category').isString().notEmpty().withMessage('Category is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('icon').optional().isString(),
  body('date').isISO8601().withMessage('Date must be a valid ISO8601 date'),
];

const deleteExpenseValidation = [
  param('expenseId').isInt().withMessage('Expense ID must be an integer'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Add an expense
router.post('/', verifyToken, addExpenseValidation, validate, async (req, res) => {
  const { category, amount, icon, date } = req.body;
  try {
    const expense = await addExpenseController(req.userId, category, amount, icon, date);
    res.status(201).json({ message: 'Expense added successfully!', expense });
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense', error: error.message });
  }
});

// Get all expenses
router.get('/', verifyToken, async (req, res) => {
  try {
    const expenses = await getExpensesController(req.userId);
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
});

// Delete an expense
router.delete('/:expenseId', verifyToken, deleteExpenseValidation, validate, async (req, res) => {
  const { expenseId } = req.params;
  try {
    const deletedExpense = await deleteExpenseController(expenseId, req.userId);
    if (deletedExpense) {
      res.status(200).json({ message: 'Expense deleted successfully!' });
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error: error.message });
  }
});

// Download expenses as an Excel file
router.get('/download', verifyToken, async (req, res) => {
  try {
    const expenses = await getExpensesForExcelController(req.userId);

    const XLSX = require('xlsx');
    const ws = XLSX.utils.json_to_sheet(expenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');

    const fileBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Disposition', 'attachment; filename=expenses.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(fileBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading expenses', error: error.message });
  }
});

module.exports = router;
