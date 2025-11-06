import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AuthRedirect = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If user is logged in, redirect based on role
  if (user) {
    if (user.role === 'teacher') {
      return <Navigate to="/teacher-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // If not logged in, show the login/register page
  return children;
};

export default AuthRedirect;
