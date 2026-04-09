import React from 'react';

/**
 * Header Component - Main navigation and controls
 */
function Header({ onToggleAI, onToggleAnalysis, showAI, showAnalysis }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TurboWarpAI</h1>
            <p className="text-xs text-gray-500">AI-Powered Scratch Development</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="ml-8 flex space-x-1">
          <button className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
            Editor
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Projects
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Extensions
          </button>
        </nav>
      </div>
      
      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Analysis Toggle */}
        <button
          onClick={onToggleAnalysis}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            showAnalysis
              ? 'bg-cyan-100 text-cyan-700 border-2 border-cyan-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📊 Analysis
        </button>
        
        {/* AI Chat Toggle */}
        <button
          onClick={onToggleAI}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            showAI
              ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🤖 AI Assistant
        </button>
        
        {/* Run/Stop Buttons */}
        <div className="ml-4 flex items-center space-x-2">
          <button className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white shadow-md transition-colors" title="Start">
            ▶
          </button>
          <button className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-md transition-colors" title="Stop">
            ⏹
          </button>
        </div>
        
        {/* User Menu */}
        <div className="ml-4 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 cursor-pointer hover:bg-gray-300 transition-colors">
          👤
        </div>
      </div>
    </header>
  );
}

export default Header;
