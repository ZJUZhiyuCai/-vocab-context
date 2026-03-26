import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const SUPABASE_PROJECT_REF = 'kjfddryrzktxrdnxtnri'
export const SUPABASE_AUTH_STORAGE_KEY = `sb-${SUPABASE_PROJECT_REF}-auth-token`
const SUPABASE_AUTH_LOCK_KEY = `lock:${SUPABASE_AUTH_STORAGE_KEY}`
const EXPIRY_MARGIN_MS = 90 * 1000

// 检查是否有有效的 Supabase 配置
export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey)

if (!hasSupabaseConfig) {
    console.warn('Supabase credentials missing. Running in offline mode.')
}

function readStoredSession() {
    if (typeof window === 'undefined' || !window.localStorage) return null

    try {
        const raw = window.localStorage.getItem(SUPABASE_AUTH_STORAGE_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

export function clearSupabaseAuthStorage() {
    if (typeof window === 'undefined' || !window.localStorage) return

    const keys = [
        SUPABASE_AUTH_STORAGE_KEY,
        `${SUPABASE_AUTH_STORAGE_KEY}-user`,
        `${SUPABASE_AUTH_STORAGE_KEY}-code-verifier`,
        SUPABASE_AUTH_LOCK_KEY
    ]

    keys.forEach(key => {
        try {
            window.localStorage.removeItem(key)
        } catch {
            // Ignore localStorage access errors
        }
    })
}

function isStoredSessionExpired(session) {
    if (!session || typeof session !== 'object') return true
    if (!session.refresh_token || !session.expires_at) return true

    const expiresAtMs = Number(session.expires_at) * 1000
    if (!Number.isFinite(expiresAtMs)) return true

    return expiresAtMs - Date.now() < EXPIRY_MARGIN_MS
}

function pruneExpiredSupabaseSession() {
    const session = readStoredSession()
    if (!session) return

    if (isStoredSessionExpired(session)) {
        clearSupabaseAuthStorage()
    }
}

pruneExpiredSupabaseSession()

// 只有在配置有效时才创建 Supabase 客户端
export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
          storageKey: SUPABASE_AUTH_STORAGE_KEY,
          persistSession: true,
          detectSessionInUrl: true,
          autoRefreshToken: false
      }
  })
  : null
