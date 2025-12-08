require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes.js');
const contactRoutes = require('./routes/contacts.routes.js');
const { verifyToken } = require('./middleware/auth.middleware.js');

const app = express();

// CORS middleware - must be before routes
app.use(cors({
  origin: [
  "http://localhost:5173",
  "https://exemplary-flexibility-production.up.railway.app"
],
credentials: true
}));


// Explicit OPTIONS handler for preflight
app.options('*', cors());

// ---------------------------------------
app.use(cookieParser());
app.use(express.json());

// ---------------------------------------
// Rate limiting (good)
// ---------------------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/auth', limiter);

// ---------------------------------------
// ROUTES
// ---------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/contacts', verifyToken, contactRoutes);

// ---------------------------------------
// HEALTH CHECK
// ---------------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------
app.get('/api/test', (req, res) => {
  res.json({
    message: "API is working!",
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------
// ERROR HANDLER
// ---------------------------------------
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({ message: err.message });
});

// ---------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
