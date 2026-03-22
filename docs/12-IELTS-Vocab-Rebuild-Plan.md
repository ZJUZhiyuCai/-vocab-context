# IELTS Vocabulary Rebuild Plan

## Goal

Rebuild the current IELTS vocabulary into a defensible, high-utility IELTS lexical system.

This system should optimize for:

- exam relevance
- contextual usability
- paraphrase awareness
- collocation retention
- writing and speaking transfer

It should not optimize for:

- raw lexical rarity
- dictionary coverage
- impressive-looking advanced words

## Problem With The Current Pipeline

The current pipeline:

1. grades words heuristically by frequency and length
2. filters the merged list by thresholds
3. slices ranges by cumulative index
4. labels those ranges as IELTS 6/7/8

That means the current product has:

- a difficulty pipeline
- but not a true IELTS relevance pipeline

## Rebuild Principle

Every lexical item must earn its place by proving at least one of the following:

- frequent in IELTS-like academic reading
- useful in listening paraphrase recognition
- useful in Writing Task 2 reasoning
- useful in Speaking Part 2/3 topic development
- part of a high-value topic cluster
- part of a recurring paraphrase family

## New Lexical Architecture

The new system should have 3 layers.

## Layer 1: IELTS Core

The most useful, broad-coverage vocabulary for learners targeting 6.0 to 7.0.

Selection criteria:

- appears across multiple IELTS topics
- has high paraphrase utility
- appears in academic prose or common exam discourse
- can be safely used in Writing and Speaking

Examples:

- significant
- decline
- allocate
- beneficial
- evidence
- regulate
- consequence

## Layer 2: IELTS Topic Bundles

Vocabulary grouped by high-frequency IELTS themes.

Required topic packs:

- education
- environment
- technology
- health
- crime
- government
- work
- media
- globalization
- culture

Each topic pack should contain:

- high-value topic nouns
- high-value process verbs
- cause/effect verbs
- evaluation adjectives
- contrast/linking lexical chunks

## Layer 3: IELTS Precision

Higher-band lexical items that are still realistic and useful.

These are not "rare words".

They are:

- more precise
- more formal
- more compact
- more topic-relevant

Examples:

- exacerbate
- mitigate
- viable
- detrimental
- disproportionate
- indispensable

## New Data Unit

The basic unit should be a `context bundle`, not a bare word.

Each bundle must include:

- target word
- target sense
- Chinese gloss
- English definition
- topic
- task type
- register
- collocations
- paraphrase family
- 3 to 5 contexts
- 1 output task

## Inclusion Rules

A word can enter the rebuilt IELTS set only if it passes:

### Rule A: Utility

At least one:

- useful in Reading
- useful in Listening
- useful in Writing
- useful in Speaking

### Rule B: Transferability

At least two:

- works in more than one topic
- works in more than one task
- has reusable collocations
- has clear paraphrase links

### Rule C: Example Quality

Must have:

- at least 2 clean examples
- examples with natural English
- examples relevant to IELTS themes or academic argument

### Rule D: Pedagogical Value

Must help with at least one of:

- inference
- paraphrase detection
- argument building
- explanation
- evaluation
- comparison

## Exclusion Rules

Words should be rejected if they are:

- highly technical biomedical terms
- taxonomic animal or plant names
- archaic or literary-edge vocabulary
- abbreviation-heavy
- mainly proper nouns
- not transferable beyond a niche domain
- lacking usable examples

## Proposed Scoring Rubric

Score each candidate 0 to 20.

### Relevance: 0 to 5

- 5 = strongly IELTS-relevant
- 3 = moderately relevant
- 1 = weak relevance

### Transferability: 0 to 5

- 5 = usable across multiple contexts and tasks
- 3 = usable in limited contexts
- 1 = very narrow

### Output Utility: 0 to 5

- 5 = useful in Writing/Speaking output
- 3 = mostly receptive
- 1 = mostly not worth producing

### Example Quality: 0 to 5

- 5 = clean, natural, task-relevant examples
- 3 = acceptable but generic
- 1 = noisy or unusable examples

### Decision Thresholds

- 16 to 20: keep
- 12 to 15: keep with review
- 8 to 11: hold
- 0 to 7: reject

## Candidate Source Strategy

The rebuild should not rely on one giant generic dictionary list.

Instead use a layered source strategy:

### Source A: Current libraries

Use only as a noisy candidate pool.

### Source B: Academic Word List

Use as a backbone for academic vocabulary.

### Source C: IELTS topic curation

Human or AI-assisted curated lists for topic and output value.

### Source D: Paraphrase families

Create explicit mappings for:

- decline / decrease / drop / fall
- beneficial / advantageous / positive
- harmful / damaging / detrimental

## Rebuild Workflow

## Phase 1: Audit

- run automated library audit
- mark suspect items
- identify high-value keepers

## Phase 2: Build Core 500

Create a clean starter set:

- 300 core cross-topic items
- 200 high-value topic items

This should replace the current `ielts6` experience.

## Phase 3: Build Topic Packs

For each topic:

- 40 to 80 bundles
- reading-oriented contexts
- writing-oriented contexts
- speaking-oriented prompts

## Phase 4: Build Precision Layer

Add realistic higher-band vocabulary only after:

- example quality check
- output utility check
- confusion risk review

## Deliverables

### D1: Clean Core Library

- `ielts-core.json`

### D2: Topic Libraries

- `ielts-topic-education.json`
- `ielts-topic-environment.json`
- `ielts-topic-technology.json`
- etc.

### D3: Paraphrase Families

- `ielts-paraphrase-families.json`

### D4: Bundle Schema

- context bundle schema
- starter editorial guidelines

## Editorial QA Checklist

Before shipping a bundle:

- does this word appear in a realistic IELTS-like context?
- would a band 6 to 7.5 learner benefit from learning it now?
- is the example natural?
- is the sense clear?
- is the collocation useful?
- can this help with Writing or Speaking?
- is there a safer or more useful synonym that should be taught instead?

## Mapping To Product Experience

### Current

- IELTS 6 / 7 / 8 by index range

### New

- IELTS Core
- IELTS Topic Packs
- IELTS Precision

This reframes the product from:

- "how many hard words can we show?"

to:

- "which bundles best improve IELTS performance?"

## Immediate Next Step

Build and ship:

- `IELTS Core 500`

Reason:

- smallest useful, defensible replacement for the current provisional IELTS buckets
- enough to validate the new context-bundle system
- fast enough to curate with quality
