import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { Star, Edit, Trash2 } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';

const StudentReviews = () => {
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
      const response = await API.get('/students/my-reviews');
      setReviews(response.data.data);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/students/reviews/${editingReview}`, editData);
      toast.success('Review updated successfully!');
      setEditingReview(null);
      fetchMyReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await API.delete(`/students/reviews/${reviewId}`);
        toast.success('Review deleted successfully!');
        fetchMyReviews();
      } catch (error) {
        toast.error('Failed to delete review');
      }
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
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Reviews</h1>
          
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <img
                        src={getImageUrl(review.teacher?.profilePicture) || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                        alt={review.teacher?.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{review.teacher?.name}</h3>
                        <p className="text-sm text-gray-600">
                          Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingReview(review._id);
                          setEditData({ rating: review.rating, comment: review.comment });
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                  </div>
                  
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">You haven't written any reviews yet.</p>
              <p className="text-gray-400 mt-2">Start by browsing teachers and writing your first review!</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Edit Review</h3>
            <form onSubmit={handleEditReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditData({...editData, rating: star})}
                      className={`text-2xl ${star <= editData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                <textarea
                  value={editData.comment}
                  onChange={(e) => setEditData({...editData, comment: e.target.value})}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength="10"
                  maxLength="500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Update Review
                </button>
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
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
  );
};

export default StudentReviews;
