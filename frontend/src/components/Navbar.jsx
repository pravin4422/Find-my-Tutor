import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import { getProfilePicture } from "../utils/imageUtils";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [profilePicKey, setProfilePicKey] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const isLoggedIn = isAuthenticated || !!user;

  // Default profile image for all users
  const defaultProfilePic = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  // Use uploaded profile picture for all users, fallback to default if not available
  const profilePic = imageError ? defaultProfilePic : getProfilePicture(user, defaultProfilePic);
  
  // Reset image error when user changes
  React.useEffect(() => {
    setImageError(false);
    setProfilePicKey(prev => prev + 1);
  }, [user?.profilePicture]);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600 flex-shrink-0 pl-0">
            TutorFinder
          </Link>

          {/* Desktop Menu - All items aligned to right */}
          <div className="hidden md:flex md:items-center space-x-6 ml-auto">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link to="/aboutus" className="text-gray-700 hover:text-blue-600 font-medium">
              About Us
            </Link>

            {isLoggedIn ? (
              <>
                {user?.role === "student" && (
                  <Link to="/teachers" className="text-gray-700 hover:text-blue-600 font-medium">
                    Browse Tutors
                  </Link>
                )}

                {user?.role === "teacher" && (
                  <Link
                    to="/teacher-dashboard"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Dashboard
                  </Link>
                )}

                {user?.role === "student" && (
                  <Link
                    to="/student-dashboard"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Dashboard
                  </Link>
                )}



                {user?.role === "teacher" && (
                  <>
                    <Link
                      to="/teacher-requests"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Requests
                    </Link>
                    <Link
                      to="/my-students"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      My Students
                    </Link>
                  </>
                )}

                {/* Profile Icon */}
                <Link to="/profile">
                  <img
                    key={profilePicKey}
                    src={profilePic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 cursor-pointer hover:scale-105 transition"
                    onError={() => setImageError(true)}
                  />
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor">
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/"
              className="block text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/aboutus"
              className="block text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>

            {isLoggedIn ? (
              <>
                {user?.role === "student" && (
                  <Link
                    to="/teachers"
                    className="block text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Browse Tutors
                  </Link>
                )}

                {user?.role === "teacher" && (
                  <Link
                    to="/teacher-dashboard"
                    className="block text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}

                {user?.role === "student" && (
                  <Link
                    to="/student-dashboard"
                    className="block text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}



                {user?.role === "teacher" && (
                  <>
                    <Link
                      to="/teacher-requests"
                      className="block text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Requests
                    </Link>
                    <Link
                      to="/my-students"
                      className="block text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Students
                    </Link>
                  </>
                )}

                {/* Profile in mobile menu */}
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 mt-2 hover:bg-gray-50 rounded-md py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <img
                    key={profilePicKey}
                    src={profilePic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border border-blue-400"
                    onError={() => setImageError(true)}
                  />
                  <span className="text-gray-700 font-medium">
                    {user?.name || "User"}
                  </span>
                </Link>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left text-red-600 px-3 py-2 rounded-md font-medium hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
