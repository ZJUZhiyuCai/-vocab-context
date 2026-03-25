const BAND_LABELS = {
  strong: '强',
  usable: '可用',
  needsWork: '待加强'
}

const FOCUS_LABELS = {
  targetWord: '目标词使用',
  minimumLength: '表达展开',
  sentenceControl: '句子完整度',
  supportSignal: '搭配或改写',
  topicSignal: '话题贴合度',
  englishOnly: '英语输出纯度'
}

const TOPIC_KEYWORDS = {
  education: ['school', 'student', 'teacher', 'education', 'learning', 'study', 'university', 'classroom'],
  environment: ['environment', 'pollution', 'climate', 'carbon', 'green', 'recycle', 'energy', 'nature'],
  technology: ['technology', 'digital', 'online', 'internet', 'device', 'innovation', 'software', 'screen'],
  government: ['government', 'policy', 'public', 'state', 'authority', 'tax', 'law', 'funding'],
  health: ['health', 'healthy', 'medical', 'exercise', 'diet', 'hospital', 'mental', 'treatment'],
  work: ['work', 'job', 'career', 'employee', 'employer', 'office', 'salary', 'remote'],
  media: ['media', 'news', 'social', 'advertising', 'information', 'platform', 'press', 'content'],
  crime: ['crime', 'criminal', 'police', 'law', 'punishment', 'prison', 'violence', 'court'],
  culture: ['culture', 'tradition', 'heritage', 'art', 'community', 'identity', 'festival', 'value'],
  transport: ['transport', 'traffic', 'car', 'train', 'bus', 'road', 'commute', 'public transport'],
  society: ['society', 'people', 'community', 'social', 'citizen', 'public', 'family', 'inequality'],
  economy: ['economy', 'economic', 'market', 'income', 'cost', 'price', 'employment', 'growth'],
  general: ['people', 'society', 'important', 'issue', 'change', 'development']
}

function normalizeText(text = '') {
  return String(text).trim()
}

function lower(text = '') {
  return normalizeText(text).toLowerCase()
}

function countWords(text = '') {
  return normalizeText(text)
    .split(/\s+/)
    .filter(Boolean)
    .length
}

function escapeRegex(text = '') {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function containsWholeWord(text, term) {
  if (!term) return false
  const regex = new RegExp(`\\b${escapeRegex(lower(term))}\\b`, 'i')
  return regex.test(lower(text))
}

function containsAnyPhrase(text, terms = []) {
  return terms.some(term => lower(text).includes(lower(term)))
}

function containsChinese(text = '') {
  return /[\u4e00-\u9fff]/.test(text)
}

function hasSentenceControl(text, promptType) {
  const trimmed = normalizeText(text)
  if (!trimmed) return false

  if (promptType === 'speaking') {
    return countWords(trimmed) >= 8
  }

  const startsWell = /^[A-Z]/.test(trimmed)
  const endsWell = /[.!?]$/.test(trimmed)
  return countWords(trimmed) >= 6 && (startsWell || endsWell)
}

function hasTopicSignal(text, topic) {
  const keywords = TOPIC_KEYWORDS[topic] || TOPIC_KEYWORDS.general
  return containsAnyPhrase(text, keywords)
}

function minimumWordThreshold(promptType) {
  if (promptType === 'speaking') return 10
  if (promptType === 'rewrite') return 8
  return 8
}

function buildBand(score) {
  if (score >= 78) return 'strong'
  if (score >= 55) return 'usable'
  return 'needsWork'
}

/**
 * 建议优先级（从高到低）
 * 1. targetWord - 没用对目标词，最关键
 * 2. englishOnly - 夹中文，考试大忌
 * 3. minimumLength - 表达不够展开
 * 4. supportSignal - 缺少搭配/改写
 * 5. topicSignal - 偏离主题
 */
const SUGGESTION_PRIORITY = ['targetWord', 'englishOnly', 'minimumLength', 'supportSignal', 'topicSignal', 'sentenceControl']

/**
 * 生成老师式的下一步建议
 * @param {string[]} failedChecks - 未通过的检查项
 * @param {Object} context - 上下文信息（word, collocations 等）
 * @returns {string} 建议文本
 */
function pickNextStep(failedChecks, context = {}) {
  const { word, collocations = [] } = context

  const tips = {
    targetWord: `试着把 ${word || '这个词'} 放在句子的关键位置，让它成为表达的核心。`,
    englishOnly: '写作考试要求全程英语，试着把中文想法直接用简单英文表达。',
    minimumLength: '雅思写作需要展开论证，试着加一个原因或例子。',
    supportSignal: collocations.length > 0
      ? `高级词汇要配高级搭配，试试用 "${collocations[0]}"。`
      : '高级词汇要配高级搭配，试着找一个自然的搭配词。',
    topicSignal: '把句子拉回当前主题，加一个更具体的场景词。',
    sentenceControl: '句子需要更完整，检查首字母大写和结尾标点。'
  }

  // 按优先级查找第一个匹配的失败项
  for (const key of SUGGESTION_PRIORITY) {
    if (failedChecks.includes(key)) {
      return tips[key]
    }
  }

  return '继续保持，试着用更自然的句式和更具体的细节。'
}

/**
 * 生成老师式的下一步建议（带详细示例）
 * @param {string[]} failedChecks - 未通过的检查项
 * @param {Object} context - 上下文信息
 * @returns {Object} 包含 tip 和 example 的对象
 */
function pickNextStepDetailed(failedChecks, context = {}) {
  const { word, collocations = [] } = context

  const tips = {
    targetWord: {
      tip: `试着把 ${word || '这个词'} 放在句子的关键位置，让它成为表达的核心。`,
      example: `比如："The results were ${word || 'significant'} in several ways."`
    },
    englishOnly: {
      tip: '写作考试要求全程英语，试着把中文想法直接用简单英文表达。',
      example: '实在想不起来，可以用简单词代替，比如 think 代替 "认为"'
    },
    minimumLength: {
      tip: '雅思写作需要展开论证，试着加一个原因或例子。',
      example: '比如加 "because..." 或 "for example..."'
    },
    supportSignal: {
      tip: collocations.length > 0
        ? `高级词汇要配高级搭配，试试用 "${collocations[0]}"`
        : '高级词汇要配高级搭配，试着找一个自然的搭配词。',
      example: collocations.length > 0
        ? `比如 "${word || 'significant'} ${collocations[0]}"`
        : `比如 "${word || 'significant'} effect"`
    },
    topicSignal: {
      tip: '把句子拉回当前主题，加一个更具体的场景词。',
      example: '比如提到具体的数据、时间、地点'
    },
    sentenceControl: {
      tip: '句子需要更完整，检查首字母大写和结尾标点。',
      example: '确保句子以大写字母开头，以句号结束'
    }
  }

  const defaultTip = {
    tip: '继续保持，试着用更自然的句式和更具体的细节。',
    example: '多读几遍，看看是否通顺自然'
  }

  // 按优先级查找第一个匹配的失败项（与 pickNextStep 保持一致）
  for (const key of SUGGESTION_PRIORITY) {
    if (failedChecks.includes(key)) {
      return tips[key]
    }
  }

  return defaultTip
}

export function getBandLabel(band) {
  return BAND_LABELS[band] || band
}

export function getFocusLabel(key) {
  return FOCUS_LABELS[key] || key
}

export function evaluateProductionAttempt({
  text,
  word,
  collocations = [],
  paraphrase,
  promptType = 'sentence',
  topic = 'general'
}) {
  const normalized = normalizeText(text)
  const wordCount = countWords(normalized)
  const minWords = minimumWordThreshold(promptType)

  const checks = {
    targetWord: containsWholeWord(normalized, word),
    minimumLength: wordCount >= minWords,
    sentenceControl: hasSentenceControl(normalized, promptType),
    supportSignal: containsAnyPhrase(normalized, collocations) || containsWholeWord(normalized, paraphrase),
    topicSignal: hasTopicSignal(normalized, topic),
    englishOnly: !containsChinese(normalized)
  }

  let score = 0
  if (checks.targetWord) score += 28
  if (checks.minimumLength) score += 18
  if (checks.sentenceControl) score += 16
  if (checks.supportSignal) score += 16
  if (checks.topicSignal) score += 12
  if (checks.englishOnly) score += 10

  const band = buildBand(score)
  const strengthKeys = Object.entries(checks)
    .filter(([, passed]) => passed)
    .map(([key]) => key)
  const failedKeys = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([key]) => key)

  return {
    score,
    band,
    bandLabel: getBandLabel(band),
    wordCount,
    checks,
    strengthKeys,
    failedKeys,
    nextStep: pickNextStep(failedKeys, { word, collocations })
  }
}

export function buildOutputCoach(results = []) {
  const submitted = results.filter(result => result.submitted && result.feedback)

  if (!submitted.length) {
    return {
      averageScore: 0,
      bandCounts: { strong: 0, usable: 0, needsWork: 0 },
      headline: '这轮还没提交足够的英语输出，没法判断学习质量。',
      focusAreas: ['minimumLength'],
      strengths: [],
      weakWords: [],
      nextAction: '下一轮试着至少提交 3 条完整的英文句子，这样才能看到真实进步。'
    }
  }

  const bandCounts = { strong: 0, usable: 0, needsWork: 0 }
  const focusCounts = {
    targetWord: 0,
    minimumLength: 0,
    sentenceControl: 0,
    supportSignal: 0,
    topicSignal: 0,
    englishOnly: 0
  }
  const strengthCounts = {
    targetWord: 0,
    minimumLength: 0,
    sentenceControl: 0,
    supportSignal: 0,
    topicSignal: 0,
    englishOnly: 0
  }

  let scoreTotal = 0

  submitted.forEach(result => {
    scoreTotal += result.feedback.score
    bandCounts[result.feedback.band] += 1

    result.feedback.failedKeys.forEach(key => {
      focusCounts[key] += 1
    })

    result.feedback.strengthKeys.forEach(key => {
      strengthCounts[key] += 1
    })
  })

  const averageScore = Math.round(scoreTotal / submitted.length)
  const focusAreas = Object.entries(focusCounts)
    .sort((left, right) => right[1] - left[1])
    .filter(([, count]) => count > 0)
    .slice(0, 3)
    .map(([key]) => key)

  const strengths = Object.entries(strengthCounts)
    .sort((left, right) => right[1] - left[1])
    .filter(([, count]) => count > 0)
    .slice(0, 3)
    .map(([key]) => key)

  const weakWords = submitted
    .filter(result => result.feedback.band === 'needsWork')
    .slice(0, 3)
    .map(result => ({
      word: result.word,
      reason: result.feedback.failedKeys.length
        ? result.feedback.failedKeys.map(getFocusLabel).join('、')
        : '表达还不够稳定',
      nextStep: result.feedback.nextStep,
      nextStepDetailed: pickNextStepDetailed(result.feedback.failedKeys, { word: result.word })
    }))

  // 老师式的 headline
  let headline
  if (averageScore >= 78) {
    headline = '这轮表现很稳，你已经能把这个词自然地用在雅思级别的句子里了。'
  } else if (averageScore >= 55) {
    headline = '这轮表现不错，句子是通顺的，但还有提升空间让表达更地道。'
  } else {
    headline = '这轮像是还在找感觉，没关系，多练几次就自然了。'
  }

  return {
    averageScore,
    bandCounts,
    headline,
    focusAreas,
    strengths,
    weakWords,
    nextAction: pickNextStep(focusAreas)
  }
}

export function buildExamCoach(results = [], surfaceStats = {}) {
  const outputResults = results.filter(result =>
    ['writing_argument', 'speaking_frame'].includes(result.surfaceType) && result.feedback
  )

  const weakSurfaces = Object.entries(surfaceStats)
    .filter(([, stat]) => stat.total > 0)
    .map(([type, stat]) => ({
      type,
      accuracy: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0
    }))
    .sort((left, right) => left.accuracy - right.accuracy)

  const outputCoach = buildOutputCoach(outputResults)
  const weakestSurface = weakSurfaces[0]?.type || null

  // 老师式的 headline
  let headline
  if (weakestSurface) {
    const surfaceName = getSurfaceLabel(weakestSurface)
    headline = `这轮 ${surfaceName} 题型稍弱，但整体表现还不错，继续加油。`
  } else {
    headline = '这轮题型表现比较均衡，继续保持，下一步把输出质量再抬高。'
  }

  return {
    headline,
    weakestSurface,
    weakSurfaces: weakSurfaces.slice(0, 2),
    outputCoach,
    nextAction: weakestSurface
      ? `下一轮重点攻克 ${getSurfaceLabel(weakestSurface)} 题型，确保输出题不只是完成，而是写出完整的英文句子。`
      : outputCoach.nextAction
  }
}

/**
 * 获取题型标签
 */
function getSurfaceLabel(type) {
  const labels = {
    reading_rewrite: '阅读改写',
    reading_paraphrase: '阅读改写',
    listening_paraphrase: '听力转述',
    writing_argument: '写作论证',
    speaking_frame: '口语框架'
  }
  return labels[type] || type.replace('_', ' ')
}
