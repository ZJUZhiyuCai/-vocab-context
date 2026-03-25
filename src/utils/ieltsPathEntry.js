import { getContextSessionHistory } from './contextSessionEngine.js'
import { getOutputStudioHistory } from './outputStudioEngine.js'
import { getExamDrillHistory } from './examDrillEngine.js'

const CORE_TOPICS = ['education', 'government', 'environment', 'technology']
const PENDING_TARGET_KEY = 'vocabman-ielts-pending-target'

export function topicLabel(topic) {
  const labels = {
    education: '教育',
    environment: '环境',
    technology: '科技',
    government: '政府',
    health: '健康',
    work: '工作',
    media: '媒体',
    crime: '犯罪',
    culture: '文化',
    transport: '交通',
    society: '社会',
    economy: '经济',
    general: '通用'
  }

  return labels[topic] || topic || '通用'
}

function safePercent(numerator, denominator) {
  if (!denominator) return 0
  return Math.round((numerator / denominator) * 100)
}

function loadHistory() {
  const contextHistory = getContextSessionHistory()
  const outputHistory = getOutputStudioHistory()
  const examHistory = getExamDrillHistory()

  return {
    context: {
      ...contextHistory,
      accuracy: safePercent(contextHistory.totalCorrect || 0, (contextHistory.totalBundles || 0) * 2)
    },
    output: {
      ...outputHistory,
      accuracy: safePercent(outputHistory.totalOutputs || 0, outputHistory.totalWords || 0)
    },
    exam: {
      ...examHistory,
      accuracy: safePercent(examHistory.totalCorrect || 0, examHistory.totalItems || 0)
    }
  }
}

function pickRecommendedTopic(history) {
  const topicScores = CORE_TOPICS.map(topic => {
    const contextSessions = history.context?.topicStats?.[topic]?.sessions || 0
    const outputSessions = history.output?.topicStats?.[topic]?.sessions || 0
    const examSessions = history.exam?.topicStats?.[topic]?.sessions || 0
    return {
      topic,
      score: contextSessions + outputSessions + examSessions
    }
  }).sort((left, right) => left.score - right.score)

  return topicScores[0]?.topic || 'education'
}

function readTopicProgress(historyBlock, topicKey, type, vocabId = '') {
  const vocabStats = vocabId ? historyBlock?.vocabStats?.[vocabId] : null
  if (vocabStats) {
    if (type === 'context') {
      return {
        sessions: vocabStats.sessions || 0,
        accuracy: safePercent(vocabStats.totalCorrect || 0, (vocabStats.totalBundles || 0) * 2),
        volume: vocabStats.totalBundles || 0
      }
    }
    if (type === 'output') {
      return {
        sessions: vocabStats.sessions || 0,
        accuracy: safePercent(vocabStats.qualityScoreTotal || 0, vocabStats.sessions || 0),
        volume: vocabStats.totalOutputs || 0
      }
    }
    return {
      sessions: vocabStats.sessions || 0,
      accuracy: safePercent(vocabStats.totalCorrect || 0, vocabStats.totalItems || 0),
      volume: vocabStats.totalItems || 0
    }
  }

  const topicStats = historyBlock?.topicStats?.[topicKey]
  if (topicStats) {
    if (type === 'context') {
      return {
        sessions: topicStats.sessions || 0,
        accuracy: safePercent(topicStats.totalCorrect || 0, (topicStats.totalBundles || 0) * 2),
        volume: topicStats.totalBundles || 0
      }
    }
    if (type === 'output') {
      return {
        sessions: topicStats.sessions || 0,
        accuracy: safePercent(topicStats.qualityScoreTotal || 0, topicStats.sessions || 0),
        volume: topicStats.totalOutputs || 0
      }
    }
    return {
      sessions: topicStats.sessions || 0,
      accuracy: safePercent(topicStats.totalCorrect || 0, topicStats.totalItems || 0),
      volume: topicStats.totalItems || 0
    }
  }

  if (type === 'context') {
    return {
      sessions: historyBlock?.sessions || 0,
      accuracy: historyBlock?.accuracy || 0,
      volume: historyBlock?.totalBundles || 0
    }
  }

  if (type === 'output') {
    return {
      sessions: historyBlock?.sessions || 0,
      accuracy: historyBlock?.accuracy || 0,
      volume: historyBlock?.totalOutputs || 0
    }
  }

  return {
    sessions: historyBlock?.sessions || 0,
    accuracy: historyBlock?.accuracy || 0,
    volume: historyBlock?.totalItems || 0
  }
}

export function buildIeltsQuickRecommendation(currentVocab) {
  if (!currentVocab || currentVocab.category !== 'IELTS') {
    return null
  }

  const history = loadHistory()
  const activeTopic = currentVocab.topic || pickRecommendedTopic(history)
  const activeLabel = topicLabel(activeTopic)
  const vocabId = currentVocab.id || ''

  const contextProgress = readTopicProgress(history.context, activeTopic, 'context', vocabId)
  const outputProgress = readTopicProgress(history.output, activeTopic, 'output', vocabId)
  const examProgress = readTopicProgress(history.exam, activeTopic, 'exam', vocabId)

  const contextReady = contextProgress.sessions >= 3 && contextProgress.accuracy >= 70
  const outputReady = outputProgress.sessions >= 2 && outputProgress.volume >= 4 && outputProgress.accuracy >= 60
  const examReady = examProgress.sessions >= 2 && examProgress.accuracy >= 65

  if (!contextReady) {
    return {
      stage: 'context',
      mode: 'session',
      targetTopic: activeTopic,
      title: '下一步：先练语境理解',
      description: `${activeLabel} 主题的 Context-first 还没练稳。建议先把“看懂 + 改写”做稳定。`,
      ctaLabel: '去做 Context-first'
    }
  }

  if (currentVocab.ieltsTrackType !== 'topic' && !outputReady) {
    return {
      stage: 'topic',
      mode: 'session',
      targetTopic: activeTopic,
      title: '下一步：切入 Topic Packs',
      description: `Foundation 基础已经够用，建议转去 ${activeLabel} Topic Pack 深练。`,
      ctaLabel: `切到 ${activeLabel} Topic`
    }
  }

  if (!outputReady) {
    return {
      stage: 'output',
      mode: 'outputStudio',
      targetTopic: activeTopic,
      title: '下一步：把词真正写出来',
      description: `${activeLabel} 主题的输出还不够稳定，建议先做 Output Studio。`,
      ctaLabel: '去做 Output Studio'
    }
  }

  if (!examReady) {
    return {
      stage: 'exam',
      mode: 'examDrills',
      targetTopic: activeTopic,
      title: '下一步：转入考试迁移',
      description: `${activeLabel} 主题已经能输出，下一步该验证考试场景迁移。`,
      ctaLabel: '去做 Exam Drills'
    }
  }

  return {
    stage: 'loop',
    mode: 'outputStudio',
    targetTopic: activeTopic,
    title: '下一步：继续主题循环',
    description: `${activeLabel} 主题可以进入“Output + Exam”交替巩固。`,
    ctaLabel: '继续 IELTS 路径'
  }
}

export function setPendingIeltsPathTarget(payload) {
  try {
    localStorage.setItem(PENDING_TARGET_KEY, JSON.stringify({
      ...payload,
      createdAt: Date.now()
    }))
  } catch {
    // ignore
  }
}

export function consumePendingIeltsPathTarget() {
  try {
    const raw = localStorage.getItem(PENDING_TARGET_KEY)
    if (!raw) return null
    localStorage.removeItem(PENDING_TARGET_KEY)
    const parsed = JSON.parse(raw)
    if (!parsed?.mode) return null
    return parsed
  } catch {
    return null
  }
}
