require("dotenv").config();

const express = require("express");
const cors = require("cors");

const config = require("./config/env");
const connectDB = require("./config/db");

const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

connectDB();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PROD,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    const allowedDev = /^http:\/\/localhost:\d+$/;
    if (!origin || allowedDev.test(origin) || allowedOrigins.includes(origin)) callback(null, true);
    else callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("/{*path}", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use("/api/auth", authRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/requests", requestRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;