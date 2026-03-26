/**
 * Storage Keys - Centralized localStorage key management
 * All keys should be defined here for consistency and migration support
 */

export const STORAGE_VERSION = 'v1'

// User data keys
export const KEYS = {
  // Settings
  SETTINGS: 'vocabcontext_settings',
  USER_PROFILE: 'vocabcontext_user_profile',
  THEME: 'vocabcontext_theme',

  // Current state
  CURRENT_VOCAB: 'vocabcontext_current_vocab',

  // Progress
  WORDBOOK: 'vocabcontext_wordbook',
  REVIEW_STATES_PREFIX: 'vocabcontext_review_',
  PROGRESS_PREFIX: 'vocabcontext_progress_',

  // History
  STUDY_HISTORY: 'vocabcontext_study_history',

  // Auth
  SUPABASE_AUTH: 'sb-kjfddryrzktxrdnxtnri-auth-token',

  // AI
  AI_SETTINGS: 'vocabcontext_agent_settings',
  AI_CONVERSATIONS: 'vocabcontext_agent_conversations',
  AI_CACHE_PREFIX: 'vocabcontext_ai_',

  // First week
  FIRST_WEEK_PROGRESS: 'vocabcontext_first_week_progress',

  // Migration
  MIGRATION_VERSION: 'vocabcontext_migration_version',

  // IELTS path
  IELTS_PENDING_TARGET: 'vocabman-ielts-pending-target',

  // Context session
  CONTEXT_SESSION_STATE: 'vocabman-context-session-state',
  CONTEXT_SESSION_HISTORY: 'vocabman-context-session-history',

  // Output studio
  OUTPUT_STUDIO_STATE: 'vocabman-output-studio-state',
  OUTPUT_STUDIO_HISTORY: 'vocabman-output-studio-history',

  // Exam drill
  EXAM_DRILL_STATE: 'vocabman-exam-drill-state',
  EXAM_DRILL_HISTORY: 'vocabman-exam-drill-history',

  // Gist sync
  GIST_CONFIG: 'vocabcontext_gist_config',
  SYNC_QUEUE: 'vocabcontext_sync_queue',
  LAST_SYNC: 'vocabcontext_last_sync',

  // TTS
  TTS_SETTINGS: 'vocabcontext_tts_settings',
  TTS_FAVORITE_VOICES: 'vocabcontext_tts_favorite_voices',

  // Achievements
  ACHIEVEMENTS: 'vocabcontext_achievements',

  // Cache
  ENGLISH_DEF_CACHE_PREFIX: 'vocabcontext_en_def_',
  FREE_DICT_CACHE_PREFIX: 'vocabcontext_freedict_',

  // Favorites
  FAVORITE_TIMES: 'vocab-context-favorite-times'
}

/**
 * Get a versioned key for migration support
 */
export function getVersionedKey(key) {
  return `${STORAGE_VERSION}_${key}`
}

/**
 * Get vocab-specific key
 */
export function getVocabKey(prefix, vocabId) {
  return `${prefix}${vocabId}`
}