require('dotenv').config();  // Ensure dotenv is loaded at the top
const path = require('path');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Import the auth routes
const dashboardRoutes = require('./routes/dashboardRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');

const app = express();
const port = 5000;

// CORS middleware configuration
const corsOptions = {
  origin: 'http://localhost:5173',  // React app URL
  credentials: true,               // Allow credentials (cookies, authorization headers)
};

// Middleware
app.use(cors(corsOptions));  // Enable CORS with the specified options
app.use(express.json());  // Express's built-in JSON parser

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Use authRoutes for API calls to /api/auth
app.use('/api/auth', authRoutes); // Register the routes under '/api/auth'
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/income', incomeRoutes);


// Add a basic GET route to test
app.get('/', (req, res) => {
  res.send('Server is working!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
