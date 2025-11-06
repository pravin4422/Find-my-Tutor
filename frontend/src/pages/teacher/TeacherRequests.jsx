import React, { useState, useEffect, useContext } from 'react';
import { Clock, CheckCircle, XCircle, User, BookOpen, MessageSquare, Phone, MapPin } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import API from '../../api/axios';
import { getImageUrl } from '../../utils/imageUtils';

const TeacherRequests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchReceivedRequests();
  }, []);

  const fetchReceivedRequests = async () => {
    try {
      const response = await API.get('/requests/received');
      setRequests(response.data.data);
    } catch (error) {
      setError('Failed to fetch requests');
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    setProcessingId(requestId);
    try {
      await API.put(`/requests/${requestId}/accept`);
      setRequests(requests.map(req => 
        req._id === requestId 
          ? { ...req, status: 'accepted', respondedAt: new Date() }
          : req
      ));
    } catch (error) {
      setError('Failed to accept request');
      console.error('Error accepting request:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setProcessingId(requestId);
    try {
      await API.put(`/requests/${requestId}/reject`);
      setRequests(requests.map(req => 
        req._id === requestId 
          ? { ...req, status: 'rejected', respondedAt: new Date() }
          : req
      ));
    } catch (error) {
      setError('Failed to reject request');
      console.error('Error rejecting request:', error);
    } finally {
      setProcessingId(null);
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Requests</h1>
          <p className="text-gray-600">Manage requests from students who want to learn from you</p>
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
            <p className="text-gray-600">You haven't received any student requests yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div key={request._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <img
                      src={getImageUrl(request.student?.profilePicture) || "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"}
                      alt={request.student?.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135768.png";
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {request.student?.name}
                          </h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            <span className="ml-2 capitalize">{request.status}</span>
                          </span>
                        </div>
                        
                        {request.status === 'pending' && (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleAcceptRequest(request._id)}
                              disabled={processingId === request._id}
                              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request._id)}
                              disabled={processingId === request._id}
                              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <BookOpen className="h-4 w-4 mr-2" />
                          <span className="font-medium">Subject: {request.subject}</span>
                        </div>
                        
                        {request.student?.phone && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{request.student.phone}</span>
                          </div>
                        )}
                        
                        {request.student?.location?.city && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>
                              {request.student.location.city}
                              {request.student.location.state && `, ${request.student.location.state}`}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Student's Message:</h4>
                        <p className="text-gray-700">{request.message}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Received on {new Date(request.createdAt).toLocaleDateString()}</span>
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

export default TeacherRequests;
