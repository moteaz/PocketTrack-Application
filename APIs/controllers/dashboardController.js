const pool = require('../config/db');

const getDashboardData = async (req, res) => {
  const userId = req.userId;

  try {
    // Get total income
    const totalIncomeRes = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) AS total FROM incomes WHERE user_id = $1',
      [userId]
    );
    const totalIncome = parseFloat(totalIncomeRes.rows[0].total);

    // Get total expense
    const totalExpenseRes = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE user_id = $1',
      [userId]
    );
    const totalExpense = parseFloat(totalExpenseRes.rows[0].total);

    const totalBalance = totalIncome - totalExpense;

    // Last 30 days expenses
    const last30DaysExpenseRes = await pool.query(
      `SELECT id, icon, category, amount, date
       FROM expenses
       WHERE user_id = $1 AND date >= NOW() - INTERVAL '30 days'
       ORDER BY date DESC`,
      [userId]
    );
    const last30DaysExpenseTotal = last30DaysExpenseRes.rows.reduce((sum, row) => sum + parseFloat(row.amount), 0);

    // Last 60 days income
    const last60DaysIncomeRes = await pool.query(
      `SELECT id, source, amount, icon, date
       FROM incomes
       WHERE user_id = $1 AND date >= NOW() - INTERVAL '60 days'
       ORDER BY date DESC`,
      [userId]
    );
    const last60DaysIncomeTotal = last60DaysIncomeRes.rows.reduce((sum, row) => sum + parseFloat(row.amount), 0);

    // Recent transactions (5 income + 5 expense)
    const recentIncomeRes = await pool.query(
      `SELECT id, source, amount, icon, date, 'income' AS type
       FROM incomes
       WHERE user_id = $1
       ORDER BY id DESC
       LIMIT 5`,
      [userId]
    );
    const recentExpenseRes = await pool.query(
      `SELECT id, category, amount, icon, date, 'expense' AS type
       FROM expenses
       WHERE user_id = $1
       ORDER BY id DESC
       LIMIT 5`,
      [userId]
    );

    // Merge & sort by date
    const recentTransactions = [...recentIncomeRes.rows, ...recentExpenseRes.rows].map(txn => ({
      ...txn,
      date: new Date(txn.date).toISOString().replace('T', ' ').slice(0, 19)
    })).sort((a, b) => new Date(b.date) - new Date(a.date));

    // Send response
    res.json({
      total_balance: totalBalance,
      total_income: totalIncome,
      total_expense: totalExpense,
      last30daysExpense: {
        total: last30DaysExpenseTotal,
        transaction: last30DaysExpenseRes.rows.map(t => ({
          id: t.id,
          icon: t.icon,
          category: t.category,
          amount: parseFloat(t.amount),
          date: new Date(t.date).toISOString().replace('T', ' ').slice(0, 19)
        }))
      },
      last60daysIncome: {
        total: last60DaysIncomeTotal,
        transaction: last60DaysIncomeRes.rows.map(t => ({
          id: t.id,
          source: t.source,
          icon: t.icon,
          amount: parseFloat(t.amount),
          date: new Date(t.date).toISOString().replace('T', ' ').slice(0, 19)
        }))
      },
      recent_transactions: recentTransactions
    });
  } catch (err) {
    console.error('Dashboard Error:', err.message);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

module.exports = { getDashboardData };
