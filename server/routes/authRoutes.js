import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  console.log('🔐 Generating JWT token for user ID:', id);
  console.log('🔐 Using JWT_SECRET:', process.env.JWT_SECRET ? '✅ Available' : '❌ Missing');
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
  console.log('🔐 Token generated successfully:', token.substring(0, 30) + '...');
  return token;
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  console.log('\n👤 REGISTER FLOW STARTED');
  console.log('═══════════════════════════════════════════');
  try {
    const { name, email, password, phone, role } = req.body;
    
    console.log('Step 1: Extracting user data from request body');
    console.log('  - Name:', name);
    console.log('  - Email:', email);
    console.log('  - Password:', password ? '***HIDDEN***' : 'Not provided');
    console.log('  - Phone:', phone);
    console.log('  - Role:', role || 'customer (default)');

    // Check if user exists
    console.log('\nStep 2: Checking if user already exists...');
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('❌ User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    console.log('✅ Email is available');

    // Create user
    console.log('\nStep 3: Creating new user in database...');
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'customer'
    });
    console.log('✅ User created successfully with ID:', user._id);

    console.log('\nStep 4: Generating JWT token...');
    const token = generateToken(user._id);

    console.log('\nStep 5: Sending success response');
    console.log('═══════════════════════════════════════════\n');
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    console.log('═══════════════════════════════════════════\n');
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  console.log('\n🔑 LOGIN FLOW STARTED');
  console.log('═══════════════════════════════════════════');
  try {
    const { email, password } = req.body;

    console.log('Step 1: Extracting credentials from request');
    console.log('  - Email:', email);
    console.log('  - Password:', password ? '***HIDDEN***' : 'Not provided');

    // Validate input
    if (!email || !password) {
      console.log('❌ Validation failed: Missing email or password');
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    console.log('✅ Input validation passed');

    // Find user with password
    console.log('\nStep 2: Looking up user in database...');
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found with email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('✅ User found:', user.name, '(Role:', user.role + ')');

    // Check password
    console.log('\nStep 3: Verifying password...');
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      console.log('❌ Password verification failed');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('✅ Password verified successfully');

    console.log('\nStep 4: Generating JWT token...');
    const token = generateToken(user._id);

    console.log('\nStep 5: Sending success response with token');
    console.log('═══════════════════════════════════════════\n');
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    console.log('═══════════════════════════════════════════\n');
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  console.log('\n👤 GET PROFILE FLOW STARTED');
  console.log('═══════════════════════════════════════════');
  try {
    console.log('Step 1: User authenticated via middleware');
    console.log('  - User ID from token:', req.user._id);
    
    console.log('\nStep 2: Fetching user details from database...');
    const user = await User.findById(req.user._id);
    console.log('✅ User profile retrieved:', user.name);
    
    console.log('\nStep 3: Sending profile data');
    console.log('═══════════════════════════════════════════\n');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('❌ Profile fetch error:', error);
    console.log('═══════════════════════════════════════════\n');
    res.status(500).json({ message: error.message });
  }
});

export default router;
