// File: src/pages/reviews/MyReviews.jsx
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import { getImageUrl } from '../../utils/imageUtils';

const MyReviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editData, setEditData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      const endpoint = user?.role === 'teacher' ? '/teachers/my-reviews' : '/students/my-reviews';
      const response = await API.get(endpoint);
      setReviews(response.data.data);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review._id);
    setEditData({
      rating: review.rating,
      comment: review.comment,
    });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditData({ rating: 5, comment: '' });
  };

  const handleUpdateReview = async (reviewId) => {
    try {
      await API.put(`/students/reviews/${reviewId}`, editData); // ✅ Correct usage
      toast.success('Review updated successfully');
      setEditingReview(null);
      fetchMyReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await API.delete(`/students/reviews/${reviewId}`); // ✅ Correct usage
      toast.success('Review deleted successfully');
      fetchMyReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user?.role === 'teacher' ? 'Student Reviews' : 'My Reviews'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'teacher' 
              ? 'Reviews from your students' 
              : 'Manage your reviews for tutors'
            }
          </p>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
                {/* User Info */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={user?.role === 'teacher' 
                      ? (getImageUrl(review.student?.profilePicture) || 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png')
                      : (getImageUrl(review.teacher?.profilePicture) || 'https://via.placeholder.com/60')
                    }
                    alt={user?.role === 'teacher' ? review.student?.name : review.teacher?.name}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = user?.role === 'teacher' 
                        ? 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png'
                        : 'https://via.placeholder.com/60';
                    }}
                  />
                  <div className="flex-1">
                    {user?.role === 'teacher' ? (
                      <div className="text-xl font-semibold text-gray-900">
                        {review.student?.name}
                      </div>
                    ) : (
                      <Link
                        to={`/teachers/${review.teacher?._id}`}
                        className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {review.teacher?.name}
                      </Link>
                    )}
                    {user?.role === 'student' && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {review.teacher?.teacherProfile?.subjects
                          ?.slice(0, 3)
                          .map((subject, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                            >
                              {subject}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Review Content */}
                {editingReview === review._id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditData({ ...editData, rating: star })}
                            className={`text-3xl ${
                              star <= editData.rating ? 'text-yellow-500' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comment
                      </label>
                      <textarea
                        value={editData.comment}
                        onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                        rows="4"
                        minLength="10"
                        maxLength="500"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateReview(review._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className={`text-xl ${
                            index < review.rating ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4">{review.comment}</p>

                    {user?.role === 'student' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(review)}
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {user?.role === 'teacher' ? 'No student reviews yet' : 'No reviews yet'}
            </h3>
            <p className="mt-2 text-gray-500">
              {user?.role === 'teacher' 
                ? 'Students will leave reviews after working with you.'
                : 'Start by browsing tutors and leaving your first review!'
              }
            </p>
            {user?.role === 'student' && (
              <Link
                to="/teachers"
                className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Browse Tutors
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviews;
