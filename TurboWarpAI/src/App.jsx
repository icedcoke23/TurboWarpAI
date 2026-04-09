import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Editor from './components/Editor';
import AIChat from './components/AIChat';
import AnalysisPanel from './components/AnalysisPanel';
import useProjectStore from './store/projectStore';
import turboWarpService from './services/turboWarpService';

function App() {
  const [showAIChat, setShowAIChat] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { currentProject, setProject } = useProjectStore();

  // Initialize TurboWarp on mount
  useEffect(() => {
    const initTurboWarp = async () => {
      try {
        await turboWarpService.initialize();
        console.log('TurboWarp initialized');
      } catch (error) {
        console.error('Failed to initialize TurboWarp:', error);
      }
    };

    initTurboWarp();

    return () => {
      turboWarpService.dispose();
    };
  }, []);

  const handleLoadProject = (projectData) => {
    setProject(projectData);
    turboWarpService.loadProject(projectData);
  };

  const toggleAIChat = () => {
    setShowAIChat(!showAIChat);
  };

  const toggleAnalysis = () => {
    setShowAnalysis(!showAnalysis);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header 
        onToggleAI={toggleAIChat}
        onToggleAnalysis={toggleAnalysis}
        showAI={showAIChat}
        showAnalysis={showAnalysis}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main Editor Area */}
        <main className="flex-1 flex overflow-hidden">
          <Editor 
            project={currentProject}
            onLoadProject={handleLoadProject}
          />
          
          {/* Analysis Panel */}
          {showAnalysis && (
            <aside className="w-96 border-l border-gray-200 bg-white overflow-y-auto animate-slide-up">
              <AnalysisPanel />
            </aside>
          )}
        </main>
        
        {/* AI Chat Sidebar */}
        {showAIChat && (
          <aside className="w-96 border-l border-gray-200 bg-white overflow-hidden animate-slide-up">
            <AIChat />
          </aside>
        )}
      </div>
    </div>
  );
}

export default App;
