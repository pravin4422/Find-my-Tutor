const User = require('../models/User');
const { asyncHandler, generateToken } = require('../utils/helpers');
const { sendWelcomeEmail } = require('../utils/emailService');
const emailService = require('../services/emailService');
const crypto = require('crypto');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  const user = await User.create({ name, email, password, role });

  if (user) {
    // Send welcome email (don't wait for it)
    sendWelcomeEmail(email, name, role).catch(err => {});

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        classOfStudying: user.classOfStudying,
        profilePicture: user.profilePicture,
        token: generateToken(user._id)
      },
      message: 'Registration successful'
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    if (!user.isActive) {
      res.status(403);
      throw new Error('Your account has been deactivated');
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        classOfStudying: user.classOfStudying,
        profilePicture: user.profilePicture,
        token: generateToken(user._id)
      },
      message: 'Login successful'
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    res.json({
      success: true,
      data: user.getPublicProfile()
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    
    // Handle phone number properly - allow empty string to clear the field
    if ('phone' in req.body) {
      user.phone = req.body.phone;
    }
    
    // Handle new student profile fields
    if ('age' in req.body) {
      user.age = req.body.age;
    }
    
    if ('gender' in req.body) {
      user.gender = req.body.gender;
    }
    
    if ('classOfStudying' in req.body) {
      user.classOfStudying = req.body.classOfStudying;
    }
    
    if (req.body.location) {
      user.location = { ...user.location, ...req.body.location };
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    // Handle profile picture upload if file is provided
    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      user.profilePicture = base64Image;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: updatedUser.getPublicProfile(),
      message: 'Profile updated successfully'
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update profile picture
// @route   PUT /api/auth/profile/picture
// @access  Private
exports.updateProfilePicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      user.profilePicture = base64Image;
      
      const updatedUser = await user.save();
      
      res.json({
        success: true,
        data: updatedUser.getPublicProfile(),
        message: 'Profile picture updated successfully'
      });
    } else {
      res.status(400);
      throw new Error('No image file provided');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email });
  
  if (!user) {
    return res.json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent'
    });
  }
  
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 3600000;
  await user.save({ validateBeforeSave: false });
  
  await emailService.sendPasswordResetEmail(email, user.name, resetToken);
  
  res.json({
    success: true,
    message: 'If an account exists with that email, a password reset link has been sent'
  });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
  
  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }
  
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  
  res.json({
    success: true,
    message: 'Password reset successful',
    data: {
      token: generateToken(user._id)
    }
  });
});
