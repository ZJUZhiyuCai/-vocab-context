import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildExpansionContexts } from './topic-context-helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const FOUNDATION_FILE = path.join(ROOT, 'public/data/ielts-foundation.json');

// 第三批 Topic Pack 扩展词汇
// 目标：补充 Health、Technology、Environment 至 80+ 词汇
const BATCH_3 = [
  // === HEALTH (+27 words, 53→80) ===
  { word: 'addiction', topic: 'health', partOfSpeech: 'n.', ipa: '/əˈdɪkʃn/', chineseMeaning: '成瘾', englishDefinition: 'physical or mental dependence on a substance', sense: 'dependency on drugs or behavior', collocations: ['drug addiction', 'overcome addiction', 'treat addiction'], paraphrases: ['dependence', 'habit', 'compulsion'] },
  { word: 'antibiotic', topic: 'health', partOfSpeech: 'n.', ipa: '/ˌæntɪbaɪˈɒtɪk/', chineseMeaning: '抗生素', englishDefinition: 'a medicine that destroys bacteria', sense: 'bacteria-fighting drug', collocations: ['take antibiotics', 'antibiotic resistance', 'prescribe antibiotics'], paraphrases: ['antimicrobial', 'antibacterial', 'medicine'] },
  { word: 'bacteria', topic: 'health', partOfSpeech: 'n.', ipa: '/bækˈtɪəriə/', chineseMeaning: '细菌', englishDefinition: 'microscopic single-celled organisms', sense: 'microorganisms', collocations: ['kill bacteria', 'harmful bacteria', 'bacterial infection'], paraphrases: ['germs', 'microbes', 'pathogens'] },
  { word: 'cardiovascular', topic: 'health', partOfSpeech: 'adj.', ipa: '/ˌkɑːdiəʊˈvæskjələ/', chineseMeaning: '心血管的', englishDefinition: 'relating to the heart and blood vessels', sense: 'heart-related', collocations: ['cardiovascular disease', 'cardiovascular health', 'cardiovascular system'], paraphrases: ['heart', 'cardiac', 'circulatory'] },
  { word: 'clinic', topic: 'health', partOfSpeech: 'n.', ipa: '/ˈklɪnɪk/', chineseMeaning: '诊所', englishDefinition: 'a medical facility for outpatient treatment', sense: 'medical center', collocations: ['health clinic', 'visit a clinic', 'clinic staff'], paraphrases: ['medical center', 'practice', 'health center'] },
  { word: 'contagious', topic: 'health', partOfSpeech: 'adj.', ipa: '/kənˈteɪdʒəs/', chineseMeaning: '传染性的', englishDefinition: 'spread from one person to another', sense: 'infectious', collocations: ['highly contagious', 'contagious disease', 'contagious virus'], paraphrases: ['infectious', 'catching', 'transmissible'] },
  { word: 'deficiency', topic: 'health', partOfSpeech: 'n.', ipa: '/dɪˈfɪʃənsi/', chineseMeaning: '缺乏', englishDefinition: 'a lack or shortage of something needed', sense: 'nutritional lack', collocations: ['vitamin deficiency', 'nutrient deficiency', 'iron deficiency'], paraphrases: ['shortage', 'lack', 'insufficiency'] },
  { word: 'diabetes', topic: 'health', partOfSpeech: 'n.', ipa: '/ˌdaɪəˈbiːtiːz/', chineseMeaning: '糖尿病', englishDefinition: 'a disease affecting blood sugar regulation', sense: 'metabolic disorder', collocations: ['type 2 diabetes', 'manage diabetes', 'diabetes patient'], paraphrases: ['blood sugar disease', 'metabolic condition', 'chronic illness'] },
  { word: 'disorder', topic: 'health', partOfSpeech: 'n.', ipa: '/dɪsˈɔːdə/', chineseMeaning: '疾病；失调', englishDefinition: 'an illness or condition affecting normal function', sense: 'medical condition', collocations: ['mental disorder', 'eating disorder', 'sleep disorder'], paraphrases: ['condition', 'illness', 'disease'] },
  { word: 'epidemic', topic: 'health', partOfSpeech: 'n.', ipa: '/ˌepɪˈdemɪk/', chineseMeaning: '流行病', englishDefinition: 'a widespread occurrence of a disease', sense: 'disease outbreak', collocations: ['flu epidemic', 'obesity epidemic', 'control an epidemic'], paraphrases: ['outbreak', 'pandemic', 'spread'] },
  { word: 'exercise', topic: 'health', partOfSpeech: 'n.', ipa: '/ˈeksəsaɪz/', chineseMeaning: '运动', englishDefinition: 'physical activity for health', sense: 'physical workout', collocations: ['regular exercise', 'do exercise', 'exercise routine'], paraphrases: ['workout', 'training', 'physical activity'] },
  { word: 'fatigue', topic: 'health', partOfSpeech: 'n.', ipa: '/fəˈtiːɡ/', chineseMeaning: '疲劳', englishDefinition: 'extreme tiredness from mental or physical exertion', sense: 'extreme tiredness', collocations: ['chronic fatigue', 'suffer from fatigue', 'combat fatigue'], paraphrases: ['tiredness', 'exhaustion', 'weariness'] },
  { word: 'fitness', topic: 'health', partOfSpeech: 'n.', ipa: '/ˈfɪtnəs/', chineseMeaning: '健康；健身', englishDefinition: 'the condition of being physically fit', sense: 'physical health', collocations: ['physical fitness', 'fitness level', 'fitness program'], paraphrases: ['health', 'condition', 'wellness'] },
  { word: 'immune', topic: 'health', partOfSpeech: 'adj.', ipa: '/ɪˈmjuːn/', chineseMeaning: '免疫的', englishDefinition: 'resistant to a particular infection', sense: 'protected from disease', collocations: ['immune system', 'immune response', 'immune to'], paraphrases: ['protected', 'resistant', 'defended'] },
  { word: 'infection', topic: 'health', partOfSpeech: 'n.', ipa: '/ɪnˈfekʃn/', chineseMeaning: '感染', englishDefinition: 'the process of being infected with a disease', sense: 'disease contamination', collocations: ['bacterial infection', 'prevent infection', 'viral infection'], paraphrases: ['contamination', 'disease', 'illness'] },
  { word: 'injury', topic: 'health', partOfSpeech: 'n.', ipa: '/ˈɪndʒəri/', chineseMeaning: '伤害', englishDefinition: 'physical harm or damage to the body', sense: 'physical damage', collocations: ['serious injury', 'prevent injury', 'sports injury'], paraphrases: ['wound', 'damage', 'harm'] },
  { word: 'intake', topic: 'health', partOfSpeech: 'n.', ipa: '/ˈɪnteɪk/', chineseMeaning: '摄入量', englishDefinition: 'the amount of food or drink consumed', sense: 'consumption amount', collocations: ['daily intake', 'calorie intake', 'reduce intake'], paraphrases: ['consumption', 'ingestion', 'diet'] },
  { word: 'malnutrition', topic: 'health', partOfSpeech: 'n.', ipa: '/ˌmælnjuːˈtrɪʃn/', chineseMeaning: '营养不良', englishDefinition: 'lack of proper nutrition caused by poor diet', sense: 'nutritional deficiency', collocations: ['suffer from malnutrition', 'severe malnutrition', 'childhood malnutrition'], paraphrases: ['undernourishment', 'poor nutrition', 'starvation'] },
  { word: 'mortality', topic: 'health', partOfSpeech: 'n.', ipa: '/mɔːˈtæləti/', chineseMeaning: '死亡率', englishDefinition: 'the rate of death from a particular cause', sense: 'death rate', collocations: ['mortality rate', 'infant mortality', 'reduce mortality'], paraphrases: ['death rate', 'fatality', 'deaths'] },
  { word: 'nutrition', topic: 'health', partOfSpeech: 'n.', ipa: '/njuːˈtrɪʃn/', chineseMeaning: '营养', englishDefinition: 'the process of obtaining food for health', sense: 'food for health', collocations: ['good nutrition', 'nutrition education', 'proper nutrition'], paraphrases: ['nourishment', 'diet', 'sustenance'] },
  { word: 'overweight', topic: 'health', partOfSpeech: 'adj.', ipa: '/ˌəʊvəˈweɪt/', chineseMeaning: '超重的', englishDefinition: 'weighing more than is healthy', sense: 'above healthy weight', collocations: ['overweight adults', 'become overweight', 'overweight population'], paraphrases: ['heavy', 'obese', 'plump'] },
  { word: 'pandemic', topic: 'health', partOfSpeech: 'n.', ipa: '/pænˈdemɪk/', chineseMeaning: '大流行', englishDefinition: 'a disease spread over a wide geographic area', sense: 'global epidemic', collocations: ['COVID-19 pandemic', 'global pandemic', 'pandemic response'], paraphrases: ['global outbreak', 'worldwide epidemic', 'plague'] },
  { word: 'patient', topic: 'health', partOfSpeech: 'n.', ipa: '/ˈpeɪʃənt/', chineseMeaning: '病人', englishDefinition: 'a person receiving medical treatment', sense: 'medical recipient', collocations: ['hospital patient', 'treat patients', 'patient care'], paraphrases: ['sick person', 'sufferer', 'case'] },
  { word: 'prescription', topic: 'health', partOfSpeech: 'n.', ipa: '/prɪˈskrɪpʃn/', chineseMeaning: '处方', englishDefinition: 'an instruction written by a doctor for medicine', sense: 'medical order', collocations: ['prescription drug', 'write a prescription', 'on prescription'], paraphrases: ['medication order', 'medical instruction', 'script'] },
  { word: 'rehabilitation', topic: 'health', partOfSpeech: 'n.', ipa: '/ˌriːəˌbɪlɪˈteɪʃn/', chineseMeaning: '康复', englishDefinition: 'the process of restoring health after illness', sense: 'recovery process', collocations: ['drug rehabilitation', 'undergo rehabilitation', 'rehabilitation program'], paraphrases: ['recovery', 'restoration', 'treatment'] },
  { word: 'vaccination', topic: 'health', partOfSpeech: 'n.', ipa: '/ˌvæksɪˈneɪʃn/', chineseMeaning: '疫苗接种', englishDefinition: 'treatment with a vaccine to produce immunity', sense: 'immunization', collocations: ['get vaccination', 'mass vaccination', 'vaccination program'], paraphrases: ['immunization', 'inoculation', 'shot'] },
  { word: 'virus', topic: 'health', partOfSpeech: 'n.', ipa: '/ˈvaɪrəs/', chineseMeaning: '病毒', englishDefinition: 'a tiny infectious agent that replicates in cells', sense: 'infectious agent', collocations: ['spread virus', 'viral infection', 'computer virus'], paraphrases: ['pathogen', 'germ', 'bug'] },

  // === TECHNOLOGY (+28 words, 52→80) ===
  { word: 'algorithm', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˈælɡərɪðəm/', chineseMeaning: '算法', englishDefinition: 'a set of rules for solving problems in computing', sense: 'computing procedure', collocations: ['search algorithm', 'machine learning algorithm', 'complex algorithm'], paraphrases: ['procedure', 'formula', 'process'] },
  { word: 'automation', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˌɔːtəˈmeɪʃn/', chineseMeaning: '自动化', englishDefinition: 'the use of machines instead of people', sense: 'machine control', collocations: ['industrial automation', 'office automation', 'full automation'], paraphrases: ['mechanization', 'computerization', 'robotics'] },
  { word: 'bandwidth', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˈbændwɪdθ/', chineseMeaning: '带宽', englishDefinition: 'the rate of data transfer in a network', sense: 'data capacity', collocations: ['high bandwidth', 'increase bandwidth', 'bandwidth limit'], paraphrases: ['capacity', 'speed', 'throughput'] },
  { word: 'cyber', topic: 'technology', partOfSpeech: 'adj.', ipa: '/ˈsaɪbə/', chineseMeaning: '网络的', englishDefinition: 'relating to computers and the internet', sense: 'computer-related', collocations: ['cyber security', 'cyber attack', 'cyber crime'], paraphrases: ['digital', 'online', 'virtual'] },
  { word: 'database', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˈdeɪtəbeɪs/', chineseMeaning: '数据库', englishDefinition: 'an organized collection of electronic data', sense: 'data storage', collocations: ['access database', 'database system', 'large database'], paraphrases: ['data bank', 'information system', 'archive'] },
  { word: 'device', topic: 'technology', partOfSpeech: 'n.', ipa: '/dɪˈvaɪs/', chineseMeaning: '设备', englishDefinition: 'an electronic tool or piece of equipment', sense: 'electronic tool', collocations: ['mobile device', 'electronic device', 'smart device'], paraphrases: ['gadget', 'tool', 'appliance'] },
  { word: 'digital', topic: 'technology', partOfSpeech: 'adj.', ipa: '/ˈdɪdʒɪtl/', chineseMeaning: '数字的', englishDefinition: 'involving computer technology', sense: 'electronic technology', collocations: ['digital technology', 'digital age', 'digital transformation'], paraphrases: ['electronic', 'computerized', 'virtual'] },
  { word: 'download', topic: 'technology', partOfSpeech: 'v.', ipa: '/ˈdaʊnləʊd/', chineseMeaning: '下载', englishDefinition: 'to transfer data from the internet to a device', sense: 'get data from internet', collocations: ['download file', 'download speed', 'free download'], paraphrases: ['transfer', 'save', 'retrieve'] },
  { word: 'encryption', topic: 'technology', partOfSpeech: 'n.', ipa: '/ɪnˈkrɪpʃn/', chineseMeaning: '加密', englishDefinition: 'the process of converting data into code', sense: 'data protection', collocations: ['data encryption', 'strong encryption', 'use encryption'], paraphrases: ['coding', 'encoding', 'cipher'] },
  { word: 'hardware', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˈhɑːdweə/', chineseMeaning: '硬件', englishDefinition: 'the physical parts of a computer system', sense: 'physical equipment', collocations: ['computer hardware', 'hardware components', 'upgrade hardware'], paraphrases: ['equipment', 'machinery', 'devices'] },
  { word: 'innovation', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˌɪnəˈveɪʃn/', chineseMeaning: '创新', englishDefinition: 'a new method, idea, or product', sense: 'new development', collocations: ['technological innovation', 'drive innovation', 'foster innovation'], paraphrases: ['invention', 'creation', 'breakthrough'] },
  { word: 'interface', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˈɪntəfeɪs/', chineseMeaning: '界面', englishDefinition: 'a point where a user interacts with a system', sense: 'interaction point', collocations: ['user interface', 'graphical interface', 'touch interface'], paraphrases: ['UI', 'dashboard', 'control panel'] },
  { word: 'internet', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˈɪntənet/', chineseMeaning: '互联网', englishDefinition: 'a global computer network', sense: 'worldwide network', collocations: ['access the internet', 'internet connection', 'internet usage'], paraphrases: ['web', 'net', 'online world'] },
  { word: 'network', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˈnetwɜːk/', chineseMeaning: '网络', englishDefinition: 'a group of interconnected computers', sense: 'connected system', collocations: ['computer network', 'network security', 'social network'], paraphrases: ['web', 'grid', 'system'] },
  { word: 'platform', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˈplætfɔːm/', chineseMeaning: '平台', englishDefinition: 'a digital environment for running applications', sense: 'software environment', collocations: ['social media platform', 'digital platform', 'gaming platform'], paraphrases: ['system', 'service', 'framework'] },
  { word: 'processor', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˈprəʊsesə/', chineseMeaning: '处理器', englishDefinition: 'the central processing unit of a computer', sense: 'computing brain', collocations: ['fast processor', 'computer processor', 'multi-core processor'], paraphrases: ['CPU', 'chip', 'microprocessor'] },
  { word: 'robotics', topic: 'technology', partOfSpeech: 'n.', ipa: '/rəʊˈbɒtɪks/', chineseMeaning: '机器人技术', englishDefinition: 'the branch of technology dealing with robots', sense: 'robot technology', collocations: ['advanced robotics', 'industrial robotics', 'robotics industry'], paraphrases: ['automation', 'mechanization', 'AI'] },
  { word: 'software', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˈsɒftweə/', chineseMeaning: '软件', englishDefinition: 'programs and data for computers', sense: 'computer programs', collocations: ['software development', 'install software', 'software update'], paraphrases: ['programs', 'applications', 'apps'] },
  { word: 'storage', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˈstɔːrɪdʒ/', chineseMeaning: '存储', englishDefinition: 'the capacity to hold digital data', sense: 'data keeping', collocations: ['data storage', 'cloud storage', 'storage device'], paraphrases: ['memory', 'capacity', 'drive'] },
  { word: 'surveillance', topic: 'technology', partOfSpeech: 'n.', ipa: '/səˈveɪləns/', chineseMeaning: '监控', englishDefinition: 'close observation using technology', sense: 'electronic monitoring', collocations: ['video surveillance', 'digital surveillance', 'mass surveillance'], paraphrases: ['monitoring', 'observation', 'tracking'] },
  { word: 'telecommunication', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˌtelikəˌmjuːnɪˈkeɪʃn/', chineseMeaning: '电信', englishDefinition: 'communication over distance using technology', sense: 'distance communication', collocations: ['telecommunication industry', 'telecommunication network', 'telecommunication services'], paraphrases: ['telecom', 'communications', 'connectivity'] },
  { word: 'upgrade', topic: 'technology', partOfSpeech: 'v.', ipa: '/ˈʌpɡreɪd/', chineseMeaning: '升级', englishDefinition: 'to improve to a newer or better version', sense: 'make better', collocations: ['upgrade system', 'upgrade software', 'upgrade to'], paraphrases: ['improve', 'update', 'enhance'] },
  { word: 'virtual', topic: 'technology', partOfSpeech: 'adj.', ipa: '/ˈvɜːtʃuəl/', chineseMeaning: '虚拟的', englishDefinition: 'existing in digital form rather than physical', sense: 'computer-generated', collocations: ['virtual reality', 'virtual meeting', 'virtual world'], paraphrases: ['digital', 'online', 'simulated'] },
  { word: 'wireless', topic: 'technology', partOfSpeech: 'adj.', ipa: '/ˈwaɪələs/', chineseMeaning: '无线的', englishDefinition: 'using radio waves instead of wires', sense: 'cordless technology', collocations: ['wireless network', 'wireless technology', 'wireless connection'], paraphrases: ['cordless', 'Wi-Fi', 'radio'] },
  { word: 'artificial', topic: 'technology', partOfSpeech: 'adj.', ipa: '/ˌɑːtɪˈfɪʃl/', chineseMeaning: '人工的', englishDefinition: 'made by humans rather than occurring naturally', sense: 'human-made', collocations: ['artificial intelligence', 'artificial light', 'artificial sweetener'], paraphrases: ['synthetic', 'man-made', 'manufactured'] },
  { word: 'cloud', topic: 'technology', partOfSpeech: 'n.', ipa: '/klaʊd/', chineseMeaning: '云计算', englishDefinition: 'remote servers accessed over the internet', sense: 'online storage system', collocations: ['cloud computing', 'cloud storage', 'cloud service'], paraphrases: ['remote server', 'online storage', 'web hosting'] },
  { word: 'coding', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˈkəʊdɪŋ/', chineseMeaning: '编程', englishDefinition: 'the process of writing computer programs', sense: 'programming', collocations: ['learn coding', 'coding skills', 'coding language'], paraphrases: ['programming', 'development', 'coding'] },
  { word: 'drone', topic: 'technology', partOfSpeech: 'n.', ipa: '/drəʊn/', chineseMeaning: '无人机', englishDefinition: 'an unmanned aircraft controlled remotely', sense: 'unmanned flying device', collocations: ['military drone', 'delivery drone', 'fly a drone'], paraphrases: ['UAV', 'unmanned aircraft', 'quadcopter'] },

  // === ENVIRONMENT (+9 words, 71→80) ===
  { word: 'biodiversity', topic: 'environment', partOfSpeech: 'n.', ipa: '/ˌbaɪəʊdaɪˈvɜːsəti/', chineseMeaning: '生物多样性', englishDefinition: 'variety of life in an ecosystem', sense: 'variety of species', collocations: ['protect biodiversity', 'loss of biodiversity', 'rich biodiversity'], paraphrases: ['ecological variety', 'species diversity', 'biological diversity'] },
  { word: 'conservation', topic: 'environment', partOfSpeech: 'n.', ipa: '/ˌkɒnsəˈveɪʃn/', chineseMeaning: '保护', englishDefinition: 'protection and preservation of natural resources', sense: 'environmental protection', collocations: ['wildlife conservation', 'energy conservation', 'nature conservation'], paraphrases: ['preservation', 'protection', 'safeguarding'] },
  { word: 'ecosystem', topic: 'environment', partOfSpeech: 'n.', ipa: '/ˈiːkəʊsɪstəm/', chineseMeaning: '生态系统', englishDefinition: 'a biological community of interacting organisms', sense: 'natural system', collocations: ['marine ecosystem', 'fragile ecosystem', 'ecosystem services'], paraphrases: ['habitat', 'environment', 'biome'] },
  { word: 'emission', topic: 'environment', partOfSpeech: 'n.', ipa: '/ɪˈmɪʃn/', chineseMeaning: '排放', englishDefinition: 'the release of gases into the atmosphere', sense: 'gas release', collocations: ['carbon emission', 'reduce emissions', 'greenhouse gas emission'], paraphrases: ['release', 'output', 'discharge'] },
  { word: 'extinction', topic: 'environment', partOfSpeech: 'n.', ipa: '/ɪkˈstɪŋkʃn/', chineseMeaning: '灭绝', englishDefinition: 'the complete disappearance of a species', sense: 'species loss', collocations: ['face extinction', 'mass extinction', 'prevent extinction'], paraphrases: ['disappearance', 'die-out', 'extirpation'] },
  { word: 'habitat', topic: 'environment', partOfSpeech: 'n.', ipa: '/ˈhæbɪtæt/', chineseMeaning: '栖息地', englishDefinition: 'the natural home of an animal or plant', sense: 'natural environment', collocations: ['natural habitat', 'destroy habitat', 'wildlife habitat'], paraphrases: ['home', 'environment', 'territory'] },
  { word: 'pollution', topic: 'environment', partOfSpeech: 'n.', ipa: '/pəˈluːʃn/', chineseMeaning: '污染', englishDefinition: 'harmful substances in the environment', sense: 'environmental contamination', collocations: ['air pollution', 'water pollution', 'reduce pollution'], paraphrases: ['contamination', 'toxicity', 'impurity'] },
  { word: 'renewable', topic: 'environment', partOfSpeech: 'adj.', ipa: '/rɪˈnjuːəbl/', chineseMeaning: '可再生的', englishDefinition: 'able to be replenished naturally', sense: 'sustainable resource', collocations: ['renewable energy', 'renewable resource', 'renewable source'], paraphrases: ['sustainable', 'unlimited', 'clean'] },
  { word: 'sustainability', topic: 'environment', partOfSpeech: 'n.', ipa: '/səˌsteɪnəˈbɪləti/', chineseMeaning: '可持续性', englishDefinition: 'the ability to maintain over the long term', sense: 'long-term viability', collocations: ['environmental sustainability', 'promote sustainability', 'achieve sustainability'], paraphrases: ['durability', 'longevity', 'continuity'] }
];

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function buildContexts(item) {
  return buildExpansionContexts(item);
}

function buildBundleId(existingIds, topic, word) {
  let counter = 1;
  let bundleId = `${topic}_${word}_batch3_${String(counter).padStart(2, '0')}`;
  while (existingIds.has(bundleId)) {
    counter += 1;
    bundleId = `${topic}_${word}_batch3_${String(counter).padStart(2, '0')}`;
  }
  existingIds.add(bundleId);
  return bundleId;
}

function main() {
  const foundation = loadJson(FOUNDATION_FILE);
  const bundles = Array.isArray(foundation.bundles) ? foundation.bundles : [];
  const existingWords = new Set(bundles.map(b => String(b.word).toLowerCase()));
  const existingIds = new Set(bundles.map(b => b.bundleId));

  const newBundles = [];
  const skipped = [];
  const added = [];

  for (const item of BATCH_3) {
    if (existingWords.has(item.word.toLowerCase())) {
      skipped.push(item.word);
      continue;
    }

    const bundleId = buildBundleId(existingIds, item.topic, item.word);

    // Add to existingWords immediately to prevent duplicates within this batch
    existingWords.add(item.word.toLowerCase());

    newBundles.push({
      bundleId,
      word: item.word,
      lemma: item.word,
      ipa: item.ipa,
      partOfSpeech: item.partOfSpeech,
      sense: item.sense,
      englishDefinition: item.englishDefinition,
      chineseMeaning: item.chineseMeaning,
      topic: item.topic,
      taskTypes: ['reading', 'writing', 'speaking'],
      register: 'formal',
      collocations: item.collocations,
      paraphrases: item.paraphrases,
      confusions: [],
      contexts: buildContexts(item),
      productionPrompt: {
        mode: 'writing',
        instruction: `Use "${item.word}" in one IELTS-style sentence about ${item.topic}.`
      },
      sourceQuality: {
        relevanceScore: 5,
        transferabilityScore: 4,
        outputUtilityScore: 5,
        exampleQualityScore: 4,
        decision: 'keep'
      },
      draft: false,
      sourceCategory: 'topic-expansion-batch3'
    });

    added.push({ word: item.word, topic: item.topic });
  }

  const mergedBundles = [...bundles, ...newBundles];
  foundation.bundles = mergedBundles;
  foundation.totalBundles = mergedBundles.length;
  foundation.generatedAt = new Date().toISOString();

  writeJson(FOUNDATION_FILE, foundation);

  const topicCounts = mergedBundles.reduce((acc, b) => {
    acc[b.topic] = (acc[b.topic] || 0) + 1;
    return acc;
  }, {});

  console.log(JSON.stringify({
    added: added.length,
    skipped: skipped.length,
    newFoundationTotal: mergedBundles.length,
    topicCounts
  }, null, 2));
}

main();
