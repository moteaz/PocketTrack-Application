

const authService = require('../services/authService');
const ApiResponse = require('../utils/responses/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');

const signup = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  const profilePic = req.file ? `/uploads/${req.file.filename}` : null;

  const newUser = await authService.createUser(fullname, email, password, profilePic);
  ApiResponse.created(res, { user: newUser }, 'User created successfully');
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const authData = await authService.authenticateUser(email, password);
  ApiResponse.success(res, authData, 'Login successful');
});

const getUser = asyncHandler(async (req, res) => {
  const user = await authService.findUserById(req.userId);
  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }
  ApiResponse.success(res, user);
});

const editUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  const profilePic = req.file ? `/uploads/${req.file.filename}` : null;

  const updates = { fullname, email, password, profilePic };
  const updatedUser = await authService.updateUser(req.userId, updates);
  ApiResponse.success(res, { user: updatedUser }, 'User updated successfully');
});

module.exports = { signup, login, getUser, editUser };
