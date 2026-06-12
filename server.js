/* ============================================
   VAISHNAV INVESTMENT & PROPERTIES
   Express Server
   ============================================ */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- Static Files ---------- */
// Serve frontend from public/
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ---------- API Routes ---------- */
const propertyRoutes = require('./routes/properties');
app.use('/api/properties', propertyRoutes);

/* ---------- Catch-all: serve index.html ---------- */
app.get('*', (req, res) => {
  // Only for non-API, non-static requests
  if (!req.path.startsWith('/api/') && !req.path.startsWith('/uploads/')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

/* ---------- Connect to MongoDB & Start Server ---------- */
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vaishnav-properties';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📁 Serving frontend from: ${path.join(__dirname, 'public')}`);
      console.log(`📷 Uploads directory: ${path.join(__dirname, 'uploads')}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('\n💡 Make sure MongoDB is running or check your MONGODB_URI in .env file');
    console.log('   For local MongoDB: mongodb://localhost:27017/vaishnav-properties');
    console.log('   For Atlas: mongodb+srv://<user>:<pass>@cluster.mongodb.net/vaishnav-properties\n');
    process.exit(1);
  });
