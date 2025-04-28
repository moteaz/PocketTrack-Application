const pool = require('../config/db');

// Expense model for adding expense data
const addExpense = async (userId, category, amount, icon, date) => {
  try {
    const result = await pool.query(
      'INSERT INTO expenses (user_id, category, amount, icon, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, category, amount, icon, date]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Get all expenses for a user
const getExpenses = async (userId) => {
  try {
    const result = await pool.query('SELECT * FROM expenses WHERE user_id = $1', [userId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Delete an expense
const deleteExpense = async (expenseId, userId) => {
  try {
    const result = await pool.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *', [expenseId, userId]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Export expenses as Excel (controller will handle conversion)
const getExpensesForExcel = async (userId) => {
  try {
    const result = await pool.query('SELECT * FROM expenses WHERE user_id = $1', [userId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense,
  getExpensesForExcel,
};
