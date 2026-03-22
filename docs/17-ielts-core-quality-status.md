# IELTS Core Quality Status

Generated: 2026-03-22

## Snapshot

| Metric | Count |
|---|---:|
| Core bundles (approved) | 411 |
| Draft bundles | 488 |
| Topic Education | 115 |
| Topic Environment | 67 |
| Topic Technology | 48 |

## Real Audit

The figures below are based on the generated production file:

- `public/data/ielts-core-500.json`

Current audit results:

| Quality debt | Count | Status |
|---|---:|---|
| Generic / fallback definitions | 0 | Cleared |
| Blank IPA | 0 | Cleared |
| Chinese meaning issues | 0 | Cleared |
| Weak paraphrases | 0 | Cleared |
| Template contexts | 0 | Cleared |
| Invalid collocations | 0 | Cleared |

## What Was Fixed

### Chinese Meaning Cleanup

- Replaced approved entries with unreadable or placeholder Chinese meanings using cleaned learner-facing meanings derived from the source `meaning` field.
- Removed newline-heavy Chinese glosses and normalized them into short, usable definitions.

### Context Cleanup

- Replaced the remaining template-generated contexts for approved bundles with topic-aware editorial contexts.
- Targeted the approved words that still matched the fallback template patterns used in earlier bundle generation.

### Collocation Cleanup

- Replaced remaining invalid or weak collocations for approved items such as:
  - `culture`
  - `injure`
  - `divulge`
  - `discredit`
  - `embark`
  - `implement`
  - `procrastinate`
  - `date`
  - `confiscate`

### Paraphrase Cleanup

- Removed the last weak paraphrase pattern from `implement`.
- Confirmed that no approved bundle now contains:
  - `important`
  - `relevant`
  - `key term`
  - `act on`
  - `carry out`

## High-Value Bundle Status

These previously-priority bundles are now in a clean learner-facing state:

- `international`
- `consequently`
- `adequate`
- `persist`
- `maximum`
- `certificate`
- `curriculum`
- `literacy`
- `sustainability`
- `innovation`
- `digital`
- `conservation`
- `phenomenon`
- `endorse`
- `perspective`
- `underlying`
- `stem`
- `trigger`
- `barrier`
- `discretionary`
- `investigative`
- `demonstration`
- `developmental`
- `precautionary`
- `redistribution`
- `rehabilitation`
- `coordination`
- `individualism`

## Verification

Recommended local commands:

```powershell
cd D:/my-projects/vocab-context
node scripts/real-audit.cjs
node scripts/qa-validate-bundles.js public/data/ielts-core-500.json
npm run build
```

## Final Assessment

The current IELTS Core 411 meets the quality bar for the current phase:

- all approved bundles now have non-generic definitions
- all approved bundles have IPA
- all approved bundles have usable Chinese meanings
- all approved bundles have non-weak paraphrases
- all approved bundles have non-template contexts
- all approved bundles have valid collocations

Remaining work is no longer debt cleanup.

Remaining work is optional editorial refinement:

- improve stylistic elegance of some contexts
- continue topic-pack enrichment
- expand only if a new high-quality intake is justified
