import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const INTAKE_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-intake.json');
const REVIEWED_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-batch9-reviewed.json');
const FOUNDATION_FILE = path.join(ROOT, 'public/data/ielts-core-500.json');

const BATCH = [
  {
    word: 'nuance',
    topic: 'general',
    chineseMeaning: '细微差别；微妙之处',
    englishDefinition: 'a subtle difference in meaning, expression, or sound',
    sense: 'a subtle or slight difference',
    collocations: ['subtle nuance', 'nuance of', 'understand the nuance'],
    paraphrases: ['subtlety', 'distinction', 'shade of meaning']
  },
  {
    word: 'brevity',
    topic: 'general',
    chineseMeaning: '简洁；简短',
    englishDefinition: 'concise and exact use of words in writing or speech',
    sense: 'quality of being brief and concise',
    collocations: ['brevity of', 'admirable brevity', 'brevity and clarity'],
    paraphrases: ['conciseness', 'terseness', 'shortness']
  },
  {
    word: 'impel',
    topic: 'general',
    chineseMeaning: '推动；驱使',
    englishDefinition: 'to drive or urge someone to do something',
    sense: 'to force or urge into action',
    collocations: ['impel someone to', 'impel action', 'impel change'],
    paraphrases: ['drive', 'urge', 'compel']
  },
  {
    word: 'afflict',
    topic: 'general',
    chineseMeaning: '使痛苦；折磨',
    englishDefinition: 'to cause pain or suffering to someone',
    sense: 'to cause suffering or distress',
    collocations: ['afflict by', 'afflict with', 'severely afflict'],
    paraphrases: ['trouble', 'torment', 'plague']
  },
  {
    word: 'regenerate',
    topic: 'environment',
    chineseMeaning: '再生；恢复',
    englishDefinition: 'to bring new life or energy to something',
    sense: 'to renew or restore',
    collocations: ['regenerate area', 'regenerate tissue', 'regenerate economy'],
    paraphrases: ['renew', 'revive', 'restore']
  }
];

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function cleanMeaning(meaning = '') {
  return String(meaning)
    .replace(/^[a-z]+\.\s*/i, '')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildContexts(candidate, topic) {
  const contexts = (candidate.examples || []).slice(0, 2).map((example, index) => ({
    kind: index === 0 ? 'reading' : 'writing',
    text: example.sentence,
    translation: example.translation || '',
    purpose: index === 0 ? 'core' : 'near-transfer'
  }));

  contexts.push({
    kind: 'speaking',
    text: generateSpeakingContext(candidate.word, topic),
    translation: '',
    purpose: 'far-transfer'
  });

  return contexts;
}

function generateSpeakingContext(word, topic) {
  const templates = {
    environment: `In environmental topics, "${word}" can describe pressure, damage, or policy responses.`,
    general: `In IELTS speaking, "${word}" can be used to explain a wider issue in a clear academic way.`
  };
  return templates[topic] || templates.general;
}

function buildBundleId(existingIds, topic, word) {
  let counter = 1;
  let bundleId = `${topic}_${word}_legacyb9_${String(counter).padStart(2, '0')}`;
  while (existingIds.has(bundleId)) {
    counter += 1;
    bundleId = `${topic}_${word}_legacyb9_${String(counter).padStart(2, '0')}`;
  }
  existingIds.add(bundleId);
  return bundleId;
}

function main() {
  const intake = loadJson(INTAKE_FILE).candidates || [];
  const foundation = loadJson(FOUNDATION_FILE);
  const bundles = Array.isArray(foundation.bundles) ? foundation.bundles : [];
  const existingWords = new Set(bundles.map(bundle => String(bundle.word).toLowerCase()));
  const existingIds = new Set(bundles.map(bundle => bundle.bundleId));

  const reviewed = [];
  const newBundles = [];

  for (const approved of BATCH) {
    const candidate = intake.find(item => item.word === approved.word);
    if (!candidate) {
      console.log(`Warning: ${approved.word} not found in intake`);
      continue;
    }
    if (existingWords.has(approved.word.toLowerCase())) {
      console.log(`Skipping ${approved.word}: already in Foundation`);
      continue;
    }

    const bundleId = buildBundleId(existingIds, approved.topic, approved.word);
    const chineseMeaning = approved.chineseMeaning || cleanMeaning(candidate.meaning);

    reviewed.push({
      ...candidate,
      approved: true,
      reviewStatus: 'approved',
      editorSense: approved.sense,
      editorEnglishDefinition: approved.englishDefinition,
      editorChineseMeaning: chineseMeaning,
      editorCollocations: approved.collocations,
      editorParaphrases: approved.paraphrases,
      editorContexts: buildContexts(candidate, approved.topic),
      editorProductionPrompt: `Use "${approved.word}" in one IELTS-style sentence about ${approved.topic}.`
    });

    newBundles.push({
      bundleId,
      word: approved.word,
      lemma: approved.word,
      ipa: candidate.ipa || '',
      partOfSpeech: candidate.partOfSpeech || 'n.',
      sense: approved.sense,
      englishDefinition: approved.englishDefinition,
      chineseMeaning,
      topic: approved.topic,
      taskTypes: ['reading', 'writing', 'speaking'],
      register: 'formal',
      collocations: approved.collocations,
      paraphrases: approved.paraphrases,
      confusions: [],
      contexts: buildContexts(candidate, approved.topic),
      productionPrompt: {
        mode: 'writing',
        instruction: `Use "${approved.word}" in one IELTS-style sentence about ${approved.topic}.`
      },
      sourceQuality: {
        relevanceScore: 4,
        transferabilityScore: 4,
        outputUtilityScore: 4,
        exampleQualityScore: 4,
        decision: 'keep'
      },
      draft: false,
      sourceCategory: 'legacy-batch9'
    });
  }

  const mergedBundles = [...bundles, ...newBundles];
  foundation.bundles = mergedBundles;
  foundation.totalBundles = mergedBundles.length;
  foundation.generatedAt = new Date().toISOString();

  writeJson(REVIEWED_FILE, {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source: 'legacy-foundation-batch9',
    approvedCount: reviewed.length,
    candidates: reviewed
  });

  writeJson(FOUNDATION_FILE, foundation);

  const topicCounts = mergedBundles.reduce((acc, b) => {
    acc[b.topic] = (acc[b.topic] || 0) + 1;
    return acc;
  }, {});

  console.log(JSON.stringify({
    approvedBatch: reviewed.length,
    newFoundationTotal: mergedBundles.length,
    topicCounts
  }, null, 2));
}

main();