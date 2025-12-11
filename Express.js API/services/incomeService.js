const pool = require('../config/db');

class IncomeService {
  async addIncome(userId, source, amount, icon, date) {
    const result = await pool.query(
      'INSERT INTO incomes (user_id, source, amount, icon, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, source, amount, icon, date]
    );
    return result.rows[0];
  }

  async getIncomes(userId) {
    const result = await pool.query('SELECT * FROM incomes WHERE user_id = $1 ORDER BY date DESC', [userId]);
    return result.rows;
  }

  async deleteIncome(incomeId, userId) {
    const result = await pool.query(
      'DELETE FROM incomes WHERE id = $1 AND user_id = $2 RETURNING *',
      [incomeId, userId]
    );
    return result.rows[0];
  }
}

module.exports = new IncomeService();
