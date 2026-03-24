# IELTS Vocabulary Audit

> **状态：历史文档**
>
> 本文档是早期词汇审计报告。当前系统已重建：
> - Foundation: 541 个高质量 context bundles
> - Topic Packs: 8 个主题包
> - 所有词汇经过人工审核
> - 质量指标：全部为 0（无问题）
>
> 请参考 `docs/23-IELTS-Learning-Track-Overview.md` 获取当前系统状态。

## Executive Summary

The current shipped IELTS vocabulary is **not a truly IELTS-native vocabulary set**.

It is a **generic large vocabulary corpus** that was:

1. heuristically graded by frequency and word length
2. filtered by simple thresholds
3. sliced by cumulative index ranges
4. relabeled as IELTS 6 / 7 / 8

This means the current IELTS libraries are better described as:

- `difficulty-bucketed vocabulary ranges`

not:

- `editorially validated IELTS vocabulary sets`

## Key Conclusion

The label `IELTS 6.0 / 7.0 / 8.0` currently reflects **position in a sorted master list**, not confirmed IELTS relevance.

## Evidence

## 1. Source and build pipeline are heuristic, not IELTS-specific

The pipeline builds CEFR levels from frequency and word length:

- [build-vocab-libraries.js](D:/my-projects/vocab-context/scripts/build-vocab-libraries.js)

Key issue:

- words are graded by `frequency`, `length`, and a rough complexity score
- there is no IELTS corpus validation layer
- there is no topic or task alignment layer

Then the final exam buckets are produced by slicing the merged vocabulary by cumulative index ranges:

- [split-vocab-cumulative.js](D:/my-projects/vocab-context/scripts/split-vocab-cumulative.js)

This means:

- `IELTS 6.0` = words ranked roughly 6001-7000
- `IELTS 7.0` = words ranked roughly 7001-9000
- `IELTS 8.0+` = words ranked 9001+

That is a ranking system, not an IELTS curation system.

## 2. The original extraction script does not really extract the IELTS book

The conversion script references an IELTS book ID, but the actual extraction logic does not use a real book-membership join.

Instead it applies generic heuristics:

- frequency range
- word length
- blacklist of simple words
- valid part of speech

See:

- [convert-data.js](D:/my-projects/vocab-context/scripts/convert-data.js)

This is not enough to claim "true IELTS words".

## 3. Actual shipped IELTS files contain many non-IELTS words

Examples from the current shipped files:

### `vocab-ielts6-breakthrough.json`

- `puffin`
- `porridge`
- `longhorn`
- `furosemide`
- `cowl`

### `vocab-ielts7-sprint.json`

- `psi`
- `blotter`
- `motorbike`
- `backrest`
- `hierogrammat`

### `vocab-ielts8-mastery.json`

- `haematemesis`
- `hendecahedron`
- `pulmometer`
- `subacetate`
- `silicomanganese`

These are not defensible as a core IELTS learning set.

Some may occur in corpora or dictionaries.

That does not make them high-value IELTS vocabulary.

## 4. Coverage quality deteriorates sharply in higher IELTS buckets

Heuristic audit of the shipped IELTS files:

- `vocab-ielts6-breakthrough.json`
  - total: 500
  - no example: 58
  - abbreviation-like: 4
  - technical-hint: 10

- `vocab-ielts7-sprint.json`
  - total: 1500
  - no example: 397
  - abbreviation-like: 17
  - long words: 14
  - technical-hint: 28

- `vocab-ielts8-mastery.json`
  - total: 4044
  - no example: 2498
  - abbreviation-like: 58
  - long words: 2116
  - technical-hint: 387

Interpretation:

- the higher the bucket, the more it turns into a repository of rare, technical, obscure, or dictionary-edge vocabulary
- this is incompatible with the needs of most IELTS learners

## 5. The app currently treats index position as exam readiness

The vocabulary selector defines:

- `IELTS 6.0 breakthrough`: 500 words
- `IELTS 7.0 sprint`: 1500 words
- `IELTS 8.0 mastery`: 4044 words

See:

- [vocabularyManager.js](D:/my-projects/vocab-context/src/utils/vocabularyManager.js)

But those buckets are created from cumulative ranges, not IELTS task evidence.

So the current product message overstates the validity of the labels.

## What The Current Libraries Actually Are

### Reasonable interpretation

- `IELTS 6.0 breakthrough`: partially useful advanced/general vocabulary with notable noise
- `IELTS 7.0 sprint`: mixed-value upper-intermediate and advanced vocabulary with increasing noise
- `IELTS 8.0 mastery`: heavily contaminated by specialist, obscure, and low-value lexical items

### Unreasonable interpretation

- "This is a true IELTS 8.0 vocabulary curriculum"

That claim is not supported by the current data pipeline.

## Root Cause

The current pipeline confuses three different things:

1. lexical rarity
2. lexical difficulty
3. IELTS usefulness

These are not the same.

A rare word is not automatically useful.
A long word is not automatically IELTS-relevant.
A technical word is not automatically worth learning.

## What A True IELTS Vocabulary Pipeline Should Require

Each word should be selected because it satisfies at least one of these:

- appears frequently in IELTS reading-like academic texts
- appears in common IELTS listening themes
- is useful in Writing Task 2 argumentation
- is useful in Speaking Part 2/3 topic development
- participates in common paraphrase families
- belongs to a high-frequency topic bundle

And each word should be rejected if it is:

- overly domain-specific for general IELTS preparation
- mainly biomedical, chemical, zoological, or taxonomic jargon
- archaic, literary-edge, or dictionary-only
- lacking realistic high-quality examples

## Recommended Fix

## P0

- stop positioning current IELTS 7/8 sets as fully authentic IELTS vocabulary
- relabel them internally as provisional advanced sets until cleaned

## P1

- build a new IELTS lexical core from:
  - IELTS topic bundles
  - Academic Word List overlap
  - validated Writing/Speaking utility
  - paraphrase importance

## P2

- create 3 layers:
  - `IELTS Core`: essential high-utility words and phrases
  - `IELTS Topic`: education, environment, technology, health, etc.
  - `IELTS Precision`: higher-band vocabulary that is still realistic and useful

## P3

- editorial review pass on every bundle
- minimum example quality threshold
- remove words with zero pedagogical value for the target band

## Recommended Decision

If the question is:

- "Are the current shipped words truly IELTS vocabulary?"

The strict answer is:

- **not reliably**

If the question is:

- "Are some of them still useful for IELTS learners?"

The answer is:

- **yes, especially in the lower and mid buckets**

If the question is:

- "Can the current IELTS labels be trusted as curriculum truth?"

The answer is:

- **no**
