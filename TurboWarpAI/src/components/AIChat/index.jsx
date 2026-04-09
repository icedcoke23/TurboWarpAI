import React, { useState, useRef, useEffect } from 'react';
import { useAIChat } from '../../hooks/useAI';

/**
 * AI Chat Component - Conversational interface for AI assistance
 */
function AIChat() {
  const [input, setInput] = useState('');
  const { messages, isProcessing, error, sendMessage, clearChat } = useAIChat();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    try {
      await sendMessage(input);
      setInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleQuickAction = (action) => {
    setInput(action.text);
    inputRef.current?.focus();
  };

  const quickActions = [
    { icon: '📊', text: 'Analyze my project', label: 'Analyze' },
    { icon: '💡', text: 'Suggest improvements', label: 'Improve' },
    { icon: '🐛', text: 'Find bugs in my code', label: 'Debug' },
    { icon: '🎮', text: 'Help me create a game', label: 'Create' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-cyan-500">
        <h2 className="text-lg font-bold text-white flex items-center">
          <span className="mr-2">🤖</span>
          AI Assistant
        </h2>
        <p className="text-xs text-indigo-100 mt-1">
          Get help with your Scratch projects
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Hello! I'm your AI assistant
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              I can help you create, analyze, and improve your Scratch projects
            </p>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all text-left"
                >
                  <span className="text-xl">{action.icon}</span>
                  <p className="text-xs text-gray-600 mt-1">{action.label}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-indigo-200' : 'text-gray-400'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about Scratch..."
            className="flex-1 input"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? '⏳' : '➤'}
          </button>
        </div>
        
        {/* Clear Chat Button */}
        {messages.length > 0 && (
          <button
            type="button"
            onClick={clearChat}
            className="mt-2 text-xs text-gray-500 hover:text-gray-700"
          >
            🗑️ Clear conversation
          </button>
        )}
      </form>
    </div>
  );
}

export default AIChat;
