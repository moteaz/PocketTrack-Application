const { addExpense, getExpenses, deleteExpense, getExpensesForExcel } = require('../models/Expense');

// Add expense controller
const addExpenseController = async (userId, category, amount, icon, date) => {
  try {
    const expense = await addExpense(userId, category, amount, icon, date);
    return expense;
  } catch (error) {
    throw error;
  }
};

// Get expenses controller
const getExpensesController = async (userId) => {
  try {
    const expenses = await getExpenses(userId);
    return expenses;
  } catch (error) {
    throw error;
  }
};

// Delete expense controller
const deleteExpenseController = async (expenseId, userId) => {
  try {
    const expense = await deleteExpense(expenseId, userId);
    return expense;
  } catch (error) {
    throw error;
  }
};

// Get expenses for Excel export
const getExpensesForExcelController = async (userId) => {
  try {
    const expenses = await getExpensesForExcel(userId);
    return expenses;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addExpenseController,
  getExpensesController,
  deleteExpenseController,
  getExpensesForExcelController,
};
