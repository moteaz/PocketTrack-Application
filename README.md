# PocketTrack

**PocketTrack** is a full-stack web application for tracking income and expenses, built with a modern, efficient tech stack. It includes data visualization, AI-powered insights, and supports exporting financial reports.

---

## 🛠 Tech Stack

- **💻 Frontend**: React + Vite  
  _Blazing-fast, modern UI powered by React with lightning-fast builds via Vite._

- **🖥️ Backend**: Node.js + Express  
  _Robust RESTful API for smooth integration and scalability._

- **🗄️ Database**: PostgreSQL  
  _Reliable, high-performance relational database for managing financial data._

- **🧠 AI Integration (Optional)**: LLaMA via [Ollama](https://ollama.com)  
  _Enables offline, private LLM usage for features like smart financial summaries and auto-categorization._

---

## ✨ Features

- ✅ JWT-based user authentication
- ➕ Add / ➖ Delete income and expenses
- 📊 Interactive charts and statistical insights
- 🤖 AI-powered summaries and transaction categorization _(optional)_
- 📥 Export monthly reports as Excel files
- 👤 Profile management
- 📱 Responsive design using Tailwind CSS

---

## 🚀 Getting Started

### 🔁 Clone the Repository

```bash
git clone https://github.com/moteaz/PocketTrack-Application.git
cd PocketTrack-Application

## Frontend Setup

cd Web
npm install
npm run dev

## Backend Setup

cd APIs
npm install
npm run dev

## 🤖 Run AI Server (Optional)
To enable AI-powered features using LLaMA:

ollama run llama3

Make sure you have Ollama installed and configured.
## Environment Variables (.env file)

Create a .env file in the APIs folder with the following variables:

# Database Configuration

DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expenseTracking_db

# JWT Authentication

JWT_SECRET=your_jwt_secret_key

# Port for the backend server

PORT=5000
```
