---
generated: 2026-03-26
focus: tech
---

# Technology Stack

**Analysis Date:** 2026-03-26

## Languages

**Primary:**
- JavaScript (ES6+) - All application code, Vue components, utility modules

**Secondary:**
- JSON - Data files in `/public/data/`, configuration files
- CSS - Tailwind-based styling with custom theme

## Runtime

**Environment:**
- Browser (Chrome, Firefox, Safari, Edge) - Primary runtime
- Node.js 18+ - Build scripts and data processing utilities

**Package Manager:**
- npm - Package management
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- Vue 3.5.26 - Frontend framework with Composition API
- Vite 5.4.21 - Build tool and dev server

**Styling:**
- Tailwind CSS 3.4.19 - Utility-first CSS framework
- PostCSS 8.5.6 - CSS processing
- Autoprefixer 10.4.23 - Vendor prefix automation

**Testing:**
- Not detected - No test framework configured

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` 2.90.1 - Authentication and cloud sync
- `vue` 3.5.26 - Core framework
- `canvas-confetti` 1.9.4 - Achievement celebration animations

**Development:**
- `@vitejs/plugin-vue` 5.2.4 - Vue SFC compilation for Vite

## Build Configuration

**Vite Config (`/Users/rosscai/projects/vocab/vite.config.js`):**
```javascript
// Key settings
server.port: 8888
build.target: 'modules'
build.minify: 'esbuild'
build.sourcemap: false
build.cssCodeSplit: true

// Chunk splitting
manualChunks: {
  'vue-vendor': ['vue'],
  'utils': ['./src/utils/aiService.js', './src/utils/storage.js']
}

// Path alias
'@': './src'
```

**Tailwind Config (`/Users/rosscai/projects/vocab/tailwind.config.js`):**
- Custom color palette: `sage`, `blue`, `beige` (Morandi color system)
- Custom font sizes: `word` (28px), `sentence` (15px)
- Custom animations: `fade-in`, `slide-up`, `progress-bump`

## Platform Requirements

**Development:**
- Node.js 18+ for build scripts
- Modern browser with Web Speech API support (for TTS)

**Production:**
- Static hosting (Netlify)
- HTTPS required for Web Speech API

## Scripts

**Package Scripts (`/Users/rosscai/projects/vocab/package.json`):**
```bash
npm run dev          # Start Vite dev server (port 8888)
npm run build        # Production build to dist/
npm run preview      # Preview production build
npm run convert      # Convert vocabulary data
npm run generate:ielts       # Generate IELTS vocabulary bundles
npm run generate:ielts:draft # Generate draft bundles
npm run qa:ielts     # QA validate bundles
npm run score:ielts  # Score IELTS candidates
```

**Data Processing Scripts (`/Users/rosscai/projects/vocab/scripts/`):**
- Vocabulary data building and validation
- IELTS vocabulary generation
- Quality scoring and auditing

## Data Architecture

**Static Data (`/Users/rosscai/projects/vocab/public/data/`):**
- Vocabulary JSON files loaded at runtime
- IELTS vocabulary bundles
- Topic-based word packs

**Client Storage:**
- localStorage for user settings, progress, and wordbook
- IndexedDB not used

---

*Stack analysis: 2026-03-26*