# IELTS Learning System Blueprint v2

> **状态：历史文档**
>
> 本文档是 2026 年初的设计蓝图。当前系统已实现以下内容：
> - Foundation: 541 bundles（原计划 600-700）
> - Topic Packs: 8 个（原计划 10-12 个）
> - 规范文件：`ielts-foundation.json`
> - 规范 ID：`ielts-foundation`
>
> 请参考 `docs/23-IELTS-Learning-Track-Overview.md` 获取当前系统状态。

## 1. Executive Decision

`IELTS Core 411` is a useful foundation layer.

It is not a sufficient IELTS preparation system.

From this point forward, the product should stop framing the IELTS offer as:

- one improved vocabulary list

and should instead frame it as:

- a multi-layer IELTS learning system

The app should help learners move through:

1. foundation vocabulary
2. topic coverage
3. output transfer
4. exam simulation

This is the minimum product architecture that can credibly help IELTS learners improve band performance.

## 2. Core Product Truth

Learners do not fail IELTS because they are missing only "more words".

They fail because they cannot reliably:

- recognize vocabulary in topic context
- detect paraphrases in Reading and Listening
- retrieve usable collocations in Writing
- produce safe, natural lexical choices in Speaking

Therefore, the product should optimize for:

- contextual recognition
- paraphrase mapping
- topic transfer
- controlled production

It should not optimize for:

- raw word count growth
- rarity of vocabulary
- generic dictionary-style breadth

## 3. Why Core 411 Is Not Enough

`411` bundles can support:

- a foundation pass
- first-use Context-first sessions
- a coherent MVP for IELTS lexical training

`411` bundles cannot support:

- full topic coverage across common IELTS themes
- enough near-synonym contrast for paraphrase training
- enough productive language for Writing Task 2 and Speaking Part 3
- sufficient redundancy for spaced transfer

Product implication:

- `IELTS Core 411` must be repositioned as `Foundation`
- not the complete IELTS vocabulary offer

## 4. New Product Architecture

The product should move to a 4-layer system.

### Layer 1: Foundation

Goal:

- high-transfer academic core
- broad recognition and early production

Recommended scale:

- `600 to 700` bundles

Current state:

- `411`

What belongs here:

- cross-topic academic verbs
- common evaluation adjectives
- argument nouns
- cause/effect verbs
- comparison and trend language

Examples:

- allocate
- significant
- beneficial
- evidence
- assess
- regulate
- alternative

### Layer 2: Topic Packs

Goal:

- real IELTS topic coverage

Recommended scale:

- `10 to 12` packs
- `80 to 120` bundles per pack
- total `900 to 1,200` bundles

Required packs:

- education
- environment
- technology
- government
- health
- work
- society
- crime
- media
- transport
- housing
- globalization/culture

What belongs here:

- topic nouns
- process verbs
- stance adjectives
- policy language
- public issue framing vocabulary

### Layer 3: Output Layer

Goal:

- help learners actually write and speak better

Recommended scale:

- `200 to 350` output units

Important note:

- this layer is not mainly "new words"
- it is mostly `lexical frames`, `collocation families`, and `argument patterns`

What belongs here:

- cause/effect frames
- concession frames
- comparison frames
- trend description frames
- stance and evaluation frames
- examples and qualification language

Examples:

- play a key role in
- be widely regarded as
- lead to long-term consequences
- there is growing evidence that
- from an educational perspective

### Layer 4: Exam Simulation

Goal:

- connect lexical study to real IELTS task behavior

Recommended scale:

- `100 to 200` integrated task drills

What belongs here:

- Writing Task 2 lexical drills
- Speaking Part 3 topic prompts
- Reading paraphrase recognition sets
- Listening paraphrase mapping drills

## 5. Target Content Scale

Recommended target for a credible IELTS system:

- Foundation: `650`
- Topic Packs: `1,000`
- Output Layer: `250`
- Exam Simulation Units: `150`

This yields a system of roughly:

- `1,900 to 2,100` meaningful learning units

This is a better product target than trying to stretch one "core list" from `411` to `1,200`.

## 6. User-Facing Product Structure

The user should no longer see IELTS as one flat vocabulary entry.

The app should expose this structure:

### IELTS Foundation

- for building base lexical competence
- default first step

### IELTS Topic Practice

- choose one topic pack
- learn within topic context

### IELTS Output Studio

- practice rewriting and producing language
- optimized for Writing and Speaking

### IELTS Exam Drills

- task-oriented mixed review

## 7. New Learning Map

The product should introduce a visible IELTS learning map.

Recommended sequence:

1. finish Foundation baseline
2. unlock Topic Packs
3. unlock Output Studio
4. unlock Exam Drills

Recommended status model:

- `not_started`
- `in_progress`
- `ready_for_review`
- `production_ready`
- `mastered`

Recommended mastery views:

- by topic
- by function
- by skill
- by production readiness

## 8. What The User Should Feel

The product should shift from:

- "I am memorizing words"

to:

- "I am building usable language for IELTS topics"

The app must signal:

- where the learner is
- what they have covered
- what remains
- what skill each layer improves

## 9. Product Changes Required

### P0: Reposition Current Core

Change:

- rename `IELTS Core 411` to `IELTS Foundation`

Reason:

- current naming overpromises

Acceptance criteria:

- no screen implies that Foundation alone is enough for IELTS success
- selector, overview copy, and onboarding all reflect "foundation" framing

### P1: Add Topic Pack Shelf

Change:

- create a new IELTS section for topic packs

Reason:

- topic coverage is the real scale gap

Acceptance criteria:

- users can enter topic-specific vocabulary paths
- topic progress is stored separately

### P2: Add Output Studio

Change:

- create a dedicated output practice area

Reason:

- production is not the same as recognition

Acceptance criteria:

- learners can practice short writing and speaking outputs
- output progress is tracked separately from recognition

### P3: Add Exam Drill Mode

Change:

- create mixed task drills tied to IELTS surfaces

Reason:

- lexical study must transfer into test behavior

Acceptance criteria:

- drills mix vocabulary, paraphrase, collocation, and output

## 10. Data Architecture v2

The system should keep `context bundle` as the atomic unit.

But bundles need stronger taxonomy.

Each bundle should carry:

- `bundleId`
- `word`
- `sense`
- `englishDefinition`
- `chineseMeaning`
- `topic`
- `subtopic`
- `skillSurface`
- `function`
- `register`
- `collocations`
- `paraphrases`
- `confusions`
- `contexts`
- `productionPrompt`
- `masteryTarget`

New field guidance:

### `skillSurface`

Allowed values:

- `reading`
- `listening`
- `writing`
- `speaking`
- `cross_skill`

### `function`

Allowed values:

- `cause_effect`
- `evaluation`
- `comparison`
- `trend`
- `policy`
- `problem_solution`
- `example`
- `concession`
- `stance`

### `masteryTarget`

Allowed values:

- `recognition`
- `paraphrase`
- `collocation`
- `controlled_output`
- `free_output`

## 11. Recommended Vocabulary Roadmap

### Phase A: Foundation Completion

Goal:

- expand `411` to `650`

Rules:

- only cross-topic, high-transfer bundles
- no draft placeholders
- no low-value rarity inflation

### Phase B: Topic Pack Launch

Goal:

- launch first `4` packs

Recommended order:

1. education
2. environment
3. technology
4. government

Reason:

- these have the highest IELTS recurrence

Target scale:

- `80 to 100` bundles per pack

### Phase C: Output Layer Launch

Goal:

- add reusable lexical frames

Target scale:

- `100` initial output units

### Phase D: Full IELTS System

Goal:

- `10+` topic packs
- `250+` output units
- first exam drill set

## 12. Prioritized Build Plan For Claude Code

This is the implementation sequence Claude code should follow.

### Workstream 1: Product Naming Cleanup

Files likely affected:

- `src/utils/vocabularyManager.js`
- `src/components/VocabularySelector.vue`
- `src/components/context/ContextPractice.vue`
- onboarding and copy surfaces that mention IELTS Core

Tasks:

- rename `IELTS Core 411` -> `IELTS Foundation`
- update descriptions to make scope honest
- add helper copy: `Foundation is the first layer of IELTS preparation`

### Workstream 2: Topic Pack Architecture

Files likely affected:

- `public/data/`
- `src/utils/vocabularyManager.js`
- `src/utils/bundleLoader.js`
- `src/App.vue`
- `src/components/` topic selection surfaces

Tasks:

- support multiple IELTS bundle entries
- add `IELTS Topic: Education`
- add `IELTS Topic: Environment`
- add `IELTS Topic: Technology`
- add `IELTS Topic: Government`

### Workstream 3: Learning Map UI

Files likely affected:

- `src/layouts/PremiumLayout.vue`
- `src/components/MobileTabBar.vue`
- new IELTS dashboard components

Tasks:

- create one IELTS landing section
- show Foundation, Topic Packs, Output Studio, Exam Drills
- preserve current design language

### Workstream 4: Output Studio

Files likely affected:

- `src/components/context/`
- new output-focused container page

Tasks:

- create a separate output practice page
- reuse current Context-first primitives
- distinguish controlled output from recognition practice

### Workstream 5: Metadata Upgrade

Files likely affected:

- bundle generation scripts
- bundle schema
- bundle loader

Tasks:

- add `function`, `skillSurface`, `masteryTarget`
- backfill metadata for Foundation and Topic Packs

## 13. Acceptance Criteria For The New System

The next meaningful milestone is not:

- "we have more words"

It is:

- Foundation is clearly positioned as the base layer
- at least 4 topic packs are available
- users can see progress by layer and topic
- output practice is available as its own mode
- exam-oriented drills exist in first form

## 14. Metrics That Actually Matter

Track:

- topic completion rate
- paraphrase accuracy
- controlled output completion rate
- free output completion rate
- returning users who move from Foundation to Topic Packs
- users who complete at least one cross-topic review cycle

Do not over-index on:

- total words viewed
- total button presses
- streak alone

## 15. What Should Happen Next

Immediate next move:

- reposition current Core as `Foundation`
- build first four topic packs
- keep current Context-first flow as the engine
- expand the system around it instead of bloating one list

This is the clearest path from:

- a good lexical prototype

to:

- a believable IELTS vocabulary product

## 16. Recommended Next Task For Claude Code

Claude code should execute the following package next:

1. Rename the current IELTS Core entry to `IELTS Foundation`
2. Add new topic-pack vocabulary entries for:
   - education
   - environment
   - technology
   - government
3. Build an `IELTS Hub` page that sits above Foundation and Topic Packs
4. Reuse current design language exactly
5. Do not redesign the app
6. Do not replace Context-first Session
7. Make Context-first Session the engine shared by Foundation and Topic Packs

## 17. One-Line Strategy

Do not scale IELTS by making one list larger.

Scale it by turning `Foundation + Topics + Output + Drills` into one coherent learning system.
