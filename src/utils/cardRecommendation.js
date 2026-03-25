/**
 * Card-level Next Step Recommendation
 * 卡片级下一步建议
 *
 * 当用户在 Today 页面"认识"一个 bundle 词后，
 * 根据学习进度推荐下一步应该去哪层练习
 */

import { getContextSessionHistory } from './contextSessionEngine.js'
import { getOutputStudioHistory } from './outputStudioEngine.js'
import { getExamDrillHistory } from './examDrillEngine.js'

/**
 * 判断是否应该显示卡片级推荐
 * 条件：
 * 1. 当前词库是 IELTS 类型
 * 2. 当前词是 bundle 词
 * 3. 用户刚认识这个词（intervalLevel >= 1）
 * 4. 不是每次都显示，而是间隔一定次数
 *
 * @param {Object} vocab - 当前词库
 * @param {Object} word - 当前词
 * @param {Object} reviewState - 复习状态
 * @param {number} learnedCount - 本次会话"认识"的次数
 * @returns {boolean}
 */
export function shouldShowCardRecommendation(vocab, word, reviewState, learnedCount) {
  // 只对 IELTS 词库显示
  if (!vocab || vocab.category !== 'IELTS') return false

  // 只对 bundle 词显示
  if (!word || !word.isBundle) return false

  // 用户刚认识这个词（level >= 1 表示至少复习过一次）
  if (!reviewState || reviewState.intervalLevel < 1) return false

  // 每认识 3、6、9... 个词显示一次（避免太频繁）
  if (learnedCount % 3 !== 0) return false

  return true
}

/**
 * 从历史记录中获取特定 topic 的练习次数
 */
function getTopicSessions(history, topic) {
  if (!history) return 0

  // 优先使用 topicStats
  if (history.topicStats && history.topicStats[topic]) {
    return history.topicStats[topic].sessions || 0
  }

  // 降级到全局 sessions
  return history.sessions || 0
}

/**
 * 构建卡片级推荐内容
 *
 * @param {Object} vocab - 当前词库
 * @param {Object} word - 当前词
 * @returns {Object|null} 推荐内容 { stage, title, ctaLabel, mode, targetTopic }
 */
export function buildCardRecommendation(vocab, word) {
  if (!vocab || vocab.category !== 'IELTS') return null

  const topic = word?.topic || 'general'

  // 获取各层练习历史
  const contextHistory = getContextSessionHistory()
  const outputHistory = getOutputStudioHistory()
  const examHistory = getExamDrillHistory()

  // 计算当前 topic 的各层进度（而非全局）
  const contextSessions = getTopicSessions(contextHistory, topic)
  const outputSessions = getTopicSessions(outputHistory, topic)
  const examSessions = getTopicSessions(examHistory, topic)

  // 根据当前 topic 的练习次数推荐
  if (contextSessions < 2) {
    return {
      stage: 'context',
      title: '去语境里见见这个词',
      ctaLabel: '做 Context-first',
      mode: 'session',
      targetTopic: topic
    }
  }

  if (outputSessions < 2) {
    return {
      stage: 'output',
      title: '试着用这个词造句',
      ctaLabel: '去 Output Studio',
      mode: 'outputStudio',
      targetTopic: topic
    }
  }

  if (examSessions < 1) {
    return {
      stage: 'exam',
      title: '检验一下考试迁移',
      ctaLabel: '去 Exam Drills',
      mode: 'examDrills',
      targetTopic: topic
    }
  }

  // 已经练得比较多了，推荐继续巩固
  return {
    stage: 'loop',
    title: '继续保持，多练几次就稳了',
    ctaLabel: '继续练习',
    mode: 'outputStudio',
    targetTopic: topic
  }
}

/**
 * 获取推荐的显示时机（毫秒）
 */
export function getRecommendationDelay() {
  return 500
}