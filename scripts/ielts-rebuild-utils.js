import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOPIC_KEYWORDS, REJECT_WORD_PATTERNS } from './ielts-seeds.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DATA_DIR = path.join(__dirname, '../public/data');
export const LEGACY_IELTS_FILES = [
  'vocab-ielts6-breakthrough.json',
  'vocab-ielts7-sprint.json',
  'vocab-ielts8-mastery.json'
];

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function normalizeWordKey(word = '') {
  return String(word).trim().toLowerCase();
}

export function readLegacyWords(filename) {
  const fullPath = path.join(DATA_DIR, filename);
  const data = readJson(fullPath);
  return data.words || data;
}

export function countExamples(word) {
  return Array.isArray(word.examples) ? word.examples.length : 0;
}

export function averageExampleLength(word) {
  const examples = word.examples || [];
  if (!examples.length) return 0;

  const totalWords = examples.reduce((sum, example) => {
    const text = example.sentence || example.text || '';
    return sum + text.split(/\s+/).filter(Boolean).length;
  }, 0);

  return totalWords / examples.length;
}

export function getTextBlob(word) {
  const examplesText = (word.examples || [])
    .map(example => `${example.sentence || ''} ${example.translation || ''}`)
    .join(' ');

  return [
    word.word || '',
    word.meaning || '',
    word.partOfSpeech || '',
    examplesText
  ].join(' ').toLowerCase();
}

export function detectTopics(word) {
  const blob = getTextBlob(word);
  const matchedTopics = [];

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some(keyword => blob.includes(keyword.toLowerCase()))) {
      matchedTopics.push(topic);
    }
  }

  return matchedTopics;
}

export function detectFlags(word) {
  const text = word.word || '';
  const meaning = word.meaning || '';
  const flags = {
    noExample: countExamples(word) === 0,
    abbreviationLike: /^[A-Z]{2,}$/.test(text) || (/^[a-z]{2,6}$/i.test(text) && /abbr\./i.test(meaning)),
    overlyLong: text.length >= 14,
    lowFrequency: Number(word.frequency || 0) <= 2,
    technicalJargon: REJECT_WORD_PATTERNS.some(pattern => pattern.test(text) || pattern.test(meaning)),
    nonAlpha: /[^a-z'-]/i.test(text),
    poorExampleQuality: averageExampleLength(word) > 36 || averageExampleLength(word) < 4
  };

  return {
    ...flags,
    rejectHint: flags.abbreviationLike || flags.technicalJargon || flags.nonAlpha
  };
}

function pickBaseWord(existingWord, incomingWord) {
  if (!existingWord) return incomingWord;

  const existingScore = countExamples(existingWord) * 10 - String(existingWord.meaning || '').length;
  const incomingScore = countExamples(incomingWord) * 10 - String(incomingWord.meaning || '').length;

  return incomingScore > existingScore ? incomingWord : existingWord;
}

function mergeExamples(existingExamples = [], incomingExamples = []) {
  const bySentence = new Map();

  [...existingExamples, ...incomingExamples].forEach(example => {
    const sentence = (example.sentence || example.text || '').trim();
    if (!sentence) return;
    if (!bySentence.has(sentence)) {
      bySentence.set(sentence, example);
    }
  });

  return Array.from(bySentence.values()).slice(0, 5);
}

export function mergeCandidatesFromFiles(files) {
  const candidateMap = new Map();
  const fileStats = {};

  for (const filename of files) {
    const words = readLegacyWords(filename);
    fileStats[filename] = {
      total: words.length
    };

    for (const rawWord of words) {
      const key = normalizeWordKey(rawWord.word);
      if (!key) continue;

      const current = candidateMap.get(key);
      const baseWord = pickBaseWord(current?.baseWord, rawWord);
      const merged = current || {
        key,
        word: rawWord.word,
        baseWord,
        meanings: new Set(),
        partOfSpeech: rawWord.partOfSpeech || '',
        ipa: rawWord.ipa || '',
        frequency: Number(rawWord.frequency || 0),
        examples: [],
        sources: new Set(),
        sourceFiles: new Set(),
        topics: new Set()
      };

      merged.word = baseWord.word || merged.word;
      merged.baseWord = baseWord;
      merged.partOfSpeech = baseWord.partOfSpeech || merged.partOfSpeech;
      merged.ipa = baseWord.ipa || merged.ipa;
      merged.frequency = Math.max(merged.frequency, Number(rawWord.frequency || 0));
      merged.examples = mergeExamples(merged.examples, rawWord.examples || []);
      merged.meanings.add(rawWord.meaning || '');
      merged.sources.add(rawWord.ielts || rawWord.level || '');
      merged.sourceFiles.add(filename);
      detectTopics(rawWord).forEach(topic => merged.topics.add(topic));

      candidateMap.set(key, merged);
    }
  }

  return {
    fileStats,
    candidates: Array.from(candidateMap.values()).map(candidate => ({
      key: candidate.key,
      word: candidate.word,
      partOfSpeech: candidate.partOfSpeech,
      ipa: candidate.ipa,
      frequency: candidate.frequency,
      meaning: Array.from(candidate.meanings).find(Boolean) || '',
      examples: candidate.examples,
      sourceCount: candidate.sourceFiles.size,
      sources: Array.from(candidate.sourceFiles),
      levels: Array.from(candidate.sources).filter(Boolean),
      topics: Array.from(candidate.topics),
      flags: detectFlags(candidate),
      averageExampleLength: averageExampleLength(candidate),
      exampleCount: candidate.examples.length
    }))
  };
}

export function mergeLegacyCandidates() {
  return mergeCandidatesFromFiles(LEGACY_IELTS_FILES);
}
