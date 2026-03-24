import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

// Canonical production filename
const FOUNDATION_FILE = path.join(ROOT, 'public/data/ielts-foundation.json');
// Legacy compatibility filename (mirrored for one release cycle)
const FOUNDATION_FILE_LEGACY = path.join(ROOT, 'public/data/ielts-core-500.json');
const REVIEWED_FILES = [
  'data/ielts-legacy-foundation-batch1-reviewed.json',
  'data/ielts-legacy-foundation-batch2-reviewed.json',
  'data/ielts-legacy-foundation-batch3-reviewed.json',
  'data/ielts-legacy-foundation-batch4-reviewed.json',
  'data/ielts-legacy-foundation-batch5-reviewed.json',
  'data/ielts-legacy-foundation-batch6-reviewed.json',
  'data/ielts-legacy-foundation-batch7-reviewed.json',
  'data/ielts-legacy-foundation-batch8-reviewed.json',
  'data/ielts-legacy-foundation-batch9-reviewed.json',
  'data/ielts-topic-expansion-batch1-reviewed.json'
].map(file => path.join(ROOT, file));

const OUTPUT_TOPIC_FILES = {
  education: path.join(ROOT, 'public/data/ielts-topic-education.json'),
  government: path.join(ROOT, 'public/data/ielts-topic-government.json'),
  environment: path.join(ROOT, 'public/data/ielts-topic-environment.json'),
  technology: path.join(ROOT, 'public/data/ielts-topic-technology.json')
};

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function normalizeWord(word = '') {
  return String(word).trim().toLowerCase();
}

function getBatchLabel(filePath) {
  const base = path.basename(filePath, '.json');
  const match = base.match(/batch(\d+)/);
  return match ? `legacy-batch${match[1]}` : 'legacy-reviewed';
}

function buildBundleId(existingIds, topic, word, batchLabel) {
  let counter = 1;
  let bundleId = `${topic}_${word}_${batchLabel}_${String(counter).padStart(2, '0')}`;
  while (existingIds.has(bundleId)) {
    counter += 1;
    bundleId = `${topic}_${word}_${batchLabel}_${String(counter).padStart(2, '0')}`;
  }
  existingIds.add(bundleId);
  return bundleId;
}

function buildBundle(candidate, batchLabel, existingIds) {
  const topic = candidate.editorContexts?.[0]?.kind === 'reading'
    ? (candidate.topic || 'general')
    : (candidate.topic || 'general');
  const word = candidate.word;

  return {
    bundleId: buildBundleId(existingIds, topic, word, batchLabel),
    word,
    lemma: word,
    ipa: candidate.ipa || '',
    partOfSpeech: candidate.partOfSpeech || 'n.',
    sense: candidate.editorSense || word,
    englishDefinition: candidate.editorEnglishDefinition || '',
    chineseMeaning: candidate.editorChineseMeaning || '',
    topic,
    taskTypes: ['reading', 'writing', 'speaking'],
    register: 'formal',
    collocations: candidate.editorCollocations || [],
    paraphrases: candidate.editorParaphrases || [],
    confusions: [],
    contexts: candidate.editorContexts || [],
    productionPrompt: {
      mode: 'writing',
      instruction: candidate.editorProductionPrompt || `Use "${word}" in one IELTS-style sentence about ${topic}.`
    },
    sourceQuality: {
      relevanceScore: 4,
      transferabilityScore: 4,
      outputUtilityScore: 4,
      exampleQualityScore: 4,
      decision: 'keep'
    },
    draft: false,
    sourceCategory: batchLabel
  };
}

function main() {
  // Prefer canonical file, fallback to legacy for reading
  const inputFile = fs.existsSync(FOUNDATION_FILE) ? FOUNDATION_FILE : FOUNDATION_FILE_LEGACY;
  const foundation = loadJson(inputFile);
  const allBundles = Array.isArray(foundation.bundles) ? foundation.bundles : [];
  const baseBundles = allBundles.filter(bundle => !String(bundle.sourceCategory || '').startsWith('legacy-batch'));

  const existingWords = new Set(baseBundles.map(bundle => normalizeWord(bundle.word)));
  const existingIds = new Set(baseBundles.map(bundle => bundle.bundleId));
  const restoredBundles = [...baseBundles];

  const imported = [];

  for (const file of REVIEWED_FILES) {
    if (!fs.existsSync(file)) continue;
    const batchLabel = getBatchLabel(file);
    const reviewed = loadJson(file).candidates || [];

    for (const candidate of reviewed) {
      const word = normalizeWord(candidate.word);
      if (!word || existingWords.has(word)) continue;
      existingWords.add(word);
      const bundle = buildBundle(candidate, batchLabel, existingIds);
      restoredBundles.push(bundle);
      imported.push({ word, batchLabel, topic: bundle.topic });
    }
  }

  foundation.bundles = restoredBundles;
  foundation.totalBundles = restoredBundles.length;
  foundation.generatedAt = new Date().toISOString();

  // Write canonical file
  writeJson(FOUNDATION_FILE, foundation);
  // Write legacy compatibility mirror
  writeJson(FOUNDATION_FILE_LEGACY, foundation);

  for (const [topic, outputFile] of Object.entries(OUTPUT_TOPIC_FILES)) {
    const topicBundles = restoredBundles.filter(bundle => bundle.topic === topic);
    writeJson(outputFile, {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      source: 'IELTS Foundation',
      topic,
      totalBundles: topicBundles.length,
      bundles: topicBundles
    });
  }

  const counts = restoredBundles.reduce((accumulator, bundle) => {
    accumulator[bundle.topic] = (accumulator[bundle.topic] || 0) + 1;
    return accumulator;
  }, {});

  console.log(JSON.stringify({
    baseBundles: baseBundles.length,
    imported: imported.length,
    totalBundles: restoredBundles.length,
    counts
  }, null, 2));
}

main();
