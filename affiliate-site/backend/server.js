const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const linkRoutes = require('./routes/links');
const categoryRoutes = require('./routes/categories');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/affiliate_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/categories', categoryRoutes);

// Admin check middleware
const adminMiddleware = require('./middleware/admin');

// Admin routes
app.use('/api/admin/links', adminMiddleware, require('./routes/admin/links'));
app.use('/api/admin/categories', adminMiddleware, require('./routes/admin/categories'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
