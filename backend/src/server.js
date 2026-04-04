require('dotenv').config();
require('express-async-errors');

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Initialize Supabase client (loaded once, cached)
require('./config/db');

const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// ── Route imports ─────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const vendorRoutes = require('./routes/vendor.routes');
const corporateRoutes = require('./routes/corporate.routes');
const cleantechRoutes = require('./routes/cleantech.routes');
const climateFinanceRoutes = require('./routes/climateFinance.routes');
const consultantRoutes = require('./routes/consultant.routes');
const ghgRoutes = require('./routes/ghg.routes');
const portalRoutes = require('./routes/portal.routes');

const app = express();

// ── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());

// ── CORS Configuration ────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',           // Local development
  'http://localhost:3001',           // Local fallback
  'https://ploxi-sable.vercel.app',  // Production frontend
  'https://ploxi-earth.vercel.app',  // Alternative production URL
  process.env.CLIENT_URL,            // Environment variable (if set)
].filter(Boolean); // Remove undefined/null values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts. Try again later.' },
});

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logging ───────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
}

// ── Static Files ──────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Ploxi Earth API is running (Supabase)', timestamp: new Date() });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/corporate', corporateRoutes);
app.use('/api/cleantech', cleantechRoutes);
app.use('/api/climate-finance', climateFinanceRoutes);
app.use('/api/consultant', consultantRoutes);
app.use('/api/ghg', ghgRoutes);
app.use('/api/portal', portalRoutes);

// ── Error Handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Ploxi Earth API running on port ${PORT} [${process.env.NODE_ENV}] (Supabase)`);
});

module.exports = app;
