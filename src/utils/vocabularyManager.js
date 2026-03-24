/**
 * 词库管理器
 */

// 词库配置 - 按累计词汇量分段（方案C）
export const VOCABULARIES = [
  {
    id: 'vocab-cet4-basic',
    name: '四级基础',
    description: '大学英语四级核心词汇（累计4,500词）',
    size: 4500,
    level: 'cet4',
    category: 'CET',
    file: '/data/vocab-cet4-basic.json',
    icon: '📖',
    color: '#8da892',
    difficulty: {
      cefr: ['A1', 'A2'],
      vocabRange: '0-4500',
      stars: 1,
      label: '四级'
    }
  },
  {
    id: 'vocab-cet6-advanced',
    name: '六级进阶',
    description: '大学英语六级新增词汇（累计6,000词）',
    size: 1500,
    level: 'cet6',
    category: 'CET',
    file: '/data/vocab-cet6-advanced.json',
    icon: '📚',
    color: '#5c6b5c',
    difficulty: {
      cefr: ['B1'],
      vocabRange: '4500-6000',
      stars: 2,
      label: '六级'
    }
  },
  {
    id: 'vocab-ielts6-breakthrough',
    name: '雅思6.0突破',
    description: '雅思6.0水平B2词汇',
    size: 500,
    level: 'ielts6',
    category: 'IELTS',
    file: '/data/vocab-ielts6-breakthrough.json',
    icon: '🎯',
    color: '#52667c',
    ieltsTrackType: 'legacy',
    difficulty: {
      cefr: ['B2'],
      vocabRange: '6000-6500',
      stars: 3,
      label: '雅思6.0'
    }
  },
  {
    id: 'vocab-ielts7-sprint',
    name: '雅思7.0冲刺',
    description: '雅思7.0水平B2+/C1词汇',
    size: 1500,
    level: 'ielts7',
    category: 'IELTS',
    file: '/data/vocab-ielts7-sprint.json',
    icon: '🏆',
    color: '#7c6f62',
    ieltsTrackType: 'legacy',
    difficulty: {
      cefr: ['B2', 'C1'],
      vocabRange: '6500-8000',
      stars: 4,
      label: '雅思7.0'
    }
  },
  {
    id: 'vocab-ielts8-mastery',
    name: '雅思8.0通关',
    description: '雅思8.0+水平C1/C2精通词汇',
    size: 4044,
    level: 'ielts8',
    category: 'IELTS',
    file: '/data/vocab-ielts8-mastery.json',
    icon: '💎',
    color: '#6b5c7c',
    ieltsTrackType: 'legacy',
    difficulty: {
      cefr: ['C1', 'C2'],
      vocabRange: '8000-12044',
      stars: 5,
      label: '雅思8.0+'
    }
  },
  {
    id: 'ielts-foundation',
    name: 'IELTS Foundation',
    description: '雅思基础核心层 · Context Bundle',
    size: 541,
    level: 'ielts-foundation',
    category: 'IELTS',
    file: '/data/ielts-foundation.json',
    icon: '🎯',
    color: '#6366f1',
    isBundle: true,
    ieltsTrackType: 'foundation',
    difficulty: {
      cefr: ['B2', 'C1'],
      vocabRange: '6000-8000',
      stars: 3,
      label: 'IELTS Foundation'
    }
  },
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
    size: 71,
    level: 'ielts-topic',
    category: 'IELTS',
    file: '/data/ielts-topic-environment.json',
    icon: '🌰',
    color: '#22c55e',
    isBundle: true,
    ieltsTrackType: 'topic',
    topic: 'environment',
    difficulty: {
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
    size: 52,
    level: 'ielts-topic',
    category: 'IELTS',
    file: '/data/ielts-topic-technology.json',
    icon: '🛰',
    color: '#8b5cf6',
    isBundle: true,
    ieltsTrackType: 'topic',
    topic: 'technology',
    difficulty: {
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
    size: 53,
    level: 'ielts-topic',
    category: 'IELTS',
    file: '/data/ielts-topic-health.json',
    icon: '🩺',
    color: '#ef4444',
    isBundle: true,
    ieltsTrackType: 'topic',
    topic: 'health',
    difficulty: {
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
    size: 32,
    level: 'ielts-topic',
    category: 'IELTS',
    file: '/data/ielts-topic-work.json',
    icon: '💼',
    color: '#f59e0b',
    isBundle: true,
    ieltsTrackType: 'topic',
    topic: 'work',
    difficulty: {
      cefr: ['B2', 'C1'],
      vocabRange: '6500-8500',
      stars: 3,
      label: 'Work'
    }
  },
  {
    id: 'ielts-topic-media',
    name: 'IELTS Topic · Media',
    description: '媒体与信息传播主题高频语境词汇',
    size: 32,
    level: 'ielts-topic',
    category: 'IELTS',
    file: '/data/ielts-topic-media.json',
    icon: '📰',
    color: '#06b6d4',
    isBundle: true,
    ieltsTrackType: 'topic',
    topic: 'media',
    difficulty: {
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
    size: 26,
    level: 'ielts-topic',
    category: 'IELTS',
    file: '/data/ielts-topic-crime.json',
    icon: '⚖️',
    color: '#64748b',
    isBundle: true,
    ieltsTrackType: 'topic',
    topic: 'crime',
    difficulty: {
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
    console.log(`✅ localStorage migration complete (v${STORAGE_MIGRATION_VERSION})`)
  } catch (error) {
    console.warn('localStorage migration failed:', error)
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
    console.error('加载词库设置失败:', error);
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
    console.error('保存词库设置失败:', error);
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
    console.error('加载词库进度失败:', error);
  }
  return {
    learned: [],
    forgotten: [],
    currentIndex: 0
  };
}


import { syncService } from './syncService'

/**
 * 保存词库学习进度并同步到云端
 */
export function saveVocabularyProgress(vocabId, progress) {
  try {
    const key = `vocabcontext_progress_${vocabId}`;
    localStorage.setItem(key, JSON.stringify(progress));

    // 异步同步到云端
    syncService.syncVocabularyProgress(vocabId, progress).catch(err => {
      console.warn('⚠️ 自动同步进度失败:', err);
    });

    return true;
  } catch (error) {
    console.error('保存词库进度失败:', error);
    return false;
  }
}

/**
 * 根据词汇测试结果推荐词库（精准匹配版）
 * @param {Object} testResult - 测试结果 { estimatedVocab, cefrLevel, ieltsLevel }
 * @returns {Array} 推荐的词库列表（按推荐度排序）
 */
export function getRecommendedVocabularies(testResult) {
  if (!testResult) {
    // 如果没有测试结果，返回默认推荐（中等难度）
    return VOCABULARIES.filter(v => v.difficulty.stars === 3).map(v => ({ ...v, isRecommended: true }));
  }

  const { cefrLevel, estimatedVocab } = testResult;

  // 精准匹配策略：优先选择完全匹配CEFR等级的词库
  const scoredVocabs = VOCABULARIES.map(vocab => {
    let score = 0;
    const diff = vocab.difficulty;

    // 1. 精确CEFR等级匹配（权重：60%）
    if (diff.cefr.includes(cefrLevel)) {
      score += 60;  // 完全匹配，高分
    } else {
      // 检查相邻等级
      const cefrOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      const userLevelIndex = cefrOrder.indexOf(cefrLevel);
      const minDiff = Math.min(
        ...diff.cefr.map(level => Math.abs(cefrOrder.indexOf(level) - userLevelIndex))
      );
      if (minDiff === 1) score += 35;  // 相邻等级，仍然比较适合
      if (minDiff === 2) score += 15;  // 隔一个等级，勉强可以
    }

    // 2. 词汇量范围匹配（权重：25%）
    if (estimatedVocab) {
      const [min, max] = estimatedVocab.split('-').map(Number);
      const userVocab = (min + max) / 2;

      // 解析词库的词汇量范围
      const vocabMin = diff.vocabRange.includes('-')
        ? parseInt(diff.vocabRange.split('-')[0])
        : parseInt(diff.vocabRange);
      const vocabMax = diff.vocabRange.includes('-')
        ? parseInt(diff.vocabRange.split('-')[1])
        : parseInt(diff.vocabRange);
      const vocabAvg = (vocabMin + vocabMax) / 2;

      // 计算词汇量重合度
      const userMax = max;
      const userMin = min;

      // 检查范围是否有重合
      const hasOverlap = !(userMax < vocabMin || userMin > vocabMax);

      if (hasOverlap) {
        // 计算重合比例
        const overlapMin = Math.max(userMin, vocabMin);
        const overlapMax = Math.min(userMax, vocabMax);
        const overlapRange = overlapMax - overlapMin;
        const userRange = userMax - userMin;
        const overlapPercent = overlapRange / userRange;

        if (overlapPercent > 0.5) score += 25;
        else if (overlapPercent > 0.3) score += 20;
        else if (overlapPercent > 0.1) score += 10;
        else score += 5;
      } else {
        // 没有重合，计算距离
        const distance = Math.min(
          Math.abs(userVocab - vocabMin),
          Math.abs(userVocab - vocabMax)
        );
        const distanceThreshold = 1000;
        if (distance < distanceThreshold) score += 10;
        else score -= 10;  // 差距太大，扣分
      }
    }

    // 3. 理想难度星级匹配（权重：15%）
    // 对于不同水平，推荐策略不同：
    // - A1-A2: 推荐同级或高一级
    // - B1-B2: 推荐同级或高一级
    // - C1-C2: 推荐同级或低一级（避免太难）
    const idealStarsMap = {
      'A1': [1, 2],
      'A2': [1, 2, 3],
      'B1': [3, 4],
      'B2': [4, 5],
      'C1': [5, 6],
      'C2': [5, 6]
    };

    const idealStars = idealStarsMap[cefrLevel] || [3];

    if (idealStars.includes(diff.stars)) {
      score += 15;
    } else {
      const starDiff = Math.min(...idealStars.map(s => Math.abs(diff.stars - s)));
      if (starDiff === 1) score += 10;
      else if (starDiff === 2) score += 5;
      else score -= 5;  // 差距太大，扣分
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
