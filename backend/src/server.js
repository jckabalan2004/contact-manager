require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth.routes.js');
const contactRoutes = require('./routes/contacts.routes.js');
const { verifyToken } = require('./middleware/auth.middleware.js');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://contact-manager-t1ta.vercel.app",     // Vercel frontend
  "https://contact-manager-production-000d.up.railway.app" // Backend domain
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow tools like Postman

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS BLOCKED:", origin);
      callback(new Error("CORS Not Allowed"));
    }
  },
  credentials: true,
}));


app.use(cookieParser());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiting to auth routes
app.use('/api/auth', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', verifyToken, contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Server is running'
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
