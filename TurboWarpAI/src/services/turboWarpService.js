/**
 * TurboWarp Service - Integration with TurboWarp runtime
 * 
 * This service provides a bridge between the React application and TurboWarp's
 * scratch-vm runtime, enabling project loading, execution, and manipulation.
 */

import { VirtualMachine } from 'scratch-vm';

class TurboWarpService {
  constructor() {
    this.vm = null;
    this.runtime = null;
    this.projectData = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the TurboWarp virtual machine
   */
  async initialize() {
    if (this.isInitialized) {
      return this.vm;
    }

    try {
      // Create new VM instance
      this.vm = new VirtualMachine();
      this.runtime = this.vm.runtime;

      // Configure runtime options for TurboWarp features
      this.runtime.setTurboMode(false);
      this.runtime.setFramerate(60);
      this.runtime.interpolation = true;

      // Setup event listeners
      this.setupEventListeners();

      this.isInitialized = true;
      console.log('TurboWarp VM initialized successfully');
      
      return this.vm;
    } catch (error) {
      console.error('Failed to initialize TurboWarp VM:', error);
      throw error;
    }
  }

  /**
   * Setup runtime event listeners
   */
  setupEventListeners() {
    this.vm.on('PROJECT_START', () => {
      console.log('Project started');
    });

    this.vm.on('PROJECT_RUN_START', () => {
      console.log('Project running');
    });

    this.vm.on('PROJECT_RUN_STOP', () => {
      console.log('Project stopped');
    });

    this.vm.on('TARGETS_UPDATE', () => {
      console.log('Targets updated');
    });

    this.vm.on('BLOCKS_NEED_UPDATE', () => {
      console.log('Blocks need update');
    });

    this.vm.on('COMPILE_ERROR', (target, error) => {
      console.error('Compile error:', target, error);
    });
  }

  /**
   * Load a Scratch project from JSON data
   * @param {Object} projectData - Scratch project JSON
   */
  async loadProject(projectData) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      this.projectData = projectData;
      await this.vm.loadProject(projectData);
      console.log('Project loaded successfully');
      return true;
    } catch (error) {
      console.error('Failed to load project:', error);
      throw error;
    }
  }

  /**
   * Start project execution
   */
  startProject() {
    if (!this.vm) {
      throw new Error('VM not initialized');
    }
    this.vm.greenFlag();
  }

  /**
   * Stop project execution
   */
  stopProject() {
    if (!this.vm) {
      throw new Error('VM not initialized');
    }
    this.vm.stopAll();
  }

  /**
   * Get current project data as JSON
   * @returns {Object} Project JSON data
   */
  exportProject() {
    if (!this.vm) {
      throw new Error('VM not initialized');
    }
    return this.vm.saveProjectSb3();
  }

  /**
   * Get runtime statistics
   * @returns {Object} Runtime stats
   */
  getRuntimeStats() {
    if (!this.runtime) {
      return null;
    }

    return {
      fps: this.runtime.currentFPS,
      stepTime: this.runtime.currentStepTime,
      targetCount: this.runtime.targets.length,
      blockCount: this.getBlockCount(),
      isRunning: this.runtime.threads.some(t => t.status === 1),
    };
  }

  /**
   * Count total blocks in project
   * @returns {number} Total block count
   */
  getBlockCount() {
    if (!this.runtime) {
      return 0;
    }

    let count = 0;
    for (const target of this.runtime.targets) {
      count += Object.keys(target.blocks._blocks).length;
    }
    return count;
  }

  /**
   * Get all targets (sprites, stage)
   * @returns {Array} List of targets
   */
  getTargets() {
    if (!this.runtime) {
      return [];
    }
    return this.runtime.targets.map(target => ({
      id: target.id,
      name: target.sprite.name,
      isStage: target.isStage,
      blockCount: Object.keys(target.blocks._blocks).length,
    }));
  }

  /**
   * Execute custom code in the runtime context
   * @param {Function} fn - Function to execute
   */
  executeInRuntime(fn) {
    if (!this.runtime) {
      throw new Error('Runtime not initialized');
    }
    return fn(this.runtime);
  }

  /**
   * Set turbo mode
   * @param {boolean} enabled - Enable/disable turbo mode
   */
  setTurboMode(enabled) {
    if (!this.runtime) {
      throw new Error('Runtime not initialized');
    }
    this.runtime.setTurboMode(enabled);
  }

  /**
   * Set framerate
   * @param {number} fps - Target framerate
   */
  setFramerate(fps) {
    if (!this.runtime) {
      throw new Error('Runtime not initialized');
    }
    this.runtime.setFramerate(fps);
  }

  /**
   * Clean up resources
   */
  dispose() {
    if (this.vm) {
      this.vm.dispose();
    }
    this.vm = null;
    this.runtime = null;
    this.projectData = null;
    this.isInitialized = false;
  }
}

// Singleton instance
const turboWarpService = new TurboWarpService();

export default turboWarpService;
export { TurboWarpService };
