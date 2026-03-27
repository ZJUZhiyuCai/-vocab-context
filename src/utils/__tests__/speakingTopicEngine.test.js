import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'

vi.mock('../vocabularyManager.js', () => ({
  VOCABULARIES: [
    {
      id: 'ielts-foundation',
      name: 'IELTS Foundation',
      size: 743,
      icon: '🎯',
      color: '#6366f1',
      file: '/data/ielts-foundation.json',
      isBundle: true,
      ieltsTrackType: 'foundation'
    },
    {
      id: 'ielts-topic-education',
      name: 'IELTS Topic · Education',
      size: 124,
      icon: '📗',
      color: '#10b981',
      file: '/data/ielts-topic-education.json',
      isBundle: true,
      ieltsTrackType: 'topic',
      topic: 'education'
    },
    {
      id: 'ielts-topic-technology',
      name: 'IELTS Topic · Technology',
      size: 80,
      icon: '🛰',
      color: '#8b5cf6',
      file: '/data/ielts-topic-technology.json',
      isBundle: true,
      ieltsTrackType: 'topic',
      topic: 'technology'
    }
  ]
}))

import {
  getSpeakingTopics,
  getTopicWordCluster,
  getSpeakingTemplatesForTopic,
  generateSpeakingPrompt
} from '../speakingTopicEngine.js'

describe('speakingTopicEngine', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
    global.fetch = vi.fn()
  })

  afterAll(() => {
    if (originalFetch) {
      global.fetch = originalFetch
      return
    }

    delete global.fetch
  })

  describe('getSpeakingTopics', () => {
    it('returns only IELTS topic packs for speaking practice', () => {
      const topics = getSpeakingTopics()

      expect(topics.length).toBeGreaterThan(0)
      expect(topics.every(topic => topic.id.startsWith('ielts-topic-'))).toBe(true)
      expect(topics.some(topic => topic.id === 'ielts-foundation')).toBe(false)
    })
  })

  describe('getTopicWordCluster', () => {
    it('filters draft items and sorts by relevance score', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: async () => ({
          bundles: [
            {
              word: 'draftWord',
              draft: true,
              sourceQuality: { relevanceScore: 10 }
            },
            {
              word: 'secondary',
              draft: false,
              partOfSpeech: 'adj.',
              sense: 'second best',
              collocations: ['secondary effect'],
              sourceQuality: { relevanceScore: 6 }
            },
            {
              word: 'primary',
              draft: false,
              partOfSpeech: 'noun',
              sense: 'top choice',
              collocations: ['primary driver'],
              sourceQuality: { relevanceScore: 9 }
            }
          ]
        })
      })

      const cluster = await getTopicWordCluster('ielts-topic-education', 2)

      expect(global.fetch).toHaveBeenCalledOnce()
      expect(cluster).toHaveLength(2)
      expect(cluster.map(item => item.word)).toEqual(['primary', 'secondary'])
    })

    it('returns an empty array when the vocabulary is not a topic pack', async () => {
      const cluster = await getTopicWordCluster('ielts-foundation', 12)

      expect(cluster).toEqual([])
    })
  })

  describe('getSpeakingTemplatesForTopic', () => {
    it('maps known topics to specialized template groups', () => {
      const educationTemplates = getSpeakingTemplatesForTopic('education')

      expect(educationTemplates.type).toBe('person')
      expect(educationTemplates.templates[0]).toContain("I'd like to talk about")
    })

    it('falls back to general templates for unknown topics', () => {
      const templates = getSpeakingTemplatesForTopic('unknown-topic')

      expect(templates.type).toBe('general')
      expect(templates.templates[0]).toBe("I'd like to talk about...")
    })
  })

  describe('generateSpeakingPrompt', () => {
    it('builds a prompt from keywords and collocations', () => {
      const prompt = generateSpeakingPrompt(
        [
          { word: 'policy', collocations: ['public policy', 'policy shift'] },
          { word: 'reform', collocations: ['education reform'] },
          { word: 'access', collocations: ['equal access'] },
          { word: 'funding', collocations: ['public funding'] },
          { word: 'curriculum', collocations: ['school curriculum'] },
          { word: 'equity', collocations: ['social equity'] }
        ],
        'education'
      )

      expect(prompt.topic).toBe('education')
      expect(prompt.keyWords).toEqual(['policy', 'reform', 'access', 'funding', 'curriculum'])
      expect(prompt.keyCollocations).toEqual([
        'public policy',
        'policy shift',
        'education reform',
        'equal access',
        'public funding',
        'school curriculum',
        'social equity'
      ])
      expect(prompt.suggestedOpening).toContain('influenced me')
    })
  })
})
