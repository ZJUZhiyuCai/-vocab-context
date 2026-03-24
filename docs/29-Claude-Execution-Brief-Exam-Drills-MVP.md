# Claude Code Execution Brief

## Mission

Build the first usable `IELTS Exam Drills` MVP on top of the current Foundation + Topic Pack + Output Studio system.

This round should be treated as a **major product layer**, not a small polish pass.

It should take meaningful engineering work.

Do not treat this as:

- a quick UI tweak
- a copy pass
- a small component add-on

Treat it as:

- the first exam-oriented practice layer built on top of the existing lexical system

## Why This Is The Right Next Step

The IELTS system now already has:

- Foundation
- Topic Packs
- Legacy Breadth
- Output Studio MVP

This means the product can now:

- teach recognition
- teach topic coverage
- teach controlled production

The next missing layer is:

- **exam-oriented integrated drills**

Without this layer, the product still stops short of the real learner job:

- applying vocabulary under task pressure
- switching between recognition and production
- handling IELTS-like prompt surfaces rather than isolated word work

## Product Goal

Create a new lane called:

- `IELTS Exam Drills`

This lane should let users practice small mixed sessions that feel closer to IELTS tasks.

The user should feel:

- “I am not just learning vocabulary”
- “I am using vocabulary in exam-like conditions”

## Hard Constraints

Do not violate these:

1. Do not expand vocabulary in this round.
2. Do not redesign the app.
3. Preserve the current visual language.
4. Reuse existing bundle data and existing engines where possible.
5. Keep the scope MVP-sized and shippable.
6. Do not introduce AI scoring in this round.
7. Do not add audio recording or speech recognition in this round.

## Current Baseline

Current verified system:

- Foundation: `541`
- Topic Packs:
  - Education `124`
  - Government `108`
  - Environment `71`
  - Technology `52`
  - Health `53`
  - Work `32`
  - Media `32`
  - Crime `26`

Current quality baseline:

- `genericDefinitions: 0`
- `blankIpa: 0`
- `chineseIssues: 0`
- `weakParaphrases: 0`
- `templateContexts: 0`
- `badCollocations: 0`

Build baseline:

- `npm run build` passes

## User Problem To Solve

Right now the product still separates:

- recognition practice
- output practice

But IELTS performance requires learners to do both while following task intent.

Typical learner gap:

- they can understand the word
- they can maybe write one sentence
- but they cannot shift quickly between:
  - context inference
  - paraphrase recognition
  - task-focused output

`IELTS Exam Drills` should close that gap.

## MVP Scope

The MVP should introduce:

1. a new entry point in the IELTS learning path
2. a mixed drill session
3. task-type variation
4. end-of-session summary

The MVP should **not** try to simulate the full IELTS exam.

It should simulate:

- exam-like lexical decision making

## Required User Flow

### Step 1: Entry

The user enters `IELTS Exam Drills` from the existing IELTS path.

Recommended placement:

- inside `ContextPractice.vue`
- near `Output Studio`

### Step 2: Source Scope

The drill should use the currently selected IELTS vocabulary source:

- Foundation
- Topic Pack

### Step 3: Start Session

Recommended default session size:

- `8` items

Allow a compact size selector if it fits naturally:

- `5`
- `8`
- `12`

### Step 4: Mixed Drill Session

Each session should mix several task surfaces.

### Step 5: Summary

At the end, show:

- total items
- completed items
- accuracy by task surface
- topic distribution
- restart / back actions

## Required Task Surfaces

The MVP should support at least **4** surfaces.

### Surface A: Reading Paraphrase

Show:

- short context
- multiple-choice paraphrase or meaning selection

Goal:

- mimic reading inference and paraphrase detection

### Surface B: Listening-Style Paraphrase

Show:

- short transcript-like sentence
- ask user to match intended meaning or paraphrased phrase

Goal:

- mimic listening comprehension where wording shifts

### Surface C: Writing Micro-Argument

Show:

- short IELTS-style claim/prompt
- user writes one sentence using the target word or phrase

Goal:

- connect vocabulary to Task 2 style argument building

### Surface D: Speaking Response Frame

Show:

- a short speaking-style prompt
- user writes a one-line spoken response plan or sentence

Goal:

- connect vocabulary to Part 2/3 retrieval

## Data Strategy

Do not add new vocabulary.

Do not add heavy new metadata if it is not necessary.

Instead, derive drill tasks from existing bundle fields:

- `contexts`
- `paraphrases`
- `collocations`
- `productionPrompt`
- `topic`
- `taskTypes`

You may add light derived heuristics inside a new drill engine if needed.

## Preferred Implementation Approach

Reuse existing ideas rather than rebuilding everything.

Likely reuse targets:

- `src/components/context/ContextPractice.vue`
- `src/components/context/ContextSession.vue`
- `src/components/context/OutputStudio.vue`
- `src/components/context/MicroOutput.vue`
- `src/utils/contextSessionEngine.js`
- `src/utils/outputStudioEngine.js`

Likely new files:

- `src/components/context/ExamDrills.vue`
- `src/components/context/ExamDrillCard.vue`
- `src/utils/examDrillEngine.js`

Use these only if they help keep the logic clean.

## Design Rules

Keep visual language consistent with current app:

- glass / blur cards
- emerald / cyan / violet accents already in use
- current typography scale
- current rounded containers

Avoid:

- redesigning navigation
- heavy dashboards
- new design system

This should feel like:

- one more serious mode inside the same product

not:

- a separate app

## Functional Requirements

### P0

1. User can enter Exam Drills from the IELTS path.
2. User can start a mixed drill session.
3. Session includes multiple task surfaces.
4. User can answer or skip each item.
5. Session summary is shown.

### P1

1. Show task-surface distribution in summary.
2. Persist a simple local history summary.
3. Make the source scope visible:
   - Foundation
   - specific Topic Pack

## Non-Goals

Do not add:

- timer pressure UI
- full exam mode
- AI grading
- audio recording
- full reading passage simulation
- long-form essay generation

## Acceptance Criteria

Claude code should not consider the task complete unless all are true.

### Feature

- Exam Drills entry is reachable
- a user can complete one full mixed session
- at least 4 task surfaces are represented
- summary appears at the end

### UX

- feature matches the current app style
- no text overload
- no obviously broken prompt/context combinations

### Stability

- existing Context-first Session still works
- Output Studio still works
- Foundation / Topic Pack path still works

### Verification

Required:

- `npm run build`

Recommended:

- one real browser walkthrough covering:
  - enter IELTS path
  - start Exam Drills
  - complete one full session
  - verify summary

## Required Final Report

Claude code must report:

1. where Exam Drills is located in the app
2. which files were added
3. which files were modified
4. what task surfaces were implemented
5. what logic was reused vs newly built
6. build result
7. browser verification result
8. residual product risks

## Stop Conditions

Stop and report instead of forcing a messy implementation if:

- 4 task surfaces cannot be implemented cleanly with current data
- the feature starts to duplicate too much of ContextSession or OutputStudio
- stability of the existing IELTS path is put at risk

## One-Line Summary

Build the first serious `IELTS Exam Drills` layer so learners can practice vocabulary in mixed exam-like conditions, not just isolated study modes.
