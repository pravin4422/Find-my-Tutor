// env.js
require('dotenv').config();

module.exports = {
  // --- General Config ---
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173',

  // --- Database ---
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tutorfinder",

  // --- JWT Authentication ---
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',

  // --- Email Config ---
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,

  // --- AWS S3 Bucket (Optional) ---
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_REGION: process.env.AWS_S3_BUCKET_REGION,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
};