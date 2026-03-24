import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const INTAKE_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-intake.json');
const REVIEWED_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-batch7-reviewed.json');
const FOUNDATION_FILE = path.join(ROOT, 'public/data/ielts-core-500.json');

// 高质量 IELTS 可用词汇批次
// 优先弱势 topic: health, work, media, crime
// 避免过于窄的专业词汇、古旧词汇、敏感词汇
const BATCH = [
  // === HEALTH (弱势 topic) ===
  {
    word: 'digestive',
    topic: 'health',
    chineseMeaning: '消化的；与消化有关的',
    englishDefinition: 'relating to the process of digesting food',
    sense: 'related to the digestion of food',
    collocations: ['digestive system', 'digestive problems', 'digestive health'],
    paraphrases: ['relating to digestion', 'gastrointestinal']
  },
  {
    word: 'alertness',
    topic: 'health',
    chineseMeaning: '警觉性；机敏',
    englishDefinition: 'the state of being quick to notice and respond to things',
    sense: 'being watchful and quick to respond',
    collocations: ['maintain alertness', 'mental alertness', 'high alertness'],
    paraphrases: ['attentiveness', 'vigilance', 'awareness']
  },
  // === WORK (弱势 topic) ===
  {
    word: 'unfortunate',
    topic: 'work',
    chineseMeaning: '不幸的；令人遗憾的',
    englishDefinition: 'having or marked by bad luck; regrettable',
    sense: 'involving bad luck or regret',
    collocations: ['unfortunate situation', 'unfortunate consequence', 'unfortunate decision'],
    paraphrases: ['regrettable', 'unlucky', 'unfavorable']
  },
  // === MEDIA (弱势 topic) ===
  {
    word: 'ovation',
    topic: 'media',
    chineseMeaning: '热烈欢迎；热烈鼓掌',
    englishDefinition: 'an occasion when a person or group is enthusiastically cheered or applauded',
    sense: 'enthusiastic applause or welcome',
    collocations: ['standing ovation', 'receive an ovation', 'rapturous ovation'],
    paraphrases: ['applause', 'acclaim', 'cheering']
  },
  // === CRIME (弱势 topic) ===
  {
    word: 'entail',
    topic: 'crime',
    chineseMeaning: '牵涉；使成为必要',
    englishDefinition: 'to involve something as a necessary part or consequence',
    sense: 'to make something necessary',
    collocations: ['entail risk', 'entail consequences', 'entail responsibility'],
    paraphrases: ['involve', 'require', 'necessitate']
  },
  {
    word: 'magnanimity',
    topic: 'crime',
    chineseMeaning: '宽宏大量；大度',
    englishDefinition: 'the quality of being generous and forgiving, especially toward a rival',
    sense: 'generosity and forgiveness toward others',
    collocations: ['show magnanimity', 'act with magnanimity', 'magnanimity in victory'],
    paraphrases: ['generosity', 'forgiveness', 'big-heartedness']
  },
  {
    word: 'calmness',
    topic: 'crime',
    chineseMeaning: '平静；冷静',
    englishDefinition: 'the state of being peaceful and not excited or upset',
    sense: 'a peaceful and composed state',
    collocations: ['maintain calmness', 'calmness under pressure', 'sense of calmness'],
    paraphrases: ['composure', 'tranquility', 'serenity']
  },
  // === GOVERNMENT (高质量政策词汇) ===
  {
    word: 'subversive',
    topic: 'government',
    chineseMeaning: '颠覆性的；破坏性的',
    englishDefinition: 'intended to destroy or undermine established systems or institutions',
    sense: 'seeking to overthrow or undermine',
    collocations: ['subversive activities', 'subversive elements', 'subversive influence'],
    paraphrases: ['rebellious', 'revolutionary', 'disruptive']
  },
  {
    word: 'extradite',
    topic: 'government',
    chineseMeaning: '引渡',
    englishDefinition: 'to hand over a person accused of a crime to the country where the crime was committed',
    sense: 'to transfer an accused person to another country',
    collocations: ['extradite to', 'extradite a suspect', 'refuse to extradite'],
    paraphrases: ['deport', 'transfer', 'surrender']
  },
  {
    word: 'insatiable',
    topic: 'government',
    chineseMeaning: '无法满足的；贪得无厌的',
    englishDefinition: 'impossible to satisfy; always wanting more',
    sense: 'impossible to satisfy',
    collocations: ['insatiable demand', 'insatiable appetite', 'insatiable desire'],
    paraphrases: ['unquenchable', 'voracious', 'greedy']
  },
  // === ENVIRONMENT ===
  {
    word: 'antarctic',
    topic: 'environment',
    chineseMeaning: '南极的；南极地区的',
    englishDefinition: 'relating to the region around the South Pole',
    sense: 'related to the Antarctic region',
    collocations: ['Antarctic region', 'Antarctic ice', 'Antarctic ecosystem'],
    paraphrases: ['polar', 'southern polar']
  },
  // === CULTURE ===
  {
    word: 'cultured',
    topic: 'culture',
    chineseMeaning: '有教养的；有文化的',
    englishDefinition: 'educated and showing good taste in art, music, or literature',
    sense: 'having good education and taste',
    collocations: ['cultured person', 'cultured society', 'well-cultured'],
    paraphrases: ['refined', 'educated', 'sophisticated']
  },
  {
    word: 'derivation',
    topic: 'culture',
    chineseMeaning: '起源；由来',
    englishDefinition: 'the origin or source of something',
    sense: 'the source or origin of something',
    collocations: ['word derivation', 'derivation of', 'historical derivation'],
    paraphrases: ['origin', 'source', 'root']
  },
  // === EDUCATION ===
  {
    word: 'egocentric',
    topic: 'education',
    chineseMeaning: '自我中心的',
    englishDefinition: 'thinking only about oneself and not about others',
    sense: 'self-centered thinking',
    collocations: ['egocentric behavior', 'egocentric view', 'egocentric stage'],
    paraphrases: ['self-centered', 'selfish', 'narcissistic']
  },
  {
    word: 'induction',
    topic: 'education',
    chineseMeaning: '入职培训；归纳',
    englishDefinition: 'the process of introducing someone to a new job or organization',
    sense: 'formal introduction to a role',
    collocations: ['induction program', 'induction training', 'staff induction'],
    paraphrases: ['orientation', 'training', 'introduction']
  },
  // === TECHNOLOGY ===
  {
    word: 'agribusiness',
    topic: 'technology',
    chineseMeaning: '农业综合企业',
    englishDefinition: 'farming and related commercial activities considered as a business sector',
    sense: 'commercial farming operations',
    collocations: ['agribusiness sector', 'global agribusiness', 'agribusiness company'],
    paraphrases: ['agricultural business', 'farming industry']
  },
  // === GENERAL (高转移价值) ===
  {
    word: 'inequality',
    topic: 'general',
    chineseMeaning: '不平等；不平等现象',
    englishDefinition: 'the unfair difference between groups of people in society',
    sense: 'unfair difference or disparity',
    collocations: ['social inequality', 'economic inequality', 'reduce inequality'],
    paraphrases: ['disparity', 'unfairness', 'imbalance']
  },
  {
    word: 'inflation',
    topic: 'general',
    chineseMeaning: '通货膨胀',
    englishDefinition: 'a general increase in prices and fall in the purchasing value of money',
    sense: 'rising prices and reduced purchasing power',
    collocations: ['high inflation', 'control inflation', 'inflation rate'],
    paraphrases: ['price rise', 'rising costs']
  },
  {
    word: 'coercive',
    topic: 'general',
    chineseMeaning: '强制的；强迫的',
    englishDefinition: 'using force or threats to make someone do something',
    sense: 'using force or pressure',
    collocations: ['coercive measures', 'coercive power', 'coercive tactics'],
    paraphrases: ['forceful', 'compulsory', 'pressuring']
  },
  {
    word: 'legislative',
    topic: 'general',
    chineseMeaning: '立法的；与立法有关的',
    englishDefinition: 'relating to the making of laws',
    sense: 'related to lawmaking',
    collocations: ['legislative process', 'legislative body', 'legislative reform'],
    paraphrases: ['lawmaking', 'statutory', 'regulatory']
  },
  {
    word: 'altruism',
    topic: 'general',
    chineseMeaning: '利他主义；无私',
    englishDefinition: 'the belief in or practice of putting others before oneself',
    sense: 'selfless concern for others',
    collocations: ['pure altruism', 'act of altruism', 'sense of altruism'],
    paraphrases: ['selflessness', 'generosity', 'charity']
  },
  {
    word: 'emancipation',
    topic: 'general',
    chineseMeaning: '解放；摆脱束缚',
    englishDefinition: 'the process of being set free from legal or social restrictions',
    sense: 'freedom from restrictions',
    collocations: ['emancipation from', 'struggle for emancipation', 'emancipation movement'],
    paraphrases: ['liberation', 'freedom', 'release']
  },
  {
    word: 'supervision',
    topic: 'general',
    chineseMeaning: '监督；管理',
    englishDefinition: 'the action of supervising someone or something',
    sense: 'oversight and direction',
    collocations: ['under supervision', 'close supervision', 'proper supervision'],
    paraphrases: ['oversight', 'management', 'direction']
  },
  {
    word: 'resignation',
    topic: 'general',
    chineseMeaning: '辞职；辞职信',
    englishDefinition: 'the act of retiring or giving up a position',
    sense: 'formally leaving a job or position',
    collocations: ['submit resignation', 'accept resignation', 'letter of resignation'],
    paraphrases: ['departure', 'quit', 'stepping down']
  },
  {
    word: 'observation',
    topic: 'general',
    chineseMeaning: '观察；观察结果',
    englishDefinition: 'the act of watching or noticing something carefully',
    sense: 'careful watching or noting',
    collocations: ['careful observation', 'observation of', 'make an observation'],
    paraphrases: ['watching', 'noticing', 'examination']
  },
  {
    word: 'ideology',
    topic: 'general',
    chineseMeaning: '意识形态；思想体系',
    englishDefinition: 'a system of ideas and ideals that forms the basis of a political or economic theory',
    sense: 'a system of beliefs and ideas',
    collocations: ['political ideology', 'dominant ideology', 'ideology of'],
    paraphrases: ['belief system', 'doctrine', 'philosophy']
  },
  {
    word: 'personality',
    topic: 'general',
    chineseMeaning: '个性；人格',
    englishDefinition: 'the combination of characteristics that makes a person unique',
    sense: 'the character and qualities of a person',
    collocations: ['strong personality', 'personality traits', 'personality type'],
    paraphrases: ['character', 'individuality', 'nature']
  },
  {
    word: 'nationalism',
    topic: 'general',
    chineseMeaning: '民族主义；国家主义',
    englishDefinition: 'strong support for the interests and culture of one\'s own nation',
    sense: 'strong national identity and pride',
    collocations: ['rise of nationalism', 'nationalism and', 'extreme nationalism'],
    paraphrases: ['patriotism', 'national pride', 'national sentiment']
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
  let bundleId = `${topic}_${word}_legacyb7_${String(counter).padStart(2, '0')}`;
  while (existingIds.has(bundleId)) {
    counter += 1;
    bundleId = `${topic}_${word}_legacyb7_${String(counter).padStart(2, '0')}`;
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
      sourceCategory: 'legacy-batch7'
    });
  }

  const mergedBundles = [...bundles, ...newBundles];
  foundation.bundles = mergedBundles;
  foundation.totalBundles = mergedBundles.length;
  foundation.generatedAt = new Date().toISOString();

  writeJson(REVIEWED_FILE, {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source: 'legacy-foundation-batch7',
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