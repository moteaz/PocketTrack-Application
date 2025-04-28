const pool = require('../config/db');

// Income model for adding expense data
const addIncome = async (userId, source, amount, icon, date) => {
  try {
    const result = await pool.query(
      'INSERT INTO incomes (user_id, source, amount, icon, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, source, amount, icon, date]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Get all incomes for a user
const getIncomes = async (userId) => {
  try {
    const result = await pool.query('SELECT * FROM incomes WHERE user_id = $1', [userId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Delete an income
const deleteIncome = async (incomeId, userId) => {
  try {
    const result = await pool.query('DELETE FROM incomes WHERE id = $1 AND user_id = $2 RETURNING *', [incomeId, userId]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Export incomes as Excel (controller will handle conversion)
const getIncomesForExcel = async (userId) => {
  try {
    const result = await pool.query('SELECT * FROM incomes WHERE user_id = $1', [userId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addIncome,
  getIncomes,
  deleteIncome,
  getIncomesForExcel
};
