import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios.js';

const MarkdownRenderer = ({ content }) => {
  const formatMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/### (.*)/g, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
      .replace(/## (.*)/g, '<h2 class="text-xl font-semibold text-gray-800 mt-4 mb-2">$1</h2>')
      .replace(/# (.*)/g, '<h1 class="text-2xl font-bold text-gray-800 mt-4 mb-2">$1</h1>')
      .replace(/^\- (.*)/gm, '<li class="ml-4">$1</li>')
      .replace(/^\* (.*)/gm, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*)/gm, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br/>');
  };

  const formattedContent = formatMarkdown(content);
  const wrappedContent = `<p class="mb-3">${formattedContent}</p>`;

  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: wrappedContent }}
    />
  );
};

export default function Chatbot({ onLogout }) {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
    
    if (storedUserId) {
      setConversation([{
        type: 'assistant',
        content: 'Hi! I\'m your expense tracking assistant. I can help you with questions about your expenses, groups, spending patterns, and financial insights. What would you like to know?'
      }]);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim() || !userId) {
      return;
    }

    const userMessage = { type: 'user', content: query };
    const currentQuery = query;
    setConversation(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      
      const response = await axiosInstance.post('/chatbot/ask', {
        prompt: currentQuery,
        user_id: parseInt(userId)
      });
      
      
      const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received';
      
      setConversation(prev => [...prev, {
        type: 'assistant',
        content: aiResponse
      }]);
    } catch (error) {
      
      let errorMessage = 'Sorry, I encountered an error processing your request. Please try again.';
      
      if (error.response?.status === 404) {
        errorMessage = 'API endpoint not found. Please check if the backend is running correctly.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error occurred. Please check the backend logs.';
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please ensure the backend is running on the correct port.';
      }
      
      setConversation(prev => [...prev, {
        type: 'assistant',
        content: errorMessage
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    onLogout?.();
  };

  const suggestedQueries = [
    "What's my total spending this month?",
    "Show me my recent expenses",
    "Which groups am I part of?",
    "How much do I owe to others?",
    "What are my biggest expense categories?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 via-purple-400/5 to-pink-400/10 rounded-3xl"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Expense Assistant
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">Your personalized expense advisor</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto space-y-4">
              {conversation.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl rounded-br-md p-4'
                      : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 rounded-2xl rounded-bl-md p-4'
                  }`}>
                    {message.type === 'user' ? (
                      <p className="font-medium">{message.content}</p>
                    ) : (
                      <MarkdownRenderer content={message.content} />
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 rounded-2xl rounded-bl-md p-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-gray-600 font-medium">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {conversation.length === 1 && (
              <div className="px-6 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestedQueries.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(suggestion)}
                      className="text-left p-3 bg-white/50 hover:bg-white/70 backdrop-blur-sm border border-indigo-200 rounded-xl transition-all duration-200 hover:shadow-md text-sm text-gray-700 hover:text-indigo-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 border-t border-white/20">
              <form onSubmit={handleSubmit}>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask me about your expenses..."
                      className="w-full px-5 py-4 bg-white/70 backdrop-blur-sm border border-indigo-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 pr-12"
                      disabled={loading || !userId}
                    />
                    <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !query.trim() || !userId}
                    className="px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-2xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}