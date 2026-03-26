/**
 * App State Management Composable
 * Centralizes all reactive state for the VocabMan application
 */

import { ref, computed } from 'vue'
import { getAllVocabularies, getCurrentVocabulary, loadCurrentVocabulary } from '../utils/vocabularyManager.js'
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