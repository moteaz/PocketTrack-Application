const { body, param } = require('express-validator');

const validators = {
  signup: [
    body('fullname').trim().isString().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
    body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],

  login: [
    body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],

  editUser: [
    body('fullname').optional().trim().isString().isLength({ min: 2 }),
    body('email').optional().trim().isEmail().normalizeEmail(),
    body('password').optional().isLength({ min: 6 }),
  ],

  addExpense: [
    body('category').trim().isString().notEmpty().withMessage('Category is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
    body('icon').optional().trim().isString(),
    body('date').isISO8601().withMessage('Date must be a valid ISO8601 date'),
  ],

  deleteExpense: [
    param('expenseId').isInt().withMessage('Expense ID must be an integer'),
  ],

  addIncome: [
    body('source').trim().isString().notEmpty().withMessage('Source is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
    body('icon').optional().trim().isString(),
    body('date').isISO8601().withMessage('Date must be a valid ISO8601 date'),
  ],

  deleteIncome: [
    param('incomeId').isInt().withMessage('Income ID must be an integer'),
  ],

  chatbot: [
    body('prompt').trim().notEmpty().withMessage('Prompt is required'),
  ],
};

module.exports = validators;
