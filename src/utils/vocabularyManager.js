/**
 * 词库管理器
 */

import logger from './logger.js'

// 词库配置 - IELTS-focused vocabulary system
// 难度标签基于 IELTS Band 分数段，CEFR 作为辅助参考
export const VOCABULARIES = [
  // === Legacy CET Track (retained for backward compatibility) ===
  {
    id: 'vocab-cet4-basic',
    name: '基础词汇',
    description: '基础英语核心词汇（累计4,500词）',
    size: 4500,
    level: 'basic',
    category: 'Foundation',
    file: '/data/vocab-cet4-basic.json',
    icon: '📖',
    color: '#8da892',
    difficulty: {
      ieltsBand: '4.0-5.0',
      cefr: ['A1', 'A2'],
      vocabRange: '0-4500',
      stars: 1,
      label: 'IELTS 4.0-5.0'
    }
  },
  {
    id: 'vocab-cet6-advanced',
    name: '进阶词汇',
    description: '中级英语扩展词汇（累计6,000词）',
    size: 1500,
    level: 'intermediate',
    category: 'Foundation',
    file: '/data/vocab-cet6-advanced.json',
    icon: '📚',
    color: '#5c6b5c',
    difficulty: {
      ieltsBand: '5.0-6.0',
      cefr: ['B1'],
      vocabRange: '4500-6000',
      stars: 2,
      label: 'IELTS 5.0-6.0'
    }
  },
  // === IELTS Core Track ===
  {
    id: 'vocab-ielts6-breakthrough',
    name: 'IELTS 6.0 突破',
    description: '雅思6.0目标词汇（B2水平）',
    size: 500,
    level: 'ielts6',
    category: 'IELTS',
    file: '/data/vocab-ielts6-breakthrough.json',
    icon: '🎯',
    color: '#52667c',
    ieltsTrackType: 'legacy',
    difficulty: {
      ieltsBand: '6.0',
      cefr: ['B2'],
      vocabRange: '6000-6500',
      stars: 3,
      label: 'IELTS 6.0'
    }
  },
  {
    id: 'vocab-ielts7-sprint',
    name: 'IELTS 7.0 冲刺',
    description: '雅思7.0目标词汇（B2+/C1水平）',
    size: 1500,
    level: 'ielts7',
    category: 'IELTS',
    file: '/data/vocab-ielts7-sprint.json',
    icon: '🏆',
    color: '#7c6f62',
    ieltsTrackType: 'legacy',
    difficulty: {
      ieltsBand: '7.0',
      cefr: ['B2', 'C1'],
      vocabRange: '6500-8000',
      stars: 4,
      label: 'IELTS 7.0'
    }
  },
  {
    id: 'vocab-ielts8-mastery',
    name: 'IELTS 8.0 通关',
    description: '雅思8.0+精通词汇（C1/C2水平）',
    size: 4044,
    level: 'ielts8',
    category: 'IELTS',
    file: '/data/vocab-ielts8-mastery.json',
    icon: '💎',
    color: '#6b5c7c',
    ieltsTrackType: 'legacy',
    difficulty: {
      ieltsBand: '8.0+',
      cefr: ['C1', 'C2'],
      vocabRange: '8000-12044',
      stars: 5,
      label: 'IELTS 8.0+'
    }
  },
  // === IELTS Foundation (Context-first) ===
  {
    id: 'ielts-foundation',
    name: 'IELTS Foundation',
    description: '雅思核心词汇 · 语境优先学习',
    size: 743,
    level: 'ielts-foundation',
    category: 'IELTS',
    file: '/data/ielts-foundation.json',
    icon: '🎯',
    color: '#6366f1',
    isBundle: true,
    ieltsTrackType: 'foundation',
    difficulty: {
      ieltsBand: '6.0-7.0',
      cefr: ['B2', 'C1'],
      vocabRange: '6000-8000',
      stars: 3,
      label: 'IELTS Core'
    }
  },
  // === IELTS Topic Packs ===
  {
    id: 'ielts-topic-education',
    name: 'IELTS Topic · Education',
    description: '教育主题高频语境词汇',
    size: 124,
    level: 'ielts-topic',
    category: 'IELTS',
    file: '/data/ielts-topic-education.json',
    icon: '📗',
    color: '#10b981',
    isBundle: true,
    ieltsTrackType: 'topic',
    topic: 'education',
    difficulty: {
      ieltsBand: '6.0-7.0',
      cefr: ['B2', 'C1'],
      vocabRange: '6000-8000',
      stars: 3,
      label: 'Education'
    }
  },
  {
    id: 'ielts-topic-government',
    name: 'IELTS Topic · Government',
    description: '政府与公共政策主题高频语境词汇',
    size: 108,
    level: 'ielts-topic',
    category: 'IELTS',
    file: '/data/ielts-topic-government.json',
    icon: '🏯',
    color: '#0ea5e9',
    isBundle: true,
    ieltsTrackType: 'topic',
    topic: 'government',
    difficulty: {
      ieltsBand: '6.5-7.5',
      cefr: ['B2', 'C1'],
      vocabRange: '6500-8500',
      stars: 4,
      label: 'Government'
    }
  },
  {
    id: 'ielts-topic-environment',
    name: 'IELTS Topic · Environment',
    description: '环境与可持续发展主题高频语境词汇',
    size: 79,
    level: 'ielts-topic',
    category: 'IELTS',
    file: '/data/ielts-topic-environment.json',
    icon: '🌰',
    color: '#22c55e',
    isBundle: true,
    ieltsTrackType: 'topic',
    topic: 'environment',
    difficulty: {
      ieltsBand: '6.5-7.5',
      cefr: ['B2', 'C1'],
      vocabRange: '6500-8500',
      stars: 4,
      label: 'Environment'
    }
  },
  {
    id: 'ielts-topic-technology',
    name: 'IELTS Topic · Technology',
    description: '科技与数字生活主题高频语境词汇',
    size: 80,
    level: 'ielts-topic',
    category: 'IELTS',
    file: '/data/ielts-topic-technology.json',
    icon: '🛰',
    color: '#8b5cf6',
    isBundle: true,
    ieltsTrackType: 'topic',
    topic: 'technology',
    difficulty: {
      ieltsBand: '6.5-7.5',
      cefr: ['B2', 'C1'],
      vocabRange: '6500-8500',
      stars: 4,
      label: 'Technology'
    }
  },
  {
    id: 'ielts-topic-health',
    name: 'IELTS Topic · Health',
    description: '健康与公共卫生主题高频语境词汇',
    size: 80,
    level: 'ielts-topic',
    category: 'IELTS',
    file: '/data/ielts-topic-health.json',
    icon: '🩺',
    color: '#ef4444',
    isBundle: true,
    ieltsTrackType: 'topic',
    topic: 'health',
    difficulty: {
      ieltsBand: '6.5-7.5',
      cefr: ['B2', 'C1'],
      vocabRange: '6500-8500',
      stars: 4,
      label: 'Health'
    }
  },
  {
    id: 'ielts-topic-work',
    name: 'IELTS Topic · Work',
    description: '工作、效率与就业主题高频语境词汇',
    size: 76,
    level: 'ielts-topic',
    category: 'IELTS',
    file: '/data/ielts-topic-work.json',
    icon: '💼',
    color: '#f59e0b',
    isBundle: true,
    ieltsTrackType: 'topic',
    topic: 'work',
    difficulty: {
      ieltsBand: '6.0-7.0',
      cefr: ['B2', 'C1'],
      vocabRange: '6000-8000',
      stars: 3,
      label: 'Work'
    }
  },
  {
    id: 'ielts-topic-media',
    name: 'IELTS Topic · Media',
    description: '媒体与信息传播主题高频语境词汇',
    size: 77,
    level: 'ielts-topic',
    category: 'IELTS',
    file: '/data/ielts-topic-media.json',
    icon: '📰',
    color: '#06b6d4',
    isBundle: true,
    ieltsTrackType: 'topic',
    topic: 'media',
    difficulty: {
      ieltsBand: '6.0-7.0',
      cefr: ['B2', 'C1'],
      vocabRange: '6500-8500',
      stars: 3,
      label: 'Media'
    }
  },
  {
    id: 'ielts-topic-crime',
    name: 'IELTS Topic · Crime',
    description: '犯罪与司法主题高频语境词汇',
    size: 76,
    level: 'ielts-topic',
    category: 'IELTS',
    file: '/data/ielts-topic-crime.json',
    icon: '⚖️',
    color: '#64748b',
    isBundle: true,
    ieltsTrackType: 'topic',
    topic: 'crime',
    difficulty: {
      ieltsBand: '6.5-7.5',
      cefr: ['B2', 'C1'],
      vocabRange: '6500-8500',
      stars: 3,
      label: 'Crime'
    }
  }
]

// 难度等级映射
export const LEVEL_LABELS = {
  'beginner': '初级',
  'pre-intermediate': '初中级',
  'intermediate': '中级',
  'upper-intermediate': '中高级',
  'advanced': '高级'
}

// === LocalStorage migration ===
const VOCAB_ID_MIGRATIONS = {
  'ielts-core-bundle-sample': 'ielts-foundation'
}

const STORAGE_MIGRATION_VERSION = '2'

/**
 * Run idempotent localStorage migrations for renamed IELTS tracks.
 *
 * v1 migrated:
 * - current vocab id
 * - progress keys
 *
 * v2 additionally migrates:
 * - review state keys
 */
function migrateLocalStorage() {
  try {
    const migrationKey = 'vocabcontext_migration_version'
    const currentVersion = localStorage.getItem(migrationKey)

    if (currentVersion === STORAGE_MIGRATION_VERSION) return

    // Migrate current selected vocabulary id.
    const currentVocabKey = 'vocabcontext_current_vocab'
    const savedVocab = localStorage.getItem(currentVocabKey)
    if (savedVocab && VOCAB_ID_MIGRATIONS[savedVocab]) {
      localStorage.setItem(currentVocabKey, VOCAB_ID_MIGRATIONS[savedVocab])
    }

    // Migrate per-vocabulary local data without deleting legacy keys so rollback remains possible.
    for (const [oldId, newId] of Object.entries(VOCAB_ID_MIGRATIONS)) {
      const oldProgressKey = `vocabcontext_progress_${oldId}`
      const newProgressKey = `vocabcontext_progress_${newId}`
      const oldProgress = localStorage.getItem(oldProgressKey)

      if (oldProgress && !localStorage.getItem(newProgressKey)) {
        localStorage.setItem(newProgressKey, oldProgress)
      }

      const oldReviewKey = `vocabcontext_review_${oldId}`
      const newReviewKey = `vocabcontext_review_${newId}`
      const oldReview = localStorage.getItem(oldReviewKey)

      if (oldReview && !localStorage.getItem(newReviewKey)) {
        localStorage.setItem(newReviewKey, oldReview)
      }
    }

    localStorage.setItem(migrationKey, STORAGE_MIGRATION_VERSION)
    logger.info(`localStorage migration complete (v${STORAGE_MIGRATION_VERSION})`)
  } catch (error) {
    logger.warn('localStorage migration failed:', error)
  }
}

// Run migration on module load in the browser.
if (typeof window !== 'undefined') {
  migrateLocalStorage()
}

// 当前选择的词库
let currentVocabulary = VOCABULARIES[0]

/**
 * 获取所有词库
 */
export function getAllVocabularies() {
  return VOCABULARIES;
}

/**
 * 获取当前词库
 */
export function getCurrentVocabulary() {
  return currentVocabulary;
}

/**
 * 设置当前词库
 */
export function setCurrentVocabulary(vocabId) {
  const vocab = VOCABULARIES.find(v => v.id === vocabId);
  if (vocab) {
    currentVocabulary = vocab;
    saveCurrentVocabulary(vocabId);
    return vocab;
  }
  return null;
}

/**
 * 从localStorage加载当前词库设置
 */
export function loadCurrentVocabulary() {
  try {
    const saved = localStorage.getItem('vocabcontext_current_vocab');
    if (saved) {
      const vocab = setCurrentVocabulary(saved);
      if (vocab) return vocab;
    }
  } catch (error) {
    logger.error('加载词库设置失败:', error);
  }
  return currentVocabulary;
}

/**
 * 保存当前词库设置
 */
export function saveCurrentVocabulary(vocabId) {
  try {
    localStorage.setItem('vocabcontext_current_vocab', vocabId);
    return true;
  } catch (error) {
    logger.error('保存词库设置失败:', error);
    return false;
  }
}

/**
 * 获取词库学习进度
 */
export function getVocabularyProgress(vocabId) {
  try {
    const key = `vocabcontext_progress_${vocabId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    logger.error('加载词库进度失败:', error);
  }
  return {
    learned: [],
    forgotten: [],
    currentIndex: 0
  };
}
function syncVocabularyProgressInBackground(vocabId, progress) {
  void import('./syncService')
    .then(({ syncService }) => syncService.syncVocabularyProgress(vocabId, progress))
    .catch(err => {
      logger.warn('自动同步进度失败:', err);
    });
}

/**
 * 保存词库学习进度并同步到云端
 */
export function saveVocabularyProgress(vocabId, progress) {
  try {
    const key = `vocabcontext_progress_${vocabId}`;
    localStorage.setItem(key, JSON.stringify(progress));

    // 异步同步到云端
    syncVocabularyProgressInBackground(vocabId, progress);

    return true;
  } catch (error) {
    logger.error('保存词库进度失败:', error);
    return false;
  }
}

/**
 * Parse IELTS Band string to numeric range
 * Handles formats: '6.0-7.0', '8.0+', '基础-4.0', '4.0-5.0'
 * @param {string} ieltsBand - e.g., '6.0-7.0', '8.0+', '基础-4.0'
 * @returns {Object} { min, max }
 */
function parseIeltsBand(ieltsBand) {
  if (!ieltsBand) return { min: 0, max: 9 }

  // Extract all numeric values from the string
  const numbers = ieltsBand.match(/\d+\.?\d*/g)?.map(parseFloat) || []

  if (numbers.length === 0) return { min: 0, max: 9 }

  if (ieltsBand.includes('+')) {
    return { min: numbers[0], max: 9 }
  }

  if (numbers.length >= 2) {
    return { min: numbers[0], max: numbers[numbers.length - 1] }
  }

  // Single number
  return { min: numbers[0] - 0.5, max: numbers[0] + 0.5 }
}

/**
 * Extract numeric IELTS band from test result format
 * Handles: '基础-4.0', '4.0-5.0', '6.0-6.5', '7.5-8.5+'
 * @param {string} ieltsLevel
 * @returns {number|null} - The primary IELTS band value
 */
function extractIeltsBandNumber(ieltsLevel) {
  if (!ieltsLevel) return null

  // Extract the first valid number from the string
  const match = ieltsLevel.match(/\d+\.?\d*/)
  return match ? parseFloat(match[0]) : null
}

/**
 * 根据词汇测试结果推荐词库（IELTS-focused）
 * @param {Object} testResult - 测试结果 { estimatedVocab, cefrLevel, ieltsLevel }
 * @returns {Array} 推荐的词库列表（按推荐度排序）
 */
export function getRecommendedVocabularies(testResult) {
  if (!testResult) {
    // 如果没有测试结果，返回默认推荐（中等难度）
    return VOCABULARIES.filter(v => v.difficulty.stars === 3).map(v => ({ ...v, isRecommended: true }));
  }

  const { cefrLevel, estimatedVocab, ieltsLevel } = testResult;

  // IELTS Band to CEFR mapping for better recommendations
  const ieltsToCefr = {
    '4.0': 'A2', '4.5': 'A2', '5.0': 'B1', '5.5': 'B1',
    '6.0': 'B2', '6.5': 'B2', '7.0': 'C1', '7.5': 'C1',
    '8.0': 'C2', '8.5': 'C2', '9.0': 'C2'
  }

  // Extract numeric IELTS band from test result (handles '基础-4.0', '4.0-5.0' etc.)
  const userBand = extractIeltsBandNumber(ieltsLevel)

  // Derive CEFR from IELTS if not provided
  const effectiveCefrLevel = cefrLevel || (userBand !== null ? ieltsToCefr[userBand.toString()] : 'B2')

  const scoredVocabs = VOCABULARIES.map(vocab => {
    let score = 0;
    const diff = vocab.difficulty;

    // 1. IELTS Band matching (highest priority for IELTS-focused users)
    if (userBand !== null && diff.ieltsBand) {
      const { min, max } = parseIeltsBand(diff.ieltsBand)

      if (userBand >= min && userBand <= max) {
        score += 70  // Perfect match
      } else if (userBand >= min - 0.5 && userBand <= max + 0.5) {
        score += 50  // Adjacent band
      } else if (userBand >= min - 1 && userBand <= max + 1) {
        score += 30  // Within one band
      }
    }

    // 2. CEFR level matching (weight: 20%)
    if (diff.cefr.includes(effectiveCefrLevel)) {
      score += 20;
    } else {
      const cefrOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      const userLevelIndex = cefrOrder.indexOf(effectiveCefrLevel);
      if (userLevelIndex >= 0) {
        const minDiff = Math.min(
          ...diff.cefr.map(level => Math.abs(cefrOrder.indexOf(level) - userLevelIndex))
        );
        if (minDiff === 1) score += 12;
        if (minDiff === 2) score += 5;
      }
    }

    // 3. Vocabulary range matching (weight: 10%)
    if (estimatedVocab) {
      const [min, max] = estimatedVocab.split('-').map(Number);
      const userVocab = (min + max) / 2;

      const vocabMin = diff.vocabRange.includes('-')
        ? parseInt(diff.vocabRange.split('-')[0])
        : parseInt(diff.vocabRange);
      const vocabMax = diff.vocabRange.includes('-')
        ? parseInt(diff.vocabRange.split('-')[1])
        : parseInt(diff.vocabRange);

      const hasOverlap = !(max < vocabMin || min > vocabMax);

      if (hasOverlap) {
        score += 10;
      } else {
        const distance = Math.min(
          Math.abs(userVocab - vocabMin),
          Math.abs(userVocab - vocabMax)
        );
        if (distance < 1000) score += 5;
      }
    }

    return { ...vocab, recommendScore: score };
  });

  // 按推荐分数排序，返回所有词库（让用户有更多选择）
  return scoredVocabs
    .sort((a, b) => b.recommendScore - a.recommendScore)
    .map(({ recommendScore, ...vocab }) => ({
      ...vocab,
      isRecommended: recommendScore >= 60,  // 提高推荐标准：60分以上才标记为推荐
      recommendScore: recommendScore  // 保留分数供调试使用
    }));
}
