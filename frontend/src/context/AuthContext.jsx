import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);

        setUser(parsedUser);
      } catch (error) {

        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    const userData = response.data.data; // Extract user data from nested structure
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
    return userData; // Return user data for redirect logic
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const updateUser = (userData) => {

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
  };

  const isAuthenticated = !!user;
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUser,
      isAuthenticated, 
      isTeacher, 
      isStudent, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
