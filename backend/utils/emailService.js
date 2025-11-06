const nodemailer = require('nodemailer');
const config = require('../config/env');

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

const sendWelcomeEmail = async (email, name, role) => {
  try {
    const transporter = createTransporter();
    const emailContent = role === 'teacher' 
      ? getTeacherWelcomeEmail(name)
      : getStudentWelcomeEmail(name);
    
    const mailOptions = {
      from: config.SMTP_USER,
      to: email,
      subject: `Welcome to Tutor Finder, ${name}!`,
      html: emailContent,
      text: `Welcome to Tutor Finder, ${name}! We're excited to have you on board.`
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

function getTeacherWelcomeEmail(name) {
  return `<h2>Welcome ${name}!</h2><p>Complete your teacher profile to start connecting with students.</p>`;
}

function getStudentWelcomeEmail(name) {
  return `<h2>Welcome ${name}!</h2><p>Start browsing qualified tutors for your learning journey.</p>`;
}

const sendRequestAcceptanceEmail = async (studentEmail, studentName, teacherName, subject) => {
  try {
    const transporter = createTransporter();
    const emailContent = `
      <h2>Request Accepted!</h2>
      <p>Hi ${studentName},</p>
      <p>Great news! <strong>${teacherName}</strong> has accepted your request to learn <strong>${subject}</strong>.</p>
      <p>You can now contact your teacher to schedule your sessions.</p>
      <p>Best regards,<br>Tutor Finder Team</p>
    `;
    
    const mailOptions = {
      from: config.SMTP_USER,
      to: studentEmail,
      subject: `Request Accepted - ${subject} with ${teacherName}`,
      html: emailContent,
      text: `Hi ${studentName}, ${teacherName} has accepted your request to learn ${subject}.`
    };
    
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending acceptance email:', error);
    throw error;
  }
};

const sendRequestRejectionEmail = async (studentEmail, studentName, teacherName, subject) => {
  try {
    const transporter = createTransporter();
    const emailContent = `
      <h2>Request Update</h2>
      <p>Hi ${studentName},</p>
      <p>Unfortunately, <strong>${teacherName}</strong> is unable to accept your request for <strong>${subject}</strong> at this time.</p>
      <p>Don't worry! There are many other qualified teachers available. Keep exploring!</p>
      <p>Best regards,<br>Tutor Finder Team</p>
    `;
    
    const mailOptions = {
      from: config.SMTP_USER,
      to: studentEmail,
      subject: `Request Update - ${subject}`,
      html: emailContent,
      text: `Hi ${studentName}, ${teacherName} is unable to accept your request for ${subject} at this time.`
    };
    
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending rejection email:', error);
    throw error;
  }
};

module.exports = { sendWelcomeEmail, sendRequestAcceptanceEmail, sendRequestRejectionEmail };