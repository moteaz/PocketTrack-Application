
const jwt = require('jsonwebtoken');
const { HTTP_STATUS } = require('../utils/constants');
const ApiError = require('../utils/responses/ApiError');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new ApiError('Access denied, no token provided', HTTP_STATUS.FORBIDDEN));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return next(new ApiError('Invalid or expired token', HTTP_STATUS.UNAUTHORIZED));
  }
};

module.exports = verifyToken;
