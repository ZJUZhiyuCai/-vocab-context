import { describe, it, expect } from 'vitest'
import { highlightWordSafe } from '../sanitize.js'

describe('sanitize utilities', () => {
  it('strips attacker-controlled markup before highlighting', () => {
    const html = highlightWordSafe('hello <span class="fixed inset-0 z-50">mask</span> world', 'world')

    expect(html).toContain('hello mask ')
    expect(html).toContain('<span class="font-semibold text-amber-300 underline decoration-amber-500 decoration-2 underline-offset-2">world</span>')
    expect(html).not.toContain('fixed')
    expect(html).not.toContain('inset-0')
    expect(html).not.toContain('z-50')
  })

  it('preserves apostrophes when highlighting words', () => {
    const html = highlightWordSafe("Don't stop", "don't")

    expect(html).toContain('<span class="font-semibold text-amber-300 underline decoration-amber-500 decoration-2 underline-offset-2">Don\'t</span>')
    expect(html).toContain(' stop')
  })

  it('sanitizes custom highlight classes before rendering', () => {
    const html = highlightWordSafe('hello world', 'world', 'safe-class x" onclick="alert(1)')

    expect(html).toContain('<span class="safe-class">world</span>')
    expect(html).not.toContain('onclick')
    expect(html).not.toContain('alert(1)')
  })
})
