const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { COOKIE_NAME } = require('../middleware/auth');

const router = express.Router();
const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many login attempts' } },
});

router.post('/login', loginLimiter, async (req, res, next) => {
  const { COORDINATOR_USERNAME, COORDINATOR_PASSWORD_HASH, COORDINATOR_JWT_SECRET } = process.env;
  if (!COORDINATOR_USERNAME || !COORDINATOR_PASSWORD_HASH || !COORDINATOR_JWT_SECRET) {
    return res.status(500).json({ error: { message: 'Coordinator authentication is not configured' } });
  }

  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: { message: 'Username and password are required' } });
  }

  try {
    const passwordMatches = await bcrypt.compare(password, COORDINATOR_PASSWORD_HASH);
    if (username !== COORDINATOR_USERNAME || !passwordMatches) {
      return res.status(401).json({ error: { message: 'Invalid username or password' } });
    }

    const token = jwt.sign(
      { username: COORDINATOR_USERNAME },
      COORDINATOR_JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 8 * 60 * 60 * 1000 });
    return res.json({ message: 'Logged in' });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  return res.json({ message: 'Logged out' });
});

module.exports = router;
