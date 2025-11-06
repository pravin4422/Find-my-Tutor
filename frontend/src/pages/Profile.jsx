// File: src/pages/Profile.jsx
import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import  AuthContext  from "../context/AuthContext";
import API from "../api/axios";
import { toast } from "react-toastify";
import { getImageUrl } from "../utils/imageUtils";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "",
    classOfStudying: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        age: user.age || "",
        gender: user.gender || "",
        classOfStudying: user.classOfStudying || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is still authenticated
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      toast.error('Please login again');
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setError('');
    try {
      let response;
      
      if (selectedImage) {
        // Use FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name || '');
        formDataToSend.append('phone', formData.phone || '');
        formDataToSend.append('age', formData.age || '');
        formDataToSend.append('gender', formData.gender || '');
        formDataToSend.append('classOfStudying', formData.classOfStudying || '');
        formDataToSend.append('profilePicture', selectedImage);

        response = await API.put("/auth/profile", formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Use JSON for regular updates
        const updateData = {
          name: formData.name || '',
          phone: formData.phone || '',
          age: formData.age || '',
          gender: formData.gender || '',
          classOfStudying: formData.classOfStudying || '',
        };

        response = await API.put("/auth/profile", updateData);
      }
      
      // Update user in AuthContext
      const updatedUser = response.data.data || response.data;
      updateUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));

      toast.success("Profile updated successfully");
      setIsEditing(false);
      setSelectedImage(null);
      setImagePreview(null);
      setFormData({ ...formData });
    } catch (error) {
      
      // Handle token expiration
      if (error.response?.status === 401) {
        localStorage.removeItem('userInfo');
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
        return;
      }
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to update profile";
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

  // Redirect teachers to their profile management page
  if (user.role === 'teacher') {
    return <Navigate to={`/teacher/${user._id}/manage`} replace />;
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
                    src={imagePreview || getImageUrl(user.profilePicture) || "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    onError={(e) => {
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135768.png";
                    }}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="ml-6">
                  <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
                  <p className="text-blue-100 text-lg">{user.email}</p>
                  <span className="inline-flex items-center mt-3 px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-400 to-blue-400 text-gray-900 shadow-lg">
                    Student
                  </span>
                </div>
              </div>

              <div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="group inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name || "",
                        phone: user.phone || "",
                        age: user.age || "",
                        gender: user.gender || "",
                        classOfStudying: user.classOfStudying || "",
                      });
                      setSelectedImage(null);
                      setImagePreview(null);
                      setError('');
                    }}
                    className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
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
              
              {/* Profile Picture Upload */}
              <div className="text-center">
                <div className="mb-4">
                  <img
                    src={imagePreview || getImageUrl(user.profilePicture) || "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full mx-auto border-4 border-gray-200 shadow-lg object-cover"
                    onError={(e) => {
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135768.png";
                    }}
                  />
                </div>
                <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  Change Profile Picture
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
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

              {/* Email (Read-only) */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your age"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    Class of Studying
                  </label>
                  <select
                    name="classOfStudying"
                    value={formData.classOfStudying}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Class</option>
                    <option value="1st">1st Grade</option>
                    <option value="2nd">2nd Grade</option>
                    <option value="3rd">3rd Grade</option>
                    <option value="4th">4th Grade</option>
                    <option value="5th">5th Grade</option>
                    <option value="6th">6th Grade</option>
                    <option value="7th">7th Grade</option>
                    <option value="8th">8th Grade</option>
                    <option value="9th">9th Grade</option>
                    <option value="10th">10th Grade</option>
                    <option value="11th">11th Grade</option>
                    <option value="12th">12th Grade</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="postgraduate">Postgraduate</option>
                  </select>
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
                    <h3 className="text-lg font-semibold text-green-800">Academic Info</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-green-700"><span className="font-medium">Age:</span> {user.age || 'Not specified'}</p>
                    <p className="text-green-700"><span className="font-medium">Gender:</span> {user.gender || 'Not specified'}</p>
                    <p className="text-green-700"><span className="font-medium">Class:</span> {user.classOfStudying || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center mb-3">
                  <h3 className="text-lg font-semibold text-purple-800">Account Details</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-purple-700"><span className="font-medium">Role:</span> {user.role}</p>
                  <p className="text-purple-700"><span className="font-medium">Member Since:</span> {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
