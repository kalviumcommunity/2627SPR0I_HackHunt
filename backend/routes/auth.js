const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { COOKIE_NAME } = require('../middleware/auth');
const { createUser, findUserByEmail } = require('../db/userStore');

const router = express.Router();
const STUDENT_COOKIE_NAME = 'studentToken';

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };
}
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many login attempts' } },
});
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many signup attempts' } },
});
const studentLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many login attempts' } },
});

function isObjectBody(body, allowedFields) {
  return body
    && typeof body === 'object'
    && !Array.isArray(body)
    && !Object.keys(body).some((key) => !allowedFields.includes(key));
}

function validEmail(email) {
  return typeof email === 'string'
    && email.length <= 254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post('/signup', signupLimiter, async (req, res, next) => {
  const { fullName, email, password } = req.body || {};
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : email;
  if (!isObjectBody(req.body, ['fullName', 'email', 'password'])
    || typeof fullName !== 'string'
    || fullName.trim().length < 1
    || fullName.trim().length > 100
    || !validEmail(normalizedEmail)
    || typeof password !== 'string'
    || password.length < 8
    || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({
      error: { message: 'Enter a name, valid email, and password of 8 to 72 bytes' },
    });
  }

  try {
    const user = await createUser({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12),
    });
    return res.status(201).json({
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: { message: 'An account with this email already exists' } });
    }
    return next(error);
  }
});

router.post('/student/login', studentLoginLimiter, async (req, res, next) => {
  const { email, password } = req.body || {};
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : email;
  if (!isObjectBody(req.body, ['email', 'password'])
    || !validEmail(normalizedEmail)
    || typeof password !== 'string'
    || password.length === 0
    || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ error: { message: 'Enter a valid email and password' } });
  }

  const jwtSecret = process.env.COORDINATOR_JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ error: { message: 'Authentication is not configured' } });
  }

  try {
    const user = await findUserByEmail(normalizedEmail);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: { message: 'Invalid email or password' } });
    }

    const token = jwt.sign(
      { userId: user.id, role: 'student' },
      jwtSecret,
      { expiresIn: '7d' }
    );
    res.cookie(STUDENT_COOKIE_NAME, token, {
      ...cookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', loginLimiter, async (req, res, next) => {
  const { COORDINATOR_USERNAME, COORDINATOR_PASSWORD_HASH, COORDINATOR_JWT_SECRET } = process.env;
  if (!COORDINATOR_USERNAME || !COORDINATOR_PASSWORD_HASH || !COORDINATOR_JWT_SECRET) {
    return res.status(500).json({ error: { message: 'Coordinator authentication is not configured' } });
  }

  const credentials = req.body;
  if (!credentials
    || typeof credentials !== 'object'
    || Array.isArray(credentials)
    || Object.keys(credentials).some((key) => !['username', 'password'].includes(key))) {
    return res.status(400).json({ error: { message: 'Username and password are required' } });
  }

  const { username, password } = credentials;
  if (typeof username !== 'string'
    || username.length === 0
    || username.length > 128
    || typeof password !== 'string'
    || password.length === 0
    || password.length > 1024) {
    return res.status(400).json({ error: { message: 'Username and password are required' } });
  }

  try {
    const passwordMatches = await bcrypt.compare(password, COORDINATOR_PASSWORD_HASH);
    if (username !== COORDINATOR_USERNAME || !passwordMatches) {
      return res.status(401).json({ error: { message: 'Invalid username or password' } });
    }

    const token = jwt.sign(
      { username: COORDINATOR_USERNAME, role: 'coordinator' },
      COORDINATOR_JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.cookie(COOKIE_NAME, token, { ...cookieOptions(), maxAge: 8 * 60 * 60 * 1000 });
    return res.json({ message: 'Logged in' });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions());
  return res.json({ message: 'Logged out' });
});

module.exports = router;
