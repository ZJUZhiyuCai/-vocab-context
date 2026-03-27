/**
 * 词汇懒加载管理器
 * 解决大文件加载性能问题（如C1词库37MB）
 */

import logger from './logger.js';

// 缓存已加载的词汇数据
const vocabCache = new Map();

/**
 * 词汇加载器类
 */
export class VocabularyLoader {
  constructor(vocabFile) {
    this.vocabFile = vocabFile;
    this.cacheKey = vocabFile;
    this.totalWords = 0;
    this.fullData = null; // 缓存完整数据（第一次加载后）
    this.loadedBatches = new Set(); // 已加载的批次索引
    this.words = []; // 已加载的单词（按顺序）
    this.wordIndex = new Map(); // word.id -> 在数组中的位置
    this.isLoading = false;
    this.loadPromise = null;
  }

  /**
   * 获取指定范围的单词
   * @param {number} startIndex - 起始索引
   * @param {number} count - 数量
   * @returns {Promise<Array>} 单词数组
   */
  async getWordsRange(startIndex, count) {
    // 确保已加载完整数据
    await this.ensureFullDataLoaded();

    // 确保数据有效
    if (!this.fullData || !Array.isArray(this.fullData.words)) {
      logger.error('词库数据无效:', this.fullData);
      return [];
    }

    const endIndex = Math.min(startIndex + count, this.totalWords);
    logger.info(`getWordsRange: startIndex=${startIndex}, count=${count}, endIndex=${endIndex}, totalWords=${this.totalWords}`);

    const result = this.fullData.words.slice(startIndex, endIndex);
    logger.info(`返回 ${result.length} 个单词`);

    return result;
  }

  /**
   * 获取单个单词
   * @param {string} wordId - 单词ID
   * @returns {Promise<Object|null>} 单词对象
   */
  async getWord(wordId) {
    await this.ensureFullDataLoaded();

    return this.fullData.words.find(w => w.id === wordId) || null;
  }

  /**
   * 确保完整数据已加载
   * @private
   */
  async ensureFullDataLoaded() {
    if (this.fullData) {
      return; // 已加载
    }

    // 检查全局缓存
    if (vocabCache.has(this.cacheKey)) {
      this.fullData = vocabCache.get(this.cacheKey);
      this.totalWords = this.fullData.totalWords || this.fullData.words.length;
      return;
    }

    // 首次加载
    if (this.isLoading) {
      await this.loadPromise;
      return;
    }

    this.isLoading = true;
    this.loadPromise = this._loadFullFile();

    try {
      await this.loadPromise;
    } finally {
      this.isLoading = false;
      this.loadPromise = null;
    }
  }

  /**
   * 加载完整文件
   * @private
   */
  async _loadFullFile() {
    try {
      logger.info(`首次加载词库: ${this.vocabFile}`);
      const startTime = Date.now();

      const response = await fetch(this.vocabFile);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      const loadTime = Date.now() - startTime;
      const fileSizeMB = (new TextEncoder().encode(JSON.stringify(data)).length / 1024 / 1024).toFixed(2);

      logger.info('词库加载完成', {
        wordCount: data.words?.length || 0,
        loadTimeMs: loadTime,
        fileSizeMB,
        hasWords: !!data.words,
        wordsIsArray: Array.isArray(data.words),
        totalWords: data.totalWords
      });

      this.fullData = data;
      this.totalWords = data.totalWords || (Array.isArray(data.words) ? data.words.length : 0);

      logger.info(`设置 totalWords = ${this.totalWords}`);

      // 存入全局缓存
      vocabCache.set(this.cacheKey, data);
    } catch (error) {
      logger.error(`加载词库失败 ${this.vocabFile}:`, error);
      throw error;
    }
  }

  /**
   * 获取总单词数
   * @returns {Promise<number>}
   */
  async getTotalCount() {
    await this.ensureFullDataLoaded();
    return this.totalWords;
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.fullData = null;
    this.totalWords = 0;
    this.loadedBatches.clear();
  }
}

/**
 * 全局加载器管理
 */
const loaders = new Map();

/**
 * 获取或创建词汇加载器
 * @param {string} vocabFile - 词库文件路径
 * @returns {VocabularyLoader}
 */
export function getVocabularyLoader(vocabFile) {
  if (!loaders.has(vocabFile)) {
    loaders.set(vocabFile, new VocabularyLoader(vocabFile));
  }
  return loaders.get(vocabFile);
}

/**
 * 清除指定词库的加载器
 * @param {string} vocabFile - 词库文件路径
 */
export function clearVocabularyLoader(vocabFile) {
  const loader = loaders.get(vocabFile);
  if (loader) {
    loader.clearCache();
  }
  loaders.delete(vocabFile);
}

/**
 * 清除所有缓存
 */
export function clearAllVocabularyCache() {
  loaders.forEach(loader => loader.clearCache());
  loaders.clear();
  vocabCache.clear();
}
