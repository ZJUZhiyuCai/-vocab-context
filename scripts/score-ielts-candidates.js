import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AWL_CORE_SEEDS, OUTPUT_FRIENDLY_POS, TOPIC_KEYWORDS } from './ielts-seeds.js';
import {
  ensureDir,
  mergeCandidatesFromFiles,
  readJson,
  writeJson
} from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../data');
const AUDIT_FILE = path.join(OUTPUT_DIR, 'ielts-audit-result.json');
const CANDIDATE_FILE = path.join(OUTPUT_DIR, 'ielts-core-500-candidates.json');
const REVIEWED_FILE = path.join(OUTPUT_DIR, 'ielts-core-500-reviewed.json');
const CANDIDATE_CSV = path.join(OUTPUT_DIR, 'ielts-core-500-candidates.csv');
const SCORE_SOURCE_FILES = [
  'vocab-filtered.json',
  'vocab-ielts65.json',
  'vocab-ielts7.json',
  'vocab-ielts6-breakthrough.json',
  'vocab-ielts7-sprint.json',
  'vocab-ielts8-mastery.json'
];

const AWL_SEED_SET = new Set(AWL_CORE_SEEDS.map(word => word.toLowerCase()));
const OUTPUT_SEED_SET = new Set([
  'allocate', 'analyse', 'assess', 'beneficial', 'consequence', 'decline', 'deteriorate',
  'disproportionate', 'evidence', 'exacerbate', 'improve', 'indicate', 'justify', 'mitigate',
  'negative', 'positive', 'proportion', 'regulate', 'relevant', 'significant', 'viable'
]);

function getTopicScore(candidate) {
  if (candidate.topics.length >= 3) return 2;
  if (candidate.topics.length >= 2) return 1;
  if (candidate.topics.length === 1) return 0;
  return 0;
}

function scoreRelevance(candidate) {
  let score = 0;

  if (AWL_SEED_SET.has(candidate.key)) score += 3;
  if (candidate.sourceCount >= 2) score += 1;
  if (candidate.topics.length > 0) score += 1;
  if (candidate.flags.technicalJargon || candidate.flags.abbreviationLike) score -= 2;

  return Math.max(0, Math.min(5, score));
}

function scoreTransferability(candidate) {
  let score = 0;

  if (candidate.exampleCount >= 2) score += 1;
  if (candidate.exampleCount >= 3) score += 1;
  score += getTopicScore(candidate);
  if (candidate.sourceCount >= 2) score += 1;
  if (candidate.flags.noExample) score -= 2;
  if (candidate.flags.technicalJargon) score -= 1;

  return Math.max(0, Math.min(5, score));
}

function scoreOutputUtility(candidate) {
  let score = 0;

  if (candidate.partOfSpeech === 'v.') score += 3;
  else if (candidate.partOfSpeech === 'adj.' || candidate.partOfSpeech === 'adv.') score += 2;
  else if (candidate.partOfSpeech === 'n.') score += 1;

  if (OUTPUT_FRIENDLY_POS.has(candidate.partOfSpeech)) score += 1;
  if (OUTPUT_SEED_SET.has(candidate.key)) score += 2;
  if (candidate.flags.technicalJargon) score -= 2;

  return Math.max(0, Math.min(5, score));
}

function scoreExampleQuality(candidate) {
  let score = 0;

  if (candidate.exampleCount >= 1) score += 1;
  if (candidate.exampleCount >= 2) score += 1;
  if (candidate.exampleCount >= 3) score += 1;
  if (candidate.averageExampleLength >= 6 && candidate.averageExampleLength <= 28) score += 2;
  if (candidate.flags.poorExampleQuality) score -= 1;

  return Math.max(0, Math.min(5, score));
}

function getDecision(totalScore, flags) {
  if (flags.rejectHint) return 'reject';
  if (totalScore >= 16) return 'keep';
  if (totalScore >= 12) return 'review';
  if (totalScore >= 8) return 'hold';
  return 'reject';
}

function getSelectionBucket(candidate) {
  if (AWL_SEED_SET.has(candidate.key)) return 'core';
  if (candidate.topics.length > 0) return 'topic';
  return 'general';
}

function selectCoreCandidates(scoredCandidates) {
  const pool = scoredCandidates.filter(candidate => candidate.decision !== 'reject');
  const core = pool
    .filter(candidate => candidate.selectionBucket === 'core')
    .slice(0, 300);

  const used = new Set(core.map(candidate => candidate.key));
  const topic = pool
    .filter(candidate => candidate.selectionBucket === 'topic' && !used.has(candidate.key))
    .slice(0, 200);

  const combined = [...core, ...topic];
  const usedCombined = new Set(combined.map(candidate => candidate.key));
  const fill = pool.filter(candidate => !usedCombined.has(candidate.key));

  return [...combined, ...fill].slice(0, 500);
}

function toCandidateRecord(candidate, index) {
  return {
    rank: index + 1,
    reviewStatus: 'candidate',
    approved: false,
    reviewerNotes: '',
    editorPartOfSpeech: '',
    editorSense: '',
    editorEnglishDefinition: '',
    editorChineseMeaning: '',
    editorCollocations: [],
    editorParaphrases: [],
    editorContexts: [],
    editorProductionPrompt: '',
    ...candidate
  };
}

function mergeWithExistingReview(candidates) {
  if (!fs.existsSync(REVIEWED_FILE)) {
    return {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      candidates
    };
  }

  const existing = readJson(REVIEWED_FILE);
  const existingMap = new Map((existing.candidates || []).map(candidate => [candidate.key, candidate]));

  return {
    ...existing,
    generatedAt: new Date().toISOString(),
    candidates: candidates.map(candidate => {
      const current = existingMap.get(candidate.key);
      if (!current) return candidate;

      return {
        ...candidate,
        reviewStatus: current.reviewStatus || candidate.reviewStatus,
        approved: current.approved || false,
        reviewerNotes: current.reviewerNotes || '',
        editorPartOfSpeech: current.editorPartOfSpeech || '',
        editorSense: current.editorSense || '',
        editorEnglishDefinition: current.editorEnglishDefinition || '',
        editorChineseMeaning: current.editorChineseMeaning || '',
        editorCollocations: current.editorCollocations || [],
        editorParaphrases: current.editorParaphrases || [],
        editorContexts: current.editorContexts || [],
        editorProductionPrompt: current.editorProductionPrompt || ''
      };
    })
  };
}

function writeCsv(candidates) {
  const header = [
    'rank',
    'word',
    'partOfSpeech',
    'decision',
    'totalScore',
    'relevanceScore',
    'transferabilityScore',
    'outputUtilityScore',
    'exampleQualityScore',
    'topics',
    'sources',
    'exampleCount'
  ];

  const rows = candidates.map(candidate => ([
    candidate.rank,
    candidate.word,
    candidate.partOfSpeech,
    candidate.decision,
    candidate.totalScore,
    candidate.relevanceScore,
    candidate.transferabilityScore,
    candidate.outputUtilityScore,
    candidate.exampleQualityScore,
    candidate.topics.join('|'),
    candidate.sources.join('|'),
    candidate.exampleCount
  ].map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')));

  fs.writeFileSync(CANDIDATE_CSV, [header.join(','), ...rows].join('\n'), 'utf8');
}

function loadAuditData() {
  const baseAudit = fs.existsSync(AUDIT_FILE) ? readJson(AUDIT_FILE) : null;
  const expandedPool = mergeCandidatesFromFiles(SCORE_SOURCE_FILES);

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    legacyAudit: baseAudit,
    ...expandedPool
  };
}

function main() {
  ensureDir(OUTPUT_DIR);

  const auditData = loadAuditData();
  const scoredCandidates = auditData.candidates
    .map(candidate => {
      const relevanceScore = scoreRelevance(candidate);
      const transferabilityScore = scoreTransferability(candidate);
      const outputUtilityScore = scoreOutputUtility(candidate);
      const exampleQualityScore = scoreExampleQuality(candidate);
      const totalScore = relevanceScore + transferabilityScore + outputUtilityScore + exampleQualityScore;

      return {
        ...candidate,
        relevanceScore,
        transferabilityScore,
        outputUtilityScore,
        exampleQualityScore,
        totalScore,
        decision: getDecision(totalScore, candidate.flags),
        selectionBucket: getSelectionBucket(candidate)
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore || b.sourceCount - a.sourceCount);

  const selected = selectCoreCandidates(scoredCandidates).map(toCandidateRecord);
  const reviewed = mergeWithExistingReview(selected);

  writeJson(CANDIDATE_FILE, {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    candidates: selected
  });
  writeJson(REVIEWED_FILE, reviewed);
  writeCsv(selected);

  console.log('IELTS core candidate scoring\n');
  console.log(`Scored pool: ${scoredCandidates.length}`);
  console.log(`Selected candidates: ${selected.length}`);
  console.log(`Core bucket: ${selected.filter(candidate => candidate.selectionBucket === 'core').length}`);
  console.log(`Topic bucket: ${selected.filter(candidate => candidate.selectionBucket === 'topic').length}`);
  console.log(`Wrote ${CANDIDATE_FILE}`);
  console.log(`Wrote ${REVIEWED_FILE}`);
  console.log(`Wrote ${CANDIDATE_CSV}`);
  console.log('\nManual review required: edit data/ielts-core-500-reviewed.json and set reviewStatus/approved/editor fields before final publish.');
}

main();
