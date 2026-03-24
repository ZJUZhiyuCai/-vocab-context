import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const FOUNDATION_FILE = path.join(ROOT, 'public/data/ielts-core-500.json');
const REVIEWED_FILE = path.join(ROOT, 'data/ielts-topic-expansion-batch1-reviewed.json');

// 高质量 IELTS 词汇 - 补强弱 Topic Packs
// 来源：IELTS 高频主题词汇知识库
// 选择标准：写作/口语高迁移价值、阅读/听力 paraphrase 相关
const BATCH = [
  // === HEALTH (+12 words, 41→53) ===
  // 为什么值得进入：健康类话题是 IELTS 写作 Task 2 和口语高频话题
  // 这些词在讨论健康问题、医疗系统、公共卫生时不可或缺
  {
    word: 'obesity',
    topic: 'health',
    partOfSpeech: 'n.',
    ipa: '/əʊˈbiːsəti/',
    chineseMeaning: '肥胖症',
    englishDefinition: 'the condition of being extremely overweight, which can lead to health problems',
    sense: 'a medical condition of excess body weight',
    collocations: ['obesity epidemic', 'childhood obesity', 'combat obesity'],
    paraphrases: ['excessive weight', 'overweight condition', 'fatness']
  },
  {
    word: 'chronic',
    topic: 'health',
    partOfSpeech: 'adj.',
    ipa: '/ˈkrɒnɪk/',
    chineseMeaning: '慢性的；长期的',
    englishDefinition: 'lasting for a long time or recurring frequently, especially of a disease',
    sense: 'persisting for a long time',
    collocations: ['chronic disease', 'chronic condition', 'chronic pain'],
    paraphrases: ['long-term', 'persistent', 'ongoing']
  },
  {
    word: 'acute',
    topic: 'health',
    partOfSpeech: 'adj.',
    ipa: '/əˈkjuːt/',
    chineseMeaning: '急性的；严重的',
    englishDefinition: 'having a sudden onset and severe symptoms; intense or sharp',
    sense: 'sudden and severe in onset',
    collocations: ['acute illness', 'acute pain', 'acute condition'],
    paraphrases: ['severe', 'intense', 'sudden']
  },
  {
    word: 'diagnosis',
    topic: 'health',
    partOfSpeech: 'n.',
    ipa: '/ˌdaɪəɡˈnəʊsɪs/',
    chineseMeaning: '诊断',
    englishDefinition: 'the identification of the nature of an illness by examination of symptoms',
    sense: 'identifying a disease or condition',
    collocations: ['early diagnosis', 'accurate diagnosis', 'medical diagnosis'],
    paraphrases: ['identification', 'detection', 'recognition']
  },
  {
    word: 'symptom',
    topic: 'health',
    partOfSpeech: 'n.',
    ipa: '/ˈsɪmptəm/',
    chineseMeaning: '症状',
    englishDefinition: 'a physical or mental feature indicating a condition or disease',
    sense: 'a sign of illness',
    collocations: ['common symptom', 'symptom of', 'mild symptoms'],
    paraphrases: ['sign', 'indication', 'manifestation']
  },
  {
    word: 'pharmaceutical',
    topic: 'health',
    partOfSpeech: 'adj.',
    ipa: '/ˌfɑːməˈsuːtɪkəl/',
    chineseMeaning: '制药的；药物的',
    englishDefinition: 'relating to the preparation, use, or sale of medicinal drugs',
    sense: 'related to medicine and drugs',
    collocations: ['pharmaceutical industry', 'pharmaceutical company', 'pharmaceutical products'],
    paraphrases: ['medicinal', 'drug-related', 'pharmacological']
  },
  {
    word: 'sedentary',
    topic: 'health',
    partOfSpeech: 'adj.',
    ipa: '/ˈsedəntəri/',
    chineseMeaning: '久坐的；缺乏运动的',
    englishDefinition: 'involving little physical activity; sitting for long periods',
    sense: 'characterized by inactivity',
    collocations: ['sedentary lifestyle', 'sedentary behavior', 'sedentary job'],
    paraphrases: ['inactive', 'stationary', 'seated']
  },
  {
    word: 'therapeutic',
    topic: 'health',
    partOfSpeech: 'adj.',
    ipa: '/ˌθerəˈpjuːtɪk/',
    chineseMeaning: '治疗的；有疗效的',
    englishDefinition: 'relating to the healing of disease or treatment of conditions',
    sense: 'having healing properties',
    collocations: ['therapeutic effect', 'therapeutic approach', 'therapeutic benefits'],
    paraphrases: ['healing', 'curative', 'medicinal']
  },
  {
    word: 'outbreak',
    topic: 'health',
    partOfSpeech: 'n.',
    ipa: '/ˈaʊtbreɪk/',
    chineseMeaning: '爆发；（疾病）突然蔓延',
    englishDefinition: 'a sudden occurrence of a disease in a community',
    sense: 'sudden spread of disease',
    collocations: ['disease outbreak', 'viral outbreak', 'prevent an outbreak'],
    paraphrases: ['epidemic', 'surge', 'sudden spread']
  },
  {
    word: 'healthcare',
    topic: 'health',
    partOfSpeech: 'n.',
    ipa: '/ˈhelθkeə/',
    chineseMeaning: '医疗保健',
    englishDefinition: 'the organized provision of medical services to the public',
    sense: 'medical services and systems',
    collocations: ['healthcare system', 'healthcare services', 'universal healthcare'],
    paraphrases: ['medical care', 'health services', 'medical treatment']
  },
  {
    word: 'mental',
    topic: 'health',
    partOfSpeech: 'adj.',
    ipa: '/ˈmentəl/',
    chineseMeaning: '精神的；心理的',
    englishDefinition: 'relating to the mind or cognitive processes',
    sense: 'related to the mind',
    collocations: ['mental health', 'mental illness', 'mental wellbeing'],
    paraphrases: ['psychological', 'cognitive', 'emotional']
  },
  {
    word: 'dietary',
    topic: 'health',
    partOfSpeech: 'adj.',
    ipa: '/ˈdaɪətəri/',
    chineseMeaning: '饮食的',
    englishDefinition: 'relating to the food and drink a person consumes',
    sense: 'related to diet and nutrition',
    collocations: ['dietary habits', 'dietary requirements', 'dietary intake'],
    paraphrases: ['nutritional', 'eating-related', 'food-related']
  },

  // === WORK (+10 words, 22→32) ===
  // 为什么值得进入：工作与职业是 IELTS 口语 Part 1/2 常见话题
  // 写作 Task 2 也常涉及就业问题、工作环境、职业发展
  {
    word: 'employment',
    topic: 'work',
    partOfSpeech: 'n.',
    ipa: '/ɪmˈplɔɪmənt/',
    chineseMeaning: '就业；雇佣',
    englishDefinition: 'the state of having paid work; the act of employing someone',
    sense: 'the condition of having a job',
    collocations: ['full employment', 'employment opportunities', 'employment rate'],
    paraphrases: ['work', 'job', 'occupation']
  },
  {
    word: 'unemployment',
    topic: 'work',
    partOfSpeech: 'n.',
    ipa: '/ˌʌnɪmˈplɔɪmənt/',
    chineseMeaning: '失业',
    englishDefinition: 'the state of not having a job despite being willing and able to work',
    sense: 'the condition of being jobless',
    collocations: ['high unemployment', 'unemployment rate', 'long-term unemployment'],
    paraphrases: ['joblessness', 'being out of work', 'lack of work']
  },
  {
    word: 'recruitment',
    topic: 'work',
    partOfSpeech: 'n.',
    ipa: '/rɪˈkruːtmənt/',
    chineseMeaning: '招聘；招募',
    englishDefinition: 'the process of finding and hiring new employees',
    sense: 'the act of hiring new staff',
    collocations: ['recruitment process', 'recruitment agency', 'staff recruitment'],
    paraphrases: ['hiring', 'staffing', 'employment process']
  },
  {
    word: 'redundancy',
    topic: 'work',
    partOfSpeech: 'n.',
    ipa: '/rɪˈdʌndənsi/',
    chineseMeaning: '裁员；冗余',
    englishDefinition: 'the state of being no longer needed or wanted; dismissal from work',
    sense: 'job loss due to restructuring',
    collocations: ['face redundancy', 'mass redundancy', 'voluntary redundancy'],
    paraphrases: ['layoff', 'dismissal', 'job cut']
  },
  {
    word: 'promotion',
    topic: 'work',
    partOfSpeech: 'n.',
    ipa: '/prəˈməʊʃən/',
    chineseMeaning: '晋升；升职',
    englishDefinition: 'advancement to a higher position or rank in an organization',
    sense: 'moving up in a career',
    collocations: ['career promotion', 'get a promotion', 'promotion prospects'],
    paraphrases: ['advancement', 'elevation', 'career progression']
  },
  {
    word: 'workload',
    topic: 'work',
    partOfSpeech: 'n.',
    ipa: '/ˈwɜːkləʊd/',
    chineseMeaning: '工作量',
    englishDefinition: 'the amount of work to be done by a person or organization',
    sense: 'the volume of work assigned',
    collocations: ['heavy workload', 'manage workload', 'increase workload'],
    paraphrases: ['work burden', 'task volume', 'work amount']
  },
  {
    word: 'flexible',
    topic: 'work',
    partOfSpeech: 'adj.',
    ipa: '/ˈfleksəbl/',
    chineseMeaning: '灵活的',
    englishDefinition: 'able to change or adapt to different circumstances; not fixed',
    sense: 'adaptable and adjustable',
    collocations: ['flexible working', 'flexible hours', 'flexible approach'],
    paraphrases: ['adaptable', 'variable', 'adjustable']
  },
  {
    word: 'retirement',
    topic: 'work',
    partOfSpeech: 'n.',
    ipa: '/rɪˈtaɪəmənt/',
    chineseMeaning: '退休',
    englishDefinition: 'the action or fact of leaving one\'s job and stopping work',
    sense: 'leaving work due to age',
    collocations: ['retirement age', 'early retirement', 'plan for retirement'],
    paraphrases: ['pensioning off', 'leaving work', 'ending career']
  },
  {
    word: 'colleague',
    topic: 'work',
    partOfSpeech: 'n.',
    ipa: '/ˈkɒliːɡ/',
    chineseMeaning: '同事',
    englishDefinition: 'a person with whom one works in a profession or business',
    sense: 'a co-worker',
    collocations: ['work colleague', 'fellow colleague', 'colleague relationship'],
    paraphrases: ['co-worker', 'associate', 'teammate']
  },
  {
    word: 'occupation',
    topic: 'work',
    partOfSpeech: 'n.',
    ipa: '/ˌɒkjʊˈpeɪʃən/',
    chineseMeaning: '职业；工作',
    englishDefinition: 'a job or profession; the way one spends one\'s time',
    sense: 'a person\'s job or career',
    collocations: ['skilled occupation', 'regular occupation', 'choose an occupation'],
    paraphrases: ['job', 'profession', 'career']
  },

  // === MEDIA (+8 words, 24→32) ===
  // 为什么值得进入：媒体话题是 IELTS 写作 Task 2 热门话题
  // 涉及新闻真实性、媒体影响、社交媒体等当代议题
  {
    word: 'journalism',
    topic: 'media',
    partOfSpeech: 'n.',
    ipa: '/ˈdʒɜːnəlɪzəm/',
    chineseMeaning: '新闻业；新闻工作',
    englishDefinition: 'the activity of gathering, assessing, and presenting news and information',
    sense: 'the profession of reporting news',
    collocations: ['investigative journalism', 'quality journalism', 'career in journalism'],
    paraphrases: ['news reporting', 'press work', 'news media']
  },
  {
    word: 'censorship',
    topic: 'media',
    partOfSpeech: 'n.',
    ipa: '/ˈsensəʃɪp/',
    chineseMeaning: '审查；审查制度',
    englishDefinition: 'the suppression or prohibition of speech, writing, or images',
    sense: 'control over information',
    collocations: ['media censorship', 'government censorship', 'censorship laws'],
    paraphrases: ['suppression', 'restriction', 'control']
  },
  {
    word: 'coverage',
    topic: 'media',
    partOfSpeech: 'n.',
    ipa: '/ˈkʌvərɪdʒ/',
    chineseMeaning: '新闻报道；覆盖范围',
    englishDefinition: 'the extent to which something is reported by the media',
    sense: 'media reporting of an event',
    collocations: ['media coverage', 'news coverage', 'extensive coverage'],
    paraphrases: ['reporting', 'news story', 'media attention']
  },
  {
    word: 'advertisement',
    topic: 'media',
    partOfSpeech: 'n.',
    ipa: '/ədˈvɜːtɪsmənt/',
    chineseMeaning: '广告',
    englishDefinition: 'a public notice promoting a product, service, or event',
    sense: 'paid promotional message',
    collocations: ['television advertisement', 'online advertisement', 'advertisement campaign'],
    paraphrases: ['ad', 'commercial', 'promotion']
  },
  {
    word: 'sensationalism',
    topic: 'media',
    partOfSpeech: 'n.',
    ipa: '/senˈseɪʃənəlɪzəm/',
    chineseMeaning: '耸人听闻的报道方式',
    englishDefinition: 'the presentation of stories in a way that exaggerates to attract attention',
    sense: 'exaggerated media reporting',
    collocations: ['media sensationalism', 'avoid sensationalism', 'accuse of sensationalism'],
    paraphrases: ['exaggeration', 'sensational reporting', 'hype']
  },
  {
    word: 'misinformation',
    topic: 'media',
    partOfSpeech: 'n.',
    ipa: '/ˌmɪsɪnfəˈmeɪʃən/',
    chineseMeaning: '虚假信息；错误信息',
    englishDefinition: 'false or inaccurate information that is spread unintentionally',
    sense: 'incorrect information spread as fact',
    collocations: ['spread misinformation', 'combat misinformation', 'online misinformation'],
    paraphrases: ['false information', 'inaccurate data', 'wrong information']
  },
  {
    word: 'credibility',
    topic: 'media',
    partOfSpeech: 'n.',
    ipa: '/ˌkredəˈbɪləti/',
    chineseMeaning: '可信度；公信力',
    englishDefinition: 'the quality of being trusted and believed in',
    sense: 'trustworthiness of a source',
    collocations: ['media credibility', 'lose credibility', 'establish credibility'],
    paraphrases: ['trustworthiness', 'reliability', 'believability']
  },
  {
    word: 'mainstream',
    topic: 'media',
    partOfSpeech: 'adj.',
    ipa: '/ˈmeɪnstriːm/',
    chineseMeaning: '主流的',
    englishDefinition: 'considered normal and accepted by the majority of people',
    sense: 'dominant or conventional',
    collocations: ['mainstream media', 'mainstream culture', 'mainstream opinion'],
    paraphrases: ['conventional', 'dominant', 'popular']
  },

  // === CRIME (+10 words, 17→27) ===
  // 为什么值得进入：犯罪与惩罚是 IELTS 写作 Task 2 经典话题
  // 涉及刑罚制度、犯罪预防、青少年犯罪等社会议题
  {
    word: 'offender',
    topic: 'crime',
    partOfSpeech: 'n.',
    ipa: '/əˈfendə/',
    chineseMeaning: '违法者；罪犯',
    englishDefinition: 'a person who commits an illegal act',
    sense: 'someone who breaks the law',
    collocations: ['first-time offender', 'repeat offender', 'young offender'],
    paraphrases: ['criminal', 'lawbreaker', 'perpetrator']
  },
  {
    word: 'verdict',
    topic: 'crime',
    partOfSpeech: 'n.',
    ipa: '/ˈvɜːdɪkt/',
    chineseMeaning: '裁决；判决',
    englishDefinition: 'a decision reached by a jury in a court of law',
    sense: 'the decision in a trial',
    collocations: ['reach a verdict', 'guilty verdict', 'not guilty verdict'],
    paraphrases: ['judgment', 'decision', 'ruling']
  },
  {
    word: 'sentence',
    topic: 'crime',
    partOfSpeech: 'n.',
    ipa: '/ˈsentəns/',
    chineseMeaning: '判决；刑罚',
    englishDefinition: 'the punishment assigned to a defendant found guilty in court',
    sense: 'punishment given by a court',
    collocations: ['prison sentence', 'life sentence', 'reduce a sentence'],
    paraphrases: ['punishment', 'penalty', 'judgment']
  },
  {
    word: 'conviction',
    topic: 'crime',
    partOfSpeech: 'n.',
    ipa: '/kənˈvɪkʃən/',
    chineseMeaning: '定罪；判罪',
    englishDefinition: 'a formal declaration that someone is guilty of a criminal offense',
    sense: 'the act of finding someone guilty',
    collocations: ['criminal conviction', 'previous conviction', 'secure a conviction'],
    paraphrases: ['guilty verdict', 'finding of guilt', 'judgment']
  },
  {
    word: 'prosecution',
    topic: 'crime',
    partOfSpeech: 'n.',
    ipa: '/ˌprɒsɪˈkjuːʃən/',
    chineseMeaning: '起诉；检控',
    englishDefinition: 'the institution of legal proceedings against someone',
    sense: 'the process of bringing criminal charges',
    collocations: ['criminal prosecution', 'face prosecution', 'avoid prosecution'],
    paraphrases: ['legal action', 'charges', 'trial process']
  },
  {
    word: 'deterrent',
    topic: 'crime',
    partOfSpeech: 'n.',
    ipa: '/dɪˈterənt/',
    chineseMeaning: '威慑物；遏制因素',
    englishDefinition: 'something that discourages people from doing something',
    sense: 'something that prevents crime',
    collocations: ['effective deterrent', 'act as a deterrent', 'crime deterrent'],
    paraphrases: ['discouragement', 'preventive measure', 'deterrence']
  },
  {
    word: 'incarceration',
    topic: 'crime',
    partOfSpeech: 'n.',
    ipa: '/ɪnˌkɑːsəˈreɪʃən/',
    chineseMeaning: '监禁；入狱',
    englishDefinition: 'the state of being imprisoned or confined in prison',
    sense: 'being put in prison',
    collocations: ['mass incarceration', 'face incarceration', 'rate of incarceration'],
    paraphrases: ['imprisonment', 'detention', 'confinement']
  },
  {
    word: 'recidivism',
    topic: 'crime',
    partOfSpeech: 'n.',
    ipa: '/rɪˈsɪdɪvɪzəm/',
    chineseMeaning: '累犯；再犯',
    englishDefinition: 'the tendency of a convicted criminal to reoffend',
    sense: 'returning to criminal behavior',
    collocations: ['high recidivism', 'reduce recidivism', 'recidivism rate'],
    paraphrases: ['reoffending', 'repeat offending', 'relapse into crime']
  },
  {
    word: 'surveillance',
    topic: 'crime',
    partOfSpeech: 'n.',
    ipa: '/səˈveɪləns/',
    chineseMeaning: '监视；监控',
    englishDefinition: 'close observation, especially of a suspected person',
    sense: 'watching and monitoring',
    collocations: ['video surveillance', 'police surveillance', 'under surveillance'],
    paraphrases: ['monitoring', 'observation', 'watching']
  },
  {
    word: 'juvenile',
    topic: 'crime',
    partOfSpeech: 'adj.',
    ipa: '/ˈdʒuːvənaɪl/',
    chineseMeaning: '青少年的',
    englishDefinition: 'relating to young people who are not yet adults',
    sense: 'related to young offenders',
    collocations: ['juvenile crime', 'juvenile offender', 'juvenile justice'],
    paraphrases: ['youth', 'adolescent', 'young person\'s']
  }
];

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function buildContexts(word, topic) {
  const templates = {
    reading: {
      health: `Studies have shown that ${word} can have significant impacts on public health outcomes.`,
      work: `Research indicates that ${word} plays a crucial role in workplace dynamics.`,
      media: `The relationship between ${word} and media influence has been widely debated.`,
      crime: `Statistics show that ${word} is a significant factor in criminal justice policy.`
    },
    writing: {
      health: `Health authorities should address ${word} as part of their public health strategy.`,
      work: `Employers need to consider ${word} when developing workplace policies.`,
      media: `Media organizations have a responsibility regarding ${word} in their reporting.`,
      crime: `The criminal justice system must balance ${word} with rehabilitation efforts.`
    },
    speaking: {
      health: `In IELTS speaking, ${word} can be used when discussing health-related topics.`,
      work: `When talking about work topics, ${word} is useful for describing employment situations.`,
      media: `For media topics, ${word} helps express opinions about information and communication.`,
      crime: `In crime-related discussions, ${word} is essential for expressing balanced views.`
    }
  };

  return [
    {
      kind: 'reading',
      text: templates.reading[topic],
      translation: '',
      purpose: 'core'
    },
    {
      kind: 'writing',
      text: templates.writing[topic],
      translation: '',
      purpose: 'near-transfer'
    },
    {
      kind: 'speaking',
      text: templates.speaking[topic],
      translation: '',
      purpose: 'far-transfer'
    }
  ];
}

function buildBundleId(existingIds, topic, word) {
  let counter = 1;
  let bundleId = `${topic}_${word}_topicexp1_${String(counter).padStart(2, '0')}`;
  while (existingIds.has(bundleId)) {
    counter += 1;
    bundleId = `${topic}_${word}_topicexp1_${String(counter).padStart(2, '0')}`;
  }
  existingIds.add(bundleId);
  return bundleId;
}

function main() {
  const foundation = loadJson(FOUNDATION_FILE);
  const bundles = Array.isArray(foundation.bundles) ? foundation.bundles : [];
  const existingWords = new Set(bundles.map(bundle => String(bundle.word).toLowerCase()));
  const existingIds = new Set(bundles.map(bundle => bundle.bundleId));

  const reviewed = [];
  const newBundles = [];

  for (const approved of BATCH) {
    if (existingWords.has(approved.word.toLowerCase())) {
      console.log(`Skipping ${approved.word}: already in Foundation`);
      continue;
    }

    const bundleId = buildBundleId(existingIds, approved.topic, approved.word);

    reviewed.push({
      word: approved.word,
      approved: true,
      reviewStatus: 'approved',
      editorSense: approved.sense,
      editorEnglishDefinition: approved.englishDefinition,
      editorChineseMeaning: approved.chineseMeaning,
      editorCollocations: approved.collocations,
      editorParaphrases: approved.paraphrases,
      editorContexts: buildContexts(approved.word, approved.topic),
      editorProductionPrompt: `Use "${approved.word}" in one IELTS-style sentence about ${approved.topic}.`
    });

    newBundles.push({
      bundleId,
      word: approved.word,
      lemma: approved.word,
      ipa: approved.ipa,
      partOfSpeech: approved.partOfSpeech,
      sense: approved.sense,
      englishDefinition: approved.englishDefinition,
      chineseMeaning: approved.chineseMeaning,
      topic: approved.topic,
      taskTypes: ['reading', 'writing', 'speaking'],
      register: 'formal',
      collocations: approved.collocations,
      paraphrases: approved.paraphrases,
      confusions: [],
      contexts: buildContexts(approved.word, approved.topic),
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
      sourceCategory: 'topic-expansion-batch1'
    });
  }

  const mergedBundles = [...bundles, ...newBundles];
  foundation.bundles = mergedBundles;
  foundation.totalBundles = mergedBundles.length;
  foundation.generatedAt = new Date().toISOString();

  writeJson(REVIEWED_FILE, {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source: 'topic-expansion-batch1',
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