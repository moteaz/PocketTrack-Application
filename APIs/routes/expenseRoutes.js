const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { addExpenseController, getExpensesController, deleteExpenseController, getExpensesForExcelController } = require('../controllers/expenseController');

// Add an expense
router.post('/add', verifyToken, async (req, res) => {
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
router.delete('/delete/:expenseId', verifyToken, async (req, res) => {
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
