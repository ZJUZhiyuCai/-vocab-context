import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  VOCABULARIES,
  getAllVocabularies,
  getCurrentVocabulary,
  setCurrentVocabulary,
  getVocabularyProgress,
  getRecommendedVocabularies
} from '../vocabularyManager.js'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value
    }),
    removeItem: vi.fn(key => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }
})()

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
})

describe('vocabularyManager', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  describe('VOCABULARIES', () => {
    it('should be an array', () => {
      expect(Array.isArray(VOCABULARIES)).toBe(true)
    })

    it('should have at least 10 vocabularies', () => {
      expect(VOCABULARIES.length).toBeGreaterThanOrEqual(10)
    })

    it('should have valid structure for each vocabulary', () => {
      VOCABULARIES.forEach(v => {
        expect(v).toHaveProperty('id')
        expect(v).toHaveProperty('name')
        expect(v).toHaveProperty('file')
        expect(v).toHaveProperty('category')
        expect(v).toHaveProperty('difficulty')
      })
    })

    it('should have unique ids', () => {
      const ids = VOCABULARIES.map(v => v.id)
      const uniqueIds = [...new Set(ids)]
      expect(ids.length).toBe(uniqueIds.length)
    })
  })

  describe('getAllVocabularies', () => {
    it('should return all vocabularies', () => {
      const result = getAllVocabularies()
      expect(result).toEqual(VOCABULARIES)
    })
  })

  describe('getCurrentVocabulary', () => {
    it('should return a vocabulary object', () => {
      const result = getCurrentVocabulary()
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('name')
    })
  })

  describe('setCurrentVocabulary', () => {
    it('should set vocabulary by id', () => {
      const result = setCurrentVocabulary('vocab-cet4-basic')
      expect(result).toBeDefined()
      expect(result.id).toBe('vocab-cet4-basic')
    })

    it('should return null for unknown id', () => {
      const result = setCurrentVocabulary('unknown-vocab')
      expect(result).toBeNull()
    })

    it('should update current vocabulary', () => {
      setCurrentVocabulary('ielts-foundation')
      const current = getCurrentVocabulary()
      expect(current.id).toBe('ielts-foundation')
    })
  })

  describe('getVocabularyProgress', () => {
    it('should return default progress for new vocabulary', () => {
      const progress = getVocabularyProgress('new-vocab')
      expect(progress).toEqual({
        learned: [],
        forgotten: [],
        currentIndex: 0
      })
    })

    it('should return saved progress', () => {
      const savedProgress = {
        learned: ['word1', 'word2'],
        forgotten: ['word3'],
        currentIndex: 5
      }
      localStorageMock.setItem('vocabcontext_progress_test-vocab', JSON.stringify(savedProgress))

      const progress = getVocabularyProgress('test-vocab')
      expect(progress).toEqual(savedProgress)
    })
  })

  describe('getRecommendedVocabularies', () => {
    it('should return 3-star vocabularies when no test result', () => {
      const result = getRecommendedVocabularies(null)
      expect(result.length).toBeGreaterThan(0)
      result.forEach(v => {
        expect(v.isRecommended).toBe(true)
        expect(v.difficulty.stars).toBe(3)
      })
    })

    it('should sort by recommend score', () => {
      const testResult = {
        cefrLevel: 'B2',
        estimatedVocab: '6000-8000'
      }
      const result = getRecommendedVocabularies(testResult)

      // Check sorting
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].recommendScore).toBeGreaterThanOrEqual(result[i + 1].recommendScore)
      }
    })

    it('should prefer matching CEFR levels', () => {
      const testResult = {
        cefrLevel: 'B2',
        estimatedVocab: '6000-8000'
      }
      const result = getRecommendedVocabularies(testResult)

      // Top results should have B2 in their CEFR
      const topResults = result.slice(0, 3)
      const hasB2 = topResults.some(v => v.difficulty.cefr.includes('B2'))
      expect(hasB2).toBe(true)
    })

    it('should handle A1 level', () => {
      const testResult = {
        cefrLevel: 'A1',
        estimatedVocab: '0-1000'
      }
      const result = getRecommendedVocabularies(testResult)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle C2 level', () => {
      const testResult = {
        cefrLevel: 'C2',
        estimatedVocab: '10000-15000'
      }
      const result = getRecommendedVocabularies(testResult)
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('IELTS vocabularies', () => {
    it('should have foundation vocabulary', () => {
      const foundation = VOCABULARIES.find(v => v.id === 'ielts-foundation')
      expect(foundation).toBeDefined()
      expect(foundation.isBundle).toBe(true)
      expect(foundation.ieltsTrackType).toBe('foundation')
    })

    it('should have topic vocabularies', () => {
      const topicVocabs = VOCABULARIES.filter(v => v.ieltsTrackType === 'topic')
      expect(topicVocabs.length).toBeGreaterThan(0)
    })

    it('should have correct topic properties', () => {
      const educationVocab = VOCABULARIES.find(v => v.topic === 'education')
      expect(educationVocab).toBeDefined()
      expect(educationVocab.name).toContain('Education')
    })
  })
})