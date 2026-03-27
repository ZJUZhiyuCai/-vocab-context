import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildExpansionContexts } from './topic-context-helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const FOUNDATION_FILE = path.join(ROOT, 'public/data/ielts-foundation.json');

const FINAL = [
  { word: 'sterile', topic: 'health', partOfSpeech: 'adj.', ipa: '/ˈsteraɪl/', chineseMeaning: '无菌的', englishDefinition: 'free from bacteria or other microorganisms', collocations: ['sterile equipment', 'sterile environment', 'keep sterile'], paraphrases: ['germ-free', 'clean', 'hygienic'] },
  { word: 'sustainable', topic: 'environment', partOfSpeech: 'adj.', ipa: '/səˈsteɪnəbl/', chineseMeaning: '可持续的', englishDefinition: 'able to be maintained without depleting natural resources', collocations: ['sustainable development', 'sustainable practice', 'more sustainable'], paraphrases: ['eco-friendly', 'green', 'renewable'] },
  { word: 'wildlife', topic: 'environment', partOfSpeech: 'n.', ipa: '/ˈwaɪldlaɪf/', chineseMeaning: '野生动物', englishDefinition: 'animals and plants in their natural environment', collocations: ['protect wildlife', 'wildlife habitat', 'local wildlife'], paraphrases: ['animals', 'fauna', 'nature'] }
];

function loadJson(f) { return JSON.parse(fs.readFileSync(f, 'utf8')); }
function writeJson(f, d) { fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n', 'utf8'); }

function buildContexts(item) {
  return buildExpansionContexts(item);
}

function main() {
  const foundation = loadJson(FOUNDATION_FILE);
  const bundles = Array.isArray(foundation.bundles) ? foundation.bundles : [];
  const existingWords = new Set(bundles.map(b => b.word.toLowerCase()));

  let added = 0;
  for (const item of FINAL) {
    if (existingWords.has(item.word.toLowerCase())) continue;

    // Add to existingWords immediately
    existingWords.add(item.word.toLowerCase());

    foundation.bundles.push({
      bundleId: `${item.topic}_${item.word}_final_01`,
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
      sourceCategory: 'final-batch'
    });
    added++;
  }

  foundation.totalBundles = foundation.bundles.length;
  foundation.generatedAt = new Date().toISOString();
  writeJson(FOUNDATION_FILE, foundation);

  const counts = foundation.bundles.reduce((a, b) => { a[b.topic] = (a[b.topic] || 0) + 1; return a; }, {});
  console.log(JSON.stringify({ added, total: foundation.totalBundles, counts }, null, 2));
}

main();
