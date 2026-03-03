require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const connectDB = require('./utils/database');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 404 Handler
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Route not found',
    timestamp: new Date().toISOString()
  });
});

// Error Handler Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = app;
