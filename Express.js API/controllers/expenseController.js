const expenseService = require('../services/expenseService');
const excelService = require('../services/excelService');
const ApiResponse = require('../utils/responses/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');

const addExpense = asyncHandler(async (req, res) => {
  const { category, amount, icon, date } = req.body;
  const expense = await expenseService.addExpense(req.userId, category, amount, icon, date);
  ApiResponse.created(res, { expense }, 'Expense added successfully');
});

const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await expenseService.getExpenses(req.userId);
  ApiResponse.success(res, expenses);
});

const deleteExpense = asyncHandler(async (req, res) => {
  const { expenseId } = req.params;
  const deletedExpense = await expenseService.deleteExpense(expenseId, req.userId);
  
  if (!deletedExpense) {
    return ApiResponse.notFound(res, 'Expense not found');
  }
  ApiResponse.success(res, null, 'Expense deleted successfully');
});

const downloadExpenses = asyncHandler(async (req, res) => {
  const expenses = await expenseService.getExpenses(req.userId);
  const fileBuffer = excelService.generateExcelBuffer(expenses, 'Expenses');
  excelService.setExcelHeaders(res, 'expenses.xlsx');
  res.send(fileBuffer);
});

module.exports = { addExpense, getExpenses, deleteExpense, downloadExpenses };
