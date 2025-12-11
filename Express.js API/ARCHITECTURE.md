# 🏛️ PocketTrack API Architecture

## 📐 Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT REQUEST                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER.JS                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. Helmet (Security Headers)                            │  │
│  │  2. CORS (Cross-Origin)                                  │  │
│  │  3. Rate Limiter (100 req/15min)                         │  │
│  │  4. Body Parser (JSON/URL-encoded)                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                          ROUTES                                 │
│  /api/auth      → authRoutes                                    │
│  /api/expense   → expenseRoutes                                 │
│  /api/income    → incomeRoutes                                  │
│  /api/dashboard → dashboardRoutes                               │
│  /api/chatbot   → chatbotRoutes                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        MIDDLEWARE CHAIN                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. verifyToken (JWT Authentication)                     │  │
│  │  2. validators (Input Validation)                        │  │
│  │  3. validate (Check Validation Results)                  │  │
│  │  4. upload (File Upload - if needed)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CONTROLLERS                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • Extract request data (body, params, query)            │  │
│  │  • Call appropriate service method                       │  │
│  │  • Format response using ApiResponse                     │  │
│  │  • Wrapped in asyncHandler (auto error handling)         │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SERVICES                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • Business logic implementation                         │  │
│  │  • Data validation and transformation                    │  │
│  │  • Call model methods for data access                    │  │
│  │  • Throw ApiError for operational errors                 │  │
│  │  • Return processed data to controller                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MODELS (Optional)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • Pure database queries                                 │  │
│  │  • No business logic                                     │  │
│  │  • Return raw data                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE (PostgreSQL)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RESPONSE BACK TO CLIENT                      │
│  Success: { success: true, message: "...", data: {...} }       │
│  Error:   { success: false, message: "...", errors: [...] }    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR OCCURS ANYWHERE                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  asyncHandler  │
                    │  catches error │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  next(error)   │
                    └────────┬───────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ERROR HANDLER MIDDLEWARE                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. Check error type (ApiError, ValidationError, etc.)   │  │
│  │  2. Determine status code                                │  │
│  │  3. Format error message                                 │  │
│  │  4. Log error (if needed)                                │  │
│  │  5. Send consistent error response                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT RECEIVES ERROR                        │
│  { success: false, message: "Error message", errors: [...] }   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure Details

```
Express.js API/
│
├── config/
│   └── db.js                    # PostgreSQL connection pool
│
├── controllers/                 # HTTP Request/Response handlers
│   ├── authController.js        # Auth endpoints (signup, login, etc.)
│   ├── expenseController.js     # Expense CRUD operations
│   ├── incomeController.js      # Income CRUD operations
│   ├── dashboardController.js   # Dashboard data aggregation
│   └── chatBotController.js     # AI chatbot integration
│
├── services/                    # Business Logic Layer (NEW)
│   ├── authService.js           # User authentication & management
│   ├── expenseService.js        # Expense business logic
│   ├── incomeService.js         # Income business logic
│   ├── dashboardService.js      # Dashboard data processing
│   └── excelService.js          # Excel file generation
│
├── models/                      # Data Access Layer
│   ├── Expense.js               # Expense database queries
│   └── Income.js                # Income database queries
│
├── routes/                      # Route Definitions
│   ├── authRoutes.js            # /api/auth routes
│   ├── expenseRoutes.js         # /api/expense routes
│   ├── incomeRoutes.js          # /api/income routes
│   ├── dashboardRoutes.js       # /api/dashboard routes
│   └── chatbotRoutes.js         # /api/chatbot routes
│
├── middleware/                  # Reusable Middleware
│   ├── asyncHandler.js          # Async error wrapper
│   ├── errorHandler.js          # Centralized error handler
│   ├── validation.js            # Validation middleware
│   ├── uploadMiddleware.js      # File upload configuration
│   └── verifyToken.js           # JWT authentication
│
├── utils/                       # Utilities & Helpers (NEW)
│   ├── constants.js             # App-wide constants
│   ├── validators.js            # Validation rules
│   └── responses/
│       ├── ApiResponse.js       # Success response formatter
│       └── ApiError.js          # Custom error class
│
├── uploads/                     # User uploaded files
│
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
├── server.js                    # Application entry point
├── REFACTORING_SUMMARY.md       # Refactoring documentation
└── ARCHITECTURE.md              # This file
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT LOGIN REQUEST                       │
│  POST /api/auth/login                                           │
│  Body: { email, password }                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  ROUTE: authRoutes.js                                           │
│  → validators.login → validate → login controller               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  CONTROLLER: authController.login()                             │
│  → Extract email, password                                      │
│  → Call authService.authenticateUser()                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  SERVICE: authService.authenticateUser()                        │
│  1. Find user by email                                          │
│  2. Compare password with hash                                  │
│  3. Generate JWT token                                          │
│  4. Return { token, userId }                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  RESPONSE TO CLIENT                                             │
│  { success: true, data: { token, userId } }                     │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  SUBSEQUENT REQUESTS                                            │
│  Headers: { Authorization: "Bearer <token>" }                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  MIDDLEWARE: verifyToken                                        │
│  1. Extract token from Authorization header                     │
│  2. Verify token with JWT_SECRET                                │
│  3. Attach userId to req.userId                                 │
│  4. Call next()                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Design Patterns Used

### 1. **Layered Architecture**
- Presentation Layer (Controllers)
- Business Logic Layer (Services)
- Data Access Layer (Models)
- Database Layer (PostgreSQL)

### 2. **Dependency Injection**
- Services are injected into controllers
- Models are injected into services
- Easy to mock for testing

### 3. **Factory Pattern**
- ApiResponse class creates different response types
- Service classes instantiated as singletons

### 4. **Middleware Chain Pattern**
- Request passes through multiple middleware
- Each middleware has single responsibility

### 5. **Error Handling Pattern**
- Custom ApiError class
- Centralized error handler
- Consistent error responses

### 6. **Singleton Pattern**
- Database connection pool
- Service instances
- Configuration constants

---

## 🔧 Key Components Explained

### **ApiResponse (Response Formatter)**
```javascript
ApiResponse.success(res, data, message, statusCode)
ApiResponse.error(res, message, statusCode, errors)
ApiResponse.created(res, data, message)
ApiResponse.notFound(res, message)
ApiResponse.unauthorized(res, message)
ApiResponse.badRequest(res, message, errors)
```

### **ApiError (Custom Error Class)**
```javascript
throw new ApiError('User not found', 404);
throw new ApiError('Invalid credentials', 401);
```

### **asyncHandler (Error Wrapper)**
```javascript
const controller = asyncHandler(async (req, res) => {
  // No try-catch needed
  const data = await service.method();
  ApiResponse.success(res, data);
});
```

### **Service Pattern**
```javascript
class AuthService {
  async createUser() { /* business logic */ }
  async authenticateUser() { /* business logic */ }
  async updateUser() { /* business logic */ }
}
module.exports = new AuthService();
```

---

## 📊 Data Flow Example: Add Expense

```
1. CLIENT
   POST /api/expense
   Body: { category: "Food", amount: 50, date: "2024-01-01" }
   Headers: { Authorization: "Bearer <token>" }

2. SERVER.JS
   → Helmet, CORS, Rate Limiter, Body Parser

3. ROUTE (expenseRoutes.js)
   → verifyToken → validators.addExpense → validate → addExpense

4. MIDDLEWARE (verifyToken)
   → Verify JWT → Attach req.userId

5. MIDDLEWARE (validators.addExpense)
   → Validate category, amount, date

6. CONTROLLER (expenseController.addExpense)
   → Extract { category, amount, icon, date }
   → Call expenseService.addExpense(userId, category, amount, icon, date)

7. SERVICE (expenseService.addExpense)
   → Validate business rules
   → Call database query

8. DATABASE
   → INSERT INTO expenses (...)
   → RETURNING *

9. RESPONSE
   ← { success: true, message: "Expense added", data: { expense } }
```

---

## 🚀 Performance Considerations

1. **Database Connection Pooling** - Reuse connections
2. **Async/Await** - Non-blocking operations
3. **Rate Limiting** - Prevent abuse
4. **Efficient Queries** - Use indexes, avoid N+1 queries
5. **Caching Ready** - Service layer can add caching easily

---

## 🔒 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Helmet                  → Security headers                  │
│  2. CORS                    → Cross-origin protection           │
│  3. Rate Limiting           → Prevent brute force               │
│  4. Input Validation        → Prevent injection attacks         │
│  5. JWT Authentication      → Secure endpoints                  │
│  6. Password Hashing        → bcrypt with salt                  │
│  7. Error Sanitization      → No sensitive data in errors       │
│  8. File Upload Validation  → Type & size restrictions          │
└─────────────────────────────────────────────────────────────────┘
```

---

**Architecture Version:** 2.0.0  
**Last Updated:** 2024
