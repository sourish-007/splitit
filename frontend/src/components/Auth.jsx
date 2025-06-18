import React from 'react';
import { useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios';

export default function Auth({ onAuthSuccess, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const authCallback = onAuthSuccess || onLogin;

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId && authCallback) {
      authCallback(savedUserId);
    }
  }, [authCallback]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = isLogin ? '/user/login' : '/user/signup';
      const payload = isLogin ? { email: formData.email } : formData;
      
      const response = await axiosInstance.post(endpoint, payload);
      const userId = response.data.user_id;
      
      localStorage.setItem('userId', userId);
      
      if (isLogin) {
        setMessage(`Welcome back! User ID: ${userId}`);
      } else {
        setMessage(`Account created successfully! User ID: ${userId}`);
        setFormData({ name: '', email: '' });
      }
      
      setTimeout(() => {
        if (authCallback) {
          authCallback(userId);
        }
      }, 1500);
      
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '' });
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-teal-400/5 to-cyan-400/10 rounded-3xl"></div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-cyan-600 bg-clip-text text-transparent">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
            </div>

            <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-2xl p-1 mb-6">
              <button
                type="button"
                onClick={() => !isLogin && toggleMode()}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                  isLogin 
                    ? 'bg-white shadow-md text-emerald-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => isLogin && toggleMode()}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                  !isLogin 
                    ? 'bg-white shadow-md text-emerald-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your full name..."
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter your email address..."
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-semibold py-4 px-6 rounded-2xl hover:from-emerald-600 hover:to-cyan-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isLogin ? "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" : "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"} />
                    </svg>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </button>
            </div>

            {message && (
              <div className={`mt-6 p-4 rounded-2xl border ${
                message.includes('error') || message.includes('Error') 
                  ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200' 
                  : 'bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-200'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.includes('error') || message.includes('Error')
                      ? 'bg-gradient-to-r from-red-500 to-rose-500'
                      : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                  }`}>
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                        message.includes('error') || message.includes('Error')
                          ? "M6 18L18 6M6 6l12 12"
                          : "M5 13l4 4L19 7"
                      } />
                    </svg>
                  </div>
                  <p className={`font-medium ${
                    message.includes('error') || message.includes('Error') 
                      ? 'text-red-800' 
                      : 'text-emerald-800'
                  }`}>
                    {message}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50/50 to-cyan-50/50 rounded-2xl border border-emerald-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-semibold text-emerald-700 mb-1">Getting Started</p>
                  <p>{isLogin ? 'Just enter your email to access your account!' : 'Create your account to start splitting expenses with friends!'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}