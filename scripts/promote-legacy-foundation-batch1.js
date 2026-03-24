import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const INTAKE_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-intake.json');
const REVIEWED_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-batch1-reviewed.json');
const FOUNDATION_FILE = path.join(ROOT, 'public/data/ielts-core-500.json');
const OUTPUT_TOPIC_FILES = {
  education: path.join(ROOT, 'public/data/ielts-topic-education.json'),
  government: path.join(ROOT, 'public/data/ielts-topic-government.json'),
  environment: path.join(ROOT, 'public/data/ielts-topic-environment.json'),
  technology: path.join(ROOT, 'public/data/ielts-topic-technology.json')
};

const BATCH = [
  {
    word: 'budgetary',
    topic: 'government',
    chineseMeaning: '预算的；财政预算相关的',
    englishDefinition: 'relating to government budgets, public spending, or financial planning',
    sense: 'relating to budgets or planned spending',
    collocations: ['budgetary pressure', 'budgetary constraints', 'budgetary policy'],
    paraphrases: ['fiscal', 'funding-related', 'finance-related']
  },
  {
    word: 'counteract',
    topic: 'health',
    chineseMeaning: '抵消；对抗；缓解不利影响',
    englishDefinition: 'to act against something harmful in order to reduce or prevent its effect',
    sense: 'reduce or oppose a harmful effect',
    collocations: ['counteract the effects', 'counteract stress', 'counteract inflation'],
    paraphrases: ['offset', 'neutralize', 'work against']
  },
  {
    word: 'productivity',
    topic: 'work',
    chineseMeaning: '生产率；工作效率',
    englishDefinition: 'the rate at which people, systems, or businesses produce useful work or output',
    sense: 'the level of efficiency in producing work or output',
    collocations: ['boost productivity', 'labour productivity', 'high productivity'],
    paraphrases: ['efficiency', 'output rate', 'work rate']
  },
  {
    word: 'alleviate',
    topic: 'health',
    chineseMeaning: '减轻；缓解',
    englishDefinition: 'to make a problem, pain, or difficult situation less severe',
    sense: 'make something less serious or painful',
    collocations: ['alleviate poverty', 'alleviate pressure', 'alleviate symptoms'],
    paraphrases: ['reduce', 'ease', 'relieve']
  },
  {
    word: 'quantify',
    topic: 'government',
    chineseMeaning: '量化；用数字表示',
    englishDefinition: 'to measure or express something as an amount, value, or number',
    sense: 'measure something in numerical terms',
    collocations: ['quantify the impact', 'quantify risk', 'quantify losses'],
    paraphrases: ['measure', 'calculate', 'assess numerically']
  },
  {
    word: 'mitigate',
    topic: 'environment',
    chineseMeaning: '减轻；缓和；降低负面影响',
    englishDefinition: 'to make a harmful effect, problem, or risk less serious',
    sense: 'reduce the seriousness of something harmful',
    collocations: ['mitigate the effects', 'mitigate risk', 'mitigate damage'],
    paraphrases: ['reduce', 'lessen', 'ease']
  },
  {
    word: 'indirect',
    topic: 'general',
    chineseMeaning: '间接的；非直接的',
    englishDefinition: 'not happening in a direct, immediate, or straightforward way',
    sense: 'not direct or immediate',
    collocations: ['indirect effect', 'indirect cost', 'indirect approach'],
    paraphrases: ['secondary', 'not immediate', 'roundabout']
  },
  {
    word: 'cohesion',
    topic: 'society',
    chineseMeaning: '凝聚力；连贯性；团结',
    englishDefinition: 'the state of sticking together, especially in a social group or in a clear argument',
    sense: 'unity or connectedness within a group or structure',
    collocations: ['social cohesion', 'group cohesion', 'community cohesion'],
    paraphrases: ['unity', 'solidarity', 'connectedness']
  },
  {
    word: 'conceptual',
    topic: 'education',
    chineseMeaning: '概念上的；观念性的',
    englishDefinition: 'relating to ideas, concepts, or abstract thinking rather than practical details',
    sense: 'related to ideas or concepts',
    collocations: ['conceptual framework', 'conceptual understanding', 'conceptual model'],
    paraphrases: ['theoretical', 'abstract', 'idea-based']
  },
  {
    word: 'depletion',
    topic: 'environment',
    chineseMeaning: '消耗；耗尽；枯竭',
    englishDefinition: 'a reduction in the amount of something important, especially a resource',
    sense: 'the process of using up a resource',
    collocations: ['resource depletion', 'ozone depletion', 'rapid depletion'],
    paraphrases: ['exhaustion', 'reduction', 'decline']
  },
  {
    word: 'authenticity',
    topic: 'culture',
    chineseMeaning: '真实性；真确性；原真感',
    englishDefinition: 'the quality of being genuine, real, or true to its origin',
    sense: 'the quality of being genuine or original',
    collocations: ['cultural authenticity', 'authenticity of evidence', 'question authenticity'],
    paraphrases: ['genuineness', 'originality', 'credibility']
  },
  {
    word: 'pervade',
    topic: 'technology',
    chineseMeaning: '弥漫；遍及；渗透到各处',
    englishDefinition: 'to spread through every part of a place, system, or experience',
    sense: 'spread throughout something',
    collocations: ['pervade society', 'pervade daily life', 'pervade the system'],
    paraphrases: ['spread through', 'permeate', 'run through']
  },
  {
    word: 'augment',
    topic: 'government',
    chineseMeaning: '增加；扩大；强化',
    englishDefinition: 'to increase something in size, value, or effect by adding to it',
    sense: 'make something larger or stronger',
    collocations: ['augment income', 'augment resources', 'augment capacity'],
    paraphrases: ['increase', 'expand', 'boost']
  },
  {
    word: 'optimal',
    topic: 'health',
    chineseMeaning: '最佳的；最理想的',
    englishDefinition: 'best or most effective for a particular purpose or situation',
    sense: 'the best possible in a situation',
    collocations: ['optimal health', 'optimal solution', 'optimal conditions'],
    paraphrases: ['best', 'ideal', 'most effective']
  },
  {
    word: 'illiteracy',
    topic: 'education',
    chineseMeaning: '文盲；缺乏基本读写能力',
    englishDefinition: 'the inability to read or write, or the lack of basic literacy skills',
    sense: 'lack of the ability to read and write',
    collocations: ['reduce illiteracy', 'combat illiteracy', 'adult illiteracy'],
    paraphrases: ['lack of literacy', 'inability to read', 'poor reading ability']
  },
  {
    word: 'nonprofit',
    topic: 'education',
    chineseMeaning: '非营利的',
    englishDefinition: 'not intended to make a profit, especially in relation to an organization',
    sense: 'operating without the goal of making profit',
    collocations: ['nonprofit organization', 'nonprofit sector', 'nonprofit group'],
    paraphrases: ['not-for-profit', 'charitable', 'non-commercial']
  },
  {
    word: 'eligibility',
    topic: 'government',
    chineseMeaning: '资格；符合条件',
    englishDefinition: 'the state of being qualified or allowed to receive something',
    sense: 'being qualified to receive or do something',
    collocations: ['eligibility criteria', 'eligibility for benefits', 'meet the eligibility requirements'],
    paraphrases: ['qualification', 'entitlement', 'admissibility']
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
    society: `In social issues, "${word}" helps explain how groups stay connected or work together.`,
    culture: `In culture topics, "${word}" is useful for discussing tradition, identity, or originality.`,
    general: `In IELTS speaking, "${word}" can be used to explain a wider issue in a clear academic way.`
  };

  return templates[topic] || templates.general;
}

function buildBundleId(existingIds, topic, word) {
  let counter = 1;
  let bundleId = `${topic}_${word}_legacyb1_${String(counter).padStart(2, '0')}`;
  while (existingIds.has(bundleId)) {
    counter += 1;
    bundleId = `${topic}_${word}_legacyb1_${String(counter).padStart(2, '0')}`;
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
    if (!candidate) continue;
    if (existingWords.has(approved.word)) continue;

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
      sourceCategory: 'legacy-batch1'
    });
  }

  const mergedBundles = [...bundles, ...newBundles];
  foundation.bundles = mergedBundles;
  foundation.totalBundles = mergedBundles.length;
  foundation.generatedAt = new Date().toISOString();

  writeJson(REVIEWED_FILE, {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source: 'legacy-foundation-batch1',
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
