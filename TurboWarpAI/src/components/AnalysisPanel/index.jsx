import React, { useState } from 'react';
import { useAnalyzer } from '../../hooks/useAI';
import useProjectStore from '../../store/projectStore';

/**
 * Analysis Panel Component - Display project analysis results
 */
function AnalysisPanel() {
  const { currentProject } = useProjectStore();
  const { results, isAnalyzing, error, analyzeProject, clearResults } = useAnalyzer();
  const [activeTab, setActiveTab] = useState('overview');

  const handleAnalyze = async () => {
    if (!currentProject) return;
    
    try {
      await analyzeProject(currentProject);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'suggestions', label: 'Suggestions', icon: '💡' },
    { id: 'issues', label: 'Issues', icon: '⚠️' },
  ];

  if (!currentProject) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📁</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Project Loaded</h3>
        <p className="text-sm text-gray-500">Load a project to analyze it</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-cyan-500 to-blue-500">
        <h2 className="text-lg font-bold text-white flex items-center">
          <span className="mr-2">📊</span>
          Project Analysis
        </h2>
        <p className="text-xs text-cyan-100 mt-1">
          AI-powered insights and recommendations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {!results && !isAnalyzing && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Ready to Analyze
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Get AI-powered insights about your project
            </p>
            <button
              onClick={handleAnalyze}
              className="btn btn-secondary"
            >
              🔍 Start Analysis
            </button>
          </div>
        )}

        {isAnalyzing && (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            </div>
            <p className="text-center text-sm text-gray-600">
              Analyzing your project...
            </p>
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded-full animate-pulse" style={{ width: '80%' }}></div>
              <div className="h-2 bg-gray-200 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
            ⚠️ Analysis failed: {error}
          </div>
        )}

        {results && (
          <div className="space-y-4">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-green-600 font-medium">Quality Score</p>
                    <p className="text-2xl font-bold text-green-700">{results.qualityScore || 80}/100</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-600 font-medium">Performance</p>
                    <p className="text-2xl font-bold text-blue-700">{results.performanceScore || 75}/100</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Summary</h3>
                  <p className="text-sm text-gray-600">
                    {results.summary || 'Your project looks good! Here are some suggestions for improvement...'}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Project Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Targets:</span>
                      <span className="font-medium">{currentProject.targets?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blocks:</span>
                      <span className="font-medium">
                        {currentProject.targets?.reduce((sum, t) => sum + Object.keys(t.blocks || {}).length, 0) || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-1">⚡ Optimization Tips</h4>
                  <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
                    <li>Consider using clones for repeated sprites</li>
                    <li>Minimize broadcast usage in tight loops</li>
                    <li>Use variables instead of repeated calculations</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div className="space-y-3">
                {(results.suggestions || ['Add more comments to explain complex logic', 'Consider breaking large scripts into smaller functions']).map((suggestion, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">💡 {suggestion}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'issues' && (
              <div className="space-y-3">
                {(results.issues || []).length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    ✅ No issues detected!
                  </div>
                ) : (
                  results.issues.map((issue, index) => (
                    <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800">⚠️ {issue}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={clearResults}
                className="w-full btn btn-outline text-sm"
              >
                🔄 New Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalysisPanel;
