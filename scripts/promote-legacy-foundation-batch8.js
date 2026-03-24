import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const INTAKE_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-intake.json');
const REVIEWED_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-batch8-reviewed.json');
const FOUNDATION_FILE = path.join(ROOT, 'public/data/ielts-core-500.json');

const BATCH = [
  // === GENERAL (高转移价值) ===
  {
    word: 'probability',
    topic: 'general',
    chineseMeaning: '可能性；概率',
    englishDefinition: 'the likelihood that something will happen',
    sense: 'how likely something is to occur',
    collocations: ['high probability', 'probability of', 'in all probability'],
    paraphrases: ['likelihood', 'chance', 'possibility']
  },
  {
    word: 'dynamics',
    topic: 'general',
    chineseMeaning: '动力学；动态变化',
    englishDefinition: 'the forces or properties that stimulate change within a system',
    sense: 'forces that cause change or growth',
    collocations: ['group dynamics', 'market dynamics', 'social dynamics'],
    paraphrases: ['forces', 'interactions', 'mechanisms']
  },
  {
    word: 'dominance',
    topic: 'general',
    chineseMeaning: '主导地位；支配',
    englishDefinition: 'the state of having power or influence over others',
    sense: 'being in a position of control',
    collocations: ['market dominance', 'maintain dominance', 'global dominance'],
    paraphrases: ['control', 'supremacy', 'authority']
  },
  {
    word: 'expansive',
    topic: 'general',
    chineseMeaning: '广阔的；广泛的',
    englishDefinition: 'covering a large area or including many things',
    sense: 'wide-ranging or extensive',
    collocations: ['expansive view', 'expansive approach', 'expansive growth'],
    paraphrases: ['extensive', 'broad', 'wide-ranging']
  },
  {
    word: 'refinement',
    topic: 'general',
    chineseMeaning: '改进；精炼',
    englishDefinition: 'the process of improving something by making small changes',
    sense: 'the act of improving or polishing',
    collocations: ['further refinement', 'refinement of', 'require refinement'],
    paraphrases: ['improvement', 'enhancement', 'polishing']
  },
  {
    word: 'exertion',
    topic: 'general',
    chineseMeaning: '努力；运用',
    englishDefinition: 'physical or mental effort used to do something',
    sense: 'vigorous effort or use of power',
    collocations: ['physical exertion', 'require exertion', 'great exertion'],
    paraphrases: ['effort', 'strain', 'endeavor']
  },
  {
    word: 'estrangement',
    topic: 'general',
    chineseMeaning: '疏远；隔离',
    englishDefinition: 'the state of being no longer friendly or close',
    sense: 'becoming distant or separated',
    collocations: ['estrangement from', 'family estrangement', 'political estrangement'],
    paraphrases: ['alienation', 'distance', 'separation']
  },
  {
    word: 'fragmentary',
    topic: 'general',
    chineseMeaning: '碎片的；不完整的',
    englishDefinition: 'made up of small parts that are not connected',
    sense: 'incomplete or lacking wholeness',
    collocations: ['fragmentary evidence', 'fragmentary knowledge', 'fragmentary remains'],
    paraphrases: ['incomplete', 'partial', 'broken']
  },
  // === GOVERNMENT ===
  {
    word: 'disloyal',
    topic: 'government',
    chineseMeaning: '不忠诚的',
    englishDefinition: 'failing to be loyal to a person, country, or organization',
    sense: 'not faithful or devoted',
    collocations: ['disloyal to', 'disloyal behavior', 'accused of being disloyal'],
    paraphrases: ['unfaithful', 'treasonous', 'traitorous']
  },
  {
    word: 'unbelievable',
    topic: 'government',
    chineseMeaning: '难以置信的；非常惊人的',
    englishDefinition: 'so extraordinary or surprising that it is difficult to believe',
    sense: 'extraordinary or shocking',
    collocations: ['unbelievable story', 'unbelievable news', 'almost unbelievable'],
    paraphrases: ['incredible', 'astonishing', 'extraordinary']
  },
  // === EDUCATION ===
  {
    word: 'hypersensitive',
    topic: 'education',
    chineseMeaning: '过敏的；高度敏感的',
    englishDefinition: 'extremely sensitive to criticism or external influences',
    sense: 'overly sensitive or reactive',
    collocations: ['hypersensitive to', 'hypersensitive person', 'become hypersensitive'],
    paraphrases: ['oversensitive', 'reactive', 'touchy']
  },
  {
    word: 'reliably',
    topic: 'education',
    chineseMeaning: '可靠地；确实地',
    englishDefinition: 'in a way that can be trusted or depended on',
    sense: 'in a trustworthy manner',
    collocations: ['reliably informed', 'reliably reported', 'work reliably'],
    paraphrases: ['dependably', 'trustworthily', 'consistently']
  },
  // === ENVIRONMENT ===
  {
    word: 'interlocking',
    topic: 'environment',
    chineseMeaning: '相互关联的；联锁的',
    englishDefinition: 'connected or linked together',
    sense: 'closely connected or interdependent',
    collocations: ['interlocking system', 'interlocking parts', 'interlocking network'],
    paraphrases: ['interconnected', 'linked', 'integrated']
  },
  // === CULTURE ===
  {
    word: 'critically',
    topic: 'culture',
    chineseMeaning: '批判性地；严重地',
    englishDefinition: 'in a way that expresses adverse or disapproving comments',
    sense: 'with careful analysis or judgment',
    collocations: ['critically important', 'think critically', 'critically examine'],
    paraphrases: ['analytically', 'judgmentally', 'seriously']
  },
  // === HEALTH ===
  {
    word: 'agility',
    topic: 'health',
    chineseMeaning: '敏捷；灵活',
    englishDefinition: 'the ability to move quickly and easily',
    sense: 'physical or mental quickness',
    collocations: ['mental agility', 'physical agility', 'improve agility'],
    paraphrases: ['flexibility', 'quickness', 'nimbleness']
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
    government: `In public discussion, people often use "${word}" when talking about rules, funding, or social policy.`,
    health: `In a health-related answer, "${word}" can help describe risk, wellbeing, or practical solutions.`,
    work: `In IELTS speaking, "${word}" is useful when discussing efficiency, careers, or workplace change.`,
    education: `In an education topic, "${word}" helps explain access, quality, or long-term learning outcomes.`,
    environment: `In environmental topics, "${word}" can describe pressure, damage, or policy responses.`,
    technology: `In technology topics, "${word}" can describe how new systems spread or reshape daily life.`,
    culture: `In culture topics, "${word}" is useful for discussing tradition, identity, or originality.`,
    media: `In media topics, "${word}" can help discuss information, bias, or public communication.`,
    crime: `In crime and justice topics, "${word}" helps explain causes, effects, or policy responses.`,
    general: `In IELTS speaking, "${word}" can be used to explain a wider issue in a clear academic way.`
  };

  return templates[topic] || templates.general;
}

function buildBundleId(existingIds, topic, word) {
  let counter = 1;
  let bundleId = `${topic}_${word}_legacyb8_${String(counter).padStart(2, '0')}`;
  while (existingIds.has(bundleId)) {
    counter += 1;
    bundleId = `${topic}_${word}_legacyb8_${String(counter).padStart(2, '0')}`;
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
      sourceCategory: 'legacy-batch8'
    });
  }

  const mergedBundles = [...bundles, ...newBundles];
  foundation.bundles = mergedBundles;
  foundation.totalBundles = mergedBundles.length;
  foundation.generatedAt = new Date().toISOString();

  writeJson(REVIEWED_FILE, {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source: 'legacy-foundation-batch8',
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