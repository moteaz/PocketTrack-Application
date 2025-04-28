const { addIncome, getIncomes, deleteIncome, getIncomesForExcel } = require('../models/Income');

// Add expense controller
const addIncomeController = async (userId, source, amount, icon, date) => {
  try {
    const income = await addIncome(userId, source, amount, icon, date);
    return income;
  } catch (error) {
    throw error;
  }
};

// Get incomes controller
const getIncomesController = async (userId) => {
  try {
    const incomes = await getIncomes(userId);
    return incomes;
  } catch (error) {
    throw error;
  }
};

// Delete income controller
const deleteIncomeController = async (incomeId, userId) => {
  try {
    const income = await deleteIncome(incomeId, userId);
    return income;
  } catch (error) {
    throw error;
  }
};

// Get incomes for Excel export
const getIncomesForExcelController = async (userId) => {
  try {
    const incomes = await getIncomesForExcel(userId);
    return incomes;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addIncomeController,
  getIncomesController,
  deleteIncomeController,
  getIncomesForExcelController,
};
