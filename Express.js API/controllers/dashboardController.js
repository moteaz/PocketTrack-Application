const dashboardService = require('../services/dashboardService');
const ApiResponse = require('../utils/responses/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');

const getDashboardData = asyncHandler(async (req, res) => {
  const dashboardData = await dashboardService.getDashboardData(req.userId);
  ApiResponse.success(res, dashboardData);
});

const getFinancialData = async (userId) => {
  return dashboardService.getFinancialData(userId);
};

module.exports = { getDashboardData, getFinancialData };
