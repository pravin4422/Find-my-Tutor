import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import API from '../../api/axios';
import { User, BookOpen, Star, Calendar, DollarSign, Users, TrendingUp, Award, Eye, GraduationCap, Clock, Monitor, Globe, FileText, MessageSquare, UserCheck } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';

const TeacherDashboard = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalReviews: 0,
    averageRating: 0,
    totalEarnings: 0
  });
  const [teacherData, setTeacherData] = useState(null);

  const fetchLatestData = async () => {
    if (user?._id) {
      try {
        const response = await API.get(`/teachers/${user._id}`);
        const freshData = response.data.data;
        setTeacherData(freshData);
        
        setStats({
          totalStudents: freshData.teacherProfile?.totalStudents || 0,
          totalReviews: freshData.teacherProfile?.totalReviews || 0,
          averageRating: freshData.teacherProfile?.averageRating || 0,
          totalEarnings: 0
        });
      } catch (error) {
        setTeacherData(user);
        setStats({
          totalStudents: user.teacherProfile?.totalStudents || 0,
          totalReviews: user.teacherProfile?.totalReviews || 0,
          averageRating: user.teacherProfile?.averageRating || 0,
          totalEarnings: 0
        });
      }
    }
  };

  useEffect(() => {
    fetchLatestData();
  }, [user?._id]);

  // Refresh data when returning to dashboard
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchLatestData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const StatCard = ({ icon: Icon, title, value, color, bgColor, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        {trend && (
          <div className="flex items-center text-green-500">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={getImageUrl(user?.profilePicture) || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                  alt={user?.name}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                  onError={(e) => {
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                  }}
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="ml-6">
                <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 -mt-16 relative z-10">
          <StatCard
            icon={Users}
            title="Total Students"
            value={stats.totalStudents}
            bgColor="bg-blue-500"
            trend="+12%"
          />
          <StatCard
            icon={Star}
            title="Average Rating"
            value={stats.averageRating.toFixed(1)}
            bgColor="bg-yellow-500"
          />
          <StatCard
            icon={BookOpen}
            title="Total Reviews"
            value={stats.totalReviews}
            bgColor="bg-green-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/profile"
                  className="group flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="p-3 bg-blue-500 rounded-lg group-hover:bg-blue-600 transition-colors">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <span className="text-blue-700 font-semibold text-lg">Edit Profile</span>
                    <p className="text-blue-600 text-sm">Update your information</p>
                  </div>
                </Link>
                
                <Link
                  to={`/teacher/${user?._id}/reviews`}
                  className="group flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="p-3 bg-green-500 rounded-lg group-hover:bg-green-600 transition-colors">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <span className="text-green-700 font-semibold text-lg">View Reviews</span>
                    <p className="text-green-600 text-sm">See student feedback</p>
                  </div>
                </Link>
                

                
                <Link
                  to={`/teacher/${user?._id}`}
                  className="group flex items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="p-3 bg-orange-500 rounded-lg group-hover:bg-orange-600 transition-colors">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <span className="text-orange-700 font-semibold text-lg">View Public Profile</span>
                    <p className="text-orange-600 text-sm">See how students see you</p>
                  </div>
                </Link>
                
                <Link
                  to="/teacher-requests"
                  className="group flex items-center p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl hover:from-indigo-100 hover:to-indigo-200 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="p-3 bg-indigo-500 rounded-lg group-hover:bg-indigo-600 transition-colors">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <span className="text-indigo-700 font-semibold text-lg">Student Requests</span>
                    <p className="text-indigo-600 text-sm">Manage student requests</p>
                  </div>
                </Link>
                
                <Link
                  to="/my-students"
                  className="group flex items-center p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl hover:from-teal-100 hover:to-teal-200 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="p-3 bg-teal-500 rounded-lg group-hover:bg-teal-600 transition-colors">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <span className="text-teal-700 font-semibold text-lg">My Students</span>
                    <p className="text-teal-600 text-sm">View accepted students</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                Profile Summary
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
                    <p className="text-sm font-medium text-blue-700">Subjects</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {teacherData?.teacherProfile?.subjects?.length > 0 ? (
                      teacherData.teacherProfile.subjects.map((subject, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {subject}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Not specified</span>
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="flex items-center mb-2">
                    <GraduationCap className="h-4 w-4 text-purple-600 mr-2" />
                    <p className="text-sm font-medium text-purple-700">Qualifications</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {teacherData?.teacherProfile?.qualifications?.length > 0 ? (
                      teacherData.teacherProfile.qualifications.map((qualification, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {qualification}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Not specified</span>
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-green-600 mr-2" />
                    <p className="text-sm font-medium text-green-700">Experience</p>
                  </div>
                  <p className="font-semibold text-lg text-gray-900">{teacherData?.teacherProfile?.experience || 0} years</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg border border-teal-200">
                  <div className="flex items-center mb-2">
                    <Monitor className="h-4 w-4 text-teal-600 mr-2" />
                    <p className="text-sm font-medium text-teal-700">Teaching Mode</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {teacherData?.teacherProfile?.teachingMode?.length > 0 ? (
                      teacherData.teacherProfile.teachingMode.map((mode, index) => (
                        <span key={index} className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium capitalize">
                          {mode}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Not specified</span>
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="flex items-center mb-2">
                    <Globe className="h-4 w-4 text-orange-600 mr-2" />
                    <p className="text-sm font-medium text-orange-700">Languages</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {teacherData?.teacherProfile?.languages?.length > 0 ? (
                      teacherData.teacherProfile.languages.map((language, index) => (
                        <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                          {language}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Not specified</span>
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <FileText className="h-4 w-4 text-gray-600 mr-2" />
                    <p className="text-sm font-medium text-gray-700">Bio</p>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3">{teacherData?.teacherProfile?.bio || 'No bio provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
