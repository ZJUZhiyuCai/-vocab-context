import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildExpansionContexts } from './topic-context-helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const FOUNDATION_FILE = path.join(ROOT, 'public/data/ielts-foundation.json');

// 第四批：补充 Health、Technology、Environment 至 80+
const BATCH_4 = [
  // === HEALTH (+5 words, 75→80) ===
  { word: 'allergy', topic: 'health', partOfSpeech: 'n.', ipa: '/ˈælədʒi/', chineseMeaning: '过敏', englishDefinition: 'an immune system reaction to a substance', collocations: ['have an allergy', 'food allergy', 'severe allergy'], paraphrases: ['hypersensitivity', 'reaction', 'intolerance'] },
  { word: 'cardiac', topic: 'health', partOfSpeech: 'adj.', ipa: '/ˈkɑːdiæk/', chineseMeaning: '心脏的', englishDefinition: 'relating to the heart', collocations: ['cardiac arrest', 'cardiac patient', 'cardiac surgery'], paraphrases: ['heart', 'cardiovascular', 'coronary'] },
  { word: 'immunity', topic: 'health', partOfSpeech: 'n.', ipa: '/ɪˈmjuːnəti/', chineseMeaning: '免疫力', englishDefinition: 'the ability to resist a particular infection', collocations: ['build immunity', 'natural immunity', 'strong immunity'], paraphrases: ['resistance', 'protection', 'defense'] },
  { word: 'stroke', topic: 'health', partOfSpeech: 'n.', ipa: '/strəʊk/', chineseMeaning: '中风', englishDefinition: 'a sudden interruption of blood supply to the brain', collocations: ['suffer a stroke', 'stroke patient', 'prevent stroke'], paraphrases: ['brain attack', 'cerebral accident', 'CVA'] },
  { word: 'tumor', topic: 'health', partOfSpeech: 'n.', ipa: '/ˈtjuːmə/', chineseMeaning: '肿瘤', englishDefinition: 'an abnormal growth of tissue', collocations: ['benign tumor', 'malignant tumor', 'remove tumor'], paraphrases: ['growth', 'mass', 'neoplasm'] },

  // === TECHNOLOGY (+7 words, 73→80) ===
  { word: 'biometric', topic: 'technology', partOfSpeech: 'adj.', ipa: '/ˌbaɪəʊˈmetrɪk/', chineseMeaning: '生物识别的', englishDefinition: 'using physical characteristics for identification', collocations: ['biometric data', 'biometric security', 'biometric authentication'], paraphrases: ['biological', 'identification', 'recognition'] },
  { word: 'blockchain', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˈblɒktʃeɪn/', chineseMeaning: '区块链', englishDefinition: 'a distributed digital ledger technology', collocations: ['blockchain technology', 'blockchain network', 'use blockchain'], paraphrases: ['distributed ledger', 'crypto', 'decentralized'] },
  { word: 'debug', topic: 'technology', partOfSpeech: 'v.', ipa: '/diːˈbʌɡ/', chineseMeaning: '调试', englishDefinition: 'to identify and remove errors from software', collocations: ['debug code', 'debug mode', 'help debug'], paraphrases: ['fix', 'troubleshoot', 'correct'] },
  { word: 'e-commerce', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˈiːkɒmɜːs/', chineseMeaning: '电子商务', englishDefinition: 'buying and selling goods over the internet', collocations: ['e-commerce platform', 'e-commerce business', 'online e-commerce'], paraphrases: ['online shopping', 'digital commerce', 'internet retail'] },
  { word: 'gadget', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˈɡædʒɪt/', chineseMeaning: '小工具', englishDefinition: 'a small technological device or tool', collocations: ['electronic gadget', 'new gadget', 'smart gadget'], paraphrases: ['device', 'tool', 'appliance'] },
  { word: 'nanotechnology', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˌnænəʊtekˈnɒlədʒi/', chineseMeaning: '纳米技术', englishDefinition: 'technology on an atomic or molecular scale', collocations: ['use nanotechnology', 'nanotechnology research', 'nanotechnology industry'], paraphrases: ['nanotech', 'molecular engineering', 'atomic tech'] },
  { word: 'wearable', topic: 'technology', partOfSpeech: 'n.', ipa: '/ˈweərəbl/', chineseMeaning: '可穿戴设备', englishDefinition: 'an electronic device worn on the body', collocations: ['wearable device', 'wearable technology', 'smart wearable'], paraphrases: ['smartwatch', 'fitness tracker', 'portable device'] },

  // === ENVIRONMENT (+5 words, 75→80) ===
  { word: 'afforestation', topic: 'environment', partOfSpeech: 'n.', ipa: '/əˌfɒrɪˈsteɪʃn/', chineseMeaning: '植树造林', englishDefinition: 'the process of establishing forests on land', collocations: ['promote afforestation', 'large-scale afforestation', 'afforestation project'], paraphrases: ['planting', 'reforestation', 'tree planting'] },
  { word: 'carbon', topic: 'environment', partOfSpeech: 'n.', ipa: '/ˈkɑːbən/', chineseMeaning: '碳', englishDefinition: 'a chemical element in fossil fuels', collocations: ['carbon footprint', 'carbon emissions', 'carbon neutral'], paraphrases: ['CO2', 'greenhouse gas', 'carbon dioxide'] },
  { word: 'deforestation', topic: 'environment', partOfSpeech: 'n.', ipa: '/diːˌfɒrɪˈsteɪʃn/', chineseMeaning: '森林砍伐', englishDefinition: 'the removal of trees from an area', collocations: ['stop deforestation', 'deforestation rate', 'cause deforestation'], paraphrases: ['tree removal', 'forest clearing', 'logging'] },
  { word: 'ecosystem', topic: 'environment', partOfSpeech: 'n.', ipa: '/ˈiːkəʊsɪstəm/', chineseMeaning: '生态系统', englishDefinition: 'a biological community of interacting organisms', collocations: ['healthy ecosystem', 'ecosystem balance', 'marine ecosystem'], paraphrases: ['environment', 'habitat', 'biome'] },
  { word: 'recyclable', topic: 'environment', partOfSpeech: 'adj.', ipa: '/riːˈsaɪkləbl/', chineseMeaning: '可回收的', englishDefinition: 'able to be processed and used again', collocations: ['recyclable materials', 'fully recyclable', 'easily recyclable'], paraphrases: ['reusable', 'recyclable', 'recoverable'] }
];

function loadJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function writeJson(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8'); }

function buildContexts(item) {
  return buildExpansionContexts(item);
}

function main() {
  const foundation = loadJson(FOUNDATION_FILE);
  const bundles = Array.isArray(foundation.bundles) ? foundation.bundles : [];
  const existingWords = new Set(bundles.map(b => String(b.word).toLowerCase()));
  const existingIds = new Set(bundles.map(b => b.bundleId));

  const newBundles = [];
  for (const item of BATCH_4) {
    if (existingWords.has(item.word.toLowerCase())) continue;

    // Add to existingWords immediately to prevent duplicates within this batch
    existingWords.add(item.word.toLowerCase());

    const bundleId = `${item.topic}_${item.word}_batch4_01`;
    newBundles.push({
      bundleId,
      word: item.word,
      lemma: item.word,
      ipa: item.ipa,
      partOfSpeech: item.partOfSpeech,
      sense: item.chineseMeaning,
      englishDefinition: item.englishDefinition,
      chineseMeaning: item.chineseMeaning,
      topic: item.topic,
      taskTypes: ['reading', 'writing', 'speaking'],
      register: 'formal',
      collocations: item.collocations,
      paraphrases: item.paraphrases,
      confusions: [],
      contexts: buildContexts(item),
      productionPrompt: { mode: 'writing', instruction: `Use "${item.word}" in an IELTS-style sentence.` },
      sourceQuality: { relevanceScore: 5, transferabilityScore: 4, outputUtilityScore: 5, exampleQualityScore: 4, decision: 'keep' },
      draft: false,
      sourceCategory: 'topic-expansion-batch4'
    });
  }

  foundation.bundles = [...bundles, ...newBundles];
  foundation.totalBundles = foundation.bundles.length;
  foundation.generatedAt = new Date().toISOString();
  writeJson(FOUNDATION_FILE, foundation);

  const topicCounts = foundation.bundles.reduce((acc, b) => { acc[b.topic] = (acc[b.topic] || 0) + 1; return acc; }, {});
  console.log(JSON.stringify({ added: newBundles.length, total: foundation.totalBundles, topicCounts }, null, 2));
}

main();
