import React, { useState, useEffect, useContext } from 'react';
import { Clock, CheckCircle, XCircle, User, BookOpen, MessageSquare } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import API from '../../api/axios';
import { getImageUrl } from '../../utils/imageUtils';

const StudentRequests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const response = await API.get('/requests/my-requests');
      setRequests(response.data.data);
    } catch (error) {
      setError('Failed to fetch requests');
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Requests</h1>
          <p className="text-gray-600">Track your tutor requests and their status</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Requests Yet</h3>
            <p className="text-gray-600 mb-6">You haven't sent any tutor requests yet.</p>
            <a
              href="/teachers"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Tutors
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div key={request._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={getImageUrl(request.teacher?.profilePicture) || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                      alt={request.teacher?.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {request.teacher?.name}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-2 capitalize">{request.status}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-3">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span className="font-medium">Subject: {request.subject}</span>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Your Message:</h4>
                        <p className="text-gray-700">{request.message}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Sent on {new Date(request.createdAt).toLocaleDateString()}</span>
                        {request.respondedAt && (
                          <span>
                            Responded on {new Date(request.respondedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRequests;
