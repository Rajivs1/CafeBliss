import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const adminData = {
      name: 'Rajeev Admin',
      email: 'rajeev04632@gmail.com',
      password: 'Admin@cafebliss123',
      role: 'admin',
      phone: '8521982915'
    };

    const existing = await User.findOne({ email: adminData.email });

    if (existing) {
      console.log('⚠️  Account found — resetting password and updating role...');
      existing.name     = adminData.name;
      existing.role     = adminData.role;
      existing.phone    = adminData.phone;
      existing.password = adminData.password; // triggers bcrypt pre('save') hook
      await existing.save();

      console.log('\n╔═══════════════════════════════════════════════╗');
      console.log('║   ✅ Admin account updated successfully!       ║');
      console.log('╚═══════════════════════════════════════════════╝\n');
    } else {
      const admin = await User.create(adminData);
      console.log('\n╔═══════════════════════════════════════════════╗');
      console.log('║   ✅ Admin account created successfully!       ║');
      console.log('╚═══════════════════════════════════════════════╝\n');
      console.log('  ID:', admin._id);
    }

    console.log('📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Email:   ', adminData.email);
    console.log('  Password:', adminData.password);
    console.log('  Role:    ', adminData.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
