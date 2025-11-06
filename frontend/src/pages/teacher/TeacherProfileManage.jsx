import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { Edit, User, Mail, Phone, MapPin, BookOpen, Clock, Star, Users } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';

const TeacherProfileManage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    subjects: '',
    qualifications: '',
    experience: '',

    availability: '',
    bio: '',
    languages: '',
    teachingMode: [],
  });

  // Check if current user can edit this profile
  const canEdit = user && user._id === id;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get('/auth/profile');
      const profile = response.data.data;
      
      // Update the user context with fresh data
      updateUser(profile);

      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        city: profile.location?.city || '',
        state: profile.location?.state || '',
        country: profile.location?.country || '',
        subjects: profile.teacherProfile?.subjects?.join(', ') || '',
        qualifications: profile.teacherProfile?.qualifications?.join(', ') || '',
        experience: profile.teacherProfile?.experience || '',
        availability: profile.teacherProfile?.availability?.join('\n') || '',
        bio: profile.teacherProfile?.bio || '',
        languages: profile.teacherProfile?.languages?.join(', ') || '',
        teachingMode: profile.teacherProfile?.teachingMode || [],
      });
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTeachingModeChange = (mode) => {
    const modes = [...formData.teachingMode];
    const index = modes.indexOf(mode);
    if (index > -1) {
      modes.splice(index, 1);
    } else {
      modes.push(mode);
    }
    setFormData({ ...formData, teachingMode: modes });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic validation
      if (!formData.name || !formData.name.trim()) {
        setError('Name is required');
        return;
      }
      

      const formDataToSend = new FormData();

      // Basic info
      if (formData.name && formData.name.trim()) {
        formDataToSend.append('name', formData.name);
      }
      formDataToSend.append('phone', formData.phone);

      // Location
      if (formData.city || formData.state || formData.country) {
        const location = {
          city: formData.city,
          state: formData.state,
          country: formData.country,
        };
        formDataToSend.append('location', JSON.stringify(location));
      }

      // Teacher profile fields
      if (formData.subjects && formData.subjects.trim()) {
        const subjectsArray = formData.subjects.split(',').map(s => s.trim()).filter(s => s);

        if (subjectsArray.length > 0) {
          const subjectsJSON = JSON.stringify(subjectsArray);

          formDataToSend.append('subjects', subjectsJSON);
        }
      }

      if (formData.qualifications && formData.qualifications.trim()) {
        const qualsArray = formData.qualifications.split(',').map(q => q.trim()).filter(q => q);
        if (qualsArray.length > 0) {
          formDataToSend.append('qualifications', JSON.stringify(qualsArray));
        }
      }

      if (formData.experience && formData.experience !== '')
        formDataToSend.append('experience', formData.experience);


      if (formData.availability && formData.availability.trim()) {
        const availArray = formData.availability.split('\n').map(a => a.trim()).filter(a => a);
        if (availArray.length > 0) {
          formDataToSend.append('availability', JSON.stringify(availArray));
        }
      }

      formDataToSend.append('bio', formData.bio);

      if (formData.languages && formData.languages.trim()) {
        const langsArray = formData.languages.split(',').map(l => l.trim()).filter(l => l);
        if (langsArray.length > 0) {
          formDataToSend.append('languages', JSON.stringify(langsArray));
        }
      }

      if (formData.teachingMode.length > 0) {
        formDataToSend.append('teachingMode', JSON.stringify(formData.teachingMode));
      }

      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }


      
      const response = await API.put('/teachers/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      


      const updatedUser = response.data.data;
      // Preserve the token from the current user
      const currentUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      const userWithToken = { ...updatedUser, token: currentUserInfo.token };
      
      updateUser(userWithToken);
      localStorage.setItem('userInfo', JSON.stringify(userWithToken));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setProfilePicture(null);
      setImagePreview(null);
      
      // Refresh profile data to show updated image
      await fetchProfile();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
<div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8 rounded-2xl shadow-xl overflow-hidden border border-gray-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="relative">
          <img
            src={imagePreview || getImageUrl(user.profilePicture) || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
            alt={user.name}
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            onError={(e) => {
              e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
            }}
          />
          <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="ml-6">
          <h1 className="text-4xl font-bold mb-2"> {user.name}</h1>
          <p className="text-blue-100 text-lg">{user.email}</p>
          <span className="inline-flex items-center mt-3 px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-lg">
            Professional Tutor
          </span>
        </div>
      </div>

      {canEdit && (
        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="group inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              <Edit className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditing(false);
                setError('');
                setImagePreview(null);
                setProfilePicture(null);
                fetchProfile(); // Reset form data
              }}
              className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>
      )}
    </div>
  </div>
</div>

        {/* Profile Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
              
              {/* Profile Picture */}
              {/* Profile Picture Upload */}
              <div className="text-center">
                <div className="mb-4">
                  <img
                    src={imagePreview || getImageUrl(user.profilePicture) || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full mx-auto border-4 border-gray-200 shadow-lg object-cover"
                    onError={(e) => {
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                    }}
                  />
                </div>
                <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  Change Profile Picture
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your city"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your state"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your country"
                  />
                </div>
              </div>

              {/* Teaching Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Teaching Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      Subjects (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="subjects"
                      value={formData.subjects}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., Mathematics, Physics, Chemistry"
                    />
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      Qualifications (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., M.Sc Mathematics, B.Ed"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      Experience (years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Years of teaching experience"
                    />
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      Languages (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., English, Hindi, Spanish"
                    />
                  </div>
                </div>
                
                {/* Teaching Mode */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Teaching Mode
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['online', 'offline', 'hybrid'].map((mode) => (
                      <label key={mode} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.teachingMode.includes(mode)}
                          onChange={() => handleTeachingModeChange(mode)}
                          className="sr-only"
                        />
                        <div className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          formData.teachingMode.includes(mode)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}>
                          <span className="font-medium capitalize">{mode}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Bio */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell students about yourself, your teaching style, and what makes you unique..."
                  />
                </div>
                
                {/* Availability */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Availability (one per line)
                  </label>
                  <textarea
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Monday 9:00 AM - 5:00 PM&#10;Tuesday 10:00 AM - 6:00 PM&#10;Wednesday 9:00 AM - 3:00 PM"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      Updating Profile...
                    </div>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Read-only View */
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Profile Overview
              </h2>
              
              {/* Basic Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center mb-3">
                    <h3 className="text-lg font-semibold text-blue-800">Personal Info</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-blue-700"><span className="font-medium">Name:</span> {user.name || 'Not provided'}</p>
                    <p className="text-blue-700"><span className="font-medium">Email:</span> {user.email}</p>
                    <p className="text-blue-700"><span className="font-medium">Phone:</span> {user.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center mb-3">
                    <h3 className="text-lg font-semibold text-green-800">Location</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-green-700"><span className="font-medium">City:</span> {user.location?.city || 'Not specified'}</p>
                    <p className="text-green-700"><span className="font-medium">State:</span> {user.location?.state || 'Not specified'}</p>
                    <p className="text-green-700"><span className="font-medium">Country:</span> {user.location?.country || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {user.teacherProfile && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                    Teaching Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                      <div className="flex items-center mb-3">
                        <h4 className="text-lg font-semibold text-purple-800">Subjects</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {user.teacherProfile.subjects?.length > 0 ? (
                          user.teacherProfile.subjects.map((subject, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">
                              {subject}
                            </span>
                          ))
                        ) : (
                          <span className="text-purple-600">Not specified</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                      <div className="flex items-center mb-3">
                        <h4 className="text-lg font-semibold text-orange-800">Qualifications</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {user.teacherProfile.qualifications?.length > 0 ? (
                          user.teacherProfile.qualifications.map((qualification, index) => (
                            <span key={index} className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-sm font-medium">
                              {qualification}
                            </span>
                          ))
                        ) : (
                          <span className="text-orange-600">Not specified</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-xl border border-teal-200">
                      <div className="flex items-center mb-3">
                        <h4 className="text-lg font-semibold text-teal-800">Experience</h4>
                      </div>
                      <p className="text-2xl font-bold text-teal-700">{user.teacherProfile.experience || 0} years</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
                      <div className="flex items-center mb-3">
                        <h4 className="text-lg font-semibold text-indigo-800">Rating & Mode</h4>
                      </div>
                      <div className="space-y-2">
                        <p className="text-indigo-700"><span className="font-medium">Rating:</span> {user.teacherProfile.averageRating?.toFixed(1) || '0.0'} ⭐</p>
                        <div className="flex flex-wrap gap-2">
                          {user.teacherProfile.teachingMode?.length > 0 ? (
                            user.teacherProfile.teachingMode.map((mode, index) => (
                              <span key={index} className="px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full text-sm font-medium capitalize">
                                {mode}
                              </span>
                            ))
                          ) : (
                            <span className="text-indigo-600">Not specified</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200">
                      <div className="flex items-center mb-3">
                        <h4 className="text-lg font-semibold text-pink-800">Languages</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {user.teacherProfile.languages?.length > 0 ? (
                          user.teacherProfile.languages.map((language, index) => (
                            <span key={index} className="px-3 py-1 bg-pink-200 text-pink-800 rounded-full text-sm font-medium">
                              {language}
                            </span>
                          ))
                        ) : (
                          <span className="text-pink-600">Not specified</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {user.teacherProfile.bio && (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Bio</h4>
                      <p className="text-gray-700 leading-relaxed">{user.teacherProfile.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileManage;
