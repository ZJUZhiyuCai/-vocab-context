/**
 * HTML Sanitization Utilities
 * Provides XSS-safe HTML rendering functions
 */

import createDOMPurify from 'dompurify'

const DEFAULT_HIGHLIGHT_CLASS = 'font-semibold text-amber-300 underline decoration-amber-500 decoration-2 underline-offset-2'
let domPurifyInstance = null

function getDOMPurify() {
  if (domPurifyInstance) return domPurifyInstance

  if (createDOMPurify && typeof createDOMPurify.sanitize === 'function') {
    domPurifyInstance = createDOMPurify
    return domPurifyInstance
  }

  if (typeof window !== 'undefined' && typeof createDOMPurify === 'function') {
    domPurifyInstance = createDOMPurify(window)
    return domPurifyInstance
  }

  return null
}

function stripTagsFallback(html) {
  return String(html ?? '').replace(/<[^>]*>/g, '')
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} html - HTML content to sanitize
 * @param {Object} options - DOMPurify options
 * @returns {string} Sanitized HTML
 */
export function sanitizeHTML(html, options = {}) {
  const domPurify = getDOMPurify()
  if (!domPurify?.sanitize) return stripTagsFallback(html)

  return domPurify.sanitize(html, {
    ALLOWED_TAGS: ['span', 'b', 'i', 'strong', 'em', 'br'],
    ALLOWED_ATTR: ['class'],
    ...options
  })
}

function stripHTMLToPlainText(html) {
  const domPurify = getDOMPurify()
  const sanitized = domPurify?.sanitize
    ? domPurify.sanitize(html, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    })
    : stripTagsFallback(html)

  if (typeof document === 'undefined') {
    return sanitized
  }

  const container = document.createElement('div')
  container.innerHTML = sanitized
  return container.textContent || ''
}

function sanitizeHighlightClass(highlightClass) {
  if (typeof highlightClass !== 'string') return DEFAULT_HIGHLIGHT_CLASS

  const safeClassName = highlightClass
    .trim()
    .split(/\s+/)
    .filter(token => {
      if (!token) return false

      for (const char of token) {
        const code = char.charCodeAt(0)
        if (code <= 31 || code === 127 || /\s/u.test(char) || `"'=\`<>`.includes(char)) {
          return false
        }
      }

      return true
    })
    .join(' ')

  return safeClassName || DEFAULT_HIGHLIGHT_CLASS
}

/**
 * Escape HTML special characters to prevent injection
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHTML(text) {
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, char => escapeMap[char])
}

/**
 * Highlight a word in a sentence safely (XSS-proof)
 * Strips all tags from input first, then adds only the trusted highlight span
 * @param {string} sentence - The sentence text (may contain untrusted HTML)
 * @param {string} word - The word to highlight
 * @param {string} highlightClass - CSS class for highlighting (trusted)
 * @returns {string} Sanitized HTML with highlighted word
 */
export function highlightWordSafe(sentence, word, highlightClass = DEFAULT_HIGHLIGHT_CLASS) {
  if (!sentence || !word) return ''

  const plainText = stripHTMLToPlainText(sentence)
  const safeHighlightClass = sanitizeHighlightClass(highlightClass)

  // Escape special regex characters in the word
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Create regex for case-insensitive match
  const regex = new RegExp(escapedWord, 'gi')

  let lastIndex = 0
  let highlighted = ''

  for (const match of plainText.matchAll(regex)) {
    const start = match.index ?? 0
    const matchedText = match[0]

    highlighted += escapeHTML(plainText.slice(lastIndex, start))
    highlighted += `<span class="${safeHighlightClass}">${escapeHTML(matchedText)}</span>`
    lastIndex = start + matchedText.length
  }

  highlighted += escapeHTML(plainText.slice(lastIndex))

  return sanitizeHTML(highlighted)
}

export default getDOMPurify()
