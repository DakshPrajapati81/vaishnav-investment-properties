/* ============================================
   VAISHNAV INVESTMENT & PROPERTIES
   Auth API Routes — Login & Verify
   ============================================ */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'vaishnav_properties_secret_key_2026';
const TOKEN_EXPIRY = '7d'; // Token valid for 7 days

/* ---------- POST /api/auth/login ---------- */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vaishnav@2026';

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    return res.json({
      message: 'Login successful',
      token,
      expiresIn: TOKEN_EXPIRY
    });
  }

  return res.status(401).json({ error: 'Invalid username or password' });
});

/* ---------- GET /api/auth/verify ---------- */
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ valid: false });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ valid: true, username: decoded.username });
  } catch (err) {
    return res.json({ valid: false });
  }
});

module.exports = router;
