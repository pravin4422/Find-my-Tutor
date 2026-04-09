import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post('/auth/forgot-password', { email });
      toast.success('Password reset link has been sent to your email!');
      setEmailSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">

      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Reset Password
          </h2>
          <p className="mt-2 text-gray-600">
            {!emailSent ? "Enter your email to receive a reset link" : "Check your email for instructions"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
          {!emailSent ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>

              <div className="text-center">
                <Link to="/login" className="text-sm font-semibold text-green-600 hover:text-green-500 transition-colors">
                  ← Back to sign in
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h3>
                <p className="text-gray-600">
                  We've sent a password reset link to
                </p>
                <p className="font-semibold text-gray-900 mt-1">{email}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>Didn't receive the email?</strong> Check your spam folder or try again.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setEmailSent(false)}
                  className="w-full py-2 px-4 border border-green-300 rounded-xl text-green-700 bg-green-50 hover:bg-green-100 font-medium transition-colors"
                >
                  Try Again
                </button>
                
                <Link
                  to="/login"
                  className="block w-full py-2 px-4 text-center text-sm font-semibold text-green-600 hover:text-green-500 transition-colors"
                >
                  ← Back to sign in
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
