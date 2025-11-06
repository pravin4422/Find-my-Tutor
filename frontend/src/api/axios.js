import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true, // ⚠️ crucial for login/register
});
// This function will be called before every request
API.interceptors.request.use((req) => {
  if (localStorage.getItem('userInfo')) {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    req.headers.Authorization = `Bearer ${token}`;

  } else {

  }
  return req;
});

// Response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/teachers/profile')) {

      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
