import { clearSupabaseAuthStorage, supabase, hasSupabaseConfig } from './supabase'
import logger from './logger.js'
import { ref } from 'vue'

const isBrowser = typeof window !== 'undefined'

export const user = ref(null)
export const authError = ref(null)

function checkAuthErrorInHash() {
    if (!isBrowser) return false

    const hash = window.location.hash
    if (hash && hash.includes('error=')) {
        const params = new URLSearchParams(hash.substring(1))
        const error = params.get('error')
        const errorCode = params.get('error_code')
        const errorDescription = params.get('error_description')

        if (error) {
            logger.error('Auth error from URL:', {
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
        } catch {
            // Ignore signOut errors - user is being logged out anyway
        }
    }
}

function getRedirectUrl() {
    return import.meta.env.VITE_REDIRECT_URL || (isBrowser ? window.location.origin : '')
}

async function initializeSession() {
    if (!supabase) {
        logger.info('Running in offline mode (no Supabase config)')
        return
    }

    try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
            await recoverBrokenLocalSession(error)
            user.value = null
            logger.warn('Auth session unavailable. Continuing in local-only mode.')
            return
        }

        user.value = session?.user ?? null
        logger.info('Auth session initialized:', session ? 'Logged in as ' + session.user.email : 'Not logged in')
    } catch (error) {
        await recoverBrokenLocalSession(error)
        user.value = null
        logger.warn('Auth initialization skipped due to network error.')
    }
}

function bindAuthStateListener() {
    if (!supabase || !isBrowser) return

    supabase.auth.onAuthStateChange((event, session) => {
        logger.info('Auth state changed:', event)
        user.value = session?.user ?? null

        if (event === 'SIGNED_IN') {
            logger.info('User signed in:', session?.user?.email)
            authError.value = null
        } else if (event === 'SIGNED_OUT') {
            logger.info('User signed out')
        } else if (event === 'TOKEN_REFRESHED') {
            logger.info('Token refreshed')
        }
    })
}

if (isBrowser) {
    checkAuthErrorInHash()
    void initializeSession()
    bindAuthStateListener()
}

export const authService = {
    async signInWithOAuth(provider) {
        if (!supabase) {
            return { error: { message: 'Supabase not configured' } }
        }
        const redirectUrl = getRedirectUrl()
        logger.info('Redirect URL (OAuth):', redirectUrl)

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
        const redirectUrl = getRedirectUrl()
        logger.info('Redirect URL (Magic Link):', redirectUrl)

        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: redirectUrl
            }
        })

        if (error) {
            logger.error('Magic Link Error:', error)
        } else {
            logger.info('Magic link sent to:', email)
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
