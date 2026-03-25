# Changelog

All notable changes to this project are documented here.

## 2026-03-25

### Added

- Local learning-quality coaching for Output Studio and Exam Drills.
- Week 1 product plan focused on turning practice into real learning guidance.
- Bilingual README set with dedicated English and Simplified Chinese entry points.
- Contributor-facing repository docs including a contributing guide and PR template.
- GitHub collaboration templates for bug reports and feature requests.

### Changed

- Polished the GitHub-facing project presentation and documentation structure.
- Improved the README navigation so project, release, and collaboration docs are easier to discover.

## 2026-03-25

### Fixed

- Cleared expired Supabase sessions before client initialization to reduce refresh-token failure loops.
- Hardened login/session recovery behavior for broken local auth state.

## 2026-03-24

### Fixed

- Added AI route fallback from `/api/ai/chat` to `/.netlify/functions/ai-chat`.
- Improved service worker update behavior to help newer deployments replace stale cached shells.
- Hardened auth session recovery and local-only sign-out behavior.

## 2026-03-24

### Added

- SiliconFlow-based AI runtime using `Qwen/Qwen2.5-72B-Instruct`.
- Safe AI proxy path for local development and Netlify deployment.
- Official `ielts-foundation.json` canonical data file and topic-pack outputs.
- IELTS learning-track documentation set.
- Context-first Session, Output Studio, and Exam Drills MVP paths in the app.

### Changed

- Moved the app away from the previous OpenRouter and StepFun runtime path.
- Reframed the IELTS product around Foundation, Topic Packs, and output-oriented learning flows.
