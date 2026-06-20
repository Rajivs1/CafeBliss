import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import seedRoute from './routes/seedRoute.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

// Log environment variables on startup
console.log('\n🔧 ENVIRONMENT CONFIGURATION:');
console.log('================================');
console.log('PORT:', process.env.PORT || 5000);
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set (hidden)' : '❌ Not set');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
console.log('CLIENT_URL:', process.env.CLIENT_URL || 'http://localhost:5173');
console.log('================================\n');

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced request logging with body and headers
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log('\n📨 INCOMING REQUEST:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`⏰ Time: ${timestamp}`);
  console.log(`🔹 Method: ${req.method}`);
  console.log(`🔹 Path: ${req.path}`);
  console.log(`🔹 Full URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
  
  if (Object.keys(req.query).length > 0) {
    console.log('🔹 Query Params:', JSON.stringify(req.query, null, 2));
  }
  
  if (req.headers.authorization) {
    console.log('🔹 Authorization Header:', req.headers.authorization.substring(0, 20) + '...');
  }
  
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '***HIDDEN***';
    console.log('🔹 Request Body:', JSON.stringify(sanitizedBody, null, 2));
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Log response
  const originalSend = res.send;
  res.send = function(data) {
    console.log('\n📤 OUTGOING RESPONSE:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🔹 Status Code: ${res.statusCode}`);
    console.log(`🔹 Path: ${req.path}`);
    
    try {
      const responseData = typeof data === 'string' ? JSON.parse(data) : data;
      if (responseData?.token) {
        console.log('🔹 Response includes JWT token');
        console.log('🔑 Token:', responseData.token.substring(0, 30) + '...');
      }
      console.log('🔹 Response Preview:', JSON.stringify(responseData, null, 2).substring(0, 500));
    } catch (e) {
      console.log('🔹 Response:', typeof data === 'string' ? data.substring(0, 200) : 'Binary data');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    originalSend.call(this, data);
  };
  
  next();
});

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: '🎉 Cafe Management API is running!',
    endpoints: {
      auth: '/api/auth',
      menu: '/api/menu',
      orders: '/api/orders',
      reservations: '/api/reservations',
      users: '/api/users'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/seed', seedRoute);
app.use('/api/reviews', reviewRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('join-staff', () => {
    socket.join('staff-room');
    console.log('👨‍🍳 Staff joined:', socket.id);
  });

  socket.on('join-order', (orderId) => {
    socket.join(`order-${orderId}`);
    console.log(`📦 User joined order room: ${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║   🚀 Server running on port ${PORT}            ║
  ║   📡 Environment: ${process.env.NODE_ENV}                ║
  ║   🔗 http://localhost:${PORT}                  ║
  ╚═══════════════════════════════════════════════╝
  `);
});

export default app;
