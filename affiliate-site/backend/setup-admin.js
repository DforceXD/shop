// Buat file setup-admin.js di backend
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const setupAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Cek apakah admin sudah ada
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      // Buat admin default
      const adminUser = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123', // Ganti dengan password yang lebih aman
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Admin user created successfully!');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

setupAdmin();
