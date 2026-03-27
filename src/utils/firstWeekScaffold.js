/**
 * First-Week Learning Scaffold
 * 首周学习脚手架
 *
 * 为新 IELTS 用户提供 Day 1-7 的结构化学习路径
 */

import { getContextSessionHistory } from './contextSessionEngine.js'
import { getOutputStudioHistory } from './outputStudioEngine.js'
import { getExamDrillHistory } from './examDrillEngine.js'

const PROGRESS_KEY = 'vocabcontext_first_week_progress'
export const FIRST_WEEK_PROGRESS_EVENT = 'vocabcontext:first-week-progress-updated'

function emitFirstWeekProgressUpdate(progress) {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new CustomEvent(FIRST_WEEK_PROGRESS_EVENT, {
    detail: progress
  }))
}

/**
 * 首周学习任务定义
 */
export const FIRST_WEEK_TASKS = [
  {
    day: 1,
    title: '入门设置',
    tasks: [
      { id: 'onboarding', label: '完成入门引导', type: 'auto' },
      { id: 'learn_10', label: '学习前 10 个词', type: 'count', target: 10 }
    ],
    tip: '先熟悉一下应用，不需要急着学太多'
  },
  {
    day: 2,
    title: '词汇积累',
    tasks: [
      { id: 'learn_20', label: '学习 20 个词', type: 'count', target: 20 },
      { id: 'quiz', label: '尝试一次测验', type: 'once' }
    ],
    tip: '边学边测，看看自己记住了多少'
  },
  {
    day: 3,
    title: '语境练习',
    tasks: [
      { id: 'context_session', label: '完成一次 Context-first', type: 'once' }
    ],
    tip: '去语境里见见这些词'
  },
  {
    day: 4,
    title: '输出训练',
    tasks: [
      { id: 'output_studio', label: '完成一次 Output Studio', type: 'once' },
      { id: 'learn_total_30', label: '累计学习 30 个词', type: 'total', target: 30 }
    ],
    tip: '试着用这些词造句'
  },
  {
    day: 5,
    title: '考试迁移',
    tasks: [
      { id: 'exam_drills', label: '完成一次 Exam Drills', type: 'once' }
    ],
    tip: '检验一下考试场景下的迁移能力'
  },
  {
    day: 6,
    title: '复习巩固',
    tasks: [
      { id: 'review', label: '完成一次复习练习', type: 'once' },
      { id: 'learn_more_10', label: '学习更多新词', type: 'count', target: 10 }
    ],
    tip: '回头看看前几天学过的词'
  },
  {
    day: 7,
    title: '完整循环',
    tasks: [
      { id: 'full_loop', label: '完成一轮完整练习', type: 'multi', targets: ['context', 'output', 'exam'] }
    ],
    tip: '你已经入门了，继续保持'
  }
]

/**
 * 获取首周进度
 * @returns {Object|null}
 */
export function getFirstWeekProgress() {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

/**
 * 保存首周进度
 * @param {Object} progress
 */
export function saveFirstWeekProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
    emitFirstWeekProgressUpdate(progress)
  } catch (error) {
    console.error('保存首周进度失败:', error)
  }
}

/**
 * 初始化首周进度（新用户首次进入）
 */
export function initFirstWeekProgress() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  const progress = {
    startedAt: `${year}-${month}-${day}`,
    currentDay: 1,
    completedTasks: [],
    dayCompleted: []
  }

  saveFirstWeekProgress(progress)
  return progress
}

/**
 * 获取或创建首周进度
 */
export function getOrCreateFirstWeekProgress() {
  let progress = getFirstWeekProgress()
  if (!progress) {
    progress = initFirstWeekProgress()
  }
  return progress
}

/**
 * 判断是否应该显示首周进度面板
 * @param {Object} currentVocab - 当前词库
 * @returns {boolean}
 */
export function shouldShowFirstWeekPanel(currentVocab) {
  // 只对 IELTS 词库显示
  if (!currentVocab || currentVocab.category !== 'IELTS') return false

  // 检查是否已完成首周
  const progress = getFirstWeekProgress()
  if (!progress) return true // 新用户，显示

  if (progress.dayCompleted?.length >= 7) return false // 已完成首周

  return true
}

function parseLocalDateString(value) {
  if (typeof value !== 'string') return null

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  // Reject invalid calendar dates that Date() would otherwise normalize.
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  date.setHours(0, 0, 0, 0)
  return date
}

/**
 * 计算当前天数（基于开始日期）
 * 使用本地日期解析，避免 UTC 时区问题
 * @param {Object} progress
 * @returns {number}
 */
export function calculateCurrentDay(progress) {
  if (!progress?.startedAt) return 1

  const startDate = parseLocalDateString(progress.startedAt)
  if (!startDate) return 1

  const today = new Date()

  // 重置时间部分，只比较日期
  today.setHours(0, 0, 0, 0)

  const diffTime = today - startDate
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  // Day 1 是开始当天
  return Math.min(Math.max(diffDays + 1, 1), 7)
}

/**
 * 获取今天的任务
 * @param {Object} progress
 * @returns {Object}
 */
export function getTodayTask(progress) {
  const currentDay = calculateCurrentDay(progress)
  const dayTask = FIRST_WEEK_TASKS[currentDay - 1]

  if (!dayTask) return null

  const completedTasks = progress?.completedTasks || []

  return {
    day: currentDay,
    title: dayTask.title,
    tip: dayTask.tip,
    tasks: dayTask.tasks.map(task => ({
      ...task,
      completed: completedTasks.includes(task.id)
    }))
  }
}

/**
 * 检查任务是否完成
 * @param {string} taskId
 * @param {Object} context - 额外上下文
 * @returns {boolean}
 */
export function checkTaskCompletion(taskId, context = {}) {
  const { learnedCount = 0, totalLearned = 0 } = context
  const progress = getFirstWeekProgress()

  // 对于需要手动标记完成的任务，检查 completedTasks
  // 这些任务包括: onboarding, quiz, review
  const manualTasks = ['onboarding', 'quiz', 'review']
  if (manualTasks.includes(taskId)) {
    return progress?.completedTasks?.includes(taskId) || false
  }

  // 可自动检测的任务
  if (taskId === 'learn_10') {
    return learnedCount >= 10
  }

  if (taskId === 'learn_20') {
    return learnedCount >= 20
  }

  if (taskId === 'context_session') {
    const history = getContextSessionHistory()
    return (history?.sessions || 0) >= 1
  }

  if (taskId === 'output_studio') {
    const history = getOutputStudioHistory()
    return (history?.sessions || 0) >= 1
  }

  if (taskId === 'exam_drills') {
    const history = getExamDrillHistory()
    return (history?.sessions || 0) >= 1
  }

  if (taskId === 'learn_total_30') {
    return totalLearned >= 30
  }

  if (taskId === 'learn_more_10') {
    return learnedCount >= 10
  }

  if (taskId === 'full_loop') {
    const contextHistory = getContextSessionHistory()
    const outputHistory = getOutputStudioHistory()
    const examHistory = getExamDrillHistory()
    return (contextHistory?.sessions || 0) >= 1 &&
           (outputHistory?.sessions || 0) >= 1 &&
           (examHistory?.sessions || 0) >= 1
  }

  return false
}

/**
 * 标记任务完成
 * @param {string} taskId
 */
export function markTaskCompleted(taskId) {
  const progress = getOrCreateFirstWeekProgress()
  if (!progress.completedTasks.includes(taskId)) {
    progress.completedTasks.push(taskId)
    saveFirstWeekProgress(progress)
  }
}

/**
 * 检查并更新当天完成状态
 * @param {Object} context
 * @returns {Object} 更新后的进度
 */
export function updateDayProgress(context = {}) {
  const progress = getOrCreateFirstWeekProgress()
  const currentDay = calculateCurrentDay(progress)
  const dayTask = FIRST_WEEK_TASKS[currentDay - 1]

  if (!dayTask) return progress

  // 检查当天所有任务是否完成
  const allCompleted = dayTask.tasks.every(task => {
    // 如果已经标记完成，直接返回 true
    if (progress.completedTasks.includes(task.id)) return true

    // 检查任务状态
    const completed = checkTaskCompletion(task.id, context)
    if (completed && !progress.completedTasks.includes(task.id)) {
      progress.completedTasks.push(task.id)
    }
    return completed
  })

  // 如果当天所有任务完成，标记日期完成
  if (allCompleted && !progress.dayCompleted.includes(currentDay)) {
    progress.dayCompleted.push(currentDay)
  }

  saveFirstWeekProgress(progress)
  return progress
}

/**
 * 获取首周完成百分比
 * @param {Object} progress
 * @returns {number}
 */
export function getFirstWeekProgressPercent(progress) {
  if (!progress) return 0
  const completedDays = progress.dayCompleted?.length || 0
  return Math.round((completedDays / 7) * 100)
}

/**
 * 重置首周进度（用于测试）
 */
export function resetFirstWeekProgress() {
  localStorage.removeItem(PROGRESS_KEY)
  emitFirstWeekProgressUpdate(null)
}
