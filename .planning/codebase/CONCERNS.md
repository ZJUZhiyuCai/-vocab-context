---
generated: 2026-03-26
focus: concerns
---

# Codebase Concerns

## HIGH Severity

### No Test Infrastructure
- **Severity:** HIGH
- **Files:** Entire codebase
- **Description:** No test files exist in the project. The only test file found is `node_modules/fraction.js/tests/fraction.test.js` (third-party). No Jest, Vitest, or other test framework is configured in `package.json`.
- **Impact:** Changes cannot be verified automatically. Refactoring is risky. Bug regressions go undetected.
- **Recommended Action:**
  1. Add Vitest (aligns with Vite ecosystem)
  2. Create test utilities in `src/utils/__tests__/`
  3. Start with unit tests for `spacedRepetition.js`, `vocabularyManager.js`
  4. Add component tests for critical flows (word learning, review queue)

### Monolithic App.vue Component
- **Severity:** HIGH
- **Files:** `src/App.vue` (1304 lines)
- **Description:** The main App.vue file contains:
  - 40+ state variables (refs)
  - 30+ computed properties
  - Multiple modal dialogs inline (settings, vocab selector)
  - Business logic mixed with UI
  - Direct localStorage access
- **Impact:** Difficult to maintain, test, and reason about. Any change risks breaking unrelated functionality. Poor separation of concerns.
- **Recommended Action:**
  1. Extract settings modal to `src/components/SettingsModal.vue`
  2. Move vocabulary selector modal to existing `VocabularySelector.vue`
  3. Create `src/composables/useAppState.js` for state management
  4. Create `src/composables/useWordOperations.js` for word-related operations
  5. Create `src/composables/useReviewSystem.js` for spaced repetition logic

### No Code Quality Tooling
- **Severity:** HIGH
- **Files:** Project root (missing config files)
- **Description:** No ESLint, Prettier, or other linting/formatting configuration exists. No `.eslintrc`, `.prettierrc`, or `eslint.config.js` found.
- **Impact:** Inconsistent code style, no automated code quality checks, potential bugs from unused variables or syntax issues.
- **Recommended Action:**
  1. Add ESLint with `@eslint/js` and `eslint-plugin-vue`
  2. Add Prettier for formatting
  3. Configure VS Code settings for auto-format
  4. Add pre-commit hooks with lint-staged

---

## MEDIUM Severity

### Large ContextPractice Component
- **Severity:** MEDIUM
- **Files:** `src/components/context/ContextPractice.vue` (1682 lines)
- **Description:** Contains multiple modes (session, outputStudio, examDrills), IELTS path coaching, and track management in a single file.
- **Impact:** Difficult navigation, high cognitive load, slow hot reload during development.
- **Recommended Action:**
  1. Extract IELTS path coach to `src/components/context/PathCoach.vue`
  2. Extract track selection to `src/components/context/TrackSelector.vue`
  3. Consider route-based splitting for different modes

### Scattered localStorage Keys
- **Severity:** MEDIUM
- **Files:** Multiple files across `src/utils/` and `src/components/`
- **Description:** localStorage keys are hardcoded in at least 30+ locations:
  - `src/utils/storage.js`: `vocabcontext_settings`, `vocabcontext_user_profile`, `vocabcontext_wordbook`
  - `src/utils/aiService.js`: `vocabcontext_ai_*` (cache keys)
  - `src/utils/gistSync.js`: `vocabcontext_gist_config`, `vocabcontext_last_sync`
  - `src/components/AITeacherSidebar.vue`: `vocabcontext_ai_teacher_history`
  - `src/components/Wordbook.vue`: `vocab-context-favorite-times`
  - `src/utils/outputStudioEngine.js`: Multiple keys for session history
- **Impact:** Key collision risk, difficult migration, no central place for storage management, quota issues handled inconsistently.
- **Recommended Action:**
  1. Create `src/utils/storageKeys.js` with all key constants
  2. Create `src/utils/storageService.js` as unified storage abstraction
  3. Add version prefix for migration support
  4. Implement centralized quota management

### Debug Logging in Production Code
- **Severity:** MEDIUM
- **Files:** 30+ locations across `src/`
- **Description:** Console.log/warn/error statements throughout production code:
  - `src/App.vue`: "Attempting Free Dictionary API", "Fallback to browser TTS"
  - `src/utils/storage.js`: "Settings saved successfully", "localStorage full"
  - `src/utils/aiService.js`: "Using cached AI example"
  - `src/components/VocabLevelTest.vue`: Test analysis logs
- **Impact:** Console noise in production, potential performance impact, may expose sensitive information in browser console.
- **Recommended Action:**
  1. Create `src/utils/logger.js` with environment-aware logging
  2. Add Vite plugin to strip console statements in production build
  3. Replace ad-hoc logging with structured logger

### v-html Without Sanitization
- **Severity:** MEDIUM
- **Files:** `src/components/PremiumWordCard.vue:111`
- **Description:** Uses `v-html="highlightedSentence"` where `highlightedSentence` is computed via regex replacement without proper sanitization:
  ```javascript
  const regex = new RegExp(`(${word})`, 'gi')
  return sentence.replace(regex, '<span class="...">$1</span>')
  ```
- **Impact:** If `word` contains special regex characters or if `sentence` contains user-generated content, this could lead to XSS vulnerabilities.
- **Recommended Action:**
  1. Use `DOMPurify` or Vue's `v-html` alternative with sanitization
  2. Escape special regex characters in `word` before creating regex
  3. Consider using `<mark>` tag with CSS instead of v-html

### Outdated Dependencies
- **Severity:** MEDIUM
- **Files:** `package.json`
- **Description:** Several major version updates available:
  - `vite`: 5.4.21 → 8.0.2 (major version behind)
  - `tailwindcss`: 3.4.19 → 4.2.2 (major version behind)
  - `@vitejs/plugin-vue`: 5.2.4 → 6.0.5 (major version behind)
  - `vue`: 3.5.30 → 3.5.31 (patch behind)
- **Impact:** Missing performance improvements, bug fixes, and new features. Tailwind 4 has breaking changes that need migration.
- **Recommended Action:**
  1. Update Vue to 3.5.31 (patch update, low risk)
  2. Update @vitejs/plugin-vue to 6.x (test build process)
  3. Plan migration to Vite 8.x (check plugin compatibility)
  4. Evaluate Tailwind 4 migration (significant breaking changes)

---

## LOW Severity

### Incomplete TODO
- **Severity:** LOW
- **Files:** `src/components/OnboardingQuiz.vue:251`
- **Description:** Comment `// TODO: 保存选中的词库到localStorage或发送给父组件` suggests incomplete implementation.
- **Impact:** Unclear if the onboarding vocabulary selection is properly persisted.
- **Recommended Action:** Verify the implementation handles vocabulary selection persistence correctly, remove TODO if complete or implement if not.

### No Error Boundary
- **Severity:** LOW
- **Files:** `src/main.js`, `src/App.vue`
- **Description:** No Vue error boundary component wraps the application. Errors will crash the entire app rather than showing a graceful fallback.
- **Impact:** Poor user experience when errors occur, no error reporting mechanism.
- **Recommended Action:**
  1. Create `src/components/ErrorBoundary.vue`
  2. Wrap key sections in error boundaries
  3. Add error reporting service integration

### Hardcoded API Configuration
- **Severity:** LOW
- **Files:** `src/utils/aiClient.js`, `server/aiProxy.js`
- **Description:** AI provider configuration is hardcoded:
  - `AI_PROVIDER_NAME = 'SiliconFlow'`
  - `AI_BROWSER_BASE_URL = 'https://api.siliconflow.cn/v1'`
  - `DEFAULT_AI_MODEL = 'Qwen/Qwen2.5-72B-Instruct'`
- **Impact:** Cannot easily switch AI providers without code changes.
- **Recommended Action:**
  1. Move provider configuration to environment variables
  2. Support multiple providers through configuration

### Supabase Project Reference Hardcoded
- **Severity:** LOW
- **Files:** `src/utils/supabase.js:5`
- **Description:** `const SUPABASE_PROJECT_REF = 'kjfddryrzktxrdnxtnri'` is hardcoded rather than derived from URL.
- **Impact:** Minor - the value is consistent with URL, but creates a maintenance point.
- **Recommended Action:** Extract project ref from `VITE_SUPABASE_URL` at runtime.

### API Key in Request Body
- **Severity:** LOW
- **Files:** `src/utils/aiClient.js:19`, `server/aiProxy.js:27`
- **Description:** API key is passed in request body (`body.apiKey`) for proxy requests. While acceptable for local/server proxy, this pattern is used inconsistently.
- **Impact:** Slightly unusual pattern; most APIs pass keys via headers.
- **Recommended Action:** Ensure server-side proxy validates and strips API key before forwarding to upstream.

---

## Documentation Gaps

### Missing Architecture Documentation
- **Files:** `docs/` directory
- **Description:** While extensive PRD and feature docs exist, no high-level architecture diagram or component relationship documentation.
- **Recommended Action:** Add `docs/ARCHITECTURE.md` with component hierarchy and data flow.

### Missing API Integration Guide
- **Files:** `docs/04-API-Documentation.md`
- **Description:** API docs exist but lack integration examples and error handling patterns.
- **Recommended Action:** Add code examples for common AI operations with error handling.

---

## Test Coverage Gaps

### Untested Utility Modules
- **What's not tested:** All utility functions in `src/utils/`
- **Files:** `spacedRepetition.js`, `vocabularyManager.js`, `examDrillEngine.js`, `outputStudioEngine.js`
- **Risk:** Logic errors in spaced repetition algorithm could affect learning effectiveness
- **Priority:** HIGH

### Untested Components
- **What's not tested:** All Vue components
- **Files:** `App.vue`, `ContextPractice.vue`, `ReviewQueue.vue`, `Quiz.vue`
- **Risk:** UI changes could break user flows without detection
- **Priority:** MEDIUM

---

## Fragile Areas

### Word Progress Persistence
- **Files:** `src/App.vue:826-897`, `src/utils/vocabularyManager.js`
- **Why fragile:** Complex progress sanitization logic with multiple localStorage keys, validation, and edge cases
- **Safe modification:** Add tests before any changes to progress calculation
- **Test coverage:** None

### AI Chat Completion Flow
- **Files:** `src/utils/aiClient.js`, `server/aiProxy.js`, `netlify/functions/ai-chat.js`
- **Why fragile:** Multiple fallback paths (proxy URLs, direct API), error handling across client/server boundary
- **Safe modification:** Test all fallback paths manually before changes
- **Test coverage:** None

---

*Concerns audit: 2026-03-26*