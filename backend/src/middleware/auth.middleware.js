const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Allow preflight OPTIONS requests to pass through
  if (req.method === 'OPTIONS') {
    return next();
  }

  const token = req.cookies?.accessToken;
  
  console.log("Auth Middleware - Token:", !!token); // Debug
  
  if (!token) {
    console.log("Auth Middleware - No token found");
    return res.status(401).json({ 
      success: false,
      message: 'Not authenticated' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userId = decoded.userId;
    console.log("Auth Middleware - User ID:", decoded.userId);
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired' 
      });
    }
    
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    });
  }
};

module.exports = {
  verifyToken: authMiddleware,
};