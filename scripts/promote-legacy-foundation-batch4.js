import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const INTAKE_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-intake.json');
const REVIEWED_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-batch4-reviewed.json');
const FOUNDATION_FILE = path.join(ROOT, 'public/data/ielts-core-500.json');
const OUTPUT_TOPIC_FILES = {
  education: path.join(ROOT, 'public/data/ielts-topic-education.json'),
  government: path.join(ROOT, 'public/data/ielts-topic-government.json'),
  environment: path.join(ROOT, 'public/data/ielts-topic-environment.json'),
  technology: path.join(ROOT, 'public/data/ielts-topic-technology.json')
};

const BATCH = [
  {
    word: 'expound',
    topic: 'government',
    chineseMeaning: '详细阐述；清楚说明观点或理论',
    englishDefinition: 'to explain an idea, theory, or opinion in a clear and detailed way',
    sense: 'explain an idea in detail',
    collocations: ['expound a theory', 'expound his views', 'expound on the issue'],
    paraphrases: ['explain in detail', 'elaborate on', 'set out clearly'],
    contexts: [
      'Public figures should expound their policies clearly instead of relying on vague slogans.',
      'In a strong essay, writers need to expound their main argument before giving examples.',
      'Good speakers can expound complex issues in a way that ordinary listeners understand.'
    ]
  },
  {
    word: 'impartiality',
    topic: 'government',
    chineseMeaning: '公正；不偏不倚；中立',
    englishDefinition: 'the quality of treating different people or ideas fairly without favouring one side',
    sense: 'fairness and neutrality',
    collocations: ['judicial impartiality', 'maintain impartiality', 'political impartiality'],
    paraphrases: ['fairness', 'neutrality', 'objectivity'],
    contexts: [
      'Public trust depends on the impartiality of courts, regulators, and other institutions.',
      'News organizations should protect impartiality if they want audiences to trust their reporting.',
      'Teachers are expected to show impartiality when dealing with disagreements between students.'
    ]
  },
  {
    word: 'atypical',
    topic: 'education',
    chineseMeaning: '非典型的；不具代表性的',
    englishDefinition: 'not typical, usual, or representative of the normal pattern',
    sense: 'not typical or representative',
    collocations: ['atypical case', 'atypical pattern', 'atypical result'],
    paraphrases: ['unusual', 'unrepresentative', 'not typical'],
    contexts: [
      'One atypical example should not be used as evidence for a general trend in education.',
      'Researchers must explain when a result is atypical rather than broadly representative.',
      'An atypical case can be interesting, but policy should be based on wider evidence.'
    ]
  },
  {
    word: 'resourceful',
    topic: 'education',
    chineseMeaning: '足智多谋的；善于应对问题的',
    englishDefinition: 'good at finding practical and clever ways to deal with difficulties',
    sense: 'able to solve problems in practical ways',
    collocations: ['resourceful student', 'resourceful approach', 'highly resourceful'],
    paraphrases: ['adaptable', 'inventive', 'quick-thinking'],
    contexts: [
      'Resourceful students often make progress even when they have limited materials or support.',
      'A resourceful teacher can adapt lessons to different levels without lowering standards.',
      'In real life, employers value resourceful people who can solve problems calmly.'
    ]
  }
];

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function buildBundleId(existingIds, topic, word) {
  let counter = 1;
  let bundleId = `${topic}_${word}_legacyb4_${String(counter).padStart(2, '0')}`;
  while (existingIds.has(bundleId)) {
    counter += 1;
    bundleId = `${topic}_${word}_legacyb4_${String(counter).padStart(2, '0')}`;
  }
  existingIds.add(bundleId);
  return bundleId;
}

function buildContexts(item) {
  return item.contexts.map((text, index) => ({
    kind: index === 0 ? 'reading' : index === 1 ? 'writing' : 'speaking',
    text,
    translation: '',
    purpose: index === 0 ? 'core' : index === 1 ? 'near-transfer' : 'far-transfer'
  }));
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
    if (!candidate) continue;
    if (existingWords.has(approved.word)) continue;

    const bundleId = buildBundleId(existingIds, approved.topic, approved.word);
    reviewed.push({
      ...candidate,
      approved: true,
      reviewStatus: 'approved',
      editorSense: approved.sense,
      editorEnglishDefinition: approved.englishDefinition,
      editorChineseMeaning: approved.chineseMeaning,
      editorCollocations: approved.collocations,
      editorParaphrases: approved.paraphrases,
      editorContexts: buildContexts(approved),
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
      chineseMeaning: approved.chineseMeaning,
      topic: approved.topic,
      taskTypes: ['reading', 'writing', 'speaking'],
      register: 'formal',
      collocations: approved.collocations,
      paraphrases: approved.paraphrases,
      confusions: [],
      contexts: buildContexts(approved),
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
      sourceCategory: 'legacy-batch4'
    });
  }

  const mergedBundles = [...bundles, ...newBundles];
  foundation.bundles = mergedBundles;
  foundation.totalBundles = mergedBundles.length;
  foundation.generatedAt = new Date().toISOString();

  writeJson(REVIEWED_FILE, {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source: 'legacy-foundation-batch4',
    approvedCount: reviewed.length,
    candidates: reviewed
  });

  writeJson(FOUNDATION_FILE, foundation);

  for (const [topic, outputFile] of Object.entries(OUTPUT_TOPIC_FILES)) {
    const topicBundles = mergedBundles.filter(bundle => bundle.topic === topic);
    writeJson(outputFile, {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      source: 'IELTS Foundation',
      topic,
      totalBundles: topicBundles.length,
      bundles: topicBundles
    });
  }

  console.log(JSON.stringify({
    approvedBatch: reviewed.length,
    newFoundationTotal: mergedBundles.length,
    topicCounts: {
      education: mergedBundles.filter(bundle => bundle.topic === 'education').length,
      government: mergedBundles.filter(bundle => bundle.topic === 'government').length,
      environment: mergedBundles.filter(bundle => bundle.topic === 'environment').length,
      technology: mergedBundles.filter(bundle => bundle.topic === 'technology').length
    }
  }, null, 2));
}

main();
