import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/axios';
import { Star, MapPin, Clock, DollarSign, BookOpen, Users } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import SendRequestModal from '../../components/SendRequestModal';

const TeacherProfileView = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    fetchTeacher();
    setImageError(false);
  }, [id]);

  useEffect(() => {
    // Refresh data when component becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchTeacher();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const fetchTeacher = async () => {
    try {
      const response = await API.get(`/teachers/${id}`);
      const teacherData = response.data.data || response.data;
      console.log('Fetched teacher data:', teacherData);
      setTeacher(teacherData);
    } catch (error) {
      console.error('Error fetching teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!reviewData.comment.trim() || reviewData.comment.length < 10) {
      toast.error('Please write a comment with at least 10 characters');
      return;
    }
    
    if (!user || user.role !== 'student') {
      toast.error('Only students can write reviews');
      return;
    }
    
    setSubmittingReview(true);
    try {
      const response = await API.post(`/students/teachers/${id}/reviews`, {
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment.trim()
      });
      
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewData({ rating: 5, comment: '' });
      fetchTeacher(); // Refresh to show new review
    } catch (error) {
      console.error('Review submission error:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors.map(err => err.msg).join(', ');
        toast.error(`Validation error: ${validationErrors}`);
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to submit review';
        toast.error(errorMessage);
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Teacher not found</h2>
          <p className="text-gray-600">The teacher profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Profile Picture and Details */}
          <div className="lg:col-span-1">
            {/* Profile Picture and Basic Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <img
                    src={getImageUrl(teacher.profilePicture) || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt={teacher.name}
                    className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg object-cover"
                    onError={(e) => {
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                    }}
                  />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{teacher.name}</h1>
                <p className="text-gray-600 mb-3">{teacher.email}</p>
                <div className="flex items-center justify-center mb-4">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="text-gray-900 font-semibold">
                    {teacher.teacherProfile?.averageRating?.toFixed(1) || '0.0'}
                  </span>
                  <span className="text-gray-600 ml-2">
                    ({teacher.teacherProfile?.totalReviews || 0} reviews)
                  </span>
                </div>
                
                {/* Contact & Review Buttons */}
                <div className="space-y-3">
                  {user?.role === 'student' && (
                    <button 
                      onClick={() => setShowRequestModal(true)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Send Request
                    </button>
                  )}
                  {user?.role === 'student' && !teacher.reviews?.some(review => review.student?._id === user._id) && (
                    <button 
                      onClick={() => setShowReviewForm(true)}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Write Review
                    </button>
                  )}
                  {user?.role === 'student' && teacher.reviews?.some(review => review.student?._id === user._id) && (
                    <div className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold text-center">
                      Already Reviewed
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-semibold">{teacher.teacherProfile?.experience || 0} years</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="w-5 h-5 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Students Taught</p>
                    <p className="font-semibold">{teacher.teacherProfile?.totalStudents || 0}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">
                      {teacher.location?.city ? 
                        `${teacher.location.city}${teacher.location.state ? `, ${teacher.location.state}` : ''}` : 
                        'Not specified'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teaching Mode */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Teaching Mode</h3>
              <div className="flex flex-wrap gap-2">
                {teacher.teacherProfile?.teachingMode?.length > 0 ? (
                  teacher.teacherProfile.teachingMode.map((mode, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium capitalize"
                    >
                      {mode}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">Not specified</p>
                )}
              </div>
            </div>

            {/* Languages */}
            {teacher.teacherProfile?.languages?.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.teacherProfile.languages.map((language, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side - About Tutor */}
          <div className="lg:col-span-2 space-y-6">

            {/* About */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">
                {teacher.teacherProfile?.bio || 'No bio available.'}
              </p>
            </div>

            {/* Subjects */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Subjects</h2>
              <div className="flex flex-wrap gap-2">
                {teacher.teacherProfile?.subjects?.length > 0 ? (
                  teacher.teacherProfile.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {subject}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No subjects listed</p>
                )}
              </div>
            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Qualifications</h2>
              <div className="space-y-2">
                {teacher.teacherProfile?.qualifications?.length > 0 ? (
                  teacher.teacherProfile.qualifications.map((qualification, index) => (
                    <div key={index} className="flex items-center">
                      <BookOpen className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-gray-700">{qualification}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No qualifications listed</p>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Reviews ({teacher.teacherProfile?.totalReviews || 0})
              </h2>
              <div className="space-y-4">
                {teacher.reviews?.length > 0 ? (
                  teacher.reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                            alt={review.student?.name}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <div>
                            <span className="font-medium text-gray-900">{review.student?.name}</span>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 ml-11">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No reviews yet</p>
                    <p className="text-sm text-gray-400 mt-1">Be the first to review this teacher!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Send Request Modal */}
        <SendRequestModal 
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          teacher={teacher}
        />

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewData({...reviewData, rating: star})}
                        className={`text-2xl ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment ({reviewData.comment.length}/500)
                  </label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Share your experience with this teacher... (minimum 10 characters)"
                    required
                    minLength="10"
                    maxLength="500"
                  />
                  {reviewData.comment.length > 0 && reviewData.comment.length < 10 && (
                    <p className="text-red-500 text-sm mt-1">Comment must be at least 10 characters long</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfileView;
