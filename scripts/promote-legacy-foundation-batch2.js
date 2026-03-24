import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const INTAKE_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-intake.json');
const REVIEWED_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-batch2-reviewed.json');
const FOUNDATION_FILE = path.join(ROOT, 'public/data/ielts-core-500.json');
const OUTPUT_TOPIC_FILES = {
  education: path.join(ROOT, 'public/data/ielts-topic-education.json'),
  government: path.join(ROOT, 'public/data/ielts-topic-government.json'),
  environment: path.join(ROOT, 'public/data/ielts-topic-environment.json'),
  technology: path.join(ROOT, 'public/data/ielts-topic-technology.json')
};

const BATCH = [
  {
    word: 'nutritional',
    topic: 'health',
    chineseMeaning: '营养的；与营养价值相关的',
    englishDefinition: 'relating to the nutrients in food and their effect on health',
    sense: 'relating to nutrition and food quality',
    collocations: ['nutritional value', 'nutritional needs', 'nutritional advice'],
    paraphrases: ['dietary', 'food-related', 'health-related'],
    contexts: [
      'Many low-income families can afford enough food but still lack nutritional balance in daily meals.',
      'Governments should improve school lunches so that children receive stronger nutritional support.',
      'Clear food labels can help consumers make more nutritional choices.'
    ]
  },
  {
    word: 'ageing',
    topic: 'government',
    chineseMeaning: '老龄化；人口变老的过程',
    englishDefinition: 'the process in which a population or society becomes older on average',
    sense: 'the process of becoming older, especially at the population level',
    collocations: ['ageing population', 'ageing society', 'ageing workforce'],
    paraphrases: ['population ageing', 'growing old', 'demographic ageing'],
    contexts: [
      'An ageing population places growing pressure on pensions and public healthcare systems.',
      'Policymakers need to prepare for the economic effects of an ageing society.',
      'My country has started to debate how an ageing population will change family care.'
    ]
  },
  {
    word: 'blight',
    topic: 'environment',
    chineseMeaning: '破败；衰败；使地区失去活力的问题',
    englishDefinition: 'serious decline or decay in an area that makes it look neglected and harmful to live in',
    sense: 'urban or social decay that damages a place',
    collocations: ['urban blight', 'industrial blight', 'blight an area'],
    paraphrases: ['decay', 'decline', 'deterioration'],
    contexts: [
      'Urban blight can reduce investment, damage confidence, and deepen local inequality.',
      'Authorities should tackle blight by renovating neglected housing and public spaces.',
      'Some districts feel less safe because visible blight has been ignored for years.'
    ]
  },
  {
    word: 'sanitation',
    topic: 'environment',
    chineseMeaning: '环境卫生；卫生设施；排污系统',
    englishDefinition: 'the systems and conditions needed to keep places clean and safe for health',
    sense: 'public hygiene systems and sanitary conditions',
    collocations: ['poor sanitation', 'sanitation facilities', 'sanitation infrastructure'],
    paraphrases: ['hygiene services', 'public hygiene', 'clean sanitation systems'],
    contexts: [
      'Poor sanitation remains a major cause of preventable disease in many communities.',
      'Investment in sanitation infrastructure can improve both health and school attendance.',
      'Access to safe sanitation should be treated as a basic public service.'
    ]
  },
  {
    word: 'deplorable',
    topic: 'government',
    chineseMeaning: '糟糕到应受谴责的；令人痛心的',
    englishDefinition: 'so bad that it deserves strong criticism or shock',
    sense: 'extremely bad and deserving criticism',
    collocations: ['deplorable conditions', 'deplorable behaviour', 'deplorable state'],
    paraphrases: ['appalling', 'shocking', 'unacceptable'],
    contexts: [
      'The report described the living conditions in the settlement as deplorable.',
      'It is deplorable when public funds are wasted while essential services remain under pressure.',
      'A situation becomes deplorable when vulnerable groups receive no meaningful support.'
    ]
  },
  {
    word: 'wrongdoing',
    topic: 'government',
    chineseMeaning: '不当行为；违法违规行为',
    englishDefinition: 'illegal or dishonest behaviour, especially by people or institutions in power',
    sense: 'wrong or illegal conduct',
    collocations: ['corporate wrongdoing', 'financial wrongdoing', 'evidence of wrongdoing'],
    paraphrases: ['misconduct', 'illegal behaviour', 'improper conduct'],
    contexts: [
      'Whistleblowers can help expose corporate wrongdoing that would otherwise remain hidden.',
      'Stronger oversight is needed to prevent wrongdoing in public institutions.',
      'People lose trust quickly when obvious wrongdoing is ignored.'
    ]
  },
  {
    word: 'optimal',
    topic: 'education',
    chineseMeaning: '最佳的；最理想的',
    englishDefinition: 'best or most effective for a particular purpose or situation',
    sense: 'best suited to a particular purpose',
    collocations: ['optimal solution', 'optimal conditions', 'optimal balance'],
    paraphrases: ['ideal', 'best possible', 'most effective'],
    contexts: [
      'There is no single optimal solution because each city faces different constraints.',
      'Students perform best when schools create an optimal balance between study and rest.',
      'Online learning is only optimal for some subjects and learners.'
    ]
  },
  {
    word: 'formalize',
    topic: 'government',
    chineseMeaning: '正式确定；制度化；形成正式规则',
    englishDefinition: 'to make something official, structured, or governed by clear rules',
    sense: 'make something formal or official',
    collocations: ['formalize an agreement', 'formalize procedures', 'formalize the rules'],
    paraphrases: ['make official', 'standardize', 'institutionalize'],
    contexts: [
      'The ministry plans to formalize the new rules after a short period of consultation.',
      'Small organizations often grow faster once they formalize basic procedures and responsibilities.',
      'Communities usually work better when decision-making is formalized clearly.'
    ]
  },
  {
    word: 'intercultural',
    topic: 'education',
    chineseMeaning: '跨文化的；不同文化之间的',
    englishDefinition: 'involving communication or interaction between people from different cultures',
    sense: 'relating to interaction across cultures',
    collocations: ['intercultural communication', 'intercultural understanding', 'intercultural skills'],
    paraphrases: ['cross-cultural', 'between cultures', 'multicultural'],
    contexts: [
      'Intercultural communication is becoming more important as universities attract students from many countries.',
      'Schools should provide intercultural training so students can work effectively in diverse teams.',
      'Travel can improve intercultural understanding because it exposes people to different norms.'
    ]
  },
  {
    word: 'ambivalence',
    topic: 'education',
    chineseMeaning: '矛盾心理；摇摆不定的态度',
    englishDefinition: 'the state of having mixed feelings or uncertain attitudes about something',
    sense: 'mixed feelings about a subject',
    collocations: ['feel ambivalence', 'public ambivalence', 'sense of ambivalence'],
    paraphrases: ['mixed feelings', 'uncertainty', 'conflicted attitude'],
    contexts: [
      'Many parents feel ambivalence about children using technology because it is both useful and distracting.',
      'Public ambivalence toward reform often appears when the costs are immediate but the benefits are long term.',
      'I feel some ambivalence about remote work because it offers freedom but reduces face-to-face contact.'
    ]
  },
  {
    word: 'victimize',
    topic: 'crime',
    chineseMeaning: '使受害；使成为不公对待的对象',
    englishDefinition: 'to treat someone unfairly or harm them so that they become a victim',
    sense: 'make someone suffer unfair harm',
    collocations: ['victimize workers', 'victimize minorities', 'feel victimized'],
    paraphrases: ['target unfairly', 'harm', 'treat unjustly'],
    contexts: [
      'Women and minorities are often victimized by online harassment and abuse.',
      'Policies should protect workers who are victimized by unfair treatment in the workplace.',
      'People can be victimized when rules exist on paper but are not enforced.'
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
  let bundleId = `${topic}_${word}_legacyb2_${String(counter).padStart(2, '0')}`;
  while (existingIds.has(bundleId)) {
    counter += 1;
    bundleId = `${topic}_${word}_legacyb2_${String(counter).padStart(2, '0')}`;
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
      sourceCategory: 'legacy-batch2'
    });
  }

  const mergedBundles = [...bundles, ...newBundles];
  foundation.bundles = mergedBundles;
  foundation.totalBundles = mergedBundles.length;
  foundation.generatedAt = new Date().toISOString();

  writeJson(REVIEWED_FILE, {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source: 'legacy-foundation-batch2',
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
