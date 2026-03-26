/**
 * HTML Sanitization Utilities
 * Provides XSS-safe HTML rendering functions
 */

import DOMPurify from 'dompurify'

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} html - HTML content to sanitize
 * @param {Object} options - DOMPurify options
 * @returns {string} Sanitized HTML
 */
export function sanitizeHTML(html, options = {}) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['span', 'b', 'i', 'strong', 'em', 'br'],
    ALLOWED_ATTR: ['class'],
    ...options
  })
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
export function highlightWordSafe(sentence, word, highlightClass = 'font-semibold text-amber-300 underline decoration-amber-500 decoration-2 underline-offset-2') {
  if (!sentence || !word) return ''

  // First, strip ALL HTML tags from the input to prevent any injection
  // DOMPurify with FORBID_TAGS will remove tags but keep text content
  const plainText = DOMPurify.sanitize(sentence, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })

  // Escape any remaining special characters
  const safeText = escapeHTML(plainText)

  // Escape special regex characters in the word
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Create regex for case-insensitive match
  const regex = new RegExp(`(${escapedWord})`, 'gi')

  // Replace with highlighted span using only trusted class
  return safeText.replace(regex, `<span class="${highlightClass}">$1</span>`)
}

export default DOMPurify