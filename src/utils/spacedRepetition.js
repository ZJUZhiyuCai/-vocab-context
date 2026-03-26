/**
 * 艾宾浩斯记忆曲线 - 简化版
 * 复习间隔：5分钟、30分钟、12小时、2天、7天、21天
 */

// 复习间隔（分钟）
const REVIEW_INTERVALS = [
  5,        // 5分钟后
  30,       // 30分钟后
  720,      // 12小时后
  2880,     // 2天后
  10080,    // 7天后
  30240     // 21天后
];

/**
 * 计算下次复习时间
 * @param {number} intervalLevel - 当前间隔等级 (0-5)
 * @param {number} easeFactor - 难度因子 (1.3-2.5)，默认2.5
 * @returns {number} 下次复习时间戳
 */
export function calculateNextReview(intervalLevel, easeFactor = 2.5) {
  const intervalMinutes = REVIEW_INTERVALS[Math.min(intervalLevel, REVIEW_INTERVALS.length - 1)];

  // 根据难度因子调整间隔
  const adjustedInterval = intervalMinutes * easeFactor;

  return Date.now() + adjustedInterval * 60 * 1000;
}

/**
 * 更新单词熟练度
 * @param {number} currentLevel - 当前间隔等级
 * @param {boolean} isCorrect - 是否回答正确
 * @param {number} easeFactor - 当前难度因子
 * @returns {object} { intervalLevel, easeFactor }
 */
export function updateWordLevel(currentLevel, isCorrect, easeFactor = 2.5) {
  let newLevel = currentLevel;
  let newEaseFactor;

  if (isCorrect) {
    // 回答正确，提升间隔等级
    if (newLevel < REVIEW_INTERVALS.length - 1) {
      newLevel++;
    }
    // 略微提升难度因子
    newEaseFactor = Math.min(easeFactor + 0.1, 2.5);
  } else {
    // 回答错误，重置间隔等级
    newLevel = 0;
    // 降低难度因子
    newEaseFactor = Math.max(easeFactor - 0.2, 1.3);
  }

  return { intervalLevel: newLevel, easeFactor: newEaseFactor };
}

/**
 * 创建单词复习状态
 * @returns {object}
 */
export function createWordReviewState() {
  return {
    intervalLevel: 0,
    easeFactor: 2.5,
    nextReview: Date.now(), // 立即复习
    lastReview: Date.now(),
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0
  };
}

/**
 * 检查单词是否需要复习
 * @param {object} reviewState - 单词复习状态
 * @returns {boolean}
 */
export function needsReview(reviewState) {
  if (!reviewState) return false;
  return Date.now() >= reviewState.nextReview;
}

/**
 * 获取复习优先级分数
 * 分数越高，优先级越高
 * @param {object} reviewState - 单词复习状态
 * @returns {number}
 */
export function getReviewPriority(reviewState) {
  if (!reviewState) return 0;

  const overdue = Date.now() - reviewState.nextReview;
  const overdueMinutes = overdue / (60 * 1000);

  // 基础分数：超时越久，分数越高
  let priority = Math.floor(overdueMinutes);

  // 调整因素：
  // - 新单词（reviewCount=0）优先级更高
  if (reviewState.reviewCount === 0) {
    priority += 1000;
  }

  // - 错误次数多的优先级更高
  priority += reviewState.incorrectCount * 500;

  return priority;
}

/**
 * 获取今日复习统计
 * @param {object} reviewStates - 所有单词的复习状态
 * @returns {object}
 */
export function getTodayReviewStats(reviewStates) {
  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStartTime = todayStart.getTime();

  let dueCount = 0;
  let reviewedCount = 0;
  let correctCount = 0;
  let totalReviews = 0;

  Object.values(reviewStates).forEach(state => {
    // 需要复习的单词
    if (state.nextReview <= now) {
      dueCount++;
    }

    // 今日已复习的单词
    if (state.lastReview >= todayStartTime) {
      reviewedCount++;
      totalReviews += state.correctCount + state.incorrectCount;
      correctCount += state.correctCount;
    }
  });

  return {
    dueCount,
    reviewedCount,
    correctCount,
    incorrectCount: totalReviews - correctCount,
    accuracy: totalReviews > 0 ? Math.round((correctCount / totalReviews) * 100) : 0
  };
}

/**
 * 获取复习队列（增强版：优先显示不认识的单词）
 * 返回需要复习的单词ID数组，按优先级排序
 * @param {object} reviewStates - 所有单词的复习状态
 * @param {Set} forgotten - 不认识的单词ID集合
 * @param {number} limit - 最大返回数量
 * @returns {Array} 单词对象数组，包含 wordId, priority, type
 */
export function getReviewQueue(reviewStates, forgotten = new Set(), limit = 20) {
  const queue = [];

  // 1. 添加所有不认识的单词（优先级 100 - 最高优先级）
  forgotten.forEach(wordId => {
    queue.push({
      wordId,
      priority: 100, // 最高优先级
      type: 'forgotten' // 标记为不认识的单词
    });
  });

  // 2. 添加需要复习的单词（优先级基于间隔重复算法）
  Object.entries(reviewStates).forEach(([wordId, state]) => {
    if (needsReview(state)) {
      // 避免重复：如果单词已经在 forgotten 中，不重复添加
      if (!forgotten.has(wordId)) {
        queue.push({
          wordId,
          priority: getReviewPriority(state),
          type: 'review' // 标记为间隔重复复习
        });
      }
    }
  });

  // 按优先级排序（分数越高越优先）
  queue.sort((a, b) => b.priority - a.priority);

  // 返回前N个单词对象（包含类型信息）
  return queue.slice(0, limit);
}

/**
 * 计算学习强度
 * @param {object} reviewStates - 所有单词的复习状态
 * @returns {string} 'light', 'moderate', 'heavy', 'intense'
 */
export function getStudyIntensity(reviewStates) {
  const dueCount = Object.values(reviewStates).filter(state => needsReview(state)).length;

  if (dueCount === 0) return 'none';
  if (dueCount <= 10) return 'light';
  if (dueCount <= 30) return 'moderate';
  if (dueCount <= 50) return 'heavy';
  return 'intense';
}
