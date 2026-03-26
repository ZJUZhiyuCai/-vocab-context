/**
 * Context Practice Utilities
 * Bundle processing, ranking, and session management functions
 */

// ============================================
// Constants
// ============================================

export const SESSION_SIZE_STORAGE_KEY = 'vocabman-context-practice-size'
export const PRIORITY_TOPICS = ['education', 'environment', 'technology']
export const CORE_TOPIC_ORDER = ['education', 'government', 'environment', 'technology']

export const sessionSizeOptions = [
  { value: 5, label: '热身' },
  { value: 8, label: '标准' },
  { value: 12, label: '冲刺' }
]

// ============================================
// Session Size Storage
// ============================================

/**
 * Load session size from localStorage
 * @returns {number} Session size (default: 8)
 */
export function loadSessionSize() {
  try {
    const saved = localStorage.getItem(SESSION_SIZE_STORAGE_KEY)
    return saved ? parseInt(saved, 10) : 8
  } catch {
    return 8
  }
}

/**
 * Save session size to localStorage
 * @param {number} size - Session size
 */
export function saveSessionSize(size) {
  try {
    localStorage.setItem(SESSION_SIZE_STORAGE_KEY, String(size))
  } catch {
    // no-op: local storage is optional
  }
}

// ============================================
// Bundle Processing
// ============================================

/**
 * Normalize a word into a bundle format
 * @param {Object} word - Word object
 * @returns {Object} Normalized bundle
 */
export function normalizeBundle(word) {
  const id = word.id || word.bundleId || word.word
  const contexts = Array.isArray(word.contexts)
    ? word.contexts
        .map((context, index) => ({
          ...context,
          id: context.id || `${id}-context-${index}`,
          text: context.text || context.sentence || '',
          translation: context.translation || '',
          kind: context.kind || context.purpose || 'reading',
          purpose: context.purpose || context.kind || 'reading'
        }))
        .filter(context => context.text)
    : []

  return {
    ...word,
    id,
    bundleId: word.bundleId || id,
    meaning: word.meaning || word.chineseMeaning || '',
    englishDefinition: word.englishDefinition || word.sense || '',
    paraphrases: Array.isArray(word.paraphrases) ? word.paraphrases.filter(Boolean) : [],
    collocations: Array.isArray(word.collocations) ? word.collocations.filter(Boolean) : [],
    contexts,
    topic: word.topic || 'general',
    draft: Boolean(word.draft)
  }
}

/**
 * Check if a bundle is eligible for practice
 * @param {Object} bundle - Bundle to check
 * @returns {boolean} True if eligible
 */
export function isEligibleBundle(bundle) {
  return Boolean(
    bundle.word &&
      bundle.meaning &&
      bundle.contexts.length > 0 &&
      bundle.paraphrases.length > 0 &&
      !bundle.draft
  )
}

/**
 * Compare two bundles for sorting
 * @param {Object} left - First bundle
 * @param {Object} right - Second bundle
 * @param {Object} reviewStates - Review states object
 * @param {number} now - Current timestamp
 * @returns {number} Comparison result
 */
export function compareBundles(left, right, reviewStates, now) {
  const leftScore = rankBundle(left, reviewStates, now)
  const rightScore = rankBundle(right, reviewStates, now)

  if (leftScore !== rightScore) {
    return rightScore - leftScore
  }

  return left.word.localeCompare(right.word)
}

/**
 * Rank a bundle for sorting priority
 * @param {Object} bundle - Bundle to rank
 * @param {Object} reviewStates - Review states object
 * @param {number} now - Current timestamp
 * @returns {number} Rank score (higher = more urgent)
 */
export function rankBundle(bundle, reviewStates, now) {
  const state = reviewStates?.[bundle.id]
  const isDue = Boolean(state?.nextReview && state.nextReview <= now)
  const topicBonus = PRIORITY_TOPICS.includes(bundle.topic) ? 3 : 0
  const reviewCount = state?.reviewCount || 0
  const contextBonus = Math.min(bundle.contexts.length, 3)
  const paraphraseBonus = Math.min(bundle.paraphrases.length, 2)

  return (
    (isDue ? 100 : 0) +
    topicBonus * 10 +
    contextBonus * 4 +
    paraphraseBonus * 3 +
    reviewCount
  )
}

// ============================================
// Topic Utilities
// ============================================

/**
 * Get human-readable topic label
 * @param {string} topic - Topic key
 * @returns {string} Topic label
 */
export function topicLabel(topic) {
  const labels = {
    education: '教育',
    environment: '环境',
    technology: '科技',
    government: '政府',
    health: '健康',
    society: '社会',
    economy: '经济',
    work: '工作',
    media: '媒体',
    crime: '犯罪',
    culture: '文化',
    transport: '交通',
    general: '通用'
  }

  return labels[topic] || topic || '通用'
}