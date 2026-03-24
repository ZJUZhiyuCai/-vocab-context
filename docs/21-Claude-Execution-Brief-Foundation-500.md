# Claude Code Execution Brief

## Mission

Expand the IELTS learning system from the current stable baseline to the next safe milestone without lowering quality.

Primary target:

- grow `IELTS Foundation` from `454` to `500+`

Secondary target:

- strengthen weak Topic Packs so the IELTS path feels more balanced and useful

## Current Baseline

Production counts right now:

- Foundation: `454`
- Education: `120`
- Government: `103`
- Environment: `69`
- Technology: `51`
- Health: `38`
- Work: `21`
- Media: `23`
- Crime: `14`

Quality baseline right now:

- `genericDefinitions: 0`
- `blankIpa: 0`
- `chineseIssues: 0`
- `weakParaphrases: 0`
- `templateContexts: 0`
- `badCollocations: 0`

Build baseline:

- `npm run build` passes

Schema baseline:

- `node scripts/qa-validate-bundles.js public/data/ielts-core-500.json` passes

## Hard Constraints

Do not break these rules:

1. No quality regression.
2. No draft bundles in production outputs.
3. No fake expansion by importing low-value or niche words.
4. No noisy medical jargon, narrow legal jargon, archaic words, or odd dictionary scraps.
5. Preserve the current visual language and layout system.
6. Do not run batch promotion scripts in parallel.
7. Prefer rebuilding Foundation from reviewed batches rather than stacking unsafe one-off overwrites.

## Expansion Strategy

Focus on useful, exam-transferable additions.

Priority order:

1. weak Topic Packs
2. high-transfer Foundation additions
3. only then broader lexical variety

Weak Topic Packs to prioritize:

- health
- work
- media
- crime

Preferred lexical types:

- argument nouns
- evaluation adjectives
- public-policy verbs
- social-issue nouns
- writing-safe academic verbs
- high-yield paraphrase items

Avoid:

- extremely topic-narrow biomedical words
- obscure legal procedure words unless clearly transferable
- culture/history trivia
- words whose examples are too noisy to salvage

## Target Outcome

Stretch goal:

- Foundation `500+`

Minimum acceptable safe outcome:

- Foundation `490+`

Topic Pack floor after this run:

- Health `50+`
- Work `30+`
- Media `30+`
- Crime `25+`

If these targets cannot be reached without reducing quality, stop early and report the safest achieved counts.

## Required Workstreams

### Workstream 1: Candidate Review

Use the existing legacy intake and reviewed-batch workflow.

Relevant files:

- `data/ielts-legacy-foundation-intake.json`
- `data/ielts-legacy-foundation-batch*.json`
- `scripts/promote-legacy-foundation-batch*.js`
- `scripts/rebuild-foundation-from-reviewed-batches.js`

Tasks:

- inspect remaining candidates
- approve only candidates that are genuinely IELTS-usable
- create new reviewed batch files for the next safe wave
- keep batches reasonably small and explainable

Recommended batch size:

- `10 to 20` approved words per batch

### Workstream 2: Foundation Rebuild

Tasks:

- rebuild Foundation from the reviewed batches
- ensure no reviewed batch overwrites earlier approved additions
- regenerate official topic packs from the rebuilt Foundation

Relevant files:

- `public/data/ielts-core-500.json`
- `public/data/ielts-topic-*.json`
- `scripts/rebuild-foundation-from-reviewed-batches.js`
- `scripts/generate-official-topic-packs.js`

### Workstream 3: UI Count Sync

Tasks:

- update front-end vocabulary counts to match production files

Relevant file:

- `src/utils/vocabularyManager.js`

### Workstream 4: Optional Product Polish

Only do this if the main expansion is already complete and clean.

Tasks:

- minor cleanup in the IELTS learning path presentation
- no redesign
- no visual experiments

## Acceptance Criteria

Claude code should not consider the task done until all items below are true.

### Data

- Foundation count increased materially
- Topic Pack counts updated consistently
- production files contain no draft items

### Quality

- `node scripts/qa-validate-bundles.js public/data/ielts-core-500.json`
- `npm run audit:real`

Must remain:

- `genericDefinitions: 0`
- `blankIpa: 0`
- `chineseIssues: 0`
- `weakParaphrases: 0`
- `templateContexts: 0`
- `badCollocations: 0`

### Build

- `npm run build`

### Consistency

- counts in `src/utils/vocabularyManager.js` match production JSON
- topic pack files reflect rebuilt Foundation counts

## Required Final Report From Claude Code

Claude code must end with a concise report containing:

1. Foundation count before vs after
2. Topic Pack counts before vs after
3. Which batch files were added or changed
4. Which scripts were run, in order
5. QA result
6. audit result
7. build result
8. any residual risks

## Suggested Execution Order

1. Review remaining intake candidates
2. Create one new conservative reviewed batch
3. Rebuild Foundation from all reviewed batches
4. Regenerate official topic packs
5. Sync counts in `vocabularyManager.js`
6. Run QA
7. Run audit
8. Run build
9. If still safe, repeat with one more batch
10. Stop before quality starts to wobble

## Stop Conditions

Stop immediately and report instead of forcing expansion if:

- candidate quality drops sharply
- new bundles start needing template contexts
- collocations become weak or artificial
- Chinese cleanup becomes noisy
- build or QA becomes unstable

## One-Line Summary

Push Foundation from `454` toward `500+`, strengthen weak Topic Packs, and do it without sacrificing the current all-green quality state.
