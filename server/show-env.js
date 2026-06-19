/**
 * Simple script to show your environment variables
 * Run with: node show-env.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║           ENVIRONMENT VARIABLES CONFIGURATION              ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('📋 Current Environment Variables:\n');

// Show all environment variables used by the application
const envVars = [
  { name: 'PORT', value: process.env.PORT, description: 'Server port' },
  { name: 'NODE_ENV', value: process.env.NODE_ENV, description: 'Environment mode' },
  { name: 'MONGODB_URI', value: process.env.MONGODB_URI, description: 'Database connection string' },
  { name: 'JWT_SECRET', value: process.env.JWT_SECRET, description: 'Secret key for JWT tokens', hide: true },
  { name: 'CLIENT_URL', value: process.env.CLIENT_URL, description: 'Frontend URL for CORS' }
];

envVars.forEach(({ name, value, description, hide }) => {
  const status = value ? '✅' : '❌';
  let displayValue = value || 'NOT SET';
  
  // Hide sensitive values
  if (hide && value) {
    displayValue = `${value.substring(0, 10)}...(hidden)`;
  }
  
  console.log(`${status} ${name}`);
  console.log(`   Value: ${displayValue}`);
  console.log(`   Description: ${description}`);
  console.log('');
});

console.log('─────────────────────────────────────────────────────────────\n');

// Check for issues
const missingVars = envVars.filter(v => !v.value);
if (missingVars.length > 0) {
  console.log('⚠️  WARNING: Missing environment variables:\n');
  missingVars.forEach(v => {
    console.log(`   - ${v.name}: ${v.description}`);
  });
  console.log('\n   Please check your .env file!\n');
} else {
  console.log('✅ All required environment variables are set!\n');
}

console.log('─────────────────────────────────────────────────────────────\n');

// Show JWT_SECRET details
if (process.env.JWT_SECRET) {
  console.log('🔐 JWT_SECRET Details:\n');
  console.log(`   Length: ${process.env.JWT_SECRET.length} characters`);
  console.log(`   First 10 chars: ${process.env.JWT_SECRET.substring(0, 10)}...`);
  console.log(`   Last 10 chars: ...${process.env.JWT_SECRET.slice(-10)}`);
  console.log('\n   ⚠️  IMPORTANT: Never share your JWT_SECRET!');
  console.log('   ⚠️  Change it in production!\n');
}

console.log('─────────────────────────────────────────────────────────────\n');

// Show how tokens are generated
console.log('💡 How JWT Tokens Work:\n');
console.log('   1. User logs in with email/password');
console.log('   2. Server verifies credentials');
console.log('   3. Server creates a token with user ID + JWT_SECRET');
console.log('   4. Token is sent to client');
console.log('   5. Client includes token in subsequent requests');
console.log('   6. Server verifies token using JWT_SECRET\n');

console.log('─────────────────────────────────────────────────────────────\n');

console.log('📚 Quick Commands:\n');
console.log('   Start server:     npm run dev');
console.log('   Test API:         node test-flow.js');
console.log('   Seed database:    npm run seed');
console.log('   Show this info:   node show-env.js\n');

console.log('════════════════════════════════════════════════════════════\n');
