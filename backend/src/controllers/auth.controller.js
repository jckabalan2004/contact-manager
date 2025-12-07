const jwt = require("jsonwebtoken");
const { query } = require("../db");

const register = async (req, res) => {
  // your registration logic here
};

const login = async (req, res) => {
  // your login logic here
};

const logout = async (req, res) => {
  // your logout logic here
};

const refreshToken = async (req, res) => {
  // your refresh token logic here
};

const me = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [decoded.userId]
    );

    if (!user.rows.length) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.json({ user: user.rows[0] });

  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  me,
};
