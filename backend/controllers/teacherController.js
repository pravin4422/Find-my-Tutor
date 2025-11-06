const User = require('../models/User');
const Review = require('../models/Review');
const { asyncHandler, getPagination } = require('../utils/helpers');
const StudentRequest = require('../models/StudentRequest');

// @desc    Get all teachers with filtering and pagination
// @route   GET /api/teachers
// @access  Public
exports.getAllTeachers = asyncHandler(async (req, res) => {
  const { subject, rating, city, search, page, limit, sortBy } = req.query;
  
  const query = { role: 'teacher', isActive: true };

  // Search by name or subjects
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { 'teacherProfile.subjects': { $regex: search, $options: 'i' } }
    ];
  }

  if (subject) {
    query['teacherProfile.subjects'] = { $regex: subject, $options: 'i' };
  }

  
  if (rating) {
    query['teacherProfile.averageRating'] = { $gte: Number(rating) };
  }

  if (city) {
    query['location.city'] = { $regex: city, $options: 'i' };
  }

  const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);

  // Sorting
  let sort = {};
  switch(sortBy) {
    case 'rating':
      sort = { 'teacherProfile.averageRating': -1 };
      break;

    case 'reviews':
      sort = { 'teacherProfile.totalReviews': -1 };
      break;
    default:
      sort = { createdAt: -1 };
  }

  const teachers = await User.find(query)
    .select('-password')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: teachers,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

// @desc    Get single teacher profile
// @route   GET /api/teachers/:id
// @access  Public
exports.getTeacherById = asyncHandler(async (req, res) => {
  const teacher = await User.findById(req.params.id).select('-password');
  
  if (teacher && teacher.role === 'teacher') {
    // Ensure teacherProfile exists with proper defaults
    if (!teacher.teacherProfile) {
      teacher.teacherProfile = {
        subjects: [],
        qualifications: [],
        experience: 0,
        availability: [],
        bio: '',
        averageRating: 0,
        totalReviews: 0,
        totalStudents: 0,
        languages: [],
        teachingMode: ['both']
      };
      await teacher.save();
    }

    // Get actual count of accepted students
    const StudentRequest = require('../models/StudentRequest');
    const acceptedStudentsCount = await StudentRequest.countDocuments({
      teacher: req.params.id,
      status: 'accepted'
    });

    // Update totalStudents if it doesn't match actual count
    if (teacher.teacherProfile.totalStudents !== acceptedStudentsCount) {
      teacher.teacherProfile.totalStudents = acceptedStudentsCount;
      await teacher.save();
    }

    // Get reviews for this teacher
    const reviews = await Review.find({ teacher: req.params.id, isActive: true })
      .populate('student', 'name profilePicture')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        ...teacher.toObject(),
        reviews
      }
    });
  } else {
    res.status(404);
    throw new Error('Teacher not found');
  }
});

// @desc    Update teacher profile
// @route   PUT /api/teachers/profile
// @access  Private (Teacher only)
exports.updateTeacherProfile = asyncHandler(async (req, res) => {

  
  const teacher = await User.findById(req.user._id);

  if (!teacher) {

    res.status(404);
    throw new Error('Teacher not found');
  }
  

  
  // Ensure teacherProfile exists
  if (!teacher.teacherProfile) {
    teacher.teacherProfile = {
      subjects: [],
      qualifications: [],
      experience: 0,
      availability: [],
      bio: '',
      averageRating: 0,
      totalReviews: 0,
      totalStudents: 0,
      languages: [],
      teachingMode: ['both']
    };
  }

  // Update basic info (only if provided)
  if (req.body.name && req.body.name.trim()) {
    teacher.name = req.body.name;
  }
  if (req.body.phone !== undefined) {
    teacher.phone = req.body.phone; // Allow empty phone
  }
  
  if (req.body.location) {
    const location = typeof req.body.location === 'string'
      ? JSON.parse(req.body.location)
      : req.body.location;
    teacher.location = { ...teacher.location, ...location };
  }

  if (req.body.password) {
    teacher.password = req.body.password;
  }
  
  // Update teacher-specific fields (only if provided)
  if (req.body.subjects && req.body.subjects.trim()) {
    try {
      const parsedSubjects = typeof req.body.subjects === 'string' 
        ? JSON.parse(req.body.subjects) 
        : req.body.subjects;
      teacher.teacherProfile.subjects = parsedSubjects;
    } catch (error) {

      throw new Error('Invalid subjects format');
    }
  }
  if (req.body.qualifications && req.body.qualifications.trim()) {
    teacher.teacherProfile.qualifications = typeof req.body.qualifications === 'string'
      ? JSON.parse(req.body.qualifications)
      : req.body.qualifications;
  }
  if (req.body.experience !== undefined && req.body.experience !== '') {
    teacher.teacherProfile.experience = Number(req.body.experience);
  }

  if (req.body.availability && req.body.availability.trim()) {
    teacher.teacherProfile.availability = typeof req.body.availability === 'string'
      ? JSON.parse(req.body.availability)
      : req.body.availability;
  }
  if (req.body.bio !== undefined) {
    teacher.teacherProfile.bio = req.body.bio; // Allow empty bio
  }
  if (req.body.languages && req.body.languages.trim()) {
    teacher.teacherProfile.languages = typeof req.body.languages === 'string'
      ? JSON.parse(req.body.languages)
      : req.body.languages;
  }
  if (req.body.teachingMode) {
    teacher.teacherProfile.teachingMode = typeof req.body.teachingMode === 'string'
      ? JSON.parse(req.body.teachingMode)
      : req.body.teachingMode;
  }
  
  // Handle image upload as base64
  if (req.file) {
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    teacher.profilePicture = base64Image;
  }

  const updatedTeacher = await teacher.save();
  
  res.json({
    success: true,
    data: updatedTeacher.getPublicProfile(),
    message: 'Teacher profile updated successfully'
  });
});

// @desc    Get teacher's own reviews
// @route   GET /api/teachers/my-reviews
// @access  Private (Teacher only)
exports.getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ teacher: req.user._id, isActive: true })
    .populate('student', 'name profilePicture')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: reviews,
    total: reviews.length
  });
});
