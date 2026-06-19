/**
 * Test script to demonstrate the backend flow
 * Run this with: node test-flow.js
 * Make sure the server is running first!
 */

const API_BASE = 'http://localhost:5000';

// Helper function to make HTTP requests
async function apiRequest(method, endpoint, data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const result = await response.json();
    
    return {
      status: response.status,
      ok: response.ok,
      data: result
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message
    };
  }
}

// Main test flow
async function testBackendFlow() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('🧪 BACKEND FLOW TEST SCRIPT');
  console.log('═══════════════════════════════════════════════════════\n');

  // Test 1: Check server health
  console.log('📍 Test 1: Health Check');
  console.log('───────────────────────────────────────────────────────');
  const health = await apiRequest('GET', '/');
  console.log('Response:', JSON.stringify(health.data, null, 2));
  console.log('Status:', health.status, health.ok ? '✅' : '❌');
  console.log('\n');

  if (!health.ok) {
    console.error('❌ Server is not running! Start it with: npm run dev');
    process.exit(1);
  }

  // Test 2: Register a new user
  console.log('📍 Test 2: Register New User');
  console.log('───────────────────────────────────────────────────────');
  const timestamp = Date.now();
  const newUser = {
    name: 'Test User',
    email: `testuser${timestamp}@example.com`,
    password: 'testpass123',
    phone: '1234567890',
    role: 'customer'
  };
  
  console.log('Registering user:', { ...newUser, password: '***HIDDEN***' });
  const registerResult = await apiRequest('POST', '/api/auth/register', newUser);
  console.log('\nResponse Status:', registerResult.status, registerResult.ok ? '✅' : '❌');
  
  if (registerResult.ok) {
    console.log('✅ Registration successful!');
    console.log('User ID:', registerResult.data.user._id);
    console.log('User Name:', registerResult.data.user.name);
    console.log('User Role:', registerResult.data.user.role);
    console.log('Token received:', registerResult.data.token.substring(0, 30) + '...');
  } else {
    console.log('❌ Registration failed:', registerResult.data);
  }
  console.log('\n');

  // Test 3: Login with the registered user
  console.log('📍 Test 3: Login with Credentials');
  console.log('───────────────────────────────────────────────────────');
  const loginData = {
    email: newUser.email,
    password: newUser.password
  };
  
  console.log('Logging in with:', { ...loginData, password: '***HIDDEN***' });
  const loginResult = await apiRequest('POST', '/api/auth/login', loginData);
  console.log('\nResponse Status:', loginResult.status, loginResult.ok ? '✅' : '❌');
  
  let authToken = null;
  if (loginResult.ok) {
    authToken = loginResult.data.token;
    console.log('✅ Login successful!');
    console.log('Token received:', authToken.substring(0, 30) + '...');
    console.log('User details:', JSON.stringify(loginResult.data.user, null, 2));
  } else {
    console.log('❌ Login failed:', loginResult.data);
  }
  console.log('\n');

  // Test 4: Access protected route with token
  if (authToken) {
    console.log('📍 Test 4: Access Protected Route (Get Profile)');
    console.log('───────────────────────────────────────────────────────');
    console.log('Using token:', authToken.substring(0, 30) + '...');
    
    const profileResult = await apiRequest('GET', '/api/auth/profile', null, authToken);
    console.log('\nResponse Status:', profileResult.status, profileResult.ok ? '✅' : '❌');
    
    if (profileResult.ok) {
      console.log('✅ Profile retrieved successfully!');
      console.log('Profile data:', JSON.stringify(profileResult.data.user, null, 2));
    } else {
      console.log('❌ Profile fetch failed:', profileResult.data);
    }
    console.log('\n');
  }

  // Test 5: Try to access protected route without token
  console.log('📍 Test 5: Access Protected Route WITHOUT Token (Should Fail)');
  console.log('───────────────────────────────────────────────────────');
  const noTokenResult = await apiRequest('GET', '/api/auth/profile');
  console.log('Response Status:', noTokenResult.status);
  console.log('Expected to fail:', !noTokenResult.ok ? '✅ Correctly rejected' : '❌ Should have failed');
  console.log('Error message:', noTokenResult.data.message);
  console.log('\n');

  // Test 6: Try login with wrong password
  console.log('📍 Test 6: Login with Wrong Password (Should Fail)');
  console.log('───────────────────────────────────────────────────────');
  const wrongPassResult = await apiRequest('POST', '/api/auth/login', {
    email: newUser.email,
    password: 'wrongpassword'
  });
  console.log('Response Status:', wrongPassResult.status);
  console.log('Expected to fail:', !wrongPassResult.ok ? '✅ Correctly rejected' : '❌ Should have failed');
  console.log('Error message:', wrongPassResult.data.message);
  console.log('\n');

  console.log('═══════════════════════════════════════════════════════');
  console.log('✅ ALL TESTS COMPLETED');
  console.log('═══════════════════════════════════════════════════════');
  console.log('\n💡 Tips:');
  console.log('  - Check the server terminal to see detailed flow logs');
  console.log('  - JWT_SECRET from .env:', process.env.JWT_SECRET || 'Not loaded (expected in this script)');
  console.log('  - NODE_ENV from .env:', process.env.NODE_ENV || 'Not loaded (expected in this script)');
  console.log('  - Use the token from Test 3 to test other API endpoints');
  console.log('\n');
}

// Run the tests
console.log('Starting in 2 seconds...\n');
setTimeout(() => {
  testBackendFlow().catch(console.error);
}, 2000);
