import React, { useState } from 'react';

/**
 * Editor Component - Main Scratch block editor area
 */
function Editor({ project, onLoadProject }) {
  const [activeTab, setActiveTab] = useState('code');

  // Sample project data for demo
  const sampleProject = {
    targets: [
      {
        isStage: true,
        name: 'Stage',
        variables: {},
        lists: {},
        broadcasts: {},
        blocks: {},
        costumes: [],
        sounds: [],
        volume: 100,
        layerOrder: 0,
      },
    ],
    meta: {
      semver: '3.0.0',
      vm: '0.2.0',
      agent: 'Mozilla/5.0',
    },
  };

  const handleLoadSample = () => {
    onLoadProject(sampleProject);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Editor Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center space-x-2">
        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'code'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          💻 Code
        </button>
        <button
          onClick={() => setActiveTab('costumes')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'costumes'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          🎨 Costumes
        </button>
        <button
          onClick={() => setActiveTab('sounds')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'sounds'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          🔊 Sounds
        </button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Block Palette */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Block Palette</h3>
          <div className="space-y-2">
            <div className="p-3 bg-blue-100 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors">
              <span className="text-blue-800 text-sm font-medium">Motion</span>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg cursor-pointer hover:bg-purple-200 transition-colors">
              <span className="text-purple-800 text-sm font-medium">Looks</span>
            </div>
            <div className="p-3 bg-pink-100 rounded-lg cursor-pointer hover:bg-pink-200 transition-colors">
              <span className="text-pink-800 text-sm font-medium">Sound</span>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg cursor-pointer hover:bg-yellow-200 transition-colors">
              <span className="text-yellow-800 text-sm font-medium">Events</span>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg cursor-pointer hover:bg-orange-200 transition-colors">
              <span className="text-orange-800 text-sm font-medium">Control</span>
            </div>
            <div className="p-3 bg-green-100 rounded-lg cursor-pointer hover:bg-green-200 transition-colors">
              <span className="text-green-800 text-sm font-medium">Sensing</span>
            </div>
            <div className="p-3 bg-teal-100 rounded-lg cursor-pointer hover:bg-teal-200 transition-colors">
              <span className="text-teal-800 text-sm font-medium">Operators</span>
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 p-4 overflow-auto">
          {project ? (
            <div className="bg-white rounded-xl shadow-md p-6 h-full">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Project: {project.meta?.name || 'Untitled'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Targets</p>
                  <p className="text-2xl font-bold text-gray-900">{project.targets?.length || 0}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Blocks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {project.targets?.reduce((sum, t) => sum + Object.keys(t.blocks || {}).length, 0) || 0}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📁</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Project Loaded</h3>
                <p className="text-gray-500 mb-4">Load a Scratch project or create a new one</p>
                <button
                  onClick={handleLoadSample}
                  className="btn btn-primary"
                >
                  Load Sample Project
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stage Preview */}
        <div className="w-80 bg-white border-l border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Stage Preview</h3>
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <span className="text-4xl">🎭</span>
              <p className="mt-2 text-sm">Stage Preview</p>
            </div>
          </div>
          
          {/* Sprite List */}
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-gray-600 mb-2">Sprites</h4>
            <div className="space-y-2">
              {project?.targets?.filter(t => !t.isStage).map(target => (
                <div key={target.id} className="p-2 bg-gray-50 rounded-lg flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <span className="text-sm text-gray-700">{target.name}</span>
                </div>
              )) || (
                <div className="p-2 bg-gray-50 rounded-lg text-sm text-gray-500">
                  No sprites yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;
