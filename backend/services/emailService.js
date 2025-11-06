const nodemailer = require('nodemailer');
const config = require('../config/env');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: config.SMTP_HOST || 'smtp.gmail.com',
    port: config.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS
    }
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${config.CLIENT_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: config.SMTP_USER,
      to: email,
      subject: 'Password Reset Request - Tutor Finder',
      html: getPasswordResetEmailTemplate(name, resetUrl),
      text: `Hi ${name}, you requested a password reset. Click the link to reset your password: ${resetUrl}`
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Email template
const getPasswordResetEmailTemplate = (name, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>You requested a password reset for your Tutor Finder account.</p>
          
          <p>Click the button below to reset your password:</p>
          
          <a href="${resetUrl}" class="button">Reset Password</a>
          
          <div class="warning">
            <strong>Important:</strong>
            <ul>
              <li>This link will expire in 1 hour</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>For security, never share this link with anyone</li>
            </ul>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
          
          <p>Best regards,<br>The Tutor Finder Team</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Tutor Finder. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  sendPasswordResetEmail
};