---
generated: 2026-03-26
focus: testing
---

# Testing Patterns

## Current Status

**Testing Framework:** None installed

**Test Files:** None exist

**Coverage:** 0%

The codebase has no testing infrastructure. No test framework, no test configuration, and no test files are present in the project.

## Dependencies Analysis

From `package.json`:

```json
{
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.4",
    "autoprefixer": "^10.4.23",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.19",
    "vite": "^5.4.21"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.90.1",
    "canvas-confetti": "^1.9.4",
    "vue": "^3.5.26"
  }
}
```

No testing libraries are installed.

## Recommended Testing Setup

### Framework: Vitest

Vitest is the recommended choice for this Vue 3 + Vite project because:
- Native Vite integration with zero configuration
- Fast watch mode and hot module replacement
- Jest-compatible API
- Built-in code coverage
- First-class Vue support

### Installation

```bash
npm install -D vitest @vue/test-utils @vitest/coverage-v8 happy-dom
```

### Configuration

Create `vitest.config.js`:

```javascript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,vue}'],
      exclude: ['src/**/*.spec.js', 'src/**/*.test.js']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Test File Organization

### Co-located Tests (Recommended)

Place test files next to source files:

```
src/
├── utils/
│   ├── spacedRepetition.js
│   ├── spacedRepetition.test.js
│   ├── storage.js
│   └── storage.test.js
├── composables/
│   ├── useAuth.js
│   ├── useAuth.test.js
│   ├── useTheme.js
│   └── useTheme.test.js
└── components/
    ├── FlashcardView.vue
    ├── FlashcardView.test.js
    └── quiz/
        ├── MultipleChoiceQuestion.vue
        └── MultipleChoiceQuestion.test.js
```

### Naming Convention

- Test files: `*.test.js` for JavaScript, `*.test.js` for Vue components
- Alternative: `*.spec.js` if preferred

## Test Patterns

### Unit Tests for Utility Functions

Test pure functions in `src/utils/`:

```javascript
// src/utils/spacedRepetition.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  calculateNextReview,
  updateWordLevel,
  createWordReviewState,
  needsReview,
  getReviewPriority
} from './spacedRepetition.js'

describe('spacedRepetition', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('calculateNextReview', () => {
    it('should return correct timestamp for level 0', () => {
      const result = calculateNextReview(0)
      // Level 0 = 5 minutes
      expect(result).toBe(Date.now() + 5 * 60 * 1000)
    })

    it('should apply ease factor to interval', () => {
      const result = calculateNextReview(0, 2.0)
      // 5 minutes * 2.0 = 10 minutes
      expect(result).toBe(Date.now() + 10 * 60 * 1000)
    })
  })

  describe('updateWordLevel', () => {
    it('should increase level on correct answer', () => {
      const result = updateWordLevel(2, true, 2.5)
      expect(result.intervalLevel).toBe(3)
      expect(result.easeFactor).toBe(2.6)
    })

    it('should reset level on incorrect answer', () => {
      const result = updateWordLevel(4, false, 2.5)
      expect(result.intervalLevel).toBe(0)
      expect(result.easeFactor).toBe(2.3)
    })
  })
})
```

### Composable Tests

Test composables with `@vue/test-utils`:

```javascript
// src/composables/useTheme.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTheme } from './useTheme.js'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('localStorage', localStorage)
  })

  it('should initialize with dark theme by default', () => {
    const { isDark, theme } = useTheme()
    expect(isDark.value).toBe(true)
    expect(theme.value).toBe('dark')
  })

  it('should toggle theme correctly', () => {
    const { isDark, toggleTheme } = useTheme()

    toggleTheme()
    expect(isDark.value).toBe(false)

    toggleTheme()
    expect(isDark.value).toBe(true)
  })

  it('should persist theme to localStorage', () => {
    const { setTheme } = useTheme()

    setTheme('light')
    expect(localStorage.getItem('vocabman-theme')).toBe('light')
  })
})
```

### Component Tests

```javascript
// src/components/FlashcardView.test.js
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FlashcardView from './FlashcardView.vue'

vi.mock('../../composables/useTheme.js', () => ({
  useTheme: () => ({
    isDark: { value: false }
  })
}))

describe('FlashcardView', () => {
  const defaultProps = {
    word: {
      word: 'example',
      phonetic: '/ɪɡˈzæmpəl/',
      meaning: 'a representative form',
      example: 'This is an example sentence.'
    },
    showAnswer: false,
    hasPrevious: true,
    hasNext: true
  }

  it('should render word on front side', () => {
    const wrapper = mount(FlashcardView, {
      props: defaultProps
    })

    expect(wrapper.text()).toContain('example')
    expect(wrapper.text()).toContain('/ɪɡˈzæmpəl/')
  })

  it('should emit toggle event on click', async () => {
    const wrapper = mount(FlashcardView, {
      props: defaultProps
    })

    await wrapper.find('.flashcard-inner').trigger('click')
    expect(wrapper.emitted('toggle')).toBeTruthy()
  })

  it('should show difficulty buttons when answer is shown', async () => {
    const wrapper = mount(FlashcardView, {
      props: { ...defaultProps, showAnswer: true }
    })

    expect(wrapper.find('.difficulty-buttons').exists()).toBe(true)
  })
})
```

### Storage/Service Tests with Mocking

```javascript
// src/utils/storage.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadSettings, saveSettings, loadWordbook, saveWordbook } from './storage.js'

// Mock syncService
vi.mock('./syncService.js', () => ({
  syncService: {
    syncSettings: vi.fn().mockResolvedValue(undefined)
  }
}))

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('localStorage', localStorage)
  })

  describe('loadSettings', () => {
    it('should return null when no settings saved', () => {
      const result = loadSettings()
      expect(result).toBeNull()
    })

    it('should parse and normalize saved settings', () => {
      localStorage.setItem('vocabcontext_settings', JSON.stringify({
        dailyGoal: 30,
        apiKey: 'test-key'
      }))

      const result = loadSettings()
      expect(result.dailyGoal).toBe(30)
      expect(result.aiProvider).toBe('siliconflow')
    })
  })

  describe('saveWordbook', () => {
    it('should save Set as array', () => {
      const wordbook = new Set(['apple', 'banana', 'cherry'])
      const result = saveWordbook(wordbook)

      expect(result).toBe(true)
      const saved = JSON.parse(localStorage.getItem('vocabcontext_wordbook'))
      expect(saved).toEqual(['apple', 'banana', 'cherry'])
    })
  })
})
```

## Priority Test Areas

### High Priority (Test First)

1. **`src/utils/spacedRepetition.js`** - Core learning algorithm, pure functions, no dependencies
2. **`src/utils/storage.js`** - Data persistence, localStorage interactions
3. **`src/utils/contextSessionEngine.js`** - Session state management

### Medium Priority

4. **`src/composables/useAuth.js`** - Authentication state
5. **`src/composables/useTheme.js`** - Theme management
6. **`src/utils/aiService.js`** - AI integration (with mocking)

### Lower Priority (Integration Tests)

7. **Vue Components** - UI rendering and user interactions
8. **End-to-end flows** - Full user journeys

## Mocking Guidelines

### What to Mock

- **External APIs:** Supabase client, AI services
- **Browser APIs:** localStorage, window.matchMedia
- **Timers:** Date.now(), setTimeout for deterministic tests

### What NOT to Mock

- **Pure functions:** Most utility functions
- **Vue reactivity:** Test actual reactive behavior
- **Data structures:** Arrays, Sets, objects

## Coverage Goals

### Initial Target: 60%

Focus on utility functions and composables first.

### Target by Module

| Module | Target | Reason |
|--------|--------|--------|
| `utils/spacedRepetition.js` | 90% | Core algorithm |
| `utils/storage.js` | 80% | Data persistence |
| `composables/*.js` | 75% | Shared state |
| `utils/aiService.js` | 70% | Mock external calls |
| `components/*.vue` | 50% | UI components |

## Running Tests

```bash
# Run all tests
npm test

# Run in watch mode during development
npm test -- --watch

# Run specific test file
npm test -- spacedRepetition.test.js

# Run with coverage
npm run test:coverage

# View coverage report
open coverage/index.html
```

---

*Testing analysis: 2026-03-26*