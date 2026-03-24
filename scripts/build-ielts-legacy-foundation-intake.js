import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOPIC_KEYWORDS, REJECT_WORD_PATTERNS, OUTPUT_FRIENDLY_POS } from './ielts-seeds.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const PUBLIC_DATA = path.join(ROOT, 'public/data');
const OUTPUT_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-intake.json');

const LEGACY_FILES = [
  { file: 'vocab-ielts6-breakthrough.json', source: 'ielts6' },
  { file: 'vocab-ielts7-sprint.json', source: 'ielts7' }
];

const FOUNDATION_FILE = path.join(PUBLIC_DATA, 'ielts-core-500.json');

const ALLOWED_NOUN_SUFFIXES = [
  'tion', 'sion', 'ment', 'ness', 'ity', 'ance', 'ence', 'ship', 'ism', 'ist',
  'acy', 'ure', 'ogy', 'ics', 'sis', 'tude', 'ory', 'ing'
];

const ACADEMIC_SIGNAL_WORDS = [
  'policy', 'public', 'education', 'school', 'student', 'government', 'social', 'society',
  'economy', 'economic', 'environment', 'technology', 'health', 'research', 'evidence',
  'issue', 'problem', 'system', 'access', 'resource', 'development', 'community',
  'employment', 'transport', 'media', 'crime', 'culture', 'housing', 'urban', 'rural'
];

const REJECT_SEMANTIC_KEYWORDS = [
  'anatomy', 'body part', 'chemical', 'chemistry', 'drug', 'medicine', 'disease',
  'infection', 'syndrome', 'virus', 'bacteria', 'animal', 'bird', 'fish', 'insect',
  'plant', 'flower', 'weapon', 'gun', 'sword', 'military rank', 'mythology', 'biblical',
  'religious order', 'musical instrument', 'zodiac', 'constellation', 'geology', 'mineral',
  'mathematical', 'physics', 'physiology', 'surgery', 'pharmaceutical'
];

const MANUAL_REJECT_WORDS = new Set([
  'amphetamine', 'chemotherapy', 'arpanet', 'dunnage', 'germen', 'litmus', 'hypertension',
  'malformation', 'desiccation', 'extraversion', 'foreshadow', 'healthful', 'newsreader',
  'inculcation', 'citizenry', 'despotism', 'keenness', 'evenness', 'outbreak', 'pandemic',
  'epidemic', 'vantage', 'molecule', 'skeletal', 'feces', 'galactic', 'plume', 'coaxial',
  'forklift', 'falsetto', 'rotunda', 'blotter', 'bromide', 'zither', 'puffin', 'hyena'
]);

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normalizeWord(rawWord = '') {
  return String(rawWord).trim().toLowerCase();
}

function isSimpleWord(word) {
  return /^[a-z-]+$/.test(word) && !word.includes('--');
}

function hasBadPattern(word) {
  return REJECT_WORD_PATTERNS.some(pattern => pattern.test(word)) || MANUAL_REJECT_WORDS.has(word);
}

function extractExamples(item) {
  return Array.isArray(item.examples)
    ? item.examples
        .map(example => ({
          sentence: example.sentence || '',
          translation: example.translation || ''
        }))
        .filter(example => example.sentence && example.sentence.split(/\s+/).length >= 6)
    : [];
}

function inferTopic(item) {
  const haystack = [
    item.word,
    item.meaning,
    ...(item.examples || []).map(example => example.sentence || '')
  ]
    .join(' ')
    .toLowerCase();

  let bestTopic = 'general';
  let bestScore = 0;

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    const score = keywords.reduce((count, keyword) => count + (haystack.includes(keyword.toLowerCase()) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  return { topic: bestTopic, topicScore: bestScore };
}

function scoreCandidate(item, topicScore, exampleCount) {
  let score = 0;
  const word = normalizeWord(item.word);
  const pos = item.partOfSpeech || '';
  const meaning = String(item.meaning || '');

  if (OUTPUT_FRIENDLY_POS.has(pos)) score += 2;
  if (topicScore >= 2) score += 4;
  else if (topicScore === 1) score += 2;
  if (exampleCount >= 3) score += 3;
  else if (exampleCount >= 2) score += 2;
  if (word.length >= 5 && word.length <= 12) score += 2;
  if (meaning.length >= 2 && meaning.length <= 60) score += 1;
  if (['v.', 'adj.', 'n.'].includes(pos)) score += 2;
  if (['education', 'environment', 'technology', 'government', 'health', 'work', 'media', 'crime', 'culture', 'transport'].includes(item.topic)) score += 2;

  return score;
}

function isAcademicEnough(item) {
  const word = normalizeWord(item.word);
  const pos = item.partOfSpeech || '';
  const haystack = [
    item.meaning,
    ...item.examples.map(example => example.sentence || '')
  ].join(' ').toLowerCase();

  const academicSignalCount = ACADEMIC_SIGNAL_WORDS.reduce(
    (count, signal) => count + (haystack.includes(signal) ? 1 : 0),
    0
  );

  const hasAcademicSuffix = ALLOWED_NOUN_SUFFIXES.some(suffix => word.endsWith(suffix));
  const hasRejectedMeaning = REJECT_SEMANTIC_KEYWORDS.some(keyword => haystack.includes(keyword));

  if (hasRejectedMeaning) return false;
  if (pos === 'n.') {
    return hasAcademicSuffix || academicSignalCount >= 2 || item.topicScore >= 3;
  }

  return academicSignalCount >= 1 || item.topicScore >= 2;
}

function main() {
  const foundation = loadJson(FOUNDATION_FILE).bundles || [];
  const foundationWords = new Set(foundation.map(bundle => normalizeWord(bundle.word)));
  const candidates = [];
  const seen = new Set();

  for (const sourceInfo of LEGACY_FILES) {
    const raw = loadJson(path.join(PUBLIC_DATA, sourceInfo.file));
    const words = Array.isArray(raw.words) ? raw.words : raw;

    for (const item of words) {
      const word = normalizeWord(item.word);
      if (!word || seen.has(word) || foundationWords.has(word)) continue;
      if (!isSimpleWord(word)) continue;
      if (hasBadPattern(word)) continue;
      if (word.length < 4 || word.length > 14) continue;

      const examples = extractExamples(item);
      if (examples.length < 2) continue;

      const { topic, topicScore } = inferTopic(item);
      const candidate = {
        word,
        partOfSpeech: item.partOfSpeech || '',
        meaning: item.meaning || '',
        ipa: item.ipa || '',
        examples,
        topic,
        topicScore,
        source: sourceInfo.source
      };

      if (!isAcademicEnough(candidate)) continue;

      candidate.score = scoreCandidate(candidate, topicScore, examples.length);
      if (candidate.score < 9) continue;

      seen.add(word);
      candidates.push(candidate);
    }
  }

  candidates.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    if (right.topicScore !== left.topicScore) return right.topicScore - left.topicScore;
    return left.word.localeCompare(right.word);
  });

  const payload = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source: 'legacy-ielts-intake',
    description: 'Strictly filtered intake candidates mined from legacy IELTS 6/7/8 vocab lists for future Foundation expansion.',
    totalCandidates: candidates.length,
    byTopic: candidates.reduce((accumulator, item) => {
      accumulator[item.topic] = (accumulator[item.topic] || 0) + 1;
      return accumulator;
    }, {}),
    candidates
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2) + '\n', 'utf8');

  console.log(JSON.stringify({
    output: OUTPUT_FILE,
    totalCandidates: candidates.length,
    top20: candidates.slice(0, 20).map(item => ({
      word: item.word,
      topic: item.topic,
      score: item.score,
      source: item.source
    }))
  }, null, 2));
}

main();
