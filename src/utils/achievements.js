/**
 * 成就系统
 * 检测和管理用户学习成就
 */

const ACHIEVEMENTS_KEY = 'vocabcontext_achievements'

/**
 * 成就定义
 * type: 'count' | 'streak' | 'vocabulary' | 'accuracy' | 'special'
 */
export const ACHIEVEMENT_DEFINITIONS = [
  // ===== 学习数量成就 =====
  {
    id: 'first_word',
    name: '初学者',
    description: '学习第1个单词',
    icon: '🌱',
    type: 'count',
    threshold: 1,
    reward: '解锁学习之路'
  },
  {
    id: 'ten_words',
    name: '词汇新手',
    description: '学习10个单词',
    icon: '📚',
    type: 'count',
    threshold: 10,
    reward: '基础扎实'
  },
  {
    id: 'hundred_words',
    name: '词汇积累者',
    description: '学习100个单词',
    icon: '💯',
    type: 'count',
    threshold: 100,
    reward: '小有成就'
  },
  {
    id: 'five_hundred_words',
    name: '词汇达人',
    description: '学习500个单词',
    icon: '🏆',
    type: 'count',
    threshold: 500,
    reward: '词汇量突破'
  },
  {
    id: 'thousand_words',
    name: '千词大师',
    description: '学习1000个单词',
    icon: '👑',
    type: 'count',
    threshold: 1000,
    reward: '词汇大师'
  },
  {
    id: 'five_thousand_words',
    name: '词汇巨人',
    description: '学习5000个单词',
    icon: '🦁',
    type: 'count',
    threshold: 5000,
    reward: '词汇巨人'
  },
  {
    id: 'ten_thousand_words',
    name: '万词王者',
    description: '学习10000个单词',
    icon: '🐉',
    type: 'count',
    threshold: 10000,
    reward: '词汇王者'
  },

  // ===== 连续学习成就 =====
  {
    id: 'streak_3',
    name: '坚持不懈',
    description: '连续学习3天',
    icon: '🔥',
    type: 'streak',
    threshold: 3,
    reward: '保持势头'
  },
  {
    id: 'streak_7',
    name: '一周勇士',
    description: '连续学习7天',
    icon: '⚡',
    type: 'streak',
    threshold: 7,
    reward: '习惯养成'
  },
  {
    id: 'streak_14',
    name: '双周英雄',
    description: '连续学习14天',
    icon: '💪',
    type: 'streak',
    threshold: 14,
    reward: '毅力超群'
  },
  {
    id: 'streak_30',
    name: '月度传奇',
    description: '连续学习30天',
    icon: '🌟',
    type: 'streak',
    threshold: 30,
    reward: '月度传奇'
  },
  {
    id: 'streak_100',
    name: '百日筑基',
    description: '连续学习100天',
    icon: '🎖️',
    type: 'streak',
    threshold: 100,
    reward: '百日筑基完成'
  },

  // ===== 词库成就 =====
  {
    id: 'vocab_master_a2',
    name: 'A2词库大师',
    description: '完成A2词库学习',
    icon: '🥉',
    type: 'vocabulary',
    threshold: 100, // 进度100%
    vocabId: 'vocab-a2-basic'
  },
  {
    id: 'vocab_master_b1',
    name: 'B1词库大师',
    description: '完成B1词库学习',
    icon: '🥈',
    type: 'vocabulary',
    threshold: 100,
    vocabId: 'vocab-b1-intermediate'
  },
  {
    id: 'vocab_master_b2',
    name: 'B2词库大师',
    description: '完成B2词库学习',
    icon: '🥇',
    type: 'vocabulary',
    threshold: 100,
    vocabId: 'vocab-b2-upper-intermediate'
  },
  {
    id: 'vocab_master_c1',
    name: 'C1词库征服者',
    description: '完成C1词库学习',
    icon: '💎',
    type: 'vocabulary',
    threshold: 100,
    vocabId: 'vocab-c1-advanced'
  },
  {
    id: 'all_vocab_master',
    name: '全能词汇大师',
    description: '完成所有词库学习',
    icon: '🏅',
    type: 'special',
    reward: '词汇大成'
  },

  // ===== 正确率成就 =====
  {
    id: 'accuracy_90',
    name: '精准记忆',
    description: '单次学习正确率达到90%',
    icon: '🎯',
    type: 'accuracy',
    threshold: 90,
    minCount: 10 // 至少学习10个词
  },
  {
    id: 'accuracy_95',
    name: '过目不忘',
    description: '单次学习正确率达到95%',
    icon: '🧠',
    type: 'accuracy',
    threshold: 95,
    minCount: 20
  },
  {
    id: 'accuracy_perfect',
    name: '完美记忆',
    description: '单次学习正确率达到100%',
    icon: '✨',
    type: 'accuracy',
    threshold: 100,
    minCount: 10
  },

  // ===== 特殊成就 =====
  {
    id: 'night_owl',
    name: '夜猫子',
    description: '在晚上10点后学习',
    icon: '🦉',
    type: 'special',
    reward: '深夜学习'
  },
  {
    id: 'early_bird',
    name: '早起鸟',
    description: '在早上6点前学习',
    icon: '🐦',
    type: 'special',
    reward: '清晨学习'
  },
  {
    id: 'marathon_session',
    name: '学习马拉松',
    description: '单次学习100个单词',
    icon: '🏃',
    type: 'count',
    threshold: 100,
    session: true
  },
  {
    id: 'perfect_review',
    name: '复习专家',
    description: '复习50个单词全对',
    icon: '⭐',
    type: 'accuracy',
    threshold: 100,
    minCount: 50,
    isReview: true
  }
]

/**
 * 获取已解锁的成就
 * @returns {Set<string>} 成就ID集合
 */
export function getUnlockedAchievements() {
  try {
    const saved = localStorage.getItem(ACHIEVEMENTS_KEY)
    return new Set(saved ? JSON.parse(saved) : [])
  } catch (error) {
    console.error('读取成就失败:', error)
    return new Set()
  }
}

/**
 * 保存已解锁的成就
 * @param {Set<string>} unlocked - 成就ID集合
 */
export function saveUnlockedAchievements(unlocked) {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(Array.from(unlocked)))
    return true
  } catch (error) {
    console.error('保存成就失败:', error)
    return false
  }
}

/**
 * 检查并解锁成就
 * @param {Object} stats - 统计数据
 * @param {number} stats.totalLearned - 总学习单词数
 * @param {number} stats.streakDays - 连续学习天数
 * @param {number} stats.sessionCount - 本次会话学习数
 * @param {number} stats.accuracy - 正确率
 * @param {number} stats.hour - 当前小时（0-23）
 * @returns {Array} 新解锁的成就
 */
export function checkAchievements(stats) {
  const unlocked = getUnlockedAchievements()
  const newAchievements = []

  for (const achievement of ACHIEVEMENT_DEFINITIONS) {
    // 跳过已解锁的成就
    if (unlocked.has(achievement.id)) continue

    let shouldUnlock = false

    // 根据类型检查条件
    switch (achievement.type) {
      case 'count': {
        const count = achievement.session ? stats.sessionCount : stats.totalLearned
        shouldUnlock = count >= achievement.threshold
        break
      }

      case 'streak':
        shouldUnlock = stats.streakDays >= achievement.threshold
        break

      case 'vocabulary':
        if (stats.vocabProgress && stats.vocabProgress[achievement.vocabId]) {
          const progress = stats.vocabProgress[achievement.vocabId]
          shouldUnlock = progress >= achievement.threshold
        }
        break

      case 'accuracy': {
        const minCount = achievement.minCount || 5
        if (stats.sessionCount >= minCount && stats.accuracy >= achievement.threshold) {
          shouldUnlock = true
        }
        break
      }

      case 'special':
        if (achievement.id === 'night_owl' && stats.hour >= 22) {
          shouldUnlock = true
        } else if (achievement.id === 'early_bird' && stats.hour <= 6) {
          shouldUnlock = true
        } else if (achievement.id === 'all_vocab_master' && stats.allVocabComplete) {
          shouldUnlock = true
        }
        break
    }

    // 解锁成就
    if (shouldUnlock) {
      unlocked.add(achievement.id)
      newAchievements.push(achievement)
    }
  }

  // 保存新解锁的成就
  if (newAchievements.length > 0) {
    saveUnlockedAchievements(unlocked)
  }

  return newAchievements
}

/**
 * 获取成就列表（带解锁状态）
 * @returns {Array} 成就列表
 */
export function getAchievementsList() {
  const unlocked = getUnlockedAchievements()

  return ACHIEVEMENT_DEFINITIONS.map(achievement => ({
    ...achievement,
    unlocked: unlocked.has(achievement.id)
  }))
}

/**
 * 获取成就统计
 * @returns {Object} 统计数据
 */
export function getAchievementStats() {
  const unlocked = getUnlockedAchievements()
  const total = ACHIEVEMENT_DEFINITIONS.length

  return {
    unlocked: unlocked.size,
    total,
    percentage: Math.round((unlocked.size / total) * 100)
  }
}

/**
 * 重置所有成就（谨慎使用）
 */
export function resetAllAchievements() {
  localStorage.removeItem(ACHIEVEMENTS_KEY)
  console.log('⚠️ 所有成就已重置')
}
