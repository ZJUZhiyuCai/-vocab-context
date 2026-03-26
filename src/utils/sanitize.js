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
 * Highlight a word in a sentence safely (XSS-proof)
 * @param {string} sentence - The sentence text
 * @param {string} word - The word to highlight
 * @param {string} highlightClass - CSS class for highlighting
 * @returns {string} Sanitized HTML with highlighted word
 */
export function highlightWordSafe(sentence, word, highlightClass = 'font-semibold text-amber-300 underline decoration-amber-500 decoration-2 underline-offset-2') {
  if (!sentence || !word) return ''

  // Escape special regex characters in the word
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Create regex for case-insensitive match
  const regex = new RegExp(`(${escapedWord})`, 'gi')

  // Replace with highlighted span
  const highlighted = sentence.replace(regex, `<span class="${highlightClass}">$1</span>`)

  // Sanitize the result to prevent XSS
  return sanitizeHTML(highlighted)
}

export default DOMPurify