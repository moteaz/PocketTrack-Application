const pool = require('../config/db');

class ExpenseService {
  async addExpense(userId, category, amount, icon, date) {
    const result = await pool.query(
      'INSERT INTO expenses (user_id, category, amount, icon, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, category, amount, icon, date]
    );
    return result.rows[0];
  }

  async getExpenses(userId) {
    const result = await pool.query('SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC', [userId]);
    return result.rows;
  }

  async deleteExpense(expenseId, userId) {
    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *',
      [expenseId, userId]
    );
    return result.rows[0];
  }
}

module.exports = new ExpenseService();
