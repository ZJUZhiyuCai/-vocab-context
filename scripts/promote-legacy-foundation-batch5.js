import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const INTAKE_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-intake.json');
const REVIEWED_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-batch5-reviewed.json');
const FOUNDATION_FILE = path.join(ROOT, 'public/data/ielts-core-500.json');
const OUTPUT_TOPIC_FILES = {
  education: path.join(ROOT, 'public/data/ielts-topic-education.json'),
  government: path.join(ROOT, 'public/data/ielts-topic-government.json'),
  environment: path.join(ROOT, 'public/data/ielts-topic-environment.json'),
  technology: path.join(ROOT, 'public/data/ielts-topic-technology.json')
};

const BATCH = [
  {
    word: 'digression',
    topic: 'education',
    chineseMeaning: '离题；偏离主线的插话或段落',
    englishDefinition: 'a part of a talk or piece of writing that moves away from the main point',
    sense: 'a movement away from the main topic',
    collocations: ['brief digression', 'avoid digression', 'return from a digression'],
    paraphrases: ['side track', 'departure from the main point', 'off-topic section'],
    contexts: [
      'A clear essay should avoid unnecessary digression if the writer wants the main argument to remain strong.',
      'Students often lose marks when a paragraph turns into digression instead of supporting the question directly.',
      'In speaking, a short digression may feel natural, but too much of it weakens the answer.'
    ]
  },
  {
    word: 'connotation',
    topic: 'education',
    chineseMeaning: '内涵意义；词语附带的联想色彩',
    englishDefinition: 'the ideas or feelings that a word suggests in addition to its basic meaning',
    sense: 'an implied meaning or association carried by a word',
    collocations: ['negative connotation', 'positive connotation', 'carry a connotation'],
    paraphrases: ['implied meaning', 'association', 'suggested meaning'],
    contexts: [
      'In reading tasks, understanding connotation can help learners choose the most accurate interpretation of a sentence.',
      'Writers should think about connotation because two similar words may create very different effects.',
      'A word may look simple, but its connotation can make an answer sound more formal or more critical.'
    ]
  },
  {
    word: 'remand',
    topic: 'crime',
    chineseMeaning: '还押候审；将案件发回重审',
    englishDefinition: 'to send someone back into legal custody or send a case back for further judicial action',
    sense: 'place someone in custody while waiting for trial',
    collocations: ['on remand', 'remand in custody', 'remand hearing'],
    paraphrases: ['hold in custody', 'return to custody', 'detain before trial'],
    contexts: [
      'Courts may remand a suspect in custody if there is a serious risk that the person could flee or interfere with evidence.',
      'The debate over whether offenders should be held on remand often focuses on fairness, cost, and public safety.',
      'In crime-related speaking topics, candidates can mention remand when discussing criminal justice and legal procedure.'
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
  let bundleId = `${topic}_${word}_legacyb5_${String(counter).padStart(2, '0')}`;
  while (existingIds.has(bundleId)) {
    counter += 1;
    bundleId = `${topic}_${word}_legacyb5_${String(counter).padStart(2, '0')}`;
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
      sourceCategory: 'legacy-batch5'
    });
  }

  const mergedBundles = [...bundles, ...newBundles];
  foundation.bundles = mergedBundles;
  foundation.totalBundles = mergedBundles.length;
  foundation.generatedAt = new Date().toISOString();

  writeJson(REVIEWED_FILE, {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source: 'legacy-foundation-batch5',
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
    newFoundationTotal: mergedBundles.length
  }, null, 2));
}

main();
