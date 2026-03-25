---
generated: 2026-03-26
focus: structure
---

# Codebase Structure

**Analysis Date:** 2026-03-26

## Directory Layout

```
vocab/
├── src/                    # Source code (main application)
│   ├── components/         # Vue components
│   ├── composables/        # Vue composition functions
│   ├── layouts/            # Page layout components
│   ├── utils/              # Business logic and services
│   ├── styles/             # CSS styles
│   ├── App.vue             # Root component
│   └── main.js             # Application entry point
├── public/                 # Static assets (served directly)
│   ├── data/               # Vocabulary JSON files
│   ├── sw.js               # Service worker
│   ├── manifest.json       # PWA manifest
│   └── icon-*.png          # App icons
├── data/                   # Source data (development)
├── scripts/                # Build and data processing scripts
├── docs/                   # Documentation
├── server/                 # Dev server utilities
├── netlify/                # Netlify functions
├── dist/                   # Build output (generated)
├── node_modules/           # Dependencies (generated)
├── index.html              # HTML entry point
├── package.json            # Project configuration
├── vite.config.js          # Vite build config
├── tailwind.config.js      # Tailwind CSS config
└── postcss.config.js       # PostCSS config
```

## Directory Purposes

**src/components/**
- Purpose: Reusable Vue SFC components
- Contains: `.vue` files with template, script, scoped styles
- Key files:
  - `PremiumWordCard.vue` - Main word learning card
  - `BundleWordCard.vue` - Context bundle card variant
  - `Quiz.vue` - Quiz session component
  - `Wordbook.vue` - Saved words collection
  - `Sidebar.vue` - Navigation sidebar (legacy layout)
  - `MobileTabBar.vue` - Mobile navigation

**src/components/context/**
- Purpose: Context-first learning feature components
- Contains: Components for IELTS context practice
- Key files:
  - `ContextPractice.vue` - Main context practice container
  - `ContextSession.vue` - Session orchestrator
  - `MeaningChoice.vue` - Multiple choice for meaning
  - `ParaphraseMatch.vue` - Paraphrase matching exercise
  - `MicroOutput.vue` - Writing output exercise
  - `ExamDrills.vue` - Exam-style drilling
  - `OutputStudio.vue` - Writing practice studio

**src/components/quiz/**
- Purpose: Quiz and review functionality
- Contains: Quiz-related components
- Key files:
  - `FlashcardView.vue` - Flashcard display
  - `MultipleChoiceQuestion.vue` - MCQ component
  - `SpellingQuestion.vue` - Spelling test
  - `ReviewSession.vue` - Review mode session
  - `TestSession.vue` - Test mode session
  - `QuizResults.vue` - Results display

**src/composables/**
- Purpose: Reusable Vue composition functions
- Contains: Shared reactive logic
- Key files:
  - `useAuth.js` - Authentication state and methods
  - `useTheme.js` - Dark/light theme management
  - `useConfetti.js` - Celebration animations

**src/layouts/**
- Purpose: Page-level layout components
- Contains: Components that wrap page content
- Key files:
  - `PremiumLayout.vue` - Main app layout with navbar

**src/utils/**
- Purpose: Business logic, services, data operations
- Contains: Plain JavaScript modules
- Key files:
  - `storage.js` - localStorage persistence
  - `vocabularyManager.js` - Vocabulary configuration and progress
  - `vocabularyLoader.js` - JSON vocabulary loading
  - `bundleLoader.js` - Context bundle loading
  - `spacedRepetition.js` - SRS algorithm
  - `aiService.js` - AI integration (examples, quizzes, analysis)
  - `aiClient.js` - Low-level AI API calls
  - `authService.js` - Supabase authentication
  - `syncService.js` - Cloud sync operations
  - `supabase.js` - Supabase client initialization
  - `contextSessionEngine.js` - Context learning flow
  - `examDrillEngine.js` - Exam drill logic
  - `outputStudioEngine.js` - Writing practice logic
  - `studyHistory.js` - Learning history tracking
  - `achievements.js` - Achievement system

**src/styles/**
- Purpose: Global CSS styles
- Contains: CSS files and Tailwind imports
- Key files:
  - `main.css` - Main stylesheet with Tailwind
  - `theme.css` - CSS custom properties for theming

**public/data/**
- Purpose: Vocabulary data files (served statically)
- Contains: JSON vocabulary bundles
- Key files:
  - `ielts-foundation.json` - IELTS foundation vocabulary (541 words)
  - `ielts-topic-education.json` - Education topic vocabulary
  - `ielts-topic-government.json` - Government topic
  - `ielts-topic-environment.json` - Environment topic
  - `ielts-topic-technology.json` - Technology topic
  - `ielts-topic-health.json` - Health topic
  - `ielts-topic-work.json` - Work topic
  - `ielts-topic-media.json` - Media topic
  - `ielts-topic-crime.json` - Crime topic
  - `vocab-cet4-basic.json` - CET-4 vocabulary
  - `vocab-cet6-advanced.json` - CET-6 vocabulary
  - `vocab-a2-basic.json` through `vocab-c2-proficiency.json` - CEFR levels

**scripts/**
- Purpose: Build tools and data processing
- Contains: Node.js scripts for development
- Key files:
  - `convert-data.js` - Data format conversion
  - `generate-core-bundles.js` - Bundle generation
  - `audit-ielts-candidates.js` - Data quality audit
  - `build-vocab-libraries.js` - Vocabulary building

**docs/**
- Purpose: Project documentation
- Contains: Design docs, PRDs, execution briefs
- Key files:
  - `01-PRD.md` - Product requirements
  - `05-Components-Spec.md` - Component specifications
  - `06-Data-Structure.md` - Data format documentation

## Key File Locations

### Entry Points
- `/index.html`: HTML entry, loads `main.js`, registers service worker
- `/src/main.js`: Vue app creation and mounting
- `/src/App.vue`: Root component with all application logic

### Configuration
- `/package.json`: Dependencies, scripts, project metadata
- `/vite.config.js`: Vite build configuration with AI proxy
- `/tailwind.config.js`: Custom color palette (sage, beige, blue)
- `/postcss.config.js`: PostCSS with Tailwind and autoprefixer
- `/netlify.toml`: Netlify deployment configuration

### Core Logic
- `/src/utils/vocabularyManager.js`: Vocabulary definitions, progress tracking
- `/src/utils/spacedRepetition.js`: SRS algorithm implementation
- `/src/utils/aiService.js`: AI integration hub
- `/src/utils/storage.js`: localStorage persistence layer

### Testing
- No dedicated test directory present
- Test data scripts in `/scripts/`

## Naming Conventions

### Files
- Vue components: PascalCase (e.g., `PremiumWordCard.vue`)
- Utility modules: camelCase (e.g., `spacedRepetition.js`)
- Composables: camelCase with `use` prefix (e.g., `useAuth.js`)
- Data files: kebab-case (e.g., `ielts-topic-education.json`)

### Directories
- Component subdirectories: lowercase (e.g., `context/`, `quiz/`)
- Feature directories: lowercase (e.g., `utils/`, `styles/`)

### Code
- Vue components: `<script setup>` syntax
- Exports: Named exports preferred over default exports
- Constants: SCREAMING_SNAKE_CASE (e.g., `REVIEW_INTERVALS`)

## Where to Add New Code

### New Feature
- Primary component: `src/components/[FeatureName].vue`
- Business logic: `src/utils/[featureName].js`
- If context-related: `src/components/context/[FeatureName].vue`

### New Vocabulary/Topic
- Data file: `public/data/ielts-topic-[topic].json`
- Register in: `src/utils/vocabularyManager.js` (add to `VOCABULARIES` array)
- Follow bundle schema in `docs/13-IELTS-Context-Bundle-Schema.json`

### New AI Capability
- Add method to: `src/utils/aiService.js` (AIService class)
- Low-level API: `src/utils/aiClient.js`
- Prompt templates: Keep in respective service methods

### New Page/Route
- Add component to: `src/components/[PageName].vue`
- Add navigation in: `src/layouts/PremiumLayout.vue`
- Add case in: `src/App.vue` template (v-if conditions)
- No router library - manual page state management

### New Shared Logic
- Composable: `src/composables/use[Name].js`
- Utility: `src/utils/[name].js`

### New Styles
- Global styles: `src/styles/main.css`
- Theme variables: `src/styles/theme.css`
- Component styles: Scoped in `.vue` files

## Special Directories

**dist/**
- Purpose: Production build output
- Generated: Yes (by `npm run build`)
- Committed: No (in `.gitignore`)

**node_modules/**
- Purpose: npm dependencies
- Generated: Yes (by `npm install`)
- Committed: No

**data/**
- Purpose: Source data for development/processing
- Contains: Intermediate JSON files, review candidates
- Generated: Partially (some are hand-curated)
- Committed: Yes

**docs/plans/**
- Purpose: Planning documents (Supabase design)
- Contains: SQL schemas, setup plans
- Generated: No
- Committed: Yes

**.planning/**
- Purpose: GSD planning documents
- Contains: Phase plans, codebase analysis
- Generated: Yes (by GSD commands)
- Committed: Yes

---

*Structure analysis: 2026-03-26*