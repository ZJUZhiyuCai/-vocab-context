import { clearSupabaseAuthStorage, supabase, hasSupabaseConfig } from './supabase'
import { ref } from 'vue'

export const user = ref(null)
export const authError = ref(null)

function checkAuthErrorInHash() {
    const hash = window.location.hash
    if (hash && hash.includes('error=')) {
        const params = new URLSearchParams(hash.substring(1))
        const error = params.get('error')
        const errorCode = params.get('error_code')
        const errorDescription = params.get('error_description')

        if (error) {
            console.error('Auth error from URL:', {
                error,
                errorCode,
                errorDescription: decodeURIComponent(errorDescription || '')
            })
            authError.value = {
                error,
                errorCode,
                message: decodeURIComponent(errorDescription || error)
            }
            window.history.replaceState(null, '', window.location.pathname)
            return true
        }
    }
    return false
}

function isRetryableAuthNetworkError(error) {
    const message = String(error?.message || '')
    return message.includes('Failed to fetch') || message.includes('Load failed') || message.includes('ERR_CONNECTION_CLOSED')
}

async function recoverBrokenLocalSession(error) {
    if (!isRetryableAuthNetworkError(error)) return

    clearSupabaseAuthStorage()
    if (supabase) {
        try {
            await supabase.auth.signOut({ scope: 'local' })
        } catch {}
    }
}

async function initializeSession() {
    if (!supabase) {
        console.log('Running in offline mode (no Supabase config)')
        return
    }

    try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
            await recoverBrokenLocalSession(error)
            user.value = null
            console.warn('Auth session unavailable. Continuing in local-only mode.')
            return
        }

        user.value = session?.user ?? null
        console.log('Auth session initialized:', session ? 'Logged in as ' + session.user.email : 'Not logged in')
    } catch (error) {
        await recoverBrokenLocalSession(error)
        user.value = null
        console.warn('Auth initialization skipped due to network error.')
    }
}

checkAuthErrorInHash()
initializeSession()

if (supabase) {
    supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event)
        user.value = session?.user ?? null

        if (event === 'SIGNED_IN') {
            console.log('User signed in:', session?.user?.email)
            authError.value = null
        } else if (event === 'SIGNED_OUT') {
            console.log('User signed out')
        } else if (event === 'TOKEN_REFRESHED') {
            console.log('Token refreshed')
        }
    })
}

export const authService = {
    async signInWithOAuth(provider) {
        if (!supabase) {
            return { error: { message: 'Supabase not configured' } }
        }
        const redirectUrl = import.meta.env.VITE_REDIRECT_URL || window.location.origin
        console.log('Redirect URL (OAuth):', redirectUrl)

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: redirectUrl
            }
        })
        return { data, error }
    },

    async signInWithMagicLink(email) {
        if (!supabase) {
            return { error: { message: 'Supabase not configured' } }
        }
        const redirectUrl = import.meta.env.VITE_REDIRECT_URL || window.location.origin
        console.log('Redirect URL (Magic Link):', redirectUrl)

        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: redirectUrl
            }
        })

        if (error) {
            console.error('Magic Link Error:', error)
        } else {
            console.log('Magic link sent to:', email)
        }

        return { data, error }
    },

    async signOut() {
        if (!supabase) {
            return { error: null }
        }
        const { error } = await supabase.auth.signOut({ scope: 'local' })
        return { error }
    },

    getUser() {
        return user.value
    },

    isLoggedIn() {
        return !!user.value
    },

    getAuthError() {
        return authError.value
    },

    clearAuthError() {
        authError.value = null
    },

    hasSupabaseConfig
}
