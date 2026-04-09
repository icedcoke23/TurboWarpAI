import { create } from 'zustand';

/**
 * Project Store - Manage project state
 */
const useProjectStore = create((set, get) => ({
  // State
  currentProject: null,
  projectName: 'Untitled',
  isDirty: false,
  isLoading: false,
  error: null,
  
  // Metadata
  lastSaved: null,
  version: 1,
  
  // Actions
  setProject: (projectData) => set({ 
    currentProject: projectData,
    projectName: projectData?.meta?.name || 'Untitled',
    isDirty: false,
    lastSaved: new Date(),
  }),
  
  updateProject: (updates) => set((state) => ({
    currentProject: { ...state.currentProject, ...updates },
    isDirty: true,
  })),
  
  setProjectName: (name) => set({ 
    projectName: name,
    isDirty: true,
  }),
  
  markAsDirty: () => set({ isDirty: true }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  reset: () => set({
    currentProject: null,
    projectName: 'Untitled',
    isDirty: false,
    isLoading: false,
    error: null,
    lastSaved: null,
    version: 1,
  }),
  
  // Selectors
  getBlockCount: () => {
    const { currentProject } = get();
    if (!currentProject || !currentProject.targets) return 0;
    
    return currentProject.targets.reduce(
      (sum, target) => sum + Object.keys(target.blocks || {}).length,
      0
    );
  },
  
  getTargetCount: () => {
    const { currentProject } = get();
    if (!currentProject || !currentProject.targets) return 0;
    return currentProject.targets.length;
  },
}));

export default useProjectStore;
