# IELTS Product Push - Week 1 Learning Quality Plan

## Why This Week Exists

The current product is already beyond a raw MVP in surface area, but it is still too close to a “feature-complete practice shell” and not yet close enough to a “customers genuinely learn usable English” product.

The biggest gap is not more modes. The biggest gap is learning quality:

- users can finish tasks without getting usable feedback
- output modes do not yet tell users whether their English is natural enough
- weak performance does not automatically create a clear next action
- the system still rewards completion more than quality

Week 1 should push the product from “practice exists” to “practice teaches”.

## North Star

By the end of this week, every serious IELTS practice path should leave the learner with:

1. a clear signal of what they did well
2. a clear signal of what was weak
3. one obvious next step for improvement

## Week Plan

### Day 1

Ship a local learning-quality rubric for output tasks.

Output:

- score each production response
- classify it as strong / usable / needs work
- identify concrete weak dimensions

### Day 2

Bring the rubric into Output Studio summaries.

Output:

- show strengths
- show focus areas
- show weak words that should be retried immediately

### Day 3

Bring the rubric into Exam Drills.

Output:

- combine surface accuracy with production quality
- tell the learner whether recognition is ahead of output

### Day 4

Add a weak-word retry lane.

Output:

- generate a short remediation set from poor attempts
- let the learner re-enter practice on the same weak items

### Day 5

Add progression logic to the IELTS path.

Output:

- clearer guidance on when to stay in Foundation
- clearer guidance on when to move into Topic Packs
- less random movement across modes

### Day 6

Improve realism and pedagogy.

Output:

- tighten prompt quality
- reduce template-feel in coaching copy
- improve review language so it sounds like a teacher, not a dashboard

### Day 7

Polish, QA, and release-readiness.

Output:

- verify all major learning paths
- remove visible low-signal UX noise
- document the upgraded learning loop

## What Was Shipped First

This first push implements Day 1 and a meaningful part of Day 2 and Day 3:

- a reusable learning-quality engine for production responses
- coaching summaries for Output Studio
- coaching summaries for Exam Drills

## Success Criteria

This week is successful if:

- users can tell why a response was weak
- the system distinguishes completion from quality
- the product starts guiding deliberate practice instead of passive clicking

## Not In Scope This Week

- full AI grading
- long-form essay scoring
- speaking transcription
- CEFR-style sentence diagnostics

Those may come later, but Week 1 is about getting the core product loop to teach real English better.
