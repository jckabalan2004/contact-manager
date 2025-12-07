const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // IMPORTANT → this must match generateTokens({ userId })
    req.userId = decoded.userId;

    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Export as named verifyToken to match imports across the codebase
module.exports = {
  verifyToken: authMiddleware,
};
