const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'coordinatorToken';

function requireCoordinator(req, res, next) {
  const token = req.cookies && req.cookies[COOKIE_NAME];
  if (!token || !process.env.COORDINATOR_JWT_SECRET) {
    return res.status(401).json({ error: { message: 'Authentication required' } });
  }

  try {
    jwt.verify(token, process.env.COORDINATOR_JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: { message: 'Authentication required' } });
  }
}

module.exports = { COOKIE_NAME, requireCoordinator };
