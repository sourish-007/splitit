import React from 'react';
import { useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios';

export default function GroupBalances() {
  const [group_id, setGroupId] = useState('');
  const [balances, setBalances] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBalances = async () => {
    if (!group_id) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/group/${group_id}/balances`);
      setBalances(response.data);
    } catch (error) {
      console.error(error);
      setBalances(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-cyan-400/5 to-teal-400/10 rounded-3xl"></div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent">
                Group Balances
              </h2>
            </div>

            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={group_id}
                  onChange={(e) => setGroupId(e.target.value)}
                  placeholder="Enter Group ID..."
                  className="w-full px-5 py-4 bg-white/70 backdrop-blur-sm border border-blue-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 pr-12"
                />
                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <button
                onClick={fetchBalances}
                disabled={loading}
                className="px-6 py-4 bg-gradient-to-r from-blue-500 to-teal-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center justify-center"
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
            
            {balances && Array.isArray(balances) && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-700">Member Balances</h3>
                </div>
                
                {balances.map((member) => (
                  <div key={member.id} className="bg-white/60 backdrop-blur-sm border border-blue-100 rounded-2xl p-5 hover:bg-white/80 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          member.net_balance > 0 
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                            : member.net_balance < 0 
                              ? 'bg-gradient-to-br from-red-400 to-rose-500'
                              : 'bg-gradient-to-br from-gray-400 to-slate-500'
                        }`}>
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{member.name}</p>
                          <p className="text-sm text-gray-500">
                            Paid: ₹{parseFloat(member.total_paid).toFixed(2)} | Owes: ₹{parseFloat(member.total_owed).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {member.net_balance > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                              </svg>
                              <span className="text-xs font-medium text-green-700">Gets</span>
                            </div>
                            <span className="font-bold text-green-600 text-lg">₹{parseFloat(member.net_balance).toFixed(2)}</span>
                          </div>
                        ) : member.net_balance < 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 px-3 py-1 bg-red-100 rounded-full">
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                              </svg>
                              <span className="text-xs font-medium text-red-700">Owes</span>
                            </div>
                            <span className="font-bold text-red-600 text-lg">₹{Math.abs(parseFloat(member.net_balance)).toFixed(2)}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-xs font-medium text-gray-700">Settled</span>
                            </div>
                            <span className="font-bold text-gray-600 text-lg">₹0.00</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!balances && !loading && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-200 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">Enter a Group ID to view balances</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}