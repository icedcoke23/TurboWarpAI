import { create } from 'zustand';

/**
 * AI Store - Manage AI conversation and feature state
 */
const useAIStore = create((set, get) => ({
  // State
  conversations: [],
  currentConversationId: null,
  isProcessing: false,
  error: null,
  
  // Analysis results
  analysisResults: null,
  blockSuggestions: [],
  
  // Settings
  aiEnabled: true,
  autoAnalyze: false,
  
  // Actions
  addMessage: (conversationId, message) => set((state) => {
    const conversations = state.conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          updatedAt: new Date(),
        };
      }
      return conv;
    });
    
    return { conversations };
  }),
  
  startConversation: () => {
    const newConversation = {
      id: Date.now().toString(),
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      conversations: [...state.conversations, newConversation],
      currentConversationId: newConversation.id,
    }));
    
    return newConversation.id;
  },
  
  endConversation: (conversationId) => set((state) => ({
    conversations: state.conversations.filter(c => c.id !== conversationId),
    currentConversationId: state.currentConversationId === conversationId 
      ? null 
      : state.currentConversationId,
  })),
  
  setCurrentConversation: (id) => set({ currentConversationId: id }),
  
  setProcessing: (processing) => set({ isProcessing: processing }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  setAnalysisResults: (results) => set({ analysisResults: results }),
  
  clearAnalysisResults: () => set({ analysisResults: null }),
  
  setBlockSuggestions: (suggestions) => set({ blockSuggestions: suggestions }),
  
  clearBlockSuggestions: () => set({ blockSuggestions: [] }),
  
  toggleAI: () => set((state) => ({ aiEnabled: !state.aiEnabled })),
  
  toggleAutoAnalyze: () => set((state) => ({ autoAnalyze: !state.autoAnalyze })),
  
  clearAllConversations: () => set({
    conversations: [],
    currentConversationId: null,
  }),
  
  // Selectors
  getCurrentConversation: () => {
    const { conversations, currentConversationId } = get();
    return conversations.find(c => c.id === currentConversationId) || null;
  },
  
  getMessageCount: () => {
    const { conversations, currentConversationId } = get();
    const conversation = conversations.find(c => c.id === currentConversationId);
    return conversation ? conversation.messages.length : 0;
  },
}));

export default useAIStore;
