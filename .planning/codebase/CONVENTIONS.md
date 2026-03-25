---
generated: 2026-03-26
focus: conventions
---

# Coding Conventions

## Language

**Primary:** JavaScript (ES6+) - All source code
**Secondary:** Chinese - Comments, console logs, and user-facing strings

## Vue Component Patterns

### Script Setup (Composition API)

All Vue components use `<script setup>` with Composition API:

```vue
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTheme } from '../../composables/useTheme.js'

const { isDark } = useTheme()

const props = defineProps({
  word: {
    type: Object,
    required: true
  },
  showAnswer: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle', 'previous', 'next', 'rate'])

// Reactive state
const currentIndex = ref(0)
const isLoading = ref(false)

// Computed properties
const progress = computed(() => {
  return Math.min(100, Math.round((currentIndex.value / total.value) * 100))
})

// Lifecycle hooks
onMounted(() => {
  initEngine()
})

// Watchers
watch(() => props.bundles, () => {
  initEngine()
}, { deep: true })
</script>
```

**Key patterns:**
- `defineProps` for props definition with type and default values
- `defineEmits` for event declarations (array of event names)
- `ref()` for reactive state
- `computed()` for derived state
- Destructured composables: `const { isDark } = useTheme()`

### Template Structure

```vue
<template>
  <div :class="['container', isDark ? 'dark' : 'light']">
    <ComponentName
      v-if="condition"
      :prop="value"
      @event="handler"
    />
  </div>
</template>
```

**Class binding pattern:**
```vue
:class="['base-class', condition ? 'variant-a' : 'variant-b']"
:class="{ 'active': isActive, 'disabled': isDisabled }"
```

### Style Organization

Styles use `<style scoped>` with Tailwind's `@apply` directive:

```vue
<style scoped>
.nav-item {
  @apply flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-beige-50 hover:text-sage-500 transition-colors;
}

.nav-item.active {
  @apply bg-sage-50 text-sage-500 font-medium;
}
</style>
```

## File Organization

### Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Vue components | PascalCase | `FlashcardView.vue`, `ContextSession.vue` |
| Utility files | camelCase | `spacedRepetition.js`, `aiService.js` |
| Composables | useXxx | `useAuth.js`, `useTheme.js`, `useConfetti.js` |
| CSS files | lowercase | `main.css`, `theme.css` |
| Data files | kebab-case | `ielts-core-500.json` |

### Directory Structure

```
src/
├── components/          # Vue components
│   ├── ComponentName.vue
│   ├── quiz/           # Feature-grouped components
│   └── context/
├── composables/        # Reusable composition functions
├── utils/              # Pure JavaScript utilities
├── layouts/            # Layout components
├── styles/             # Global CSS
└── main.js            # App entry point
```

## Import Organization

Imports follow this order:
1. Vue imports (from 'vue')
2. Third-party imports
3. Local utilities/composables
4. Local components

```javascript
import { ref, computed, onMounted, watch } from 'vue'
import { user, authService } from '../utils/authService'
import { useTheme } from '../../composables/useTheme.js'
import {
  createContextSessionEngine,
  TASK_TYPES,
  saveContextSessionToHistory
} from '../../utils/contextSessionEngine.js'
import ContextPromptCard from './ContextPromptCard.vue'
```

### Path Alias

Use `@` alias for src-relative imports (configured in `vite.config.js`):

```javascript
// In vite.config.js
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src')
  }
}
```

## Composables Pattern

Composables export functions that encapsulate reusable state and logic:

```javascript
// src/composables/useTheme.js
import { ref, onMounted } from 'vue'

const theme = ref('dark')
const isDark = ref(true)

export function useTheme() {
  onMounted(() => {
    initTheme()
  })

  function setTheme(newTheme) {
    theme.value = newTheme
    saveTheme(newTheme)
    applyTheme(newTheme)
  }

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    THEMES
  }
}
```

**Pattern:**
- Global state declared outside the function (singleton pattern)
- Function returns reactive refs and methods
- Initialization logic in `onMounted` or called immediately for SSR safety

## Utility Module Pattern

Utility files export named functions with JSDoc comments in Chinese:

```javascript
/**
 * 计算下次复习时间
 * @param {number} intervalLevel - 当前间隔等级 (0-5)
 * @param {number} easeFactor - 难度因子 (1.3-2.5)，默认2.5
 * @returns {number} 下次复习时间戳
 */
export function calculateNextReview(intervalLevel, easeFactor = 2.5) {
  const intervalMinutes = REVIEW_INTERVALS[Math.min(intervalLevel, REVIEW_INTERVALS.length - 1)];
  const adjustedInterval = intervalMinutes * easeFactor;
  return Date.now() + adjustedInterval * 60 * 1000;
}
```

**Singleton service pattern:**

```javascript
// src/utils/aiService.js
let aiServiceInstance = null;

export class AIService {
  constructor() {
    this.settings = loadAISettings();
  }

  async generateExample(word, meaning, purpose) {
    // ...
  }
}

export function getAIService() {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService();
  }
  return aiServiceInstance;
}

export function resetAIService() {
  aiServiceInstance = null;
  return getAIService();
}
```

## Error Handling

### Try-Catch with Console Logging

```javascript
export function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? normalizeSettings(JSON.parse(saved)) : null;
  } catch (error) {
    console.error('加载设置失败:', error);
    return null;
  }
}
```

### Async Error Handling

```javascript
export async function validateApiKey(apiKey) {
  try {
    const cleanedApiKey = resolveApiKey(apiKey);
    await createAIChatCompletion({
      apiKey: cleanedApiKey,
      messages: [{ role: 'user', content: 'Hello' }],
      maxTokens: 10
    });
    return true;
  } catch (error) {
    console.error('验证API密钥失败:', error);
    return false;
  }
}
```

### Error Codes Pattern

```javascript
export const ERROR_CODES = {
  INVALID_API_KEY: 'INVALID_API_KEY',
  RATE_LIMIT: 'RATE_LIMIT',
  NETWORK_ERROR: 'NETWORK_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

export function getErrorMessage(errorCode) {
  const messages = {
    [ERROR_CODES.INVALID_API_KEY]: 'API密钥无效，请检查设置',
    // ...
  };
  return messages[errorCode] || messages[ERROR_CODES.UNKNOWN_ERROR];
}
```

## Logging

Console logs use Chinese messages with emoji indicators:

```javascript
console.log('✅ 设置保存成功');
console.warn('⚠️ 自动同步设置失败（可能未登录或断网）:', err);
console.error('❌ 保存设置失败:', error);
console.log('🧹 清理了 50 条旧缓存');
```

## State Management

### Local Storage Keys

Consistent naming with `vocabcontext_` prefix:

```javascript
const SETTINGS_KEY = 'vocabcontext_settings';
const USER_PROFILE_KEY = 'vocabcontext_user_profile';
const CACHE_KEY_PREFIX = 'vocabcontext_ai_';
```

### Cache Patterns

```javascript
function getFromCache(key) {
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const data = JSON.parse(cached);
      const age = Date.now() - (data.generatedAt || 0);
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      if (age < maxAge) {
        return data;
      } else {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('读取缓存失败:', error);
  }
  return null;
}
```

## Styling

### Tailwind Configuration

Custom theme defined in `tailwind.config.js`:

```javascript
colors: {
  sage: {
    50: '#f5f7f5',
    // ...
    500: '#5c6b5c',  // Primary green
  },
  beige: {
    50: '#faf8f6',
    // ...
  },
  success: { light: '#d4ddd4', DEFAULT: '#5c6b5c', dark: '#3d473d' },
  error: { light: '#e8d4d4', DEFAULT: '#8b5a5a', dark: '#6b4545' }
}
```

### Dark/Light Theme Pattern

Components check `isDark` from `useTheme()`:

```vue
<div :class="['card', isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200']">
```

## Module Exports

Named exports are preferred over default exports:

```javascript
// Preferred
export function loadSettings() { }
export function saveSettings(settings) { }

// Only for classes/singletons
export class AIService { }
export default someConfig  // Rare, for config files only
```

---

*Convention analysis: 2026-03-26*