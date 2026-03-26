/**
 * AI服务工具
 * 封装 AI API 调用，提供多种AI功能
 * - AI个性化例句生成
 * - AI智能测验生成
 * - AI错题分析与学习建议
 * - AI词汇关联记忆
 */

import { generateQuiz, generateFillBlankQuestion } from './aiQuizGenerator.js';
import { analyzeErrors, analyzeWordError, generateStudyPlan } from './aiErrorAnalyzer.js';
import { generateMemoryHooks, generateWordNetwork, generateScenarioExamples, generateLearningPath } from './aiMemoryHooks.js';
import { createAIChatCompletion, resolveApiKey } from './aiClient.js';

// localStorage keys
const CACHE_KEY_PREFIX = 'vocabcontext_ai_';
const CACHE_VERSION = 'v1';
const SETTINGS_KEY = 'vocabcontext_settings'; // 与主设置文件保持一致
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时缓存

/**
 * 生成AI例句（带缓存）
 * @param {Object} options - 配置选项
 * @param {string} options.apiKey - API密钥
 * @param {string} options.word - 目标单词
 * @param {string} options.meaning - 单词释义
 * @param {string} options.purpose - 学习目的
 * @returns {Promise<{sentence: string, translation: string}>} AI生成的例句
 */
export async function generateAIExample({ apiKey, word, meaning, purpose }) {
  const cleanedApiKey = resolveApiKey(apiKey);

  // 检查缓存
  const cacheKey = getCacheKey(word, purpose);
  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log(`✅ 使用缓存的AI例句: ${word}`);
    return cached;
  }

  // 调用API生成
  const result = await generateAIExampleWithoutCache({ apiKey: cleanedApiKey, word, meaning, purpose });

  // 存入缓存
  saveToCache(cacheKey, { ...result, purpose, generatedAt: Date.now() });

  return result;
}

/**
 * 获取缓存键
 * @param {string} word - 单词
 * @param {string} purpose - 学习目的
 * @returns {string} 缓存键
 */
function getCacheKey(word, purpose) {
  return `${CACHE_KEY_PREFIX}${CACHE_VERSION}_${word}_${purpose || 'daily'}`;
}

/**
 * 从缓存获取
 * @param {string} key - 缓存键
 * @returns {Object|null} 缓存的数据
 */
function getFromCache(key) {
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const data = JSON.parse(cached);

      // 检查是否过期（30天）
      const age = Date.now() - (data.generatedAt || 0);
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30天

      if (age < maxAge) {
        return {
          sentence: data.sentence,
          translation: data.translation
        };
      } else {
        // 过期，删除缓存
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('读取缓存失败:', error);
  }
  return null;
}

/**
 * 保存到缓存
 * @param {string} key - 缓存键
 * @param {Object} data - 要缓存的数据
 */
function saveToCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('保存缓存失败:', error);
    // 如果localStorage满了，清理旧缓存
    if (error.name === 'QuotaExceededError') {
      cleanOldCache();
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (retryError) {
        console.error('重试保存缓存失败:', retryError);
      }
    }
  }
}

/**
 * 清理旧缓存
 */
function cleanOldCache() {
  try {
    const keys = Object.keys(localStorage);
    const aiCacheKeys = keys.filter(k => k.startsWith(CACHE_KEY_PREFIX));

    // 按生成时间排序，删除最旧的50%
    const cacheEntries = aiCacheKeys.map(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        return { key, timestamp: data.generatedAt || 0 };
      } catch {
        return { key, timestamp: 0 };
      }
    }).sort((a, b) => a.timestamp - b.timestamp);

    // 删除最旧的50%
    const deleteCount = Math.floor(cacheEntries.length / 2);
    for (let i = 0; i < deleteCount; i++) {
      localStorage.removeItem(cacheEntries[i].key);
    }

    console.log(`🧹 清理了 ${deleteCount} 条旧AI例句缓存`);
  } catch (error) {
    console.error('清理缓存失败:', error);
  }
}

/**
 * 生成AI例句（不使用缓存）
 * @param {Object} options - 配置选项
 * @param {string} options.apiKey - API密钥
 * @param {string} options.word - 目标单词
 * @param {string} options.meaning - 单词释义
 * @param {string} options.purpose - 学习目的
 * @returns {Promise<{sentence: string, translation: string}>} AI生成的例句
 */
async function generateAIExampleWithoutCache({ apiKey, word, meaning, purpose }) {
  const cleanedApiKey = resolveApiKey(apiKey);

  const prompt = buildPrompt(word, meaning, purpose);

  const data = await createAIChatCompletion({
    apiKey: cleanedApiKey,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    maxTokens: 500,
    topP: 0.7
  });
  return parseResponse(data);
}

/**
 * 构建AI Prompt（基于学习目的）
 * @param {string} word - 单词
 * @param {string} meaning - 释义
 * @param {string} purpose - 学习目的
 * @returns {string} Prompt文本
 */
function buildPrompt(word, meaning, purpose) {
  const purposeConfig = getPurposeConfig(purpose);

  return `你是一个专业的英语教学助手。请为以下单词生成一个**个性化**英语例句。

【单词信息】
单词：${word}
释义：${meaning}

【学习目的】
${purposeConfig.description}

【个性化要求】
1. 例句场景要与"${purposeConfig.scene}"相关
2. 例句风格：${purposeConfig.style}
3. 句子长度：${purposeConfig.length}
4. 难度水平：${purposeConfig.difficulty}
5. ${purposeConfig.keywords}

请以JSON格式返回，格式如下：
{
  "sentence": "英语例句",
  "translation": "中文翻译"
}

只返回JSON，不要其他内容。`;
}

/**
 * 获取学习目的配置
 * @param {string} purpose - 学习目的
 * @returns {Object} 配置对象
 */
function getPurposeConfig(purpose) {
  const configs = {
    exam: {
      description: '备考（雅思、托福、GRE等）',
      scene: '考试场景（模拟试题、学术阅读、听力材料）',
      style: '学术化、规范化',
      length: '15-25个单词',
      difficulty: '中高级，适合学术英语',
      keywords: '使用考试高频词汇和学术表达'
    },
    career: {
      description: '职场提升（商务、技术等专业英语）',
      scene: '职场场景（会议、邮件、报告、客户沟通）',
      style: '专业化、实用化',
      length: '15-25个单词',
      difficulty: '中级，注重实用性',
      keywords: '使用职场专业术语和商务表达'
    },
    hobby: {
      description: '兴趣爱好（阅读、影视、旅行、文化）',
      scene: '日常生活场景（旅行、娱乐、文化交流、社交活动）',
      style: '自然化、口语化',
      length: '12-20个单词',
      difficulty: '中级，贴近实际生活',
      keywords: '使用地道的生活化表达'
    },
    daily: {
      description: '日常交流（生活、社交、购物）',
      scene: '日常场景（购物、餐饮、交通、社交对话）',
      style: '简单化、口语化',
      length: '10-18个单词',
      difficulty: '初级到中级，易于理解',
      keywords: '使用日常基础词汇'
    }
  };

  return configs[purpose] || configs.daily;
}

/**
 * 解析AI响应
 * @param {Object} data - API响应数据
 * @returns {Object} 解析后的例句对象
 */
function parseResponse(data) {
  try {
    const content = data.choices[0].message.content;

    // 尝试提取JSON（可能包含代码块标记）
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                      content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('无法解析AI响应');
    }

    const result = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    return {
      sentence: result.sentence,
      translation: result.translation
    };
  } catch (error) {
    console.error('解析响应失败:', error);
    throw new Error('AI响应格式错误', { cause: error });
  }
}

/**
 * 清除所有AI例句缓存
 */
export function clearAllAICache() {
  try {
    const keys = Object.keys(localStorage);
    const aiCacheKeys = keys.filter(k => k.startsWith(CACHE_KEY_PREFIX));

    aiCacheKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log(`🧹 清除了 ${aiCacheKeys.length} 条AI例句缓存`);
    return aiCacheKeys.length;
  } catch (error) {
    console.error('清除AI缓存失败:', error);
    return 0;
  }
}

/**
 * 获取AI缓存统计
 * @returns {Object} 缓存统计信息
 */
export function getAICacheStats() {
  try {
    const keys = Object.keys(localStorage);
    const aiCacheKeys = keys.filter(k => k.startsWith(CACHE_KEY_PREFIX));

    let totalSize = 0;
    let validCount = 0;
    let expiredCount = 0;
    const now = Date.now();
    const maxAge = 30 * 24 * 60 * 60 * 1000;

    aiCacheKeys.forEach(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        const size = localStorage.getItem(key).length;
        totalSize += size;

        if (now - (data.generatedAt || 0) < maxAge) {
          validCount++;
        } else {
          expiredCount++;
        }
      } catch {
        // 忽略解析失败的缓存
      }
    });

    return {
      totalCount: aiCacheKeys.length,
      validCount,
      expiredCount,
      totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
      totalSizeBytes: totalSize
    };
  } catch (error) {
    console.error('获取缓存统计失败:', error);
    return {
      totalCount: 0,
      validCount: 0,
      expiredCount: 0,
      totalSize: '0 KB',
      totalSizeBytes: 0
    };
  }
}

/**
 * 错误代码枚举
 */
export const ERROR_CODES = {
  INVALID_API_KEY: 'INVALID_API_KEY',
  RATE_LIMIT: 'RATE_LIMIT',
  NETWORK_ERROR: 'NETWORK_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

/**
 * 获取友好的错误提示
 * @param {string} errorCode - 错误代码
 * @returns {string} 错误提示文本
 */
export function getErrorMessage(errorCode) {
  const messages = {
    [ERROR_CODES.INVALID_API_KEY]: 'API密钥无效，请检查设置',
    [ERROR_CODES.RATE_LIMIT]: 'API调用次数超限，请稍后再试',
    [ERROR_CODES.NETWORK_ERROR]: '网络连接失败，请检查网络',
    [ERROR_CODES.PARSE_ERROR]: 'AI响应解析失败',
    [ERROR_CODES.UNKNOWN_ERROR]: '未知错误，请重试'
  };
  return messages[errorCode] || messages[ERROR_CODES.UNKNOWN_ERROR];
}

// ==================== AI 设置管理 ====================

/**
 * 默认AI设置
 */
const DEFAULT_SETTINGS = {
  apiKey: '',
  aiProvider: 'siliconflow',
  enabled: false,
  features: {
    example: true,      // AI例句
    quiz: true,         // AI测验
    errorAnalysis: true,// AI错题分析
    memoryHooks: true   // AI记忆辅助
  },
  userLevel: 'B2',
  aiUserLevel: 'B2',
  cacheEnabled: true,
  aiCacheEnabled: true,
  learningPurpose: 'exam' // exam, career, hobby, daily
};

function normalizeAISettings(settings = {}) {
  const hasSavedApiKey = Boolean(settings.apiKey);
  const isLegacyProvider = hasSavedApiKey && settings.aiProvider !== DEFAULT_SETTINGS.aiProvider;
  const userLevel = settings.aiUserLevel || settings.userLevel || DEFAULT_SETTINGS.userLevel;
  const cacheEnabled = settings.aiCacheEnabled ?? settings.cacheEnabled ?? DEFAULT_SETTINGS.cacheEnabled;
  const learningPurpose = settings.learningPurpose || settings.purpose || DEFAULT_SETTINGS.learningPurpose;

  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    apiKey: isLegacyProvider ? '' : settings.apiKey || '',
    aiProvider: DEFAULT_SETTINGS.aiProvider,
    userLevel,
    aiUserLevel: userLevel,
    cacheEnabled,
    aiCacheEnabled: cacheEnabled,
    learningPurpose
  };
}

/**
 * 加载 AI 设置
 */
export function loadAISettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return normalizeAISettings(parsed);
    }
  } catch (error) {
    console.error('加载AI设置失败:', error);
  }
  return normalizeAISettings();
}

/**
 * 保存 AI 设置
 */
export function saveAISettings(settings) {
  try {
    const normalizedSettings = normalizeAISettings(settings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(normalizedSettings));
    return true;
  } catch (error) {
    console.error('保存AI设置失败:', error);
    return false;
  }
}

/**
 * 验证 API 密钥
 */
export async function validateApiKey(apiKey) {
  try {
    const cleanedApiKey = resolveApiKey(apiKey);

    await createAIChatCompletion({
      apiKey: cleanedApiKey,
      messages: [{ role: 'user', content: 'Hello' }],
      maxTokens: 10
    });

    return true;
  } catch (error) {
    console.error('验证API密钥失败:', error);
    return false;
  }
}

/**
 * 生成通用缓存键
 */
function generateCacheKey(type, identifier) {
  const id = typeof identifier === 'string' ? identifier : identifier.word || identifier.id;
  return `${CACHE_KEY_PREFIX}${type}_${id}`;
}

/**
 * 获取缓存数据
 */
function getCachedData(cacheKey) {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      const now = Date.now();
      if (now - (data.timestamp || 0) < CACHE_DURATION) {
        return data.content;
      } else {
        localStorage.removeItem(cacheKey);
      }
    }
  } catch (error) {
    console.error('读取缓存失败:', error);
  }
  return null;
}

/**
 * 保存缓存数据
 */
function setCachedData(cacheKey, content) {
  try {
    const data = {
      content,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (error) {
    console.error('保存缓存失败:', error);
  }
}

/**
 * 清除指定类型的AI缓存
 */
export function clearAICacheByType(type) {
  try {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(k => k.startsWith(`${CACHE_KEY_PREFIX}${type}_`));

    cacheKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    return cacheKeys.length;
  } catch (error) {
    console.error('清除缓存失败:', error);
    return 0;
  }
}

// ==================== AI 服务类 ====================

/**
 * AI 服务统一接口
 * 管理所有 AI 功能的 API 调用和配置
 */
export class AIService {
  constructor() {
    this.settings = loadAISettings();
  }

  /**
   * 重新加载设置（每次调用时）
   */
  reloadSettings() {
    this.settings = loadAISettings();
  }

  /**
   * 更新设置
   */
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    saveAISettings(this.settings);
  }

  /**
   * 获取清理后的 API key
   * @private
   */
  getCleanedApiKey() {
    return resolveApiKey(this.settings.apiKey);
  }

  /**
   * 检查是否可用
   */
  isAvailable() {
    // Always return true - the proxy server may have SILICONFLOW_API_KEY
    // configured as an environment variable, so AI may work even without
    // a user-provided key. The actual availability is determined when
    // the request is made.
    return true;
  }

  /**
   * 检查特定功能是否可用（简化版，暂时不使用）
   */
  isFeatureEnabled(feature) {
    return this.settings.features?.[feature] !== false;
  }

  // ==================== AI例句功能 ====================

  /**
   * 生成AI例句
   */
  async generateExample(word, meaning, purpose) {
    this.reloadSettings();

    if (!this.isAvailable()) {
      throw new Error('请先配置API密钥');
    }

    const targetPurpose = purpose || this.settings.learningPurpose || 'exam';
    const cacheKey = getCacheKey(word, targetPurpose);

    const cached = getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await generateAIExampleWithoutCache({
      apiKey: this.getCleanedApiKey(),
      word,
      meaning,
      purpose: targetPurpose
    });

    setCachedData(cacheKey, result);
    return result;
  }

  // ==================== AI测验功能 ====================

  /**
   * 生成选择题
   */
  async generateQuiz(word, otherWords, options = {}) {
    // 重新加载设置
    this.reloadSettings();

    if (!this.isAvailable() || !this.isFeatureEnabled('quiz')) {
      throw new Error('AI测验功能未启用');
    }

    const cacheKey = generateCacheKey('quiz', word);

    if (this.settings.aiCacheEnabled) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    const result = await generateQuiz({
      apiKey: this.getCleanedApiKey(),
      word,
      otherWords,
      userLevel: this.settings.aiUserLevel,
      ...options
    });

    if (this.settings.aiCacheEnabled && result && !result.error) {
      setCachedData(cacheKey, result);
    }

    return result;
  }

  /**
   * 生成填空题
   */
  async generateFillBlank(word, options = {}) {
    // 重新加载设置
    this.reloadSettings();

    if (!this.isAvailable()) {
      throw new Error('AI功能未启用');
    }

    const cacheKey = generateCacheKey('fillblank', word);

    if (this.settings.aiCacheEnabled) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    const result = await generateFillBlankQuestion({
      apiKey: this.getCleanedApiKey(),
      word,
      userLevel: this.settings.aiUserLevel,
      ...options
    });

    if (this.settings.aiCacheEnabled && result && !result.error) {
      setCachedData(cacheKey, result);
    }

    return result;
  }

  // ==================== AI错题分析功能 ====================

  /**
   * 分析错误模式
   */
  async analyzeErrors(mistakes, stats, options = {}) {
    // 重新加载设置
    this.reloadSettings();

    if (!this.isAvailable() || !this.isFeatureEnabled('errorAnalysis')) {
      throw new Error('AI错题分析功能未启用');
    }

    // 错误分析不缓存，因为会动态变化
    return await analyzeErrors({
      apiKey: this.getCleanedApiKey(),
      mistakes,
      stats,
      userLevel: this.settings.aiUserLevel,
      ...options
    });
  }

  /**
   * 分析单词错误
   */
  async analyzeWordError(word, userAnswer, correctAnswer, context = '') {
    // 重新加载设置
    this.reloadSettings();

    if (!this.isAvailable()) {
      throw new Error('AI功能未启用');
    }

    return await analyzeWordError({
      apiKey: this.getCleanedApiKey(),
      word,
      userAnswer,
      correctAnswer,
      context
    });
  }

  /**
   * 生成学习计划
   */
  async generateStudyPlan(stats, weakAreas, goals, options = {}) {
    // 重新加载设置
    this.reloadSettings();

    if (!this.isAvailable()) {
      throw new Error('AI功能未启用');
    }

    return await generateStudyPlan({
      apiKey: this.getCleanedApiKey(),
      stats,
      weakAreas,
      goals,
      userLevel: this.settings.aiUserLevel,
      ...options
    });
  }

  // ==================== AI记忆辅助功能 ====================

  /**
   * 生成记忆辅助内容
   */
  async generateMemoryHooks(word, options = {}) {
    // 重新加载设置
    this.reloadSettings();

    if (!this.isAvailable() || !this.isFeatureEnabled('memoryHooks')) {
      throw new Error('AI记忆辅助功能未启用');
    }

    const cacheKey = generateCacheKey('memory', word);

    if (this.settings.aiCacheEnabled) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    const result = await generateMemoryHooks({
      apiKey: this.getCleanedApiKey(),
      word,
      userLevel: this.settings.aiUserLevel,
      ...options
    });

    if (this.settings.aiCacheEnabled && result && !result.error) {
      setCachedData(cacheKey, result);
    }

    return result;
  }

  /**
   * 生成单词网络
   */
  async generateWordNetwork(word, options = {}) {
    // 重新加载设置
    this.reloadSettings();

    if (!this.isAvailable()) {
      throw new Error('AI功能未启用');
    }

    const cacheKey = generateCacheKey('network', word);

    if (this.settings.aiCacheEnabled) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    const result = await generateWordNetwork({
      apiKey: this.getCleanedApiKey(),
      word,
      userLevel: this.settings.aiUserLevel,
      ...options
    });

    if (this.settings.aiCacheEnabled && result && !result.error) {
      setCachedData(cacheKey, result);
    }

    return result;
  }

  /**
   * 生成场景化例句
   */
  async generateScenarioExamples(word, scenarios, options = {}) {
    // 重新加载设置
    this.reloadSettings();

    if (!this.isAvailable()) {
      throw new Error('AI功能未启用');
    }

    const cacheKey = generateCacheKey('scenarios', word);

    if (this.settings.aiCacheEnabled) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    const result = await generateScenarioExamples({
      apiKey: this.getCleanedApiKey(),
      word,
      scenarios,
      userLevel: this.settings.aiUserLevel,
      ...options
    });

    if (this.settings.aiCacheEnabled && result && !result.error) {
      setCachedData(cacheKey, result);
    }

    return result;
  }

  /**
   * 生成学习路径
   */
  async generateLearningPath(words, goal, options = {}) {
    // 重新加载设置
    this.reloadSettings();

    if (!this.isAvailable()) {
      throw new Error('AI功能未启用');
    }

    return await generateLearningPath({
      apiKey: this.getCleanedApiKey(),
      words,
      goal,
      userLevel: this.settings.aiUserLevel,
      ...options
    });
  }
}

// ==================== 单例模式 ====================

let aiServiceInstance = null;

/**
 * 获取 AI 服务实例
 */
export function getAIService() {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService();
  }
  return aiServiceInstance;
}

/**
 * 重置 AI 服务（用于测试）
 */
export function resetAIService() {
  aiServiceInstance = null;
  return getAIService();
}
