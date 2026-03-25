---
generated: 2026-03-26
focus: integrations
---

# External Integrations

**Analysis Date:** 2026-03-26

## APIs & External Services

### SiliconFlow AI (Primary AI Provider)
- **Purpose:** AI-powered vocabulary learning features (example sentences, quiz generation, error analysis, memory hooks)
- **SDK/Client:** Custom fetch-based client in `/Users/rosscai/projects/vocab/src/utils/aiClient.js`
- **Model:** Qwen/Qwen2.5-72B-Instruct
- **Auth:** API key via `SILICONFLOW_API_KEY` env var
- **Base URL:** `https://api.siliconflow.cn/v1`
- **Proxy Pattern:**
  - Development: Vite middleware (`/Users/rosscai/projects/vocab/server/aiProxy.js`) proxies requests to `/api/ai/chat`
  - Production: Netlify function (`/Users/rosscai/projects/vocab/netlify/functions/ai-chat.js`) proxies requests

### AI Feature Modules
- `/Users/rosscai/projects/vocab/src/utils/aiService.js` - Main AI service class with caching
- `/Users/rosscai/projects/vocab/src/utils/aiQuizGenerator.js` - Quiz generation
- `/Users/rosscai/projects/vocab/src/utils/aiErrorAnalyzer.js` - Error analysis and study plans
- `/Users/rosscai/projects/vocab/src/utils/aiMemoryHooks.js` - Memory hooks and word networks
- `/Users/rosscai/projects/vocab/src/utils/aiAgent.js` - AI agent for contextual learning

## Data Storage

### Supabase (Cloud Backend)
- **Purpose:** User authentication, cloud sync for progress, settings, wordbook
- **SDK:** `@supabase/supabase-js` 2.90.1
- **Client:** `/Users/rosscai/projects/vocab/src/utils/supabase.js`
- **Connection:** `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- **Project Ref:** `kjfddryrzktxrdnxtnri`

**Database Tables:**
- `user_settings` - User preferences (daily_goal, study_mode, purpose, theme)
- `vocabulary_progress` - Learning progress per vocabulary set
- `wordbook` - Personal word collection
- `word_review_states` - SRS (Spaced Repetition System) states
- `study_history` - Daily study records
- `achievements` - Unlocked achievements

### Local Storage
- **Purpose:** Offline-first data persistence
- **Keys:** `vocabcontext_*` prefix
- **Managed by:** `/Users/rosscai/projects/vocab/src/utils/storage.js`

**Key Storage Keys:**
- `vocabcontext_settings` - User settings
- `vocabcontext_user_profile` - User profile
- `vocabcontext_wordbook` - Personal wordbook
- `vocabcontext_ai_*` - AI response cache

### File Storage
- **Static Data Only:** Vocabulary JSON files in `/public/data/`

### Caching
- **AI Response Cache:** localStorage with 30-day TTL
- **Static Assets:** Browser cache via Netlify headers (1 year for data/assets)

## Authentication & Identity

### Supabase Auth
- **Provider:** OAuth + Magic Link
- **Implementation:** `/Users/rosscai/projects/vocab/src/utils/authService.js`

**Supported OAuth Providers:**
- Google (implied from OAuth pattern)
- Magic Link (email OTP)

**Auth Flow:**
1. `signInWithOAuth(provider)` or `signInWithMagicLink(email)`
2. Redirect to `VITE_REDIRECT_URL` after authentication
3. Session stored in localStorage with key `sb-{project_ref}-auth-token`
4. Auto session cleanup on expiry (90-second margin)

**Offline Mode:**
- App functions without Supabase config
- All data stored locally
- Cloud sync disabled gracefully

## Browser APIs

### Web Speech API (Text-to-Speech)
- **Implementation:** `/Users/rosscai/projects/vocab/src/utils/text-to-speech.js`
- **Purpose:** Word and sentence pronunciation
- **Features:**
  - Rate/pitch/volume control
  - Voice selection (prefers high-quality English voices)
  - Play/pause/stop controls
  - Event-based playback status

### Canvas Confetti
- **Purpose:** Achievement celebration animations
- **Package:** `canvas-confetti` 1.9.4
- **Usage:** `/Users/rosscai/projects/vocab/src/composables/useConfetti.js`

## Monitoring & Observability

**Error Tracking:**
- None detected - console logging only

**Logs:**
- Console-based logging with emoji prefixes (e.g., `✅`, `⚠️`, `❌`)
- Warning messages for offline mode, sync failures

## CI/CD & Deployment

### Hosting
- **Platform:** Netlify
- **Config:** `/Users/rosscai/projects/vocab/netlify.toml`

**Build Settings:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "netlify/functions"
```

**Redirects:**
- `/api/ai/chat` -> `/.netlify/functions/ai-chat`

**Security Headers:**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### CI Pipeline
- Not detected - No GitHub Actions or other CI config in `.github/`

## Environment Configuration

**Required Environment Variables:**

| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | For cloud sync |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | For cloud sync |
| `VITE_REDIRECT_URL` | OAuth redirect URL | For auth |
| `SILICONFLOW_API_KEY` | SiliconFlow AI API key | For AI features |
| `SILICONFLOW_MODEL` | AI model name | Optional (default: Qwen/Qwen2.5-72B-Instruct) |
| `SILICONFLOW_API_BASE_URL` | SiliconFlow API base URL | Optional |

**Example Configuration (`/Users/rosscai/projects/vocab/.env.example`):**
```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_REDIRECT_URL=http://localhost:5173
SILICONFLOW_API_KEY=your-local-siliconflow-api-key
SILICONFLOW_MODEL=Qwen/Qwen2.5-72B-Instruct
SILICONFLOW_API_BASE_URL=https://api.siliconflow.cn/v1
```

**Secrets Location:**
- Development: `.env` file (gitignored)
- Production: Netlify environment variables

## Webhooks & Callbacks

**Incoming:**
- OAuth callbacks via URL hash fragments
- Magic Link email redirects

**Outgoing:**
- None detected

## API Patterns

### AI Client Pattern (`/Users/rosscai/projects/vocab/src/utils/aiClient.js`)
```javascript
// Request flow:
1. Try local dev proxy: /api/ai/chat
2. Try Netlify function: /.netlify/functions/ai-chat
3. Fallback to direct SiliconFlow API (if user provides API key)

// Request format:
{
  apiKey: string,
  messages: Array<{role: string, content: string}>,
  temperature: number (default 0.7),
  maxTokens: number (default 800),
  topP: number (optional)
}
```

### Supabase Sync Pattern (`/Users/rosscai/projects/vocab/src/utils/syncService.js`)
```javascript
// Sync on data change:
- syncSettings(settings) -> user_settings table
- syncVocabularyProgress(vocabId, progress) -> vocabulary_progress table
- syncWordbook(wordId, vocabId, isAdding) -> wordbook table
- syncReviewState(vocabId, wordId, state) -> word_review_states table
- syncStudyHistory(date, wordsLearned, studyTime) -> study_history table
- syncAchievement(achievementId) -> achievements table

// Full sync on login:
fullSync() -> Pull all cloud data
```

---

*Integration audit: 2026-03-26*