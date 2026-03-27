/**
 * App State Management Composable
 * Centralizes all reactive state for the VocabMan application
 */

import { ref, computed } from 'vue'
import logger from '../utils/logger.js'
import { getAllVocabularies } from '../utils/vocabularyManager.js'
import { loadSettings, loadWordbook, loadUserProfile, shouldShowOnboarding } from '../utils/storage.js'

// ============================================
// Core State
// ============================================

// Word data
export const words = ref([])
export const currentIndex = ref(0)
export const learned = ref(new Set())
export const forgotten = ref(new Set())
export const wordbook = ref(new Set())

// Loading & UI state
export const isLoading = ref(true)
export const currentVocab = ref(null)
export const showVocabSelector = ref(false)
export const currentPage = ref('today')
export const allVocabularies = getAllVocabularies()

// Review system state
export const reviewStates = ref({})
export const reviewQueue = ref([])

// Card animation state
export const cardAnimation = ref('')
export const isCardAnimating = ref(false)

// Network state
export const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)

// Touch gesture state
export const touchStartX = ref(0)
export const touchStartY = ref(0)
export const touchEndX = ref(0)
export const touchEndY = ref(0)
export const isSwiping = ref(false)

// ============================================
// User Settings State
// ============================================

export const userSettings = ref({
  apiKey: '',
  interests: [],
  dailyGoal: 20,
  studyMode: 'random',
  githubToken: '',
  purpose: 'exam'
})

export const settingsForm = ref({
  apiKey: '',
  interests: [],
  dailyGoal: 20,
  studyMode: 'random',
  githubToken: '',
  purpose: 'exam'
})

export const showSettings = ref(false)
export const newInterest = ref('')
export const generatingWordId = ref(null)
export const loadingEtymology = ref(null)
export const loadingEnglishDefinition = ref(null)
export const error = ref(null)

// ============================================
// Sync State
// ============================================

export const syncing = ref(false)
export const testingGist = ref(false)
export const gistSyncStats = ref({ lastSync: 'Never synced', gistId: null, hasConfig: false })

// ============================================
// User Profile & Onboarding State
// ============================================

export const userProfile = ref({ purpose: '' })
export const showOnboarding = ref(false)
export const showVocabTest = ref(false)

// ============================================
// Achievement State
// ============================================

export const currentAchievementNotification = ref(null)
export const sessionLearnCount = ref(0)
export const learnedCount = ref(0)

// ============================================
// Card Recommendation State
// ============================================

export const cardRecommendation = ref(null)
export let pendingRecommendationTimer = null

export const setPendingRecommendationTimer = (timer) => {
  pendingRecommendationTimer = timer
}

export const clearPendingRecommendationTimer = () => {
  pendingRecommendationTimer = null
}

// ============================================
// Study Time Tracking
// ============================================

export const sessionStartTime = ref(Date.now())
export const totalStudyTime = ref(0)
export const isPageVisible = ref(true)

// ============================================
// Computed Properties
// ============================================

export const currentWord = computed(() => {
  return words.value[currentIndex.value] || null
})

export const progress = computed(() => ({
  total: words.value.length,
  learned: learned.value.size,
}))

export const stats = computed(() => {
  const total = learned.value.size + forgotten.value.size
  const accuracy = total > 0 ? Math.round((learned.value.size / total) * 100) : 0
  return {
    learned: learned.value.size,
    forgotten: forgotten.value.size,
    accuracy,
  }
})

// ============================================
// Initialization Functions
// ============================================

/**
 * Initialize state from localStorage
 */
export function initializeState() {
  const savedSettings = loadSettings()
  if (savedSettings) userSettings.value = savedSettings

  const savedProfile = loadUserProfile()
  if (savedProfile) userProfile.value = savedProfile

  if (shouldShowOnboarding()) showOnboarding.value = true

  wordbook.value = loadWordbook()
}

/**
 * Reset progress state
 */
export function resetProgressState() {
  currentIndex.value = 0
  learned.value.clear()
  forgotten.value.clear()
  sessionLearnCount.value = 0
  learnedCount.value = 0
  reviewStates.value = {}
}

// ============================================
// Study Time Functions
// ============================================

/**
 * Get current session duration in seconds
 */
export function getSessionTime() {
  if (!isPageVisible.value) return 0
  return Math.floor((Date.now() - sessionStartTime.value) / 1000)
}

/**
 * Format duration for display
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 */
export function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}秒`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}分钟`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}小时${remainingMinutes}分` : `${hours}小时`
}

/**
 * Save study time to localStorage
 */
export function saveStudyTime() {
  try {
    const currentSessionTime = getSessionTime()
    const totalTime = totalStudyTime.value + currentSessionTime
    localStorage.setItem('vocabcontext_study_time', totalTime.toString())
    totalStudyTime.value = totalTime
    sessionStartTime.value = Date.now()
  } catch (error) {
    logger.error('保存学习时长失败:', error)
  }
}

/**
 * Load study time from localStorage
 * @returns {number} Total study time in seconds
 */
export function loadStudyTime() {
  try {
    const saved = localStorage.getItem('vocabcontext_study_time')
    return saved ? parseInt(saved, 10) : 0
  } catch {
    return 0
  }
}

/**
 * Initialize study time from localStorage
 */
export function initStudyTime() {
  totalStudyTime.value = loadStudyTime()
  sessionStartTime.value = Date.now()
}
