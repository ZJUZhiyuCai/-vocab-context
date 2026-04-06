/**
 * 本地存储工具
 * 用于保存和加载用户设置
 */


import { syncService } from './syncService'
import logger from './logger.js'
import { normalizeLearningPurpose } from './learningPurpose'

const SETTINGS_KEY = 'vocabcontext_settings';
const USER_PROFILE_KEY = 'vocabcontext_user_profile';
const AI_PROVIDER = 'siliconflow';

function normalizeSettings(settings = {}) {
  const hasSavedApiKey = Boolean(settings.apiKey);
  const isLegacyProvider = hasSavedApiKey && settings.aiProvider !== AI_PROVIDER;

  return {
    ...settings,
    aiProvider: AI_PROVIDER,
    apiKey: isLegacyProvider ? '' : (settings.apiKey || ''),
    purpose: normalizeLearningPurpose(settings.purpose, 'exam')
  };
}

/**
 * 从localStorage加载用户设置
 * @returns {Object|null} 用户设置对象或null
 */
export function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? normalizeSettings(JSON.parse(saved)) : null;
  } catch (error) {
    logger.error('加载设置失败:', error);
    return null;
  }
}

/**
 * 保存用户设置到localStorage并同步到云端
 * @param {Object} settings - 用户设置对象
 * @returns {boolean} 保存是否成功
 */
export function saveSettings(settings) {
  const normalizedSettings = normalizeSettings(settings);
  try {
    const data = JSON.stringify(normalizedSettings);
    localStorage.setItem(SETTINGS_KEY, data);

    // 异步同步到云端
    syncService.syncSettings(normalizedSettings).catch(err => {
      logger.warn('自动同步设置失败（可能未登录或断网）:', err);
    });

    logger.info('设置保存成功');
    return true;
  } catch (error) {
    logger.error('保存设置失败:', error);

    // 如果是容量错误，尝试清理缓存后重试
    if (error.name === 'QuotaExceededError') {
      logger.warn('localStorage已满，尝试清理缓存...');
      cleanOldCache().then(() => {
        try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(normalizedSettings));
          logger.info('清理后保存成功');
        } catch (retryError) {
          logger.error('清理后仍然无法保存:', retryError);
        }
      });
    }

    return false;
  }
}

/**
 * 清理localStorage中的旧缓存
 * @returns {Promise<number>} 清理的项目数量
 */
async function cleanOldCache() {
  return new Promise((resolve) => {
    try {
      const keys = Object.keys(localStorage);
      const vocabContextKeys = keys.filter(k => k.startsWith('vocabcontext_'));

      // 按时间戳排序（如果有的话）
      const cacheEntries = vocabContextKeys.map(key => {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          return {
            key,
            timestamp: data.generatedAt || data.lastUpdated || 0
          };
        } catch {
          return { key, timestamp: 0 };
        }
      }).sort((a, b) => a.timestamp - b.timestamp);

      // 删除最旧的30%
      const deleteCount = Math.floor(cacheEntries.length * 0.3);
      for (let i = 0; i < deleteCount; i++) {
        localStorage.removeItem(cacheEntries[i].key);
      }

      logger.info(`清理了 ${deleteCount} 条旧缓存`);
      resolve(deleteCount);
    } catch (error) {
      logger.error('清理缓存失败:', error);
      resolve(0);
    }
  });
}

/**
 * 清除用户设置
 */
export function clearSettings() {
  localStorage.removeItem(SETTINGS_KEY);
}

/**
 * 加载用户画像
 * @returns {Object|null} 用户画像对象
 */
export function loadUserProfile() {
  try {
    const saved = localStorage.getItem(USER_PROFILE_KEY);
    if (!saved) return null;

    const profile = JSON.parse(saved);
    return {
      ...profile,
      purpose: normalizeLearningPurpose(profile.purpose, '')
    };
  } catch (error) {
    logger.error('加载用户画像失败:', error);
    return null;
  }
}

/**
 * 保存用户画像
 * @param {Object} profile - 用户画像对象
 * @returns {boolean} 保存是否成功
 */
export function saveUserProfile(profile) {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify({
      ...profile,
      purpose: normalizeLearningPurpose(profile?.purpose, '')
    }));
    return true;
  } catch (error) {
    logger.error('保存用户画像失败:', error);
    return false;
  }
}

/**
 * 检查是否需要显示入门测试
 * @returns {boolean}
 */
export function shouldShowOnboarding() {
  const profile = loadUserProfile();
  return !profile || !profile.purpose;
}

/**
 * 保存单词本到localStorage
 * @param {Set} wordbook - 单词本Set
 * @returns {boolean} 保存是否成功
 */
export function saveWordbook(wordbook) {
  try {
    localStorage.setItem('vocabcontext_wordbook', JSON.stringify([...wordbook]));
    return true;
  } catch (error) {
    logger.error('保存单词本失败:', error);
    return false;
  }
}

/**
 * 从localStorage加载单词本
 * @returns {Set} 单词本Set
 */
export function loadWordbook() {
  try {
    const saved = localStorage.getItem('vocabcontext_wordbook');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch (error) {
    logger.error('加载单词本失败:', error);
    return new Set();
  }
}
