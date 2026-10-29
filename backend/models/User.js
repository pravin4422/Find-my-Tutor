const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please add a name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: { 
    type: String, 
    enum: ['student', 'teacher'], 
    required: true 
  },
  profilePicture: { 
    type: String, 
    default: function() {
      return this.role === 'teacher' 
        ? 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
        : 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png';
    }
  },
  phone: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    min: 1,
    max: 100
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    trim: true
  },
  classOfStudying: {
    type: String,
    trim: true
  },
  location: {
    city: String,
    state: String,
    country: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  },
  teacherProfile: {
    subjects: {
      type: [String],
      default: []
    },
    qualifications: {
      type: [String],
      default: []
    },
    experience: {
      type: Number,
      min: 0,
      default: 0
    },

    availability: {
      type: [String],
      default: []
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
      default: ''
    },
    averageRating: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    totalStudents: {
      type: Number,
      default: 0
    },
    languages: {
      type: [String],
      default: []
    },
    teachingMode: {
      type: [String],
      enum: ['online', 'offline', 'both'],
      default: ['both']
    }
  }
}, { 
  timestamps: true 
});

// Indexes for better query performance
userSchema.index({ role: 1 });
userSchema.index({ 'teacherProfile.subjects': 1 });
userSchema.index({ 'teacherProfile.averageRating': -1 });
userSchema.index({ 'location.city': 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
