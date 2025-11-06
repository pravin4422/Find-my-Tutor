import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import API from '../../api/axios';
import { User, BookOpen, Star, MessageSquare, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [reviewsResponse, requestsResponse] = await Promise.all([
        API.get('/students/my-reviews'),
        API.get('/requests/my-requests')
      ]);

      const reviews = reviewsResponse.data.data || [];
      const requests = requestsResponse.data.data || [];

      setStats({
        totalReviews: reviews.length,
        totalRequests: requests.length,
        pendingRequests: requests.filter(req => req.status === 'pending').length,
        acceptedRequests: requests.filter(req => req.status === 'accepted').length
      });

      setRecentRequests(requests.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
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

  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1 group">
      <div className="flex items-center">
        <div className={`p-3 rounded-xl ${bgColor} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-200 border-t-blue-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>
      
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <img
                src={getImageUrl(user?.profilePicture) || "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"}
                alt={user?.name}
                className="relative w-20 h-20 rounded-full border-3 border-white shadow-lg object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135768.png";
                }}
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-400 to-green-500 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center shadow-sm animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="ml-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">{user?.name}</h1>
              <p className="text-gray-600 text-lg">Ready to continue your learning journey ✨</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 -mt-16 relative z-10">
          <StatCard
            icon={MessageSquare}
            title="Total Requests"
            value={stats.totalRequests}
            bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            icon={Clock}
            title="Pending Requests"
            value={stats.pendingRequests}
            bgColor="bg-gradient-to-r from-yellow-500 to-orange-500"
          />
          <StatCard
            icon={CheckCircle}
            title="Accepted Requests"
            value={stats.acceptedRequests}
            bgColor="bg-gradient-to-r from-green-500 to-emerald-500"
          />
          <StatCard
            icon={Star}
            title="Reviews Written"
            value={stats.totalReviews}
            bgColor="bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-white/20 hover:shadow-xl transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/teachers"
                  className="group flex items-center p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-blue-200/50"
                >
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <span className="text-blue-700 font-semibold text-lg group-hover:text-blue-800 transition-colors">Find Tutors</span>
                    <p className="text-blue-600 text-sm group-hover:text-blue-700 transition-colors">Browse available tutors</p>
                  </div>
                </Link>
                
                <Link
                  to="/my-requests"
                  className="group flex items-center p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-green-200/50"
                >
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <span className="text-green-700 font-semibold text-lg group-hover:text-green-800 transition-colors">My Requests</span>
                    <p className="text-green-600 text-sm group-hover:text-green-700 transition-colors">Track your tutor requests</p>
                  </div>
                </Link>
                
                <Link
                  to="/my-reviews"
                  className="group flex items-center p-5 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-purple-200/50"
                >
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <span className="text-purple-700 font-semibold text-lg group-hover:text-purple-800 transition-colors">My Reviews</span>
                    <p className="text-purple-600 text-sm group-hover:text-purple-700 transition-colors">View your reviews</p>
                  </div>
                </Link>
                
                <Link
                  to="/profile"
                  className="group flex items-center p-5 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 transform hover:scale-105 hover:shadow-md border border-orange-200/50"
                >
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <span className="text-orange-700 font-semibold text-lg group-hover:text-orange-800 transition-colors">Edit Profile</span>
                    <p className="text-orange-600 text-sm group-hover:text-orange-700 transition-colors">Update your information</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3 shadow-sm">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                Recent Requests
              </h2>
              <div className="space-y-4">
                {recentRequests.length > 0 ? (
                  recentRequests.map((request) => (
                    <div key={request._id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-gray-300">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{request.teacher?.name}</h4>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 font-medium">Subject: {request.subject}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <MessageSquare className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-gray-600 text-sm mb-3">No requests yet</p>
                    <Link
                      to="/teachers"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      Find a tutor to get started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
