# Phase 1: 测试与质量工具配置 - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning
**Mode:** Auto-generated (discuss skipped via workflow.skip_discuss)

<domain>
## Phase Boundary

建立测试和代码质量基础设施，为后续重构提供安全网。

This phase sets up:
- Vitest testing framework
- ESLint + Prettier code quality tools
- lint-staged for pre-commit checks

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase.

Key decisions to make:
- Vitest configuration (browser vs node environment)
- ESLint rules (Vue 3 recommended + what extensions)
- Test file organization (co-located vs separate)
- Which files to test first (core utilities)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
From codebase analysis:
- `src/utils/spacedRepetition.js` - core algorithm, pure functions
- `src/utils/vocabularyManager.js` - vocabulary config
- `src/utils/storage.js` - settings management

### Established Patterns
- Vue 3 Composition API
- ES modules
- No existing tests

### Integration Points
- `package.json` scripts section
- Vite build configuration

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Follow Vitest and ESLint best practices for Vue 3 + Vite projects.

</specifics>

<deferred>
## Deferred Ideas

None — infrastructure phase.
</deferred>