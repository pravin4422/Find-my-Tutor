import React, { useState, useEffect, useContext } from 'react';
import { User, BookOpen, Phone, MapPin, Calendar, Mail } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import API from '../../api/axios';
import { getImageUrl } from '../../utils/imageUtils';

const MyStudents = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyStudents();
  }, []);

  const fetchMyStudents = async () => {
    try {
      const response = await API.get('/requests/my-students');
      setStudents(response.data.data);
    } catch (error) {
      setError('Failed to fetch students');
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Students</h1>
          <p className="text-gray-600">Students who have been accepted and are learning from you</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {students.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Students Yet</h3>
            <p className="text-gray-600">You haven't accepted any student requests yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((request) => (
              <div key={request._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={getImageUrl(request.student?.profilePicture) || "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"}
                    alt={request.student?.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135768.png";
                    }}
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {request.student?.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">{request.subject}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {request.student?.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-3 text-gray-400" />
                      <span className="text-sm">{request.student.email}</span>
                    </div>
                  )}
                  
                  {request.student?.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-3 text-gray-400" />
                      <span className="text-sm">{request.student.phone}</span>
                    </div>
                  )}
                  
                  {request.student?.location?.city && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                      <span className="text-sm">
                        {request.student.location.city}
                        {request.student.location.state && `, ${request.student.location.state}`}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-sm">
                      Joined on {new Date(request.respondedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Original Request:</h4>
                  <p className="text-gray-600 text-sm line-clamp-3">{request.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStudents;
