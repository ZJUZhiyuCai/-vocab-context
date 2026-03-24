import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const SUPABASE_PROJECT_REF = 'kjfddryrzktxrdnxtnri'
export const SUPABASE_AUTH_STORAGE_KEY = `sb-${SUPABASE_PROJECT_REF}-auth-token`
const SUPABASE_AUTH_LOCK_KEY = `lock:${SUPABASE_AUTH_STORAGE_KEY}`

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials missing. Please check your environment config.')
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
        } catch {}
    })
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storageKey: SUPABASE_AUTH_STORAGE_KEY,
        persistSession: true,
        detectSessionInUrl: true,
        autoRefreshToken: false
    }
})
