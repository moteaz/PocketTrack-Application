# 🚀 Installation Guide - Refactored PocketTrack API

## 📋 Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

---

## 🔧 Installation Steps

### 1. Install Dependencies
```bash
cd "Express.js API"
npm install
```

### 2. Install New Dependencies (Added in Refactoring)
```bash
npm install helmet node-fetch
```

Or install all at once:
```bash
npm install
```

### 3. Environment Configuration
Copy the example environment file:
```bash
copy .env.example .env
```

Edit `.env` with your configuration:
```env
# Database Configuration
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expenseTracking_db

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# Client Configuration
CLIENT_ORIGIN=http://localhost:5173

# AI Configuration (Optional - for chatbot feature)
AI_API_URL=http://localhost:11434/api/generate
AI_MODEL=llama3
```

### 4. Database Setup
Make sure PostgreSQL is running and create the database:
```sql
CREATE DATABASE expenseTracking_db;
```

Run your existing database migrations/schema setup.

### 5. Start the Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

You should see:
```
🚀 Server running on port 5000
📝 Environment: development
```

---

## ✅ Verify Installation

### Test the API:
```bash
curl http://localhost:5000
```

Expected response:
```json
{
  "message": "PocketTrack API is running",
  "version": "1.0.0"
}
```

### Test Authentication:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 📦 New Dependencies Explained

| Package | Purpose | Version |
|---------|---------|---------|
| `helmet` | Security headers | ^7.1.0 |
| `node-fetch` | HTTP requests (for AI chatbot) | ^2.7.0 |

---

## 🔄 Migration from Old Version

**Good News:** No breaking changes! The refactored API is 100% backward compatible.

### What Changed:
- ✅ Internal code structure (better organized)
- ✅ Added security middleware
- ✅ Added rate limiting
- ✅ Better error handling
- ✅ Consistent response format

### What Stayed the Same:
- ✅ All API endpoints
- ✅ Request/response formats
- ✅ Database schema
- ✅ Authentication flow

---

## 🧪 Testing the Refactored API

### 1. Test Signup
```bash
curl -X POST http://localhost:5000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Test Protected Endpoint (use token from login)
```bash
curl http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Test Rate Limiting
Run the same request 101 times in 15 minutes:
```bash
for i in {1..101}; do
  curl http://localhost:5000/api/dashboard \
    -H "Authorization: Bearer YOUR_TOKEN_HERE"
done
```

After 100 requests, you should get:
```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'helmet'"
**Solution:**
```bash
npm install helmet
```

### Issue: "Cannot find module 'node-fetch'"
**Solution:**
```bash
npm install node-fetch@2.7.0
```

### Issue: Database connection error
**Solution:**
- Check PostgreSQL is running
- Verify `.env` database credentials
- Ensure database exists

### Issue: JWT errors
**Solution:**
- Make sure `JWT_SECRET` is set in `.env`
- Token might be expired (default: 1 hour)

### Issue: CORS errors
**Solution:**
- Update `CLIENT_ORIGIN` in `.env` to match your frontend URL
- Default is `http://localhost:5173`

### Issue: Rate limit too strict
**Solution:**
Edit `utils/constants.js`:
```javascript
RATE_LIMIT: {
  WINDOW_MS: 15 * 60 * 1000,  // 15 minutes
  MAX_REQUESTS: 200,           // Increase from 100 to 200
}
```

---

## 📊 Project Structure After Installation

```
Express.js API/
├── config/
├── controllers/
├── services/          ← NEW
├── models/
├── routes/
├── middleware/
├── utils/             ← NEW
│   ├── constants.js
│   ├── validators.js
│   └── responses/
├── uploads/
├── node_modules/
├── .env
├── .env.example
├── package.json
├── server.js
├── REFACTORING_SUMMARY.md
├── ARCHITECTURE.md
└── INSTALLATION.md
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS (not HTTP)
- [ ] Update `CLIENT_ORIGIN` to production URL
- [ ] Review rate limiting settings
- [ ] Enable database SSL connection
- [ ] Set up proper logging
- [ ] Configure firewall rules
- [ ] Use environment-specific `.env` files

---

## 📚 Next Steps

1. ✅ Read `REFACTORING_SUMMARY.md` to understand changes
2. ✅ Read `ARCHITECTURE.md` to understand structure
3. ✅ Test all endpoints with Postman/Insomnia
4. ✅ Update frontend to use new response format (if needed)
5. ✅ Write unit tests for services
6. ✅ Set up CI/CD pipeline

---

## 🆘 Need Help?

- Check `REFACTORING_SUMMARY.md` for detailed changes
- Check `ARCHITECTURE.md` for architecture details
- Review code comments in service files
- Check the Code Issues Panel for any remaining issues

---

## 📝 Version Info

- **API Version:** 2.0.0 (Refactored)
- **Node.js:** v14+
- **PostgreSQL:** v12+
- **Express:** v5.1.0

---

**Happy Coding! 🎉**
