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

function pickNextStep(failedChecks) {
  if (failedChecks.includes('targetWord')) {
    return '下一轮先确保把目标词自然放进句子主干。'
  }
  if (failedChecks.includes('englishOnly')) {
    return '下一轮尽量全程用英语表达，不要夹中文。'
  }
  if (failedChecks.includes('minimumLength')) {
    return '下一轮至少补一层原因、结果或例子，把句子写满。'
  }
  if (failedChecks.includes('supportSignal')) {
    return '下一轮尽量带一个搭配或改写表达，不要只孤立使用单词。'
  }
  if (failedChecks.includes('topicSignal')) {
    return '下一轮把句子拉回当前主题，补一个更具体的场景词。'
  }
  return '下一轮继续保持，用更自然的句式和更具体的细节提升表达。'
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
    nextStep: pickNextStep(failedKeys)
  }
}

export function buildOutputCoach(results = []) {
  const submitted = results.filter(result => result.submitted && result.feedback)

  if (!submitted.length) {
    return {
      averageScore: 0,
      bandCounts: { strong: 0, usable: 0, needsWork: 0 },
      headline: '这一轮还没有足够的英语产出来判断学习质量。',
      focusAreas: ['minimumLength'],
      strengths: [],
      weakWords: [],
      nextAction: '下一轮至少提交 3 条完整英文输出，我们才能看到真实学习增益。'
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
      nextStep: result.feedback.nextStep
    }))

  const headline = averageScore >= 78
    ? '这轮产出已经接近“会用词”，不只是“认得词”。'
    : averageScore >= 55
      ? '这轮输出已经开始可用，但还没稳定到考试场景。'
      : '这轮更像在试词，还没有把词真正写成自然英语。'

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

  const headline = weakestSurface
    ? `你当前最薄弱的考试表面是 ${weakestSurface.replace('_', ' ')}，而且产出质量还可以继续拉高。`
    : '这轮题型表现比较均衡，下一步重点是把输出质量再抬高。'

  return {
    headline,
    weakestSurface,
    weakSurfaces: weakSurfaces.slice(0, 2),
    outputCoach,
    nextAction: weakestSurface
      ? '下一轮优先重做最弱题型，并确保输出题不只是完成，而是写出完整英文句子。'
      : outputCoach.nextAction
  }
}
