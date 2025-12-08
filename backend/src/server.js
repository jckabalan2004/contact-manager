require('dotenv').config();
const express = require('express');

const app = express();

// MUST BE FIRST
app.set("trust proxy", 1);

const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes.js');
const contactRoutes = require('./routes/contacts.routes.js');
const { verifyToken } = require('./middleware/auth.middleware.js');

// CORS (fix origins)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://exemplary-flexibility-production.up.railway.app",
    "https://contact-manager-production-a16a.up.railway.app"   // ⬅ ADD THIS
  ],
  credentials: true
}));

app.options('*', cors());

app.use(cookieParser());
app.use(express.json());

// Rate limit
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', verifyToken, contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
