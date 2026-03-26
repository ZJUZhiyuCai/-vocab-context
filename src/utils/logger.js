/**
 * Logger - Environment-aware logging utility
 * In development: full logging with timestamps
 * In production: logs are stripped by Vite
 */

const isDev = import.meta.env.DEV

export const logger = {
  debug(...args) {
    if (isDev) {
      console.log('[DEBUG]', new Date().toISOString(), ...args)
    }
  },

  info(...args) {
    if (isDev) {
      console.log('[INFO]', ...args)
    }
  },

  warn(...args) {
    if (isDev) {
      console.warn('[WARN]', ...args)
    }
  },

  error(...args) {
    // Always log errors, but consider using error tracking service in production
    console.error('[ERROR]', ...args)
  },

  success(...args) {
    if (isDev) {
      console.log('[SUCCESS] ✓', ...args)
    }
  },

  group(label, fn) {
    if (isDev) {
      console.group(label)
      fn()
      console.groupEnd()
    }
  },

  time(label) {
    if (isDev) {
      console.time(label)
    }
  },

  timeEnd(label) {
    if (isDev) {
      console.timeEnd(label)
    }
  }
}

export default logger