const fetch = require('node-fetch');
const { getFinancialData } = require('./dashboardController');
const ApiResponse = require('../utils/responses/ApiResponse');
const { HTTP_STATUS } = require('../utils/constants');

const groupByCategory = (expenses) => {
  return expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) acc[category] = 0;
    acc[category] += expense.amount;
    return acc;
  }, {});
};

const groupBySource = (incomes) => {
  return incomes.reduce((acc, income) => {
    const source = income.source;
    if (!acc[source]) acc[source] = 0;
    acc[source] += income.amount;
    return acc;
  }, {});
};

const getBotResponse = async (req, res) => {
  const { prompt } = req.body;
  const userId = req.userId;

  if (!prompt) {
    return ApiResponse.badRequest(res, 'Prompt is required');
  }

  const sanitizedPrompt = prompt.replace(/[\r\n]+/g, ' ').trim();

  try {
    const { last30DaysExpenseRes, last60DaysIncomeRes } = await getFinancialData(userId);

    const expenseData = last30DaysExpenseRes.rows.map(expense => ({
      category: expense.category,
      amount: parseFloat(expense.amount),
      date: new Date(expense.date).toISOString().split('T')[0],
    }));

    const incomeData = last60DaysIncomeRes.rows.map(income => ({
      source: income.source,
      amount: parseFloat(income.amount),
      date: new Date(income.date).toISOString().split('T')[0],
    }));

    const totalExpense = expenseData.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncome = incomeData.reduce((sum, income) => sum + income.amount, 0);

    const financialSummary = {
      last30DaysExpenseTotal: totalExpense,
      last60DaysIncomeTotal: totalIncome,
      balance: totalIncome - totalExpense,
      expenseCategories: groupByCategory(expenseData),
      incomeSources: groupBySource(incomeData),
    };

    const aiPrompt = `
      User Question: ${sanitizedPrompt}

      Financial Data:
      ${JSON.stringify(financialSummary, null, 2)}

      Expense Details (last 10):
      ${JSON.stringify(expenseData.slice(-10), null, 2)}

      Income Details (last 10):
      ${JSON.stringify(incomeData.slice(-10), null, 2)}

      If the question is about finances, use this data to answer. If not, just answer the question as best you can.
    `;

    try {
      const response = await fetch(process.env.AI_API_URL || 'http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: process.env.AI_MODEL || 'llama3',
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
        return res.status(HTTP_STATUS.GATEWAY_TIMEOUT).json({ message: 'AI API request timed out' });
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Chatbot Error:', error.message);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

module.exports = { getBotResponse };
