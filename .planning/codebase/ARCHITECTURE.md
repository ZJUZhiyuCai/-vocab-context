---
generated: 2026-03-26
focus: architecture
---

# Architecture

**Analysis Date:** 2026-03-26

## Pattern Overview

**Overall:** Single Page Application (SPA) with Component-Based Architecture

**Key Characteristics:**
- Vue 3 Composition API with `<script setup>` syntax
- Centralized state management via reactive refs in App.vue
- Service layer pattern for external integrations (AI, Auth, Sync)
- localStorage-first persistence with optional cloud sync via Supabase
- Context Bundle data model for IELTS vocabulary

## Layers

### Presentation Layer (Components)
- Purpose: UI rendering and user interaction
- Location: `src/components/`, `src/layouts/`
- Contains: Vue SFC components with template, script, and scoped styles
- Depends on: Utils for data operations, Composables for shared logic
- Used by: App.vue as root orchestrator

### Business Logic Layer (Utils/Services)
- Purpose: Core application logic and external integrations
- Location: `src/utils/`
- Contains: Plain JavaScript modules with exported functions and classes
- Depends on: External APIs (Supabase, SiliconFlow AI), localStorage
- Used by: Components and composables

### State Layer (Reactive State)
- Purpose: Application state management
- Location: Distributed across App.vue and service modules
- Contains: Vue reactive refs, computed properties
- Depends on: Vue reactivity system
- Used by: All components via props/emits and composable imports

### Data Layer (Persistence)
- Purpose: Data storage and retrieval
- Location: `src/utils/storage.js`, `src/utils/syncService.js`
- Contains: localStorage operations, Supabase sync functions
- Depends on: localStorage API, Supabase client
- Used by: Business logic layer

## Data Flow

### Word Learning Flow

1. User navigates to app, `App.vue` mounted
2. `loadCurrentVocabulary()` fetches selected vocabulary from localStorage
3. `vocabularyLoader.js` or `bundleLoader.js` fetches JSON data from `/public/data/`
4. Words are filtered based on progress (`learned`, `forgotten` sets)
5. Current word displayed via `PremiumWordCard` or `BundleWordCard` component
6. User action (known/unknown) triggers state update
7. Progress saved to localStorage and synced to cloud (if logged in)

### Spaced Repetition Flow

1. `spacedRepetition.js` calculates review intervals using Ebbinghaus curve
2. Each word has `intervalLevel` (0-5) and `easeFactor` (1.3-2.5)
3. Correct answer increases interval, wrong answer resets to 0
4. `getReviewQueue()` returns prioritized words for review
5. Review states persisted in localStorage with key `vocabcontext_review_{vocabId}`

### Authentication Flow

1. `authService.js` initializes Supabase session on app load
2. OAuth providers (Google, GitHub) or Magic Link for email
3. `user` reactive ref updated on auth state change
4. `useAuth()` composable provides auth state to components
5. Cloud sync triggered after successful login via `syncService.fullSync()`

**State Management:**
- Primary state lives in `App.vue` as reactive refs
- State passed down via props, events bubble up via emits
- Shared state accessed through composables (`useAuth`, `useTheme`)
- No Vuex/Pinia - simpler ref-based approach for this app scale

## Key Abstractions

### Vocabulary Bundle
- Purpose: Represents a learning unit with rich context data
- Examples: `src/utils/bundleLoader.js`, `public/data/ielts-foundation.json`
- Pattern: Normalized JSON structure with contexts, collocations, paraphrases
```javascript
{
  bundleId: "work_significant_001",
  word: "significant",
  ipa: "/sɪɡˈnɪfɪkənt/",
  partOfSpeech: "adj.",
  meaning: "...",
  contexts: [{ kind: "reading", text: "...", purpose: "core" }],
  collocations: ["significant effect"],
  paraphrases: ["substantial"],
  taskTypes: ["reading", "writing"]
}
```

### AIService
- Purpose: Centralized AI functionality with caching
- Examples: `src/utils/aiService.js`
- Pattern: Singleton class with method-based API
```javascript
const ai = getAIService();
await ai.generateExample(word, meaning, purpose);
await ai.generateQuiz(word, otherWords);
await ai.analyzeErrors(mistakes, stats);
```

### ContextSessionEngine
- Purpose: Orchestrates context-first learning sessions
- Examples: `src/utils/contextSessionEngine.js`
- Pattern: Factory function returning state and control methods
- Task sequence: context_preview -> meaning_choice -> paraphrase_match -> micro_output -> feedback -> summary

## Entry Points

### Application Bootstrap
- Location: `src/main.js`
- Triggers: Browser loads `index.html`, script executes
- Responsibilities: Creates Vue app instance, mounts to `#app`, imports global styles

### Root Component
- Location: `src/App.vue`
- Triggers: Vue app mount
- Responsibilities:
  - Orchestrates all page navigation
  - Manages global state (words, progress, settings)
  - Handles vocabulary loading and switching
  - Coordinates sync operations

### Service Worker
- Location: `public/sw.js`
- Triggers: Browser registration in `index.html`
- Responsibilities: Offline caching, update notifications

## Error Handling

**Strategy:** Graceful degradation with user feedback

**Patterns:**
- Try-catch blocks in all async operations with console logging
- User-facing error messages via inline UI states
- Offline mode indicator when network unavailable
- Supabase connection failures fall back to local-only mode
- AI API errors show friendly messages without breaking app

```javascript
// Pattern from storage.js
export function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? normalizeSettings(JSON.parse(saved)) : null;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return null;
  }
}
```

## Cross-Cutting Concerns

**Logging:** Console logging with emoji prefixes (e.g., `✅`, `⚠️`, `❌`)

**Validation:**
- Input validation in settings forms
- Data normalization on load (e.g., `normalizeSettings()`)
- Bundle validation in loader (structure checks)

**Authentication:**
- Supabase Auth with OAuth (Google, GitHub) and Magic Link
- Session persistence in localStorage
- Optional feature - app works fully offline without auth

**Theming:**
- Dark/light mode via `useTheme()` composable
- CSS variables in `theme.css`
- Tailwind-based color system with custom palette

---

*Architecture analysis: 2026-03-26*