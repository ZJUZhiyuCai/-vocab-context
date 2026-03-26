import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  calculateNextReview,
  updateWordLevel,
  createWordReviewState,
  needsReview,
  getReviewPriority,
  getTodayReviewStats,
  getReviewQueue,
  getStudyIntensity
} from '../spacedRepetition.js'

describe('spacedRepetition', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-26T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('calculateNextReview', () => {
    it('should return a timestamp in the future', () => {
      const result = calculateNextReview(0)
      expect(result).toBeGreaterThan(Date.now())
    })

    it('should increase interval with higher level', () => {
      const level0 = calculateNextReview(0)
      const level1 = calculateNextReview(1)
      expect(level1).toBeGreaterThan(level0)
    })

    it('should respect ease factor', () => {
      const normal = calculateNextReview(1, 2.5)
      const harder = calculateNextReview(1, 1.5)
      expect(normal).toBeGreaterThan(harder)
    })

    it('should cap at max level', () => {
      const level5 = calculateNextReview(5)
      const level10 = calculateNextReview(10)
      // Both should use the same interval (level 5 is max)
      expect(level10 - Date.now()).toBe(level5 - Date.now())
    })

    it('should return correct interval for level 0 (5 minutes)', () => {
      const result = calculateNextReview(0)
      const expectedTime = Date.now() + 5 * 60 * 1000 * 2.5
      expect(result).toBe(expectedTime)
    })
  })

  describe('updateWordLevel', () => {
    it('should increase level on correct answer', () => {
      const result = updateWordLevel(0, true)
      expect(result.intervalLevel).toBe(1)
    })

    it('should reset level on incorrect answer', () => {
      const result = updateWordLevel(3, false)
      expect(result.intervalLevel).toBe(0)
    })

    it('should increase ease factor on correct answer', () => {
      const result = updateWordLevel(0, true, 2.0)
      expect(result.easeFactor).toBeGreaterThan(2.0)
    })

    it('should decrease ease factor on incorrect answer', () => {
      const result = updateWordLevel(0, false, 2.0)
      expect(result.easeFactor).toBeLessThan(2.0)
    })

    it('should cap ease factor at 2.5', () => {
      const result = updateWordLevel(0, true, 2.5)
      expect(result.easeFactor).toBe(2.5)
    })

    it('should not let ease factor go below 1.3', () => {
      const result = updateWordLevel(0, false, 1.3)
      expect(result.easeFactor).toBe(1.3)
    })

    it('should not exceed max level', () => {
      const result = updateWordLevel(5, true)
      expect(result.intervalLevel).toBe(5)
    })
  })

  describe('createWordReviewState', () => {
    it('should create a valid initial state', () => {
      const state = createWordReviewState()
      expect(state.intervalLevel).toBe(0)
      expect(state.easeFactor).toBe(2.5)
      expect(state.reviewCount).toBe(0)
      expect(state.correctCount).toBe(0)
      expect(state.incorrectCount).toBe(0)
    })

    it('should set nextReview to now', () => {
      const state = createWordReviewState()
      expect(state.nextReview).toBe(Date.now())
    })
  })

  describe('needsReview', () => {
    it('should return true for due review', () => {
      const state = { nextReview: Date.now() - 1000 }
      expect(needsReview(state)).toBe(true)
    })

    it('should return false for future review', () => {
      const state = { nextReview: Date.now() + 10000 }
      expect(needsReview(state)).toBe(false)
    })

    it('should return false for null state', () => {
      expect(needsReview(null)).toBe(false)
    })

    it('should return false for undefined state', () => {
      expect(needsReview(undefined)).toBe(false)
    })
  })

  describe('getReviewPriority', () => {
    it('should return 0 for null state', () => {
      expect(getReviewPriority(null)).toBe(0)
    })

    it('should give high priority to new words', () => {
      const state = { nextReview: Date.now() - 1000, reviewCount: 0, incorrectCount: 0 }
      const priority = getReviewPriority(state)
      expect(priority).toBeGreaterThanOrEqual(1000)
    })

    it('should increase priority with more incorrect answers', () => {
      const state1 = { nextReview: Date.now() - 1000, reviewCount: 1, incorrectCount: 1 }
      const state2 = { nextReview: Date.now() - 1000, reviewCount: 1, incorrectCount: 3 }
      expect(getReviewPriority(state2)).toBeGreaterThan(getReviewPriority(state1))
    })
  })

  describe('getTodayReviewStats', () => {
    it('should return correct stats for empty states', () => {
      const stats = getTodayReviewStats({})
      expect(stats.dueCount).toBe(0)
      expect(stats.reviewedCount).toBe(0)
      expect(stats.accuracy).toBe(0)
    })

    it('should count due words correctly', () => {
      const states = {
        word1: { nextReview: Date.now() - 1000, lastReview: Date.now() },
        word2: { nextReview: Date.now() + 10000, lastReview: Date.now() }
      }
      const stats = getTodayReviewStats(states)
      expect(stats.dueCount).toBe(1)
    })
  })

  describe('getReviewQueue', () => {
    it('should return empty array for no due words', () => {
      const states = {
        word1: { nextReview: Date.now() + 10000, reviewCount: 1, incorrectCount: 0 }
      }
      const queue = getReviewQueue(states)
      expect(queue).toEqual([])
    })

    it('should prioritize forgotten words', () => {
      const states = {
        word1: { nextReview: Date.now() - 1000, reviewCount: 1, incorrectCount: 0 }
      }
      const forgotten = new Set(['word2'])
      const queue = getReviewQueue(states, forgotten)
      expect(queue[0].wordId).toBe('word2')
      expect(queue[0].type).toBe('forgotten')
    })

    it('should respect limit', () => {
      const states = {}
      for (let i = 0; i < 30; i++) {
        states[`word${i}`] = { nextReview: Date.now() - 1000, reviewCount: 0, incorrectCount: 0 }
      }
      const queue = getReviewQueue(states, new Set(), 10)
      expect(queue.length).toBe(10)
    })
  })

  describe('getStudyIntensity', () => {
    it('should return none for no due words', () => {
      const states = {
        word1: { nextReview: Date.now() + 10000 }
      }
      expect(getStudyIntensity(states)).toBe('none')
    })

    it('should return light for 1-10 due words', () => {
      const states = {}
      for (let i = 0; i < 5; i++) {
        states[`word${i}`] = { nextReview: Date.now() - 1000 }
      }
      expect(getStudyIntensity(states)).toBe('light')
    })

    it('should return moderate for 11-30 due words', () => {
      const states = {}
      for (let i = 0; i < 20; i++) {
        states[`word${i}`] = { nextReview: Date.now() - 1000 }
      }
      expect(getStudyIntensity(states)).toBe('moderate')
    })

    it('should return heavy for 31-50 due words', () => {
      const states = {}
      for (let i = 0; i < 40; i++) {
        states[`word${i}`] = { nextReview: Date.now() - 1000 }
      }
      expect(getStudyIntensity(states)).toBe('heavy')
    })

    it('should return intense for 50+ due words', () => {
      const states = {}
      for (let i = 0; i < 60; i++) {
        states[`word${i}`] = { nextReview: Date.now() - 1000 }
      }
      expect(getStudyIntensity(states)).toBe('intense')
    })
  })
})