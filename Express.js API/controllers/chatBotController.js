// controllers/chatBotController.js
const fetch = require('node-fetch');  // Make sure to install node-fetch
const pool = require('../config/db');
const { getFinancialData } = require('./dashboardController');

// Helper function to group expenses by category
function groupByCategory(expenses) {
  return expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) acc[category] = 0;
    acc[category] += expense.amount;
    return acc;
  }, {});
}

// Helper function to group income by source
function groupBySource(incomes) {
  return incomes.reduce((acc, income) => {
    const source = income.source;
    if (!acc[source]) acc[source] = 0;
    acc[source] += income.amount;
    return acc;
  }, {});
}

const getBotResponse = async (req, res) => {
  const { prompt } = req.body;
  const userId = req.userId;  

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  const sanitizedPrompt = prompt.replace(/[\r\n]+/g, ' ').trim();

  try {
    const { last30DaysExpenseRes, last60DaysIncomeRes } = await getFinancialData(userId);

    const expenseData = last30DaysExpenseRes.rows.map(expense => ({
      category: expense.category,
      amount: parseFloat(expense.amount),
      date: new Date(expense.date).toISOString().split('T')[0]
    }));

    const incomeData = last60DaysIncomeRes.rows.map(income => ({
      source: income.source,
      amount: parseFloat(income.amount),
      date: new Date(income.date).toISOString().split('T')[0]
    }));

    const totalExpense = expenseData.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncome = incomeData.reduce((sum, income) => sum + income.amount, 0);

    const financialSummary = {
      last30DaysExpenseTotal: totalExpense,
      last60DaysIncomeTotal: totalIncome,
      balance: totalIncome - totalExpense,
      expenseCategories: groupByCategory(expenseData),
      incomeSources: groupBySource(incomeData)
    };

    const expenseDetails = expenseData.slice(-10);
    const incomeDetails = incomeData.slice(-10);

    const aiPrompt = `
      User Question: ${sanitizedPrompt}

      Financial Data:
      ${JSON.stringify(financialSummary, null, 2)}

      Expense Details (last 10):
      ${JSON.stringify(expenseDetails, null, 2)}

      Income Details (last 10):
      ${JSON.stringify(incomeDetails, null, 2)}

      If the question is about finances, use this data to answer. If not, just answer the question as best you can.
    `;

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          prompt: aiPrompt,
          stream: true,
        }),
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      response.body.on('data', (chunk) => {
        res.write(`data: ${chunk.toString()}\n\n`);
      });

      response.body.on('end', () => {
        res.write('data: [END]\n\n');
        res.end();
      });

      response.body.on('error', (err) => {
        res.write(`data: [ERROR] ${err.message}\n\n`);
        res.end();
      });
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        return res.status(504).json({ message: 'AI API request timed out' });
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Chatbot Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = { getBotResponse };
