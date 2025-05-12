require('dotenv').config();  // Ensure dotenv is loaded at the top
const path = require('path');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const chatBotRoutes = require('./routes/chatbotRoutes');
const app = express();
const port = 5000;

// CORS middleware configuration
const corsOptions = {
  origin: 'http://localhost:5173',  // React app URL
  credentials: true,               // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));  
app.use(express.json());  

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes); 
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/chatbot', chatBotRoutes);

app.get('/', (req, res) => {
  res.send('Server is working!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
