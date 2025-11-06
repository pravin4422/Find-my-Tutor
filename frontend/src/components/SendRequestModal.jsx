import React, { useState, useContext } from 'react';
import { X, Send, BookOpen, MessageSquare } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import API from '../api/axios';

const SendRequestModal = ({ isOpen, onClose, teacher }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post('/requests', {
        teacherId: teacher._id,
        subject: formData.subject,
        message: formData.message
      });
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ subject: '', message: '' });
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Send Request to {teacher?.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Sent!</h3>
            <p className="text-gray-600">Your request has been sent to {teacher?.name}. They will respond soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="h-4 w-4 inline mr-2" />
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="e.g., Mathematics, Physics, English"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="h-4 w-4 inline mr-2" />
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Tell the teacher about your learning goals, current level, and what you hope to achieve..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.message.length}/500 characters
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.subject.trim() || !formData.message.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Request
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SendRequestModal;
