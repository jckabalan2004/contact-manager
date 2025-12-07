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

// ---- FIXED HELMET ----
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// ---- FIXED CORS ----
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow Postman, server-side, etc.

    const allowed =
      origin.startsWith("http://localhost") ||
      origin.endsWith(".vercel.app"); // allow ALL Vercel preview or prod URLs

    if (allowed) return callback(null, true);

    console.log("CORS BLOCKED:", origin);
    return callback(new Error("CORS Not Allowed"));
  },
  credentials: true,
}));


app.use(cookieParser());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/auth', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', verifyToken, contactRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get('/api/test', (req, res) => {
  res.json({ message: "API is working!", timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
