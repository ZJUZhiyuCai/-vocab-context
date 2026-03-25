# Tomorrow Development Handoff

## Context

This handoff is for the next development session after the current product-path push.

The project is no longer blocked on basic feature coverage. The main challenge has shifted from “adding more modes” to “making the existing system teach real English better”.

## Current Product Position

The repository is now at:

- `MVP+ / Alpha Learning System`

What is already in place:

- IELTS Foundation and Topic Packs
- Context-first Session
- Output Studio
- Exam Drills
- Remediation loops and retry gates
- Path Coach
- Today / Quiz / Context entry handoff
- Teacher-style feedback language
- Card-level next step recommendations
- First-week learning scaffold

What is still weak:

- long-term progression goals and achievement system
- users could benefit from more personalized learning path adjustments

## Recommended Priority for Tomorrow

### P1. Teacher Layer Rewrite ✅ DONE

Goal:

- make feedback sound like a teacher instead of a dashboard
- make users understand what to change in their next sentence

Scope:

- Output Studio feedback copy
- Exam Drills feedback copy
- Context-first retry gate language

Success criteria:

- fewer mechanical labels
- more concrete guidance
- stronger “why this is weak / how to improve” language

### P2. Today Card-Level Handoff ✅ DONE

Goal:

- turn daily card study into a smarter entry point into the IELTS system

Scope:

- after key card interactions, show a lightweight “next best step”
- especially for bundle-based IELTS vocabularies

Success criteria:

- users do not need to guess where to go after daily review
- Today becomes a learning orchestrator, not only a card feed

### P3. First-Week Learning OS ✅ DONE

Goal:

- give new IELTS users a structured first week

Scope:

- Day 1 to Day 7 scaffold
- default path order
- completion markers

Success criteria:

- a new learner can open the app and know exactly what to do next

### P4. Long-term Progression System 🔄 NEXT

Goal:

- provide long-term learning goals beyond the first week

Scope:

- Weekly/monthly learning targets
- Milestone achievements
- Learning streak rewards
- Level progression system

Success criteria:

- users have clear long-term goals
- users feel motivated to continue learning

## Suggested Execution Order

1. ~~Rewrite teacher-style feedback copy~~ ✅ DONE
2. ~~Add Today card-level handoff~~ ✅ DONE
3. ~~Design first-week scaffold~~ ✅ DONE
4. Design long-term progression system

## Technical Anchors

Likely files to touch next:

- `src/utils/achievements.js` - Achievement system
- `src/components/AchievementsPanel.vue` - Achievement display
- `src/utils/firstWeekScaffold.js` - May extend for long-term goals
- `src/utils/studyHistory.js` - Learning history tracking

## Validation Checklist

Before ending the next session:

```bash
npm run build
npm run audit:real
node scripts/qa-validate-bundles.js public/data/ielts-foundation.json
```

## One-Sentence Summary

Next session should focus on designing the long-term progression system to give users clear weekly/monthly goals and milestone achievements beyond the first week.
