/**
 * AI Service - Integration with AI models for code analysis and generation
 * 
 * This service provides AI-powered features including:
 * - Project analysis
 * - Block completion suggestions
 * - Natural language project generation
 * - Conversational project modification
 */

import axios from 'axios';

class AIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_AI_API_KEY || '';
    this.apiEndpoint = import.meta.env.VITE_AI_ENDPOINT || 'https://api.openai.com/v1';
    this.model = import.meta.env.VITE_AI_MODEL || 'gpt-4';
    this.conversationHistory = [];
  }

  /**
   * Configure AI service
   * @param {Object} config - Configuration object
   */
  configure(config) {
    if (config.apiKey) this.apiKey = config.apiKey;
    if (config.apiEndpoint) this.apiEndpoint = config.apiEndpoint;
    if (config.model) this.model = config.model;
  }

  /**
   * Analyze a Scratch project and provide insights
   * @param {Object} projectData - Scratch project JSON
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeProject(projectData) {
    try {
      const prompt = this.buildAnalysisPrompt(projectData);
      
      const response = await this.callAI(prompt, [
        {
          role: 'system',
          content: `You are an expert Scratch programming analyst. Analyze projects for:
- Code structure and organization
- Performance bottlenecks
- Best practices adherence
- Potential bugs or issues
- Optimization suggestions
- Educational value assessment

Provide structured JSON output with your analysis.`
        }
      ]);

      return this.parseAnalysisResponse(response);
    } catch (error) {
      console.error('Failed to analyze project:', error);
      throw error;
    }
  }

  /**
   * Suggest blocks based on current context
   * @param {Object} context - Current editor context
   * @returns {Promise<Array>} List of block suggestions
   */
  async suggestBlocks(context) {
    try {
      const prompt = this.buildCompletionPrompt(context);
      
      const response = await this.callAI(prompt, [
        {
          role: 'system',
          content: `You are a Scratch programming assistant. Suggest appropriate blocks based on context.
Consider:
- Current block category
- Common patterns in Scratch programming
- Age-appropriate complexity
- Best practices

Return suggestions as a JSON array of block objects with: opcode, fields, inputs, and explanation.`
        }
      ]);

      return this.parseBlockSuggestions(response);
    } catch (error) {
      console.error('Failed to get block suggestions:', error);
      throw error;
    }
  }

  /**
   * Generate a complete project from natural language description
   * @param {string} prompt - Natural language description
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Generated project data
   */
  async generateProject(prompt, options = {}) {
    try {
      const systemPrompt = `You are a Scratch project generator. Create complete, working Scratch projects based on user descriptions.

Guidelines:
- Create age-appropriate projects (target age: ${options.targetAge || 10})
- Include clear comments and organization
- Use best practices for Scratch programming
- Include sprites, backdrops, and sounds when appropriate
- Ensure the project is educational and fun

Output format: Return a valid Scratch 3.0 project JSON structure.`;

      const response = await this.callAI(
        `Create a Scratch project that: ${prompt}`,
        [{ role: 'system', content: systemPrompt }]
      );

      return this.parseGeneratedProject(response);
    } catch (error) {
      console.error('Failed to generate project:', error);
      throw error;
    }
  }

  /**
   * Modify an existing project based on natural language instructions
   * @param {Object} projectData - Current project JSON
   * @param {string} instruction - Modification instruction
   * @returns {Promise<Object>} Modified project data
   */
  async modifyProject(projectData, instruction) {
    try {
      const prompt = `Modify this Scratch project according to the following instruction:

Instruction: ${instruction}

Current project structure:
${JSON.stringify(projectData, null, 2).substring(0, 10000)}...

Provide the complete modified project as valid Scratch 3.0 JSON.`;

      const response = await this.callAI(prompt, [
        {
          role: 'system',
          content: `You are a Scratch project modifier. Make precise changes to existing projects while preserving their structure and functionality.
Always return complete, valid Scratch 3.0 project JSON.`
        }
      ]);

      return this.parseGeneratedProject(response);
    } catch (error) {
      console.error('Failed to modify project:', error);
      throw error;
    }
  }

  /**
   * Chat with AI about Scratch programming
   * @param {string} message - User message
   * @param {Object} context - Conversation context
   * @returns {Promise<string>} AI response
   */
  async chat(message, context = {}) {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: Date.now(),
      });

      // Keep conversation history manageable
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      const systemPrompt = `You are a friendly and knowledgeable Scratch programming assistant. Help users learn programming concepts, debug their projects, and create amazing games and animations.

Guidelines:
- Be encouraging and positive
- Explain concepts clearly and simply
- Provide concrete examples when helpful
- Adapt explanations to the user's skill level
- Focus on learning and creativity`;

      const response = await this.callAI(
        message,
        [
          { role: 'system', content: systemPrompt },
          ...this.conversationHistory,
        ],
        context
      );

      // Add AI response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      });

      return response;
    } catch (error) {
      console.error('Chat failed:', error);
      throw error;
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Call AI API
   * @param {string} prompt - User prompt
   * @param {Array} messages - Message history
   * @param {Object} options - Additional options
   * @returns {Promise<string>} AI response
   */
  async callAI(prompt, messages = [], options = {}) {
    if (!this.apiKey) {
      // Demo mode - return mock responses
      return this.getMockResponse(prompt);
    }

    try {
      const response = await axios.post(
        `${this.apiEndpoint}/chat/completions`,
        {
          model: options.model || this.model,
          messages: [...messages, { role: 'user', content: prompt }],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 4000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI API call failed:', error);
      throw error;
    }
  }

  /**
   * Build analysis prompt from project data
   * @param {Object} projectData - Project JSON
   * @returns {string} Formatted prompt
   */
  buildAnalysisPrompt(projectData) {
    const targets = projectData.targets || [];
    const totalBlocks = targets.reduce(
      (sum, target) => sum + Object.keys(target.blocks || {}).length,
      0
    );

    return `Analyze this Scratch project:

Project Info:
- Targets: ${targets.length}
- Total Blocks: ${totalBlocks}
- Name: ${projectData.meta?.name || 'Untitled'}

Targets:
${targets
  .map(
    t =>
      `- ${t.name} (${t.isStage ? 'Stage' : 'Sprite'}): ${Object.keys(t.blocks || {}).length} blocks`
  )
  .join('\n')}

Provide detailed analysis including:
1. Code quality assessment
2. Performance considerations
3. Suggestions for improvement
4. Educational value
5. Potential bugs or issues`;
  }

  /**
   * Build completion prompt from context
   * @param {Object} context - Editor context
   * @returns {string} Formatted prompt
   */
  buildCompletionPrompt(context) {
    const { currentBlock, selectedCategory, nearbyBlocks } = context;

    return `Suggest the next blocks for this Scratch program:

Current Context:
- Selected Category: ${selectedCategory || 'Any'}
- Current Block: ${currentBlock?.opcode || 'None'}
- Nearby Blocks: ${nearbyBlocks?.length || 0}

What blocks would be most appropriate to add next? Consider common patterns and best practices.`;
  }

  /**
   * Parse analysis response
   * @param {string} response - AI response
   * @returns {Object} Parsed analysis
   */
  parseAnalysisResponse(response) {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: create structured response from text
      return {
        summary: response,
        performanceScore: 75,
        qualityScore: 80,
        suggestions: ['Consider adding more comments', 'Optimize loop structures'],
        issues: [],
      };
    } catch {
      return {
        summary: response,
        performanceScore: 75,
        qualityScore: 80,
        suggestions: [],
        issues: [],
      };
    }
  }

  /**
   * Parse block suggestions
   * @param {string} response - AI response
   * @returns {Array} Block suggestions
   */
  parseBlockSuggestions(response) {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch {
      return [];
    }
  }

  /**
   * Parse generated project
   * @param {string} response - AI response
   * @returns {Object} Project data
   */
  parseGeneratedProject(response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Failed to parse generated project:', error);
      throw error;
    }
  }

  /**
   * Get mock response for demo mode
   * @param {string} prompt - User prompt
   * @returns {string} Mock response
   */
  getMockResponse(prompt) {
    return `[Demo Mode] This is a demo response. To enable full AI features, please configure your API key.

Your request: "${prompt.substring(0, 100)}..."

In demo mode, AI features are limited. Configure VITE_AI_API_KEY in your environment to enable full functionality.`;
  }
}

// Singleton instance
const aiService = new AIService();

export default aiService;
export { AIService };
