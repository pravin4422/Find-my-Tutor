// File: src/pages/teachers/TeacherDetails.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import  AuthContext  from '../../context/AuthContext'; // ✅ make sure you have this context

const TeacherDetails = () => {
  const { id } = useParams();
  const { user, isStudent } = useContext(AuthContext);
  const [teacher, setTeacher] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTeacherDetails();
  }, [id]);

  // ✅ Use API instead of axiosClient
  const fetchTeacherDetails = async () => {
    try {
      const response = await API.get(`/teachers/${id}`);
      setTeacher(response.data.data);
      setReviews(response.data.data.reviews || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load teacher details');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!isStudent) {
      toast.error('Only students can leave reviews');
      return;
    }

    setSubmitting(true);
    try {
      await API.post(`/students/teachers/${id}/reviews`, reviewData);
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewData({ rating: 5, comment: '' });
      fetchTeacherDetails(); // refresh reviews
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // 🌀 Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // ❌ Not found
  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Teacher not found</h2>
        </div>
      </div>
    );
  }

  // ✅ Extract teacher data safely
  const { name, email, profilePicture, phone, location, teacherProfile } = teacher;
  const {
    subjects = [],
    qualifications = [],
    experience = 0,

    availability = [],
    bio = '',
    averageRating = 0,
    totalReviews = 0,
    languages = [],
    teachingMode = []
  } = teacherProfile || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Teacher Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            {/* Left Panel */}
            <div className="md:w-1/3 p-8 bg-gradient-to-b from-blue-50 to-white">
              <img
                src={profilePicture || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                alt={name}
                className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
              />
              <div className="text-center mt-6">
                <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
                <div className="flex items-center justify-center mt-3">
                  <span className="text-3xl text-yellow-500">★</span>
                  <span className="ml-2 text-2xl font-bold text-gray-900">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="ml-2 text-gray-600">
                    ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                  </span>
                </div>

              </div>
            </div>

            {/* Right Panel */}
            <div className="md:w-2/3 p-8">
              {/* About */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed">{bio || 'No bio provided.'}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subjects */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Subjects</h3>
                  <div className="flex flex-wrap gap-2">
                    {subjects.length > 0 ? (
                      subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {subject}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No subjects listed</span>
                    )}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Experience</h3>
                  <p className="text-gray-700">{experience} years</p>
                </div>

                {/* Languages */}
                {languages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Languages</h3>
                    <p className="text-gray-700">{languages.join(', ')}</p>
                  </div>
                )}

                {/* Teaching Mode */}
                {teachingMode.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Teaching Mode</h3>
                    <p className="text-gray-700 capitalize">{teachingMode.join(', ')}</p>
                  </div>
                )}

                {/* Location */}
                {location?.city && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                    <p className="text-gray-700">
                      {location.city}
                      {location.state && `, ${location.state}`}
                      {location.country && `, ${location.country}`}
                    </p>
                  </div>
                )}

                {/* Contact */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact</h3>
                  <p className="text-gray-700">{email}</p>
                  {phone && <p className="text-gray-700">{phone}</p>}
                </div>
              </div>

              {/* Qualifications */}
              {qualifications.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Qualifications</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {qualifications.map((qual, index) => (
                      <li key={index}>{qual}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Availability */}
              {availability.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Availability</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {availability.map((slot, index) => (
                      <li key={index}>{slot}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
            {isStudent && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className={`text-3xl ${
                        star <= reviewData.rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  rows="4"
                  required
                  minLength="10"
                  maxLength="500"
                  placeholder="Share your experience with this tutor (10–500 characters)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {reviewData.comment.length}/500 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="relative w-12 h-12">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                        alt={review.student?.name}
                        className="w-12 h-12 rounded-full absolute inset-0 object-cover"
                      />
                      {review.student?.profilePicture && review.student.profilePicture !== "https://cdn-icons-png.flaticon.com/512/3135/3135768.png" && (
                        <img
                          src={review.student.profilePicture}
                          alt={review.student?.name}
                          className="w-12 h-12 rounded-full absolute inset-0 object-cover opacity-0 transition-opacity duration-300"
                          onLoad={(e) => e.target.style.opacity = '1'}
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {review.student?.name || 'Anonymous'}
                          </h4>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, index) => (
                              <span
                                key={index}
                                className={`text-lg ${
                                  index < review.rating ? 'text-yellow-500' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No reviews yet. Be the first to review this tutor!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
