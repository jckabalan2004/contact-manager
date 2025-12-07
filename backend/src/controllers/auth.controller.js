const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { query } = require("../db");
const { generateTokens, setTokenCookies, clearTokenCookies } = require("../utils/jwt");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists" 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = await query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );
    
    // Generate tokens and set cookies
    const { accessToken, refreshToken } = generateTokens(newUser.rows[0].id);
    setTokenCookies(res, accessToken, refreshToken);
    
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: newUser.rows[0]
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error during registration" 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("Login attempt for:", email); // Debug
    
    // Find user
    const userResult = await query(
      "SELECT id, name, email, password FROM users WHERE email = $1",
      [email]
    );
    
    if (userResult.rows.length === 0) {
      console.log("User not found:", email);
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }
    
    const user = userResult.rows[0];
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      console.log("Invalid password for:", email);
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }
    
    console.log("Password valid for:", email);
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    
    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);
    
    console.log("Cookies set for user:", user.id);
    
    // Return user data (without password)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error during login" 
    });
  }
};

const logout = async (req, res) => {
  clearTokenCookies(res);
  return res.status(200).json({ 
    success: true,
    message: "Logged out successfully" 
  });
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ 
        success: false,
        message: "Refresh token required" 
      });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Generate new access token
    const { accessToken } = generateTokens(decoded.userId);
    
    // Set new access token cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/'
    });
    
    return res.status(200).json({
      success: true,
      message: "Token refreshed"
    });
    
  } catch (error) {
    console.error("Refresh token error:", error);
    clearTokenCookies(res);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: "Invalid refresh token" 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

const me = async (req, res) => {
  try {
    // verifyToken middleware already validated and set req.userId
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: "Not authenticated" 
      });
    }

    // Get user from database
    const user = await query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [userId]
    );

    if (!user.rows.length) {
      return res.status(401).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    return res.status(200).json({ 
      success: true,
      user: user.rows[0]
    });

  } catch (err) {
    console.error("Me endpoint error:", err.message);
    
    return res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  me,
};