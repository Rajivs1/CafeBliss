import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  console.log('\n🔒 AUTH MIDDLEWARE STARTED');
  console.log('═══════════════════════════════════════════');
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      console.log('Step 1: Extracting token from Authorization header...');
      token = req.headers.authorization.split(' ')[1];
      console.log('✅ Token extracted:', token.substring(0, 30) + '...');
    }

    if (!token) {
      console.log('❌ No token provided in Authorization header');
      console.log('═══════════════════════════════════════════\n');
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    console.log('\nStep 2: Verifying JWT token...');
    console.log('  - Using JWT_SECRET:', process.env.JWT_SECRET ? '✅ Available' : '❌ Missing');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully');
    console.log('  - User ID from token:', decoded.id);
    console.log('  - Token expires:', new Date(decoded.exp * 1000).toISOString());

    console.log('\nStep 3: Fetching user from database...');
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      console.log('❌ User not found in database');
      console.log('═══════════════════════════════════════════\n');
      return res.status(401).json({ message: 'User not found' });
    }
    
    console.log('✅ User authenticated:', req.user.name, '(Role:', req.user.role + ')');
    console.log('═══════════════════════════════════════════\n');

    next();
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    console.log('═══════════════════════════════════════════\n');
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }
    next();
  };
};
