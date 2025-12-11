const pool = require('../config/db');
const { TIME_INTERVALS } = require('../utils/constants');

class DashboardService {
  async getTotalIncome(userId) {
    const result = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) AS total FROM incomes WHERE user_id = $1',
      [userId]
    );
    return parseFloat(result.rows[0].total);
  }

  async getTotalExpense(userId) {
    const result = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE user_id = $1',
      [userId]
    );
    return parseFloat(result.rows[0].total);
  }

  async getLast30DaysExpenses(userId) {
    const result = await pool.query(
      `SELECT id, icon, category, amount, date
       FROM expenses
       WHERE user_id = $1 AND date >= NOW() - INTERVAL '${TIME_INTERVALS.LAST_30_DAYS}'
       ORDER BY date DESC`,
      [userId]
    );
    return result.rows;
  }

  async getLast60DaysIncome(userId) {
    const result = await pool.query(
      `SELECT id, source, amount, icon, date
       FROM incomes
       WHERE user_id = $1 AND date >= NOW() - INTERVAL '${TIME_INTERVALS.LAST_60_DAYS}'
       ORDER BY date DESC`,
      [userId]
    );
    return result.rows;
  }

  async getRecentTransactions(userId, limit = 5) {
    const recentIncome = await pool.query(
      `SELECT id, source, amount, icon, date, 'income' AS type
       FROM incomes WHERE user_id = $1 ORDER BY id DESC LIMIT $2`,
      [userId, limit]
    );

    const recentExpense = await pool.query(
      `SELECT id, category, amount, icon, date, 'expense' AS type
       FROM expenses WHERE user_id = $1 ORDER BY id DESC LIMIT $2`,
      [userId, limit]
    );

    return [...recentIncome.rows, ...recentExpense.rows]
      .map(txn => ({
        ...txn,
        date: new Date(txn.date).toISOString().replace('T', ' ').slice(0, 19),
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getDashboardData(userId) {
    const [totalIncome, totalExpense, last30DaysExpenses, last60DaysIncome, recentTransactions] = await Promise.all([
      this.getTotalIncome(userId),
      this.getTotalExpense(userId),
      this.getLast30DaysExpenses(userId),
      this.getLast60DaysIncome(userId),
      this.getRecentTransactions(userId),
    ]);

    const last30DaysExpenseTotal = last30DaysExpenses.reduce((sum, row) => sum + parseFloat(row.amount), 0);
    const last60DaysIncomeTotal = last60DaysIncome.reduce((sum, row) => sum + parseFloat(row.amount), 0);

    return {
      total_balance: totalIncome - totalExpense,
      total_income: totalIncome,
      total_expense: totalExpense,
      last30daysExpense: {
        total: last30DaysExpenseTotal,
        transaction: last30DaysExpenses.map(t => ({
          id: t.id,
          icon: t.icon,
          category: t.category,
          amount: parseFloat(t.amount),
          date: new Date(t.date).toISOString().replace('T', ' ').slice(0, 19),
        })),
      },
      last60daysIncome: {
        total: last60DaysIncomeTotal,
        transaction: last60DaysIncome.map(t => ({
          id: t.id,
          source: t.source,
          icon: t.icon,
          amount: parseFloat(t.amount),
          date: new Date(t.date).toISOString().replace('T', ' ').slice(0, 19),
        })),
      },
      recent_transactions: recentTransactions,
    };
  }

  async getFinancialData(userId) {
    const [last30DaysExpenses, last60DaysIncome] = await Promise.all([
      this.getLast30DaysExpenses(userId),
      this.getLast60DaysIncome(userId),
    ]);

    return {
      last30DaysExpenseRes: { rows: last30DaysExpenses },
      last60DaysIncomeRes: { rows: last60DaysIncome },
    };
  }
}

module.exports = new DashboardService();
