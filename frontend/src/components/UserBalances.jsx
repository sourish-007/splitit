import React from 'react';
import { useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios';

export default function UserBalances() {
  const [user_id, setUserId] = useState('');
  const [balances, setBalances] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBalances = async () => {
    if (!user_id) return;
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get(`/user/${user_id}/balances`);
      setBalances(response.data);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || 'Error fetching balances');
      setBalances(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-amber-400/5 to-yellow-400/10 rounded-3xl"></div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-700 to-amber-600 bg-clip-text text-transparent">
                My Balances
              </h2>
            </div>

            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <input
                  type="number"
                  value={user_id}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Your User ID..."
                  className="w-full px-5 py-4 bg-white/70 backdrop-blur-sm border border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 pr-12"
                />
                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <button
                onClick={fetchBalances}
                disabled={loading}
                className="px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold rounded-2xl hover:from-orange-600 hover:to-amber-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center justify-center"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span>View</span>
                )}
              </button>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}
            
            {balances && (
              <div className="space-y-6">
                <div className="bg-white/60 backdrop-blur-sm border border-orange-100 rounded-2xl p-6 hover:bg-white/80 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{balances.name}</h3>
                      <p className="text-sm text-gray-500">Personal Balance Overview</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-green-800">Total Paid</p>
                          <p className="text-sm text-green-600">Amount you've spent</p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-green-700">₹{balances.total_paid}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-blue-800">Total Owed</p>
                          <p className="text-sm text-blue-600">Your share of expenses</p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-blue-700">₹{balances.total_owed}</span>
                    </div>

                    <div className="p-5 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border-2 border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            balances.net_balance > 0 
                              ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                              : balances.net_balance < 0 
                                ? 'bg-gradient-to-br from-red-400 to-rose-500'
                                : 'bg-gradient-to-br from-gray-400 to-slate-500'
                          }`}>
                            {balances.net_balance > 0 ? (
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                              </svg>
                            ) : balances.net_balance < 0 ? (
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-800">Net Balance</p>
                            <p className="text-sm text-gray-600">Overall position</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-2xl font-bold ${
                            balances.net_balance > 0 
                              ? 'text-green-600' 
                              : balances.net_balance < 0 
                                ? 'text-red-600' 
                                : 'text-gray-600'
                          }`}>
                            {balances.net_balance > 0 
                              ? `+₹${balances.net_balance}` 
                              : balances.net_balance < 0 
                                ? `₹${balances.net_balance}` 
                                : '₹0.00'
                            }
                          </span>
                          <p className={`text-sm font-medium ${
                            balances.net_balance > 0 
                              ? 'text-green-600' 
                              : balances.net_balance < 0 
                                ? 'text-red-600' 
                                : 'text-gray-600'
                          }`}>
                            {balances.net_balance > 0 
                              ? 'You are owed' 
                              : balances.net_balance < 0 
                                ? 'You owe' 
                                : 'All settled'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!balances && !loading && !error && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">Enter your User ID to view personal balances</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}