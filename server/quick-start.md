# ⚡ Quick Start - Backend Flow Testing

## 🚀 Get Started in 3 Steps

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd server
npm install        # If you haven't already
npm run dev        # Start server with auto-restart
```

**You should see:**
```
🔧 ENVIRONMENT CONFIGURATION:
================================
PORT: 5000
NODE_ENV: development
JWT_SECRET: ✅ Set (hidden)
MONGODB_URI: ✅ Set
================================

Connected to MongoDB

  ╔═══════════════════════════════════════════════╗
  ║   🚀 Server running on port 5000            ║
  ║   📡 Environment: development                ║
  ║   🔗 http://localhost:5000                  ║
  ╚═══════════════════════════════════════════════╝
```

---

### Step 2: Run the Test Script

Open a **NEW terminal** (keep the server running) and run:

```bash
cd server
node test-flow.js
```

This will test all authentication flows automatically!

---

### Step 3: Watch the Server Logs

Go back to your **first terminal** (where the server is running) and watch the detailed logs:

- 📨 Incoming requests with full details
- 🔑 Login/Register flows with step-by-step progress
- 🔐 JWT token generation and verification
- 📤 Outgoing responses with status codes

---

## 📊 What Gets Tested

The test script will:

1. ✅ Check server health
2. ✅ Register a new user
3. ✅ Login with credentials
4. ✅ Get user profile with JWT token
5. ✅ Test error cases (no token, wrong password)

---

## 🔑 Finding Your JWT Token and NODE_ENV

### Where to find JWT_SECRET:
1. Open `server/.env` file
2. Look for the line: `JWT_SECRET=your-super-secret-jwt-key-change-this-in-production`
3. That's your JWT secret!

### Where to find NODE_ENV:
1. Same `server/.env` file
2. Look for: `NODE_ENV=development`

### To see them in action:
- **On server startup**, they're displayed in the environment configuration
- **When generating tokens**, you'll see "Using JWT_SECRET: ✅ Available"
- **In logs**, all operations show which environment mode is active

---

## 💡 Pro Tips

### Get a JWT Token Manually:

1. **Register a user** (using curl):
```bash
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"pass123\",\"phone\":\"1234567890\"}"
```

2. **Copy the token** from the response (it starts with "eyJ...")

3. **Use it to access protected routes**:
```bash
curl http://localhost:5000/api/auth/profile -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### View Environment Variables in Server:

The server shows all environment variables on startup:

```
🔧 ENVIRONMENT CONFIGURATION:
================================
PORT: 5000
NODE_ENV: development          <-- Here's NODE_ENV
JWT_SECRET: ✅ Set (hidden)    <-- JWT_SECRET is set (not shown for security)
MONGODB_URI: ✅ Set
CLIENT_URL: http://localhost:5173
================================
```

---

## 🎯 Expected Output in Server Terminal

When you run the test script, your **server terminal** will show:

```
📨 INCOMING REQUEST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Time: 2026-06-15T10:30:45.123Z
🔹 Method: POST
🔹 Path: /api/auth/register
🔹 Request Body: {
  "name": "Test User",
  "email": "testuser1718445045123@example.com",
  "password": "***HIDDEN***"
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 REGISTER FLOW STARTED
═══════════════════════════════════════════
Step 1: Extracting user data from request body
  - Name: Test User
  - Email: testuser1718445045123@example.com
  - Password: ***HIDDEN***
  - Phone: 1234567890
  - Role: customer (default)

Step 2: Checking if user already exists...
✅ Email is available

Step 3: Creating new user in database...
✅ User created successfully with ID: 507f1f77bcf86cd799439011

Step 4: Generating JWT token...
🔐 Generating JWT token for user ID: 507f1f77bcf86cd799439011
🔐 Using JWT_SECRET: ✅ Available
🔐 Token generated successfully: eyJhbGciOiJIUzI1NiIsInR5cCI6...

Step 5: Sending success response
═══════════════════════════════════════════

📤 OUTGOING RESPONSE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔹 Status Code: 201
🔹 Path: /api/auth/register
🔹 Response includes JWT token
🔑 Token: eyJhbGciOiJIUzI1NiIsInR5cCI6...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎉 You're All Set!

Now you can:
- See exactly how authentication works
- Understand JWT token flow
- Debug issues with detailed logs
- Test your API endpoints

For more detailed information, check out `TESTING_GUIDE.md`! 🚀
