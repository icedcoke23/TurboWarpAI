import { useState, useCallback } from 'react';
import aiService from '../services/aiService';

/**
 * Hook for AI chat functionality
 */
export function useAIChat() {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return;

    setIsProcessing(true);
    setError(null);

    // Add user message to display
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Get AI response
      const response = await aiService.chat(content);
      
      // Add AI response to display
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    aiService.clearHistory();
  }, []);

  return {
    messages,
    isProcessing,
    error,
    sendMessage,
    clearChat,
  };
}

/**
 * Hook for project analysis
 */
export function useAnalyzer() {
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const analyzeProject = useCallback(async (projectData) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await aiService.analyzeProject(projectData);
      setResults(analysis);
      return analysis;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    results,
    isAnalyzing,
    error,
    analyzeProject,
    clearResults,
  };
}

/**
 * Hook for block completion suggestions
 */
export function useCompletion() {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const suggestBlocks = useCallback(async (context) => {
    setIsLoading(true);
    setError(null);

    try {
      const blockSuggestions = await aiService.suggestBlocks(context);
      setSuggestions(blockSuggestions);
      return blockSuggestions;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acceptSuggestion = useCallback((suggestion) => {
    // Implementation depends on editor integration
    console.log('Accepting suggestion:', suggestion);
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    suggestBlocks,
    acceptSuggestion,
    clearSuggestions,
  };
}

/**
 * Hook for AI-powered project generation
 */
export function useProjectGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState(null);
  const [error, setError] = useState(null);

  const generateProject = useCallback(async (prompt, options = {}) => {
    setIsGenerating(true);
    setError(null);

    try {
      const project = await aiService.generateProject(prompt, options);
      setGeneratedProject(project);
      return project;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearGenerated = useCallback(() => {
    setGeneratedProject(null);
    setError(null);
  }, []);

  return {
    generatedProject,
    isGenerating,
    error,
    generateProject,
    clearGenerated,
  };
}

/**
 * Hook for AI-powered project modification
 */
export function useProjectModifier() {
  const [isModifying, setIsModifying] = useState(false);
  const [error, setError] = useState(null);

  const modifyProject = useCallback(async (projectData, instruction) => {
    setIsModifying(true);
    setError(null);

    try {
      const modifiedProject = await aiService.modifyProject(projectData, instruction);
      return modifiedProject;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsModifying(false);
    }
  }, []);

  return {
    isModifying,
    error,
    modifyProject,
  };
}
