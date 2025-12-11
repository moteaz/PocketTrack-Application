const incomeService = require('../services/incomeService');
const excelService = require('../services/excelService');
const ApiResponse = require('../utils/responses/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');

const addIncome = asyncHandler(async (req, res) => {
  const { source, amount, icon, date } = req.body;
  const income = await incomeService.addIncome(req.userId, source, amount, icon, date);
  ApiResponse.created(res, { income }, 'Income added successfully');
});

const getIncomes = asyncHandler(async (req, res) => {
  const incomes = await incomeService.getIncomes(req.userId);
  ApiResponse.success(res, incomes);
});

const deleteIncome = asyncHandler(async (req, res) => {
  const { incomeId } = req.params;
  const deletedIncome = await incomeService.deleteIncome(incomeId, req.userId);
  
  if (!deletedIncome) {
    return ApiResponse.notFound(res, 'Income not found');
  }
  ApiResponse.success(res, null, 'Income deleted successfully');
});

const downloadIncomes = asyncHandler(async (req, res) => {
  const incomes = await incomeService.getIncomes(req.userId);
  const fileBuffer = excelService.generateExcelBuffer(incomes, 'Incomes');
  excelService.setExcelHeaders(res, 'incomes.xlsx');
  res.send(fileBuffer);
});

module.exports = { addIncome, getIncomes, deleteIncome, downloadIncomes };
