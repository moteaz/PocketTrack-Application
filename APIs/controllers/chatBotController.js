// controllers/chatBotController.js
const fetch = require('node-fetch');  // Make sure to install node-fetch
const pool = require('../config/db');
const { getFinancialData } = require('./dashboardController');

const getBotResponse = async (req, res) => {
  
  const { prompt } = req.body;
  const userId = req.userId;
  

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  try {
    // Get financial data from dashboard controller
    const { last30DaysExpenseRes, last60DaysIncomeRes } = await getFinancialData(userId);
    
    // Process expense data
    const expenseData = last30DaysExpenseRes.rows.map(expense => ({
      category: expense.category,
      amount: parseFloat(expense.amount),
      date: new Date(expense.date).toISOString().split('T')[0]
    }));
    
    // Process income data
    const incomeData = last60DaysIncomeRes.rows.map(income => ({
      source: income.source,
      amount: parseFloat(income.amount),
      date: new Date(income.date).toISOString().split('T')[0]
    }));
    
    // Calculate summary statistics
    const totalExpense = expenseData.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncome = incomeData.reduce((sum, income) => sum + income.amount, 0);
    
    // Create a financial summary for context
    const financialSummary = {
      last30DaysExpenseTotal: totalExpense,
      last60DaysIncomeTotal: totalIncome,
      balance: totalIncome - totalExpense,
      expenseCategories: groupByCategory(expenseData),
      incomeSources: groupBySource(incomeData)
    };
    
    // Prepare the prompt for the AI
    const aiPrompt = `
      User Question: ${prompt}
      
      Financial Data:
      ${JSON.stringify(financialSummary, null, 2)}
      
      Expense Details:
      ${JSON.stringify(expenseData, null, 2)}
      
      Income Details:
      ${JSON.stringify(incomeData, null, 2)}
      
      Please analyze this financial data and answer the user's question.
    `;
    
    // Call the AI API
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3",  // Ensure the model is correct as per the API you're using
        prompt: aiPrompt,
        stream: false,
      }),
    });
    
    const data = await response.json();
    res.json({ response: data.response || "No response from the server" });
  } catch (error) {
    console.error('Chatbot Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Helper function to group expenses by category
function groupByCategory(expenses) {
  return expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {});
}

// Helper function to group income by source
function groupBySource(incomes) {
  return incomes.reduce((acc, income) => {
    const source = income.source;
    if (!acc[source]) {
      acc[source] = 0;
    }
    acc[source] += income.amount;
    return acc;
  }, {});
}

module.exports = { getBotResponse };