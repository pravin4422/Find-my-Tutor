/**
 * Entry point for Tutor Finder Backend (Vercel compatible)
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

/**
 * Connect to MongoDB
 * IMPORTANT:
 * - Vercel serverless functions may re-run
 * - Your connectDB() should internally handle already-open connections
 */
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "https://find-my-tutor-ypii.vercel.app",
    credentials: true,
  })
);

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
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

/**
 * IMPORTANT:
 * - DO NOT use app.listen() in Vercel
 * - Vercel manages the server
 */
if (!process.env.VERCEL) {
  const PORT = config.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for Vercel
module.exports = app;
