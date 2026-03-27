/**
 * 学习历史记录工具
 * 记录每天学习的单词数量，用于生成学习热力图
 */

import logger from './logger.js'

const HISTORY_KEY = 'vocabcontext_study_history'

/**
 * 获取学习历史
 * @returns {Object} - { 'YYYY-MM-DD': count }
 */
export function getStudyHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch (error) {
    logger.error('读取学习历史失败:', error)
    return {}
  }
}

/**
 * 保存学习历史
 * @param {Object} history - { 'YYYY-MM-DD': count }
 */
export function saveStudyHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    return true
  } catch (error) {
    logger.error('保存学习历史失败:', error)
    return false
  }
}


import { syncService } from './syncService'

/**
 * 记录今日学习的单词数量并同步到云端
 */
export function recordTodayStudy(count) {
  const history = getStudyHistory()
  const today = getTodayKey()

  // 累加今天的数量
  history[today] = (history[today] || 0) + count

  saveStudyHistory(history)

  // 异步同步到云端
  syncService.syncStudyHistory(today, history[today], 0).catch(err => {
    logger.warn('⚠️ 同步学习历史失败:', err);
  });
}

/**
 * 获取今日已学习的单词数量
 * @returns {number}
 */
export function getTodayStudyCount() {
  const history = getStudyHistory()
  const today = getTodayKey()
  return history[today] || 0
}

/**
 * 获取最近N天的学习数据
 * @param {number} days - 天数
 * @returns {Array} - [{ date: 'YYYY-MM-DD', count: 0, label: 'M/D' }]
 */
export function getRecentStudyDays(days = 14) {
  const history = getStudyHistory()
  const result = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateKey = `${year}-${month}-${day}`
    const label = `${date.getMonth() + 1}/${date.getDate()}`

    result.push({
      date: dateKey,
      label,
      count: history[dateKey] || 0
    })
  }

  return result
}

/**
 * 获取今日日期的key
 * @returns {string} - 'YYYY-MM-DD'
 */
function getTodayKey() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 获取连续学习天数
 * @returns {number}
 */
export function getStreakDays() {
  const history = getStudyHistory()
  const today = new Date()
  let streak = 0

  // 检查从今天开始往回数连续学习的天数
  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateKey = `${year}-${month}-${day}`

    if (history[dateKey] && history[dateKey] > 0) {
      streak++
    } else if (i === 0) {
      // 今天还没学习，继续检查昨天
      continue
    } else {
      // 中断了
      break
    }
  }

  return streak
}

/**
 * 获取总学习天数
 * @returns {number}
 */
export function getTotalStudyDays() {
  const history = getStudyHistory()
  return Object.values(history).filter(count => count > 0).length
}
