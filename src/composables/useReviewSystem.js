/**
 * Review System Composable
 * Handles spaced repetition logic and review queue management
 */

import { ref, computed } from 'vue'
import {
  createWordReviewState,
  updateWordLevel,
  calculateNextReview,
  getReviewQueue,
  getTodayReviewStats
} from '../utils/spacedRepetition.js'
import { recordTodayStudy, getStreakDays } from '../utils/studyHistory.js'
import { syncService } from '../utils/syncService.js'
import {
  reviewStates,
  reviewQueue,
  learned,
  forgotten,
  currentWord,
  currentVocab,
  sessionLearnCount,
  learnedCount,
  cardRecommendation,
  setPendingRecommendationTimer,
  clearPendingRecommendationTimer,
  pendingRecommendationTimer,
  words
} from './useAppState.js'
import { shouldShowCardRecommendation, buildCardRecommendation, getRecommendationDelay } from '../utils/cardRecommendation.js'
import { checkAchievements } from '../utils/achievements.js'
import { getVocabularyProgress } from '../utils/vocabularyManager.js'

/**
 * Save review states to localStorage
 */
export function saveReviewStates() {
  try {
    const key = `vocabcontext_review_${currentVocab.value.id}`
    localStorage.setItem(key, JSON.stringify(reviewStates.value))

    if (currentWord.value && reviewStates.value[currentWord.value.id]) {
      syncService.syncReviewState(
        currentVocab.value.id,
        currentWord.value.id,
        reviewStates.value[currentWord.value.id]
      ).catch(err => console.warn('Failed to sync review state:', err))
    }
  } catch (err) {
    console.error('Failed to save review states:', err)
  }
}

/**
 * Load review states from localStorage
 */
export function loadReviewStates(validWordIds = new Set()) {
  try {
    const key = `vocabcontext_review_${currentVocab.value.id}`
    const saved = localStorage.getItem(key)
    const parsed = saved ? JSON.parse(saved) : {}
    reviewStates.value = sanitizeReviewStates(parsed, validWordIds)
    localStorage.setItem(key, JSON.stringify(reviewStates.value))
  } catch (err) {
    reviewStates.value = {}
  }
}

function sanitizeReviewStates(states, validWordIds) {
  if (!states || typeof states !== 'object') return {}
  return Object.fromEntries(
    Object.entries(states).filter(([wordId]) => validWordIds.has(wordId))
  )
}

/**
 * Update the review queue
 */
export function updateReviewQueue() {
  reviewQueue.value = getReviewQueue(reviewStates.value, forgotten.value, 50)
}

/**
 * Handle "know" action
 */
export function handleKnow(isCardAnimating, animateCardAndNext) {
  if (currentWord.value && !isCardAnimating.value) {
    if (!reviewStates.value[currentWord.value.id]) {
      reviewStates.value[currentWord.value.id] = createWordReviewState()
    }
    const updated = updateWordLevel(
      reviewStates.value[currentWord.value.id].intervalLevel,
      true,
      reviewStates.value[currentWord.value.id].easeFactor
    )
    reviewStates.value[currentWord.value.id] = {
      ...reviewStates.value[currentWord.value.id],
      ...updated,
      nextReview: calculateNextReview(updated.intervalLevel, updated.easeFactor),
      lastReview: Date.now(),
      reviewCount: (reviewStates.value[currentWord.value.id].reviewCount || 0) + 1,
      correctCount: (reviewStates.value[currentWord.value.id].correctCount || 0) + 1
    }
    learned.value.add(currentWord.value.id)
    saveReviewStates()
    updateReviewQueue()
    recordTodayStudy(1)
    sessionLearnCount.value++
    learnedCount.value++

    // Check for card recommendation
    const vocabSnapshot = currentVocab.value
    const wordSnapshot = currentWord.value
    const reviewSnapshot = reviewStates.value[currentWord.value.id]
    if (shouldShowCardRecommendation(vocabSnapshot, wordSnapshot, reviewSnapshot, learnedCount.value)) {
      if (pendingRecommendationTimer) {
        clearTimeout(pendingRecommendationTimer)
      }
      setPendingRecommendationTimer(setTimeout(() => {
        cardRecommendation.value = buildCardRecommendation(vocabSnapshot, wordSnapshot)
        clearPendingRecommendationTimer()
      }, getRecommendationDelay()))
    }

    animateCardAndNext('slide-left')
  }
}

/**
 * Handle "forget" action
 */
export function handleForget(isCardAnimating, animateCardAndNext) {
  if (currentWord.value && !isCardAnimating.value) {
    if (!reviewStates.value[currentWord.value.id]) {
      reviewStates.value[currentWord.value.id] = createWordReviewState()
    }
    const updated = updateWordLevel(
      reviewStates.value[currentWord.value.id].intervalLevel,
      false,
      reviewStates.value[currentWord.value.id].easeFactor
    )
    reviewStates.value[currentWord.value.id] = {
      ...reviewStates.value[currentWord.value.id],
      ...updated,
      nextReview: calculateNextReview(updated.intervalLevel, updated.easeFactor),
      lastReview: Date.now(),
      reviewCount: (reviewStates.value[currentWord.value.id].reviewCount || 0) + 1,
      incorrectCount: (reviewStates.value[currentWord.value.id].incorrectCount || 0) + 1
    }
    forgotten.value.add(currentWord.value.id)
    saveReviewStates()
    updateReviewQueue()
    recordTodayStudy(1)
    sessionLearnCount.value++
    animateCardAndNext('slide-right')
  }
}

/**
 * Get streak days
 */
export function getStreak() {
  try {
    return getStreakDays() || 0
  } catch (e) {
    return 0
  }
}

/**
 * Review stats computed
 */
export const reviewStats = computed(() => {
  return getTodayReviewStats(reviewStates.value)
})

/**
 * Review queue data computed
 */
export const reviewQueueData = computed(() => {
  return reviewQueue.value.map(item => {
    const word = words.value.find(w => w.id === item.wordId)
    const reviewState = reviewStates.value[item.wordId]
    return {
      word,
      reviewState,
      type: item.type || 'review',
      priority: item.priority || 0
    }
  }).filter(item => item.word)
})

/**
 * Check and unlock achievements
 */
export function checkAndUnlockAchievements(streakDays, stats, sessionLearnCount, triggerConfetti, showAchievementNotification) {
  const hour = new Date().getHours()
  const achievementStats = {
    totalLearned: learned.value.size,
    streakDays: streakDays,
    sessionCount: sessionLearnCount,
    accuracy: stats.value.accuracy,
    hour,
    vocabProgress: {}
  }
  const vocabularies = ['vocab-a2-basic', 'vocab-b1-intermediate', 'vocab-b2-upper-intermediate', 'vocab-c1-advanced', 'vocab-c2-proficiency']
  vocabularies.forEach(vocabId => {
    try {
      const progress = getVocabularyProgress(vocabId)
      const totalWords = progress.total || 0
      const learnedCount = (progress.learned || []).length
      achievementStats.vocabProgress[vocabId] = totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0
    } catch {
      achievementStats.vocabProgress[vocabId] = 0
    }
  })
  const newAchievements = checkAchievements(achievementStats)
  if (newAchievements.length > 0) {
    newAchievements.forEach((achievement, index) => {
      syncService.syncAchievement(achievement.id).catch(() => {})
      setTimeout(() => {
        showAchievementNotification(achievement)
        triggerConfetti()
      }, index * 1000)
    })
  }
}