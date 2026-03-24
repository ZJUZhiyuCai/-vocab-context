import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const INTAKE_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-intake.json');
const REVIEWED_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-batch3-reviewed.json');
const FOUNDATION_FILE = path.join(ROOT, 'public/data/ielts-core-500.json');
const OUTPUT_TOPIC_FILES = {
  education: path.join(ROOT, 'public/data/ielts-topic-education.json'),
  government: path.join(ROOT, 'public/data/ielts-topic-government.json'),
  environment: path.join(ROOT, 'public/data/ielts-topic-environment.json'),
  technology: path.join(ROOT, 'public/data/ielts-topic-technology.json')
};

const BATCH = [
  {
    word: 'mediate',
    topic: 'government',
    chineseMeaning: '调解；斡旋；在双方之间促成解决',
    englishDefinition: 'to help two sides reach an agreement by discussing the problem with both of them',
    sense: 'help two sides reach an agreement',
    collocations: ['mediate in a dispute', 'mediate a conflict', 'mediate between groups'],
    paraphrases: ['broker', 'help settle', 'intervene to resolve'],
    contexts: [
      'International organizations sometimes mediate in disputes when governments cannot negotiate directly.',
      'A neutral body may be needed to mediate between workers and employers during a prolonged strike.',
      'In public life, trusted leaders can mediate when communities disagree strongly.'
    ]
  },
  {
    word: 'cohesion',
    topic: 'society',
    chineseMeaning: '凝聚力；团结性；连贯性',
    englishDefinition: 'the quality of forming a united whole, especially in a society, group, or clear piece of writing',
    sense: 'unity and connectedness within a group or structure',
    collocations: ['social cohesion', 'community cohesion', 'group cohesion'],
    paraphrases: ['unity', 'solidarity', 'connectedness'],
    contexts: [
      'High levels of social cohesion can make communities more resilient during economic change.',
      'Public policy should strengthen cohesion rather than deepen division between social groups.',
      'In essays, cohesion matters because ideas need to connect naturally from one point to the next.'
    ]
  },
  {
    word: 'conceptual',
    topic: 'education',
    chineseMeaning: '概念上的；重在观念理解的',
    englishDefinition: 'relating to concepts, ideas, or abstract understanding rather than practical detail',
    sense: 'related to ideas and abstract understanding',
    collocations: ['conceptual framework', 'conceptual understanding', 'conceptual model'],
    paraphrases: ['theoretical', 'abstract', 'idea-based'],
    contexts: [
      'Students often memorize facts but still lack conceptual understanding of the topic.',
      'Teachers should balance factual knowledge with conceptual learning in the curriculum.',
      'A conceptual explanation usually helps people understand why a system works the way it does.'
    ]
  },
  {
    word: 'depletion',
    topic: 'environment',
    chineseMeaning: '消耗；耗尽；枯竭',
    englishDefinition: 'the reduction or exhaustion of an important resource over time',
    sense: 'the process of using up a resource',
    collocations: ['resource depletion', 'ozone depletion', 'rapid depletion'],
    paraphrases: ['exhaustion', 'decline', 'running down'],
    contexts: [
      'Groundwater depletion is becoming a serious issue in regions with intensive farming.',
      'Governments must act early if they want to prevent the depletion of natural resources.',
      'People rarely notice depletion until a resource becomes expensive or difficult to replace.'
    ]
  },
  {
    word: 'authenticity',
    topic: 'culture',
    chineseMeaning: '真实性；原真性；真实可信的特质',
    englishDefinition: 'the quality of being genuine, real, or true to its original character',
    sense: 'the state of being genuine or original',
    collocations: ['cultural authenticity', 'authenticity of evidence', 'question the authenticity'],
    paraphrases: ['genuineness', 'originality', 'credibility'],
    contexts: [
      'Tourism can bring income, but some people worry that it weakens the authenticity of local culture.',
      'Museums must balance public access with the need to protect the authenticity of historical objects.',
      'People tend to respond positively when a speaker shows authenticity rather than a rehearsed image.'
    ]
  },
  {
    word: 'indirect',
    topic: 'government',
    chineseMeaning: '间接的；非直接产生的',
    englishDefinition: 'not direct, immediate, or straightforward, especially in relation to effects or influence',
    sense: 'happening through another cause or channel rather than directly',
    collocations: ['indirect effect', 'indirect cost', 'indirect impact'],
    paraphrases: ['secondary', 'not direct', 'less immediate'],
    contexts: [
      'Housing policy can have an indirect effect on health by changing stress and living conditions.',
      'Some reforms appear cheap at first, but their indirect costs are often much higher later on.',
      'In public debate, indirect consequences are often harder to measure than immediate ones.'
    ]
  },
  {
    word: 'pervade',
    topic: 'technology',
    chineseMeaning: '弥漫；遍及；渗透到各处',
    englishDefinition: 'to spread through every part of something such as a system, environment, or society',
    sense: 'spread throughout all parts of something',
    collocations: ['pervade daily life', 'pervade society', 'pervade the system'],
    paraphrases: ['permeate', 'spread through', 'run through'],
    contexts: [
      'Digital technology now pervades almost every part of daily life, from banking to education.',
      'Online platforms pervade the labour market because job-seeking increasingly happens through apps and websites.',
      'Once a new technology becomes cheap enough, it can pervade society very quickly.'
    ]
  },
  {
    word: 'augment',
    topic: 'government',
    chineseMeaning: '增加；扩大；强化',
    englishDefinition: 'to increase something by adding to it or making it stronger',
    sense: 'make something larger or stronger',
    collocations: ['augment resources', 'augment income', 'augment capacity'],
    paraphrases: ['increase', 'expand', 'boost'],
    contexts: [
      'Local authorities may need to augment public transport capacity as cities continue to grow.',
      'Some families rely on part-time work to augment their income during periods of inflation.',
      'Technology can augment classroom learning, but it should not replace good teaching completely.'
    ]
  },
  {
    word: 'interruption',
    topic: 'work',
    chineseMeaning: '中断；打断；妨碍正常进行的情况',
    englishDefinition: 'a break in continuity that stops a process, activity, or piece of work from continuing smoothly',
    sense: 'a break that stops something from continuing',
    collocations: ['without interruption', 'service interruption', 'constant interruption'],
    paraphrases: ['disruption', 'break', 'disturbance'],
    contexts: [
      'Frequent interruption reduces productivity because workers lose focus and need time to start again.',
      'Reliable infrastructure is important because even a short power interruption can disrupt local businesses.',
      'Students often struggle to study effectively in homes where there is constant interruption.'
    ]
  },
  {
    word: 'collude',
    topic: 'government',
    chineseMeaning: '串通；共谋；暗中勾结',
    englishDefinition: 'to secretly cooperate with others in order to do something dishonest or unfair',
    sense: 'secretly cooperate for dishonest purposes',
    collocations: ['collude with', 'collude to fix', 'collude in corruption'],
    paraphrases: ['conspire', 'plot together', 'act in secret'],
    contexts: [
      'Firms sometimes collude to keep prices high when competition rules are weakly enforced.',
      'Strong regulation is needed to stop officials and businesses from colluding for private gain.',
      'People lose trust quickly if they believe powerful groups collude behind closed doors.'
    ]
  },
  {
    word: 'destabilize',
    topic: 'government',
    chineseMeaning: '使不稳定；破坏平衡；动摇',
    englishDefinition: 'to make a system, society, or government less stable and more likely to fail',
    sense: 'make something less stable',
    collocations: ['destabilize the economy', 'destabilize the government', 'politically destabilize'],
    paraphrases: ['disrupt', 'undermine stability', 'throw off balance'],
    contexts: [
      'Rapid inflation can destabilize an economy if wages fail to keep pace with living costs.',
      'Misinformation may destabilize public trust when citizens no longer believe official advice.',
      'In politics, even small shocks can destabilize a system that already lacks legitimacy.'
    ]
  },
  {
    word: 'flourishing',
    topic: 'environment',
    chineseMeaning: '繁荣的；兴盛的；发展旺盛的',
    englishDefinition: 'growing, developing, or succeeding strongly',
    sense: 'developing in a healthy or successful way',
    collocations: ['flourishing economy', 'flourishing community', 'flourishing wildlife'],
    paraphrases: ['thriving', 'prosperous', 'growing strongly'],
    contexts: [
      'A flourishing local economy often depends on reliable transport, skilled workers, and stable investment.',
      'Cities should protect parks if they want a flourishing urban environment rather than a purely concrete landscape.',
      'Tourism can create a flourishing market for local businesses when it is managed responsibly.'
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
  let bundleId = `${topic}_${word}_legacyb3_${String(counter).padStart(2, '0')}`;
  while (existingIds.has(bundleId)) {
    counter += 1;
    bundleId = `${topic}_${word}_legacyb3_${String(counter).padStart(2, '0')}`;
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
      sourceCategory: 'legacy-batch3'
    });
  }

  const mergedBundles = [...bundles, ...newBundles];
  foundation.bundles = mergedBundles;
  foundation.totalBundles = mergedBundles.length;
  foundation.generatedAt = new Date().toISOString();

  writeJson(REVIEWED_FILE, {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source: 'legacy-foundation-batch3',
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
