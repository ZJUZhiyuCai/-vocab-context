/**
 * Word Operations Composable
 * Handles word-related operations: audio, wordbook, AI generation
 */

import { ref } from 'vue'
import { generateAIExample } from '../utils/aiService.js'
import { getEnglishDefinition } from '../utils/englishDefinitionService.js'
import { saveWordbook } from '../utils/storage.js'
import { syncService } from '../utils/syncService.js'
import { getTTS } from '../utils/text-to-speech.js'
import { getFreeDictionaryTTS } from '../utils/freeDictionaryTTS.js'
import { useConfetti } from './useConfetti.js'
import { wordbook, userSettings, userProfile, currentVocab, error, generatingWordId, loadingEnglishDefinition } from './useAppState.js'

const tts = getTTS()
const freeDictTTS = getFreeDictionaryTTS()
export const isPlayingWord = ref(false)

/**
 * Play word audio using TTS
 */
export async function playWordAudio(word) {
  isPlayingWord.value = true
  try {
    const success = await freeDictTTS.play(word)
    if (success) return
  } catch (err) {
    console.warn('Free Dictionary TTS failed:', err)
  }
  try {
    await fallbackBrowserTTS(word)
  } finally {
    isPlayingWord.value = false
  }
}

async function fallbackBrowserTTS(word) {
  if (!tts.isSupported()) {
    alert('Please configure API key or use a browser that supports speech')
    return
  }
  try {
    await tts.speakWord(word)
  } catch (err) {
    console.error('TTS failed:', err)
  }
}

/**
 * Check if word is in wordbook
 */
export function isWordbooked(wordId) {
  return wordbook.value.has(wordId)
}

/**
 * Add word to wordbook
 */
export function addToWordbook(wordId) {
  wordbook.value.add(wordId)
  saveWordbook(wordbook.value)

  if (currentVocab.value) {
    syncService.syncWordbook(wordId, currentVocab.value.id, true).catch(err => {
      console.warn('Failed to sync wordbook:', err)
    })
  }
}

/**
 * Remove word from wordbook
 */
export function removeFromWordbook(wordId) {
  wordbook.value.delete(wordId)
  saveWordbook(wordbook.value)

  if (currentVocab.value) {
    syncService.syncWordbook(wordId, currentVocab.value.id, false).catch(err => {
      console.warn('Failed to remove from cloud wordbook:', err)
    })
  }
}

/**
 * Toggle word in wordbook
 */
export function toggleWordbook(wordId) {
  if (isWordbooked(wordId)) removeFromWordbook(wordId)
  else addToWordbook(wordId)
}

/**
 * Batch remove words from wordbook
 */
export function handleBatchRemoveFromWordbook(wordIds) {
  wordIds.forEach(wordId => {
    wordbook.value.delete(wordId)
    if (currentVocab.value) {
      syncService.syncWordbook(wordId, currentVocab.value.id, false).catch(() => {})
    }
  })
  saveWordbook(wordbook.value)
}

/**
 * Generate AI example for a word
 */
export async function generateExample(word, words, triggerConfetti) {
  generatingWordId.value = word.id
  error.value = null
  try {
    const result = await generateAIExample({
      apiKey: userSettings.value.apiKey,
      word: word.word,
      meaning: word.meaning,
      purpose: userProfile.value.purpose || 'daily'
    })
    const wordIndex = words.value.findIndex(w => w.id === word.id)
    if (wordIndex !== -1) {
      words.value[wordIndex].aiExample = {
        sentence: result.sentence,
        translation: result.translation,
        generatedAt: new Date().toISOString(),
        basedOnPurpose: userProfile.value.purpose || 'daily'
      }
    }
    triggerConfetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } })
  } catch (err) {
    error.value = err.message || 'Generation failed, please retry'
    setTimeout(() => { error.value = null }, 3000)
  } finally {
    generatingWordId.value = null
  }
}

/**
 * Fetch English definition for a word
 */
export async function fetchEnglishDefinitionForWord(word, words) {
  loadingEnglishDefinition.value = word.id
  error.value = null
  try {
    const definition = await getEnglishDefinition({
      apiKey: userSettings.value.apiKey,
      word: word.word,
      meaning: word.meaning
    })
    const wordIndex = words.value.findIndex(w => w.id === word.id)
    if (wordIndex !== -1) {
      words.value[wordIndex].englishDefinition = definition
    }
  } catch (err) {
    error.value = err.message || 'Failed to fetch English definition'
    setTimeout(() => { error.value = null }, 3000)
  } finally {
    loadingEnglishDefinition.value = null
  }
}