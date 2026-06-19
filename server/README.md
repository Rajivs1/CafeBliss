# Cafe Management System - Backend API

Complete REST API for the Cafe Management System with real-time features using Socket.io.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)

### Installation

1. **Navigate to server folder:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update values as needed:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cafe-management
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

4. **Start MongoDB:**
   - If using local MongoDB:
     ```bash
     mongod
     ```
   - Or use MongoDB Atlas connection string in `.env`

5. **Seed the database (optional but recommended):**
   ```bash
   npm run seed
   ```
   This creates:
   - 3 users (admin, staff, customer)
   - 20 menu items across all categories
   - Sample orders and reservations

6. **Start the server:**
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:5000

## 📝 Test Credentials

After seeding, use these credentials:

| Role     | Email               | Password    |
|----------|---------------------|-------------|
| Admin    | admin@cafe.com      | admin123    |
| Staff    | staff@cafe.com      | staff123    |
| Customer | customer@cafe.com   | customer123 |

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (protected)

### Menu (`/api/menu`)
- `GET /` - Get all menu items (public)
- `GET /:id` - Get single item (public)
- `POST /` - Create item (admin only)
- `PUT /:id` - Update item (admin only)
- `DELETE /:id` - Delete item (admin only)

### Orders (`/api/orders`)
- `POST /` - Create order (customer)
- `GET /my-orders` - Get user's orders (protected)
- `GET /` - Get all orders (staff/admin)
- `GET /:id` - Get single order (owner/staff/admin)
- `PATCH /:id/status` - Update status (staff/admin)

### Reservations (`/api/reservations`)
- `POST /` - Create reservation (protected)
- `GET /my-reservations` - Get user's reservations (protected)
- `GET /` - Get all reservations (staff/admin)
- `PATCH /:id` - Update reservation (staff/admin)
- `DELETE /:id` - Cancel reservation (owner/staff/admin)

## 🔌 Real-time Events (Socket.io)

### Client → Server
- `join-staff` - Join staff room for order notifications
- `join-order` - Join specific order room for status updates

### Server → Client
- `new-order` - New order created (to staff-room)
- `order-status-updated` - Order status changed (to order-{orderId})

## 🏗️ Project Structure

```
server/
├── config/
│   └── db.js                 # MongoDB connection
├── middleware/
│   └── auth.js              # JWT auth & role authorization
├── models/
│   ├── User.js              # User model with role
│   ├── MenuItem.js          # Menu item model
│   ├── Order.js             # Order model with items
│   └── Reservation.js       # Reservation model
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── menuRoutes.js        # Menu CRUD
│   ├── orderRoutes.js       # Order management
│   └── reservationRoutes.js # Reservation management
├── scripts/
│   └── seedData.js          # Database seeding
├── .env                      # Environment variables
├── .env.example             # Env template
├── server.js                # Main application file
└── package.json
```

## 🔐 Authentication

API uses JWT (JSON Web Tokens) for authentication.

**How it works:**
1. User logs in → receives JWT token
2. Token stored in localStorage (frontend)
3. Token sent in `Authorization: Bearer <token>` header
4. Server validates token and extracts user info

## 🎭 Role-Based Access Control

| Endpoint                | Customer | Staff | Admin |
|------------------------|----------|-------|-------|
| Browse menu            | ✅       | ✅    | ✅    |
| Create order           | ✅       | ✅    | ✅    |
| View own orders        | ✅       | ✅    | ✅    |
| View all orders        | ❌       | ✅    | ✅    |
| Update order status    | ❌       | ✅    | ✅    |
| Create menu item       | ❌       | ❌    | ✅    |
| Update/Delete menu     | ❌       | ❌    | ✅    |

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **socket.io** - Real-time bidirectional communication
- **express-validator** - Request validation

## 🧪 Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123","role":"customer"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cafe.com","password":"admin123"}'
```

**Get Menu (no auth required):**
```bash
curl http://localhost:5000/api/menu
```

**Create Order (requires token):**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"items":[{"menuItem":"ITEM_ID","name":"Item Name","price":150,"quantity":2}],"totalAmount":300,"phone":"9876543210"}'
```

### Using Postman/Thunder Client

1. Import endpoints from documentation
2. Set up environment variable for `token`
3. Test all endpoints systematically

## 🛠️ Development Scripts

```bash
npm run dev        # Start with nodemon (auto-restart)
npm start          # Start production server
npm run seed       # Seed database with sample data
npm run test-flow  # Run automated API flow tests (NEW!)
npm run show-env   # Display environment variables (NEW!)
```

## 🔍 Enhanced Logging & Flow Testing (NEW!)

The backend now includes **detailed step-by-step logging** to help you understand exactly what happens during authentication and API requests!

### 📚 New Documentation Files

- **[Quick Start Guide](quick-start.md)** - Get started testing the flow in 3 steps
- **[Flow Summary](FLOW_SUMMARY.md)** - Overview of all logging enhancements
- **[Flow Diagram](FLOW_DIAGRAM.md)** - Visual diagrams of authentication flow
- **[Testing Guide](TESTING_GUIDE.md)** - Complete testing instructions

### 🎯 What You'll See

When you run `npm run dev`, every request now shows:

```
📨 INCOMING REQUEST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Time: 2026-06-15T10:30:45.123Z
🔹 Method: POST
🔹 Path: /api/auth/login
🔹 Request Body: {
  "email": "admin@cafe.com",
  "password": "***HIDDEN***"
}

🔑 LOGIN FLOW STARTED
═══════════════════════════════════════════
Step 1: Extracting credentials ✅
Step 2: Looking up user in database ✅
Step 3: Verifying password ✅
Step 4: Generating JWT token ✅
  🔐 Token: eyJhbGciOiJI... (first 30 chars)
Step 5: Sending success response ✅

📤 OUTGOING RESPONSE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔹 Status Code: 200
🔹 Response includes JWT token
```

### 🧪 Automated Flow Testing

Run the test script to automatically test all authentication flows:

```bash
npm run test-flow
```

This will:
- ✅ Check server health
- ✅ Register a new user
- ✅ Login with credentials
- ✅ Access protected routes with JWT token
- ✅ Test error cases (wrong password, no token)

### 🔐 Understanding JWT & Environment Variables

Run this to see your configuration:

```bash
npm run show-env
```

Output:
```
╔════════════════════════════════════════════════════════════╗
║           ENVIRONMENT VARIABLES CONFIGURATION              ║
╚════════════════════════════════════════════════════════════╝

✅ PORT
   Value: 5000
   Description: Server port

✅ NODE_ENV
   Value: development
   Description: Environment mode

✅ JWT_SECRET
   Value: your-super-...(hidden)
   Description: Secret key for JWT tokens

✅ MONGODB_URI
   Value: mongodb://localhost:27017/cafe-management
   Description: Database connection string
```

### 📋 Quick Test with REST Client

Use the included `test-api.http` file:
1. Open `test-api.http` in VS Code
2. Install "REST Client" extension
3. Click "Send Request" above any endpoint
4. Watch detailed logs in your server terminal!

## 🐛 Debugging

**MongoDB Connection Issues:**
```bash
# Check if MongoDB is running
mongosh

# Or check system services
# On Mac: brew services list
# On Linux: sudo systemctl status mongod
```

**Port Already in Use:**
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

## 📊 Database Schema

### User
- name, email, password, role, phone, address

### MenuItem
- name, description, price, category, image, available, preparationTime, isVegetarian, spicyLevel

### Order
- user, items[], totalAmount, status, paymentStatus, deliveryAddress, phone, notes

### Reservation
- user, name, email, phone, date, time, guests, specialRequests, status

## 🚧 Future Enhancements

- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Email notifications
- [ ] File upload for menu images
- [ ] Advanced analytics endpoints
- [ ] Order history with pagination
- [ ] Review and rating system
- [ ] Loyalty points system

## 📄 License

MIT

---

**Happy Coding! ☕**
