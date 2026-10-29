/**
 * Entry point for Tutor Finder Backend (Render compatible)
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const config = require("../config/env");
const connectDB = require("../config/db");

const { errorHandler, notFound } = require("../middleware/errorMiddleware");

// Routes
const authRoutes = require("../routes/authRoutes");
const teacherRoutes = require("../routes/teacherRoutes");
const studentRoutes = require("../routes/studentRoutes");
const requestRoutes = require("../routes/requestRoutes");

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB().catch(err => console.error('DB connection failed:', err));

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PROD,
  "https://find-my-tutor-ypii.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174"
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options("/{*path}", cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Tutor Finder API is running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      teachers: "/api/teachers",
      students: "/api/students",
      requests: "/api/requests",
      health: "/health",
    },
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/requests", requestRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Export app for Render
module.exports = app;

// Start server only if not imported
if (require.main === module) {
  const PORT = config.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
