// /middleware/verifyToken.js

const jwt = require('jsonwebtoken');  // Add this line to import the 'jsonwebtoken' module

const verifyToken = (req, res, next) => {
  const authHeader  = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Access denied, no token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.userId = decoded.userId;  // Store the user ID from the token payload
    next();
  });
};

module.exports = verifyToken;
