# VocabMan 2.0 PRD

## 1. Product Thesis

VocabMan 2.0 is not a word-card app.

It is a context-first IELTS vocabulary training product whose goal is to help learners:

- recognize target vocabulary in realistic IELTS contexts
- infer meaning from context rather than translation alone
- retain collocations and register, not just dictionary glosses
- transfer vocabulary into Writing and Speaking output

The smallest meaningful learning unit is not `word`.

The smallest meaningful learning unit is:

- `word sense`
- `topic`
- `task type`
- `collocation`
- `register`
- `retrieval prompt`

We call this a `context bundle`.

## 2. Problem

Current vocabulary products mostly optimize for:

- exposure
- self-reported familiarity
- repetition count

IELTS learners actually need:

- contextual recognition in Reading and Listening
- paraphrase detection
- controlled production in Writing
- fluent retrieval in Speaking

This creates the core product gap:

- learners can often say "I know this word"
- but cannot identify the right sense in context
- cannot distinguish near-synonyms
- cannot produce the word safely in an IELTS answer

## 3. Target Users

### Primary

- IELTS learners targeting band 6.0 to 7.5
- current vocabulary roughly 4,500 to 8,000 words
- already capable of basic reading, but blocked by academic vocabulary, paraphrase, and productive use

### Secondary

- band 7.5+ learners who need topic-specific lexical precision
- self-study learners who want short but high-yield daily sessions

## 4. Jobs To Be Done

### Functional Jobs

- When I read an IELTS passage, I want to infer unfamiliar vocabulary from context quickly.
- When I listen to a lecture or conversation, I want to catch paraphrases rather than miss the meaning because one word changed.
- When I write Task 2 or speak in Part 3, I want to retrieve precise expressions without sounding unnatural.

### Emotional Jobs

- I want to feel that I am becoming more competent, not just checking off words.
- I want evidence that I can use vocabulary in exam-like settings.

### Progress Job

- I want to see mastery by topic and task, not just total words learned.

## 5. First-Principles Design Rules

1. Context comes before definition.
2. Retrieval beats rereading.
3. Production is a separate skill from recognition.
4. A word is not mastered until it survives transfer into a new context.
5. IELTS vocabulary is topic-bound and task-bound, not just level-bound.
6. The app should reward usable language, not only exposure volume.

## 6. Product Principles

### Principle A: Context-first

Users should first meet the word inside:

- a sentence
- a short paragraph
- a listening transcript excerpt
- a speaking prompt

Definitions come after a guess, not before.

### Principle B: Multi-context retention

A learner should see the same target bundle across:

- original context
- near-transfer context
- far-transfer context
- output context

### Principle C: Evidence-based mastery

Mastery should be tracked separately for:

- recognition
- contextual inference
- collocation
- controlled production
- free production

### Principle D: IELTS alignment

Every bundle should be tagged by:

- topic: education, environment, technology, health, crime, government, work, media, culture
- skill: reading, listening, writing, speaking
- function: describe trend, evaluate cause, compare, argue, exemplify, hedge, conclude

## 7. Core User Experience

## 7.1 Daily Session

Each daily session has 4 blocks.

### Block 1: Context Inference

- show a sentence or short excerpt with the target word masked or highlighted
- ask the learner to infer meaning or choose the best paraphrase

### Block 2: Sense and Collocation

- reveal the correct sense
- contrast it with close alternatives
- teach 2 to 4 high-value collocations

### Block 3: Transfer

- show the word in a different IELTS topic or task context
- ask the learner to judge whether it still works

### Block 4: Output

- ask the learner to produce:
  - one sentence for Writing
  - or one spoken response frame for Speaking

## 7.2 Review Loop

Review should not return the learner to a bare word card.

Review should cycle through:

- same word, new context
- same meaning, new collocation
- same topic, different lexical choice
- same word, output retrieval

## 8. Core Features

## 8.1 Context Bundles

Each bundle includes:

- target word
- sense
- Chinese gloss
- English learner-friendly definition
- 3 to 5 contexts
- 2 to 4 collocations
- 2 near-synonyms with usage contrast
- 1 IELTS Writing usage pattern
- 1 IELTS Speaking usage pattern
- known confusion points

## 8.2 IELTS Topic Packs

Topic packs organize vocabulary by real exam themes:

- education
- environment
- technology
- health
- work
- government
- crime
- media
- globalization
- culture

## 8.3 Paraphrase Engine

Critical for Reading and Listening.

For each bundle, store:

- target expression
- common paraphrases
- near misses
- false friends

Example:

- target: `deteriorate`
- paraphrase: `get worse`, `decline`, `worsen`
- near miss: `change`, `shift`

## 8.4 Output Coach

AI should generate not just one example sentence, but a 4-step ladder:

1. comprehension example
2. collocation contrast
3. controlled rewrite task
4. open speaking or writing prompt

## 8.5 Mastery Dashboard

Show progress by:

- topic mastery
- paraphrase accuracy
- collocation accuracy
- productive vocabulary count
- Writing-safe vocabulary count
- Speaking-ready vocabulary count

## 9. Non-Goals

- generic vocabulary expansion for every exam
- gamification-heavy streak farming
- broad dictionary-style coverage with weak task alignment
- relying only on user self-report of "known / unknown"

## 10. MVP Scope

## P0

- context-first learning card
- context bundle data model
- recognition vs production split
- IELTS topic tags
- paraphrase multiple choice
- collocation check
- one-sentence controlled output
- SRS by `word + sense + task`

## P1

- listening transcript contexts
- speaking prompt drills
- writing micro-drills
- dashboard by topic and skill
- AI output ladder

## P2

- personalized weak-topic plan
- mock-test lexical diagnosis
- teacher mode / writing feedback mode

## 11. Success Metrics

## North Star

- weekly count of context bundles successfully transferred into output

## Leading Indicators

- contextual inference accuracy
- paraphrase recognition accuracy
- collocation accuracy
- percentage of reviewed bundles passed in a new context
- productive usage completion rate

## Outcome Metrics

- learners report improved Reading comprehension speed
- learners report higher confidence in Writing and Speaking
- higher 14-day retention for bundles vs old word-card model

## 12. Data Model

```json
{
  "bundleId": "env_pollution_001",
  "word": "deteriorate",
  "sense": "become worse",
  "topic": "environment",
  "taskTypes": ["reading", "writing"],
  "register": "formal",
  "collocations": [
    "deteriorate rapidly",
    "air quality deteriorates",
    "living conditions deteriorate"
  ],
  "contexts": [
    {
      "kind": "reading",
      "text": "Air quality in major cities has deteriorated rapidly over the last decade."
    },
    {
      "kind": "writing",
      "text": "Without stronger regulation, environmental conditions may deteriorate further."
    },
    {
      "kind": "speaking",
      "text": "Public transport becomes less attractive when services deteriorate."
    }
  ],
  "paraphrases": ["get worse", "decline"],
  "confusions": ["change", "shift"],
  "productionPrompt": "Use the word in a Task 2 cause-effect sentence."
}
```

## 13. UX Requirements

- first screen of a lesson must contain context
- no immediate translation reveal
- every bundle must contain at least 2 contexts before it can ship
- every review session must include at least one transfer context
- output tasks must be short enough to complete in under 45 seconds

## 14. Why This Beats The Current Product

Current VocabMan helps learners see more words.

VocabMan 2.0 helps learners build usable lexical competence.

The upgrade is not "more AI".

The upgrade is changing the learning object from:

- `word`

to:

- `context bundle`

## 15. Open Questions

- should Writing and Speaking share the same bundle, or require separate mastery states?
- how much AI generation vs editorial curation is acceptable for high-stakes IELTS prep?
- how should the product detect "safe production" automatically without creating noisy feedback?

## 16. Recommended Build Sequence

1. Replace current daily card with context-first card.
2. Add bundle schema and migrate a small curated topic pack.
3. Split mastery into recognition and production.
4. Rebuild SRS around bundle variants.
5. Add paraphrase and collocation reviews.
6. Add Writing and Speaking output drills.
