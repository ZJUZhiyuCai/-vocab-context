/**
 * AI Agent - 智能词汇学习助手
 * 提供对话式学习体验，帮助用户深入理解单词
 * - 词汇深度解析（词源、同义词、反义词、搭配）
 * - 个性化学习策略
 * - 单词关联网络
 * - 记忆技巧
 * - 对话式问答
 */

import { loadAISettings } from './aiService.js';
import { createAIChatCompletion, getCompletionText, resolveApiKey } from './aiClient.js';
import logger from './logger.js';

// localStorage keys
const CONVERSATION_KEY = 'vocabcontext_agent_conversations';
const AGENT_SETTINGS_KEY = 'vocabcontext_agent_settings';

/**
 * 对话角色枚举
 */
export const MessageRole = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system'
};

/**
 * Agent 能力类型
 */
export const AgentCapability = {
  WORD_ANALYSIS: 'word_analysis',           // 单词深度分析
  ETYMOLOGY: 'etymology',                   // 词源解析
  SYNONYMS: 'synonyms',                     // 同义词辨析
  ANTONYMS: 'antonyms',                     // 反义词
  COLLOCATIONS: 'collocations',             // 词语搭配
  MEMORY_HOOKS: 'memory_hooks',             // 记忆技巧
  USAGE_EXAMPLES: 'usage_examples',         // 用法示例
  LEARNING_STRATEGY: 'learning_strategy',   // 学习策略
  QUIZ_PRACTICE: 'quiz_practice',           // 测验练习
  CONTEXT_EXPLANATION: 'context_explanation'// 语境解释
};

/**
 * Agent 默认设置
 */
const DEFAULT_AGENT_SETTINGS = {
  personality: 'friendly',          // 性格：friendly(友好), professional(专业), encouraging(鼓励)
  responseLength: 'medium',         // 回复长度：short, medium, detailed
  focusAreas: ['all'],              // 重点关注领域
  language: 'zh-CN',                // 交互语言
  enableMemory: true                // 是否启用对话记忆
};

/**
 * AI Agent 服务类
 */
export class AIAgent {
  constructor() {
    this.settings = this.loadSettings();
    this.conversations = this.loadConversations();
    this.currentConversationId = null;
    this.apiSettings = loadAISettings();
  }

  reloadApiSettings() {
    this.apiSettings = loadAISettings();
  }

  /**
   * 加载 Agent 设置
   * @private
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem(AGENT_SETTINGS_KEY);
      if (saved) {
        return { ...DEFAULT_AGENT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (error) {
      logger.error('加载Agent设置失败:', error);
    }
    return { ...DEFAULT_AGENT_SETTINGS };
  }

  /**
   * 保存 Agent 设置
   * @private
   */
  saveSettings() {
    try {
      localStorage.setItem(AGENT_SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (error) {
      logger.error('保存Agent设置失败:', error);
    }
  }

  /**
   * 加载对话历史
   * @private
   */
  loadConversations() {
    try {
      const saved = localStorage.getItem(CONVERSATION_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      logger.error('加载对话历史失败:', error);
    }
    return {};
  }

  /**
   * 保存对话历史
   * @private
   */
  saveConversations() {
    try {
      // 限制保存的对话数量，最多保留最近10个对话
      const entries = Object.entries(this.conversations);
      if (entries.length > 10) {
        entries.sort((a, b) => b[1].updatedAt - a[1].updatedAt);
        this.conversations = Object.fromEntries(entries.slice(0, 10));
      }
      localStorage.setItem(CONVERSATION_KEY, JSON.stringify(this.conversations));
    } catch (error) {
      logger.error('保存对话历史失败:', error);
    }
  }

  /**
   * 获取清理后的 API key
   * @private
   */
  getCleanedApiKey() {
    this.reloadApiSettings();
    return resolveApiKey(this.apiSettings.apiKey);
  }

  /**
   * 检查是否可用
   * @returns {boolean}
   */
  isAvailable() {
    // Always return true - the proxy server may have SILICONFLOW_API_KEY
    // configured as an environment variable, so AI may work even without
    // a user-provided key. The actual availability is determined when
    // the request is made.
    return true;
  }

  /**
   * 更新设置
   * @param {Object} newSettings - 新设置
   */
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  /**
   * 创建新对话
   * @param {string} title - 对话标题
   * @returns {string} 对话ID
   */
  createConversation(title = '新对话') {
    const conversationId = Date.now().toString();
    this.conversations[conversationId] = {
      id: conversationId,
      title,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.currentConversationId = conversationId;
    this.saveConversations();
    return conversationId;
  }

  /**
   * 切换对话
   * @param {string} conversationId - 对话ID
   */
  switchConversation(conversationId) {
    if (this.conversations[conversationId]) {
      this.currentConversationId = conversationId;
    }
  }

  /**
   * 获取当前对话
   * @returns {Object|null}
   */
  getCurrentConversation() {
    if (!this.currentConversationId) {
      return null;
    }
    return this.conversations[this.currentConversationId] || null;
  }

  /**
   * 获取所有对话列表
   * @returns {Array}
   */
  getConversationList() {
    return Object.values(this.conversations)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  /**
   * 删除对话
   * @param {string} conversationId - 对话ID
   */
  deleteConversation(conversationId) {
    delete this.conversations[conversationId];
    if (this.currentConversationId === conversationId) {
      this.currentConversationId = null;
    }
    this.saveConversations();
  }

  /**
   * 清空所有对话
   */
  clearAllConversations() {
    this.conversations = {};
    this.currentConversationId = null;
    this.saveConversations();
  }

  /**
   * 分析单词（深度解析）
   * @param {string} word - 单词
   * @param {Object} context - 上下文信息
   * @returns {Promise<Object>}
   */
  async analyzeWord(word, context = {}) {
    if (!this.isAvailable()) {
      throw new Error('请先配置API密钥');
    }

    const prompt = this.buildWordAnalysisPrompt(word, context);

    const response = await this.callAI(prompt, {
      temperature: 0.7,
      maxTokens: 1500
    });

    return this.parseAnalysisResponse(response, word);
  }

  /**
   * 构建单词分析提示词
   * @private
   */
  buildWordAnalysisPrompt(word, context) {
    const personality = this.getPersonalityPrompt();

    return `${personality}

请对英语单词 "${word}" 进行深度分析，帮助用户全面理解这个词。

${context.meaning ? `【单词释义】${context.meaning}` : ''}
${context.example ? `【例句】${context.example}` : ''}

请提供以下信息（以JSON格式返回）：
{
  "word": "${word}",
  "phonetic": "音标（国际音标）",
  "pos": "词性（noun/verb/adjective等）",
  "definition": "简明的英英释义（2-3个主要含义）",
  "etymology": {
    "origin": "词源起源（拉丁语/希腊语/古英语等）",
    "evolution": "词义演变过程",
    "interesting_fact": "有趣的词源故事"
  },
  "synonyms": [
    {"word": "同义词", "nuance": "细微区别说明"}
  ],
  "antonyms": ["反义词1", "反义词2"],
  "collocations": [
    {"phrase": "搭配短语", "meaning": "含义", "example": "例句"}
  ],
  "usage_notes": [
    "使用注意点1",
    "使用注意点2"
  ],
  "memory_hook": "记忆技巧（助记方法）",
  "common_mistakes": ["常见错误1", "常见错误2"]
}

只返回JSON，不要其他内容。`;
  }

  /**
   * 解析分析响应
   * @private
   */
  parseAnalysisResponse(response) {
    try {
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) ||
                        response.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('无法解析AI响应');
      }

      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } catch (error) {
      logger.error('解析单词分析响应失败:', error);
      throw new Error(`解析单词分析响应失败: ${error.message}`, { cause: error });
    }
  }

  /**
   * 生成学习策略
   * @param {Object} stats - 学习统计
   * @param {Array} weakWords - 薄弱单词列表
   * @returns {Promise<Object>}
   */
  async generateLearningStrategy(stats, weakWords = []) {
    if (!this.isAvailable()) {
      throw new Error('请先配置API密钥');
    }

    const personality = this.getPersonalityPrompt();

    const prompt = `${personality}

根据以下学习数据，为用户制定个性化的词汇学习策略。

【学习统计】
- 已学单词：${stats.learned || 0}
- 掌握单词：${stats.mastered || 0}
- 薄弱单词：${stats.weak || 0}
- 学习天数：${stats.days || 0}

【薄弱单词】
${weakWords.slice(0, 10).map(w => `- ${w.word}: ${w.meaning}`).join('\n')}

请提供学习策略建议（以JSON格式返回）：
{
  "overall_assessment": "整体学习状况评估",
  "priorities": ["优先级1", "优先级2"],
  "daily_plan": {
    "new_words": "每日新词建议数量",
    "review_words": "每日复习建议数量",
    "focus_areas": ["重点关注领域"]
  },
  "study_tips": [
    "学习建议1",
    "学习建议2"
  ],
  "resources": ["推荐资源1", "推荐资源2"],
  "encouragement": "鼓励话语"
}

只返回JSON，不要其他内容。`;

    const response = await this.callAI(prompt, {
      temperature: 0.8,
      maxTokens: 1200
    });

    return this.parseJSONResponse(response);
  }

  /**
   * 解释单词在特定语境中的用法
   * @param {string} word - 单词
   * @param {string} context - 语境
   * @param {string} fullSentence - 完整句子
   * @returns {Promise<Object>}
   */
  async explainInContext(word, context, fullSentence) {
    if (!this.isAvailable()) {
      throw new Error('请先配置API密钥');
    }

    const personality = this.getPersonalityPrompt();

    const prompt = `${personality}

用户在阅读中遇到了单词 "${word}"，需要你帮助理解其在具体语境中的含义和用法。

【语境】${context}
【完整句子】${fullSentence}

请提供详细解释（以JSON格式返回）：
{
  "word": "${word}",
  "context_meaning": "在该语境中的具体含义",
  "why_this_meaning": "为什么在这里是这个意思",
  "alternative_words": ["可以替换的词语"],
  "tone": "这个词语的语气色彩（正式/非正式/褒义/贬义）",
  "explanation": "详细的用法解释",
  "similar_examples": [
    {"sentence": "类似用法的例句1", "translation": "翻译"},
    {"sentence": "类似用法的例句2", "translation": "翻译"}
  ]
}

只返回JSON，不要其他内容。`;

    const response = await this.callAI(prompt, {
      temperature: 0.7,
      maxTokens: 1000
    });

    return this.parseJSONResponse(response);
  }

  /**
   * 对话式交互
   * @param {string} userMessage - 用户消息
   * @param {string} conversationId - 对话ID（可选）
   * @returns {Promise<string>} AI回复
   */
  async chat(userMessage, conversationId = null) {
    if (!this.isAvailable()) {
      throw new Error('请先配置API密钥');
    }

    // 使用指定对话或当前对话
    const convId = conversationId || this.currentConversationId;
    if (!convId || !this.conversations[convId]) {
      // 创建新对话
      const newConvId = this.createConversation(`关于 ${userMessage.slice(0, 20)}...`);
      this.currentConversationId = newConvId;
    }

    const conversation = this.conversations[this.currentConversationId];

    // 添加用户消息
    conversation.messages.push({
      role: MessageRole.USER,
      content: userMessage,
      timestamp: Date.now()
    });

    // 构建对话历史（最近的20条消息）
    const recentMessages = conversation.messages.slice(-20);

    // 构建系统提示
    const systemPrompt = this.buildSystemPrompt();

    // 调用AI
    const messages = [
      { role: MessageRole.SYSTEM, content: systemPrompt },
      ...recentMessages.map(m => ({
        role: m.role,
        content: m.content
      }))
    ];

    const response = await this.callAIChat(messages, {
      temperature: 0.8,
      maxTokens: 1000
    });

    // 添加AI回复
    conversation.messages.push({
      role: MessageRole.ASSISTANT,
      content: response,
      timestamp: Date.now()
    });

    conversation.updatedAt = Date.now();
    this.saveConversations();

    return response;
  }

  /**
   * 构建系统提示词
   * @private
   */
  buildSystemPrompt() {
    const personality = this.getPersonalityPrompt();
    const lengthConfig = this.getResponseLengthConfig();

    return `${personality}

你是一个专业的英语词汇学习助手，帮助用户深入理解和掌握英语单词。

【你的能力】
1. 解释单词的含义、用法、搭配
2. 提供词源分析、同义词、反义词
3. 给出记忆技巧和学习建议
4. 回答用户的词汇相关问题
5. 帮助用户制定学习计划

【回复风格】
- ${lengthConfig}
- 用中文交流，必要时用英文举例
- 提供具体、实用的建议
- 适当鼓励用户，保持积极态度

【注意事项】
- 回答要准确、专业
- 如果不确定，诚实告知
- 优先考虑用户的实际学习需求`;
  }

  /**
   * 获取性格提示词
   * @private
   */
  getPersonalityPrompt() {
    const personalities = {
      friendly: '你是一个友好的英语学习伙伴，用轻松愉快的方式帮助用户学习。',
      professional: '你是一个专业的英语词汇导师，提供准确、系统的学习指导。',
      encouraging: '你是一个充满热情的学习教练，总是鼓励用户，帮助建立学习信心。'
    };
    return personalities[this.settings.personality] || personalities.friendly;
  }

  /**
   * 获取回复长度配置
   * @private
   */
  getResponseLengthConfig() {
    const configs = {
      short: '回复要简洁明了，直击要点',
      medium: '回复要适中，既详细又不过于冗长',
      detailed: '回复要详细全面，深入解释各个方面'
    };
    return configs[this.settings.responseLength] || configs.medium;
  }

  /**
   * 调用AI API（基础方法）
   * @private
   */
  async callAI(prompt, options = {}) {
    const data = await createAIChatCompletion({
      apiKey: this.getCleanedApiKey(),
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: options.temperature || 0.7,
      maxTokens: options.maxTokens || 1000,
      topP: options.topP || 0.7
    });

    return getCompletionText(data);
  }

  /**
   * 调用AI API（对话模式）
   * @private
   */
  async callAIChat(messages, options = {}) {
    const data = await createAIChatCompletion({
      apiKey: this.getCleanedApiKey(),
      messages,
      temperature: options.temperature || 0.7,
      maxTokens: options.maxTokens || 1000,
      topP: options.topP || 0.7
    });

    return getCompletionText(data);
  }

  /**
   * 解析JSON响应
   * @private
   */
  parseJSONResponse(response) {
    try {
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) ||
                        response.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('无法解析AI响应');
      }

      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } catch (error) {
      logger.error('解析JSON响应失败:', error);
      throw new Error(`解析JSON响应失败: ${error.message}`, { cause: error });
    }
  }

  /**
   * 获取设置
   * @returns {Object}
   */
  getSettings() {
    return { ...this.settings };
  }

  /**
   * 获取对话历史统计
   * @returns {Object}
   */
  getConversationStats() {
    const list = this.getConversationList();
    const totalMessages = list.reduce((sum, conv) => sum + conv.messages.length, 0);

    return {
      totalConversations: list.length,
      totalMessages,
      latestConversation: list[0] || null
    };
  }
}

// ==================== 单例模式 ====================

let agentInstance = null;

/**
 * 获取 AI Agent 实例
 * @returns {AIAgent}
 */
export function getAIAgent() {
  if (!agentInstance) {
    agentInstance = new AIAgent();
  }
  return agentInstance;
}

/**
 * 重置 AI Agent（用于测试）
 * @returns {AIAgent}
 */
export function resetAIAgent() {
  agentInstance = null;
  return getAIAgent();
}

/**
 * 快捷方法：分析单词
 * @param {string} word - 单词
 * @param {Object} context - 上下文
 */
export async function analyzeWord(word, context) {
  return getAIAgent().analyzeWord(word, context);
}

/**
 * 快捷方法：生成学习策略
 * @param {Object} stats - 统计数据
 * @param {Array} weakWords - 薄弱单词
 */
export async function generateStrategy(stats, weakWords) {
  return getAIAgent().generateLearningStrategy(stats, weakWords);
}

/**
 * 快捷方法：解释语境
 * @param {string} word - 单词
 * @param {string} context - 语境
 * @param {string} sentence - 句子
 */
export async function explainContext(word, context, sentence) {
  return getAIAgent().explainInContext(word, context, sentence);
}
