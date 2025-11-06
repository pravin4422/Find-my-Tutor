import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import TeacherCard from '../components/TeacherCard';
import AuthContext from '../context/AuthContext';
import { BookOpen, Users, Star, Search, CheckCircle, DollarSign, ArrowRight, Play } from 'lucide-react';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats] = useState({
    totalTutors: 500,
    totalStudents: 2500,
    totalLessons: 10000,
    avgRating: 4.8
  });

  useEffect(() => {
    fetchFeaturedTeachers();
  }, []);

  const fetchFeaturedTeachers = async () => {
    try {
      const response = await API.get('/teachers?limit=6&sortBy=rating');
      setTeachers(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>

        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
               
              <span className="block text-yellow-400">Find My Tutor</span>
            </h1>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              {user ? (
                <Link 
                  to={user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'} 
                  className="group bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/teachers" 
                    className="group bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Browse Tutors
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="/register" 
                    className="group bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Become a Tutor
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-blue-600">TutorFinder</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of personalized learning with our innovative platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">Smart Search</h3>
              <p className="text-gray-600 text-center leading-relaxed">Advanced AI-powered search to find the perfect tutor based on your learning style, subject, and schedule preferences.</p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">Verified Excellence</h3>
              <p className="text-gray-600 text-center leading-relaxed">Every tutor undergoes rigorous verification and continuous quality monitoring to ensure exceptional learning experiences.</p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">Transparent Pricing</h3>
              <p className="text-gray-600 text-center leading-relaxed">Clear, upfront pricing with flexible payment options. No hidden fees, just quality education at fair prices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Teachers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet Our <span className="text-blue-600">Star Tutors</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from the best educators who are passionate about your success
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <div className="absolute top-0 left-0 animate-ping rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-300 opacity-20"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teachers.slice(0, 6).map((teacher) => (
                  <TeacherCard key={teacher._id} teacher={teacher} />
                ))}
              </div>

              {teachers.length === 0 && (
                <div className="text-center py-20">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No tutors available yet</h3>
                  <p className="text-gray-500">Check back soon for amazing tutors!</p>
                </div>
              )}

              {teachers.length > 0 && (
                <div className="text-center mt-16">
                  <Link 
                    to="/teachers" 
                    className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Explore All Tutors
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section - Only show when not logged in */}
      {!user && (
        <section className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 text-white py-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to <span className="text-yellow-400">Transform</span> Your Learning?
              </h2>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link 
                  to="/register" 
                  className="group bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-10 py-4 rounded-full font-bold text-xl hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Start Learning Today
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  to="/teachers" 
                  className="group bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-10 py-4 rounded-full font-bold text-xl hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center"
                >
                  <Search className="w-6 h-6 mr-3" />
                  Browse Tutors
                </Link>
              </div>
              
              <div className="mt-12 flex justify-center items-center space-x-8 text-blue-200">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-yellow-400 mr-2" />
                  <span>3000+ Students</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mr-2" />
                  <span>Verified Tutors</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
