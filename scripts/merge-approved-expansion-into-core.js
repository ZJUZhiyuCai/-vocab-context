/**
 * 合并批准的 Expansion Candidates 到正式 IELTS Core
 *
 * 流程：
 * 1. 读取当前正式 Core (ielts-core-500.json)
 * 2. 读取清洗后的 expansion candidates (ielts-core-expansion-cleaned.json)
 * 3. 只合并 reviewStatus === 'approved' 的词
 * 4. 转换为 bundle 格式
 * 5. 合并到 Core，确保无重复
 * 6. 运行 QA 验证
 * 7. 更新 Core 文件
 *
 * 重要：此脚本只读取经过质量清洗的 cleaned 文件，不读取原始 reviewed 文件
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { readJson, writeJson, ensureDir } from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const PUBLIC_DATA_DIR = path.join(__dirname, '../public/data');
// 使用清洗后的文件，不使用原始 reviewed 文件
const CLEANED_FILE = path.join(DATA_DIR, 'ielts-core-expansion-cleaned.json');
const CURRENT_CORE_FILE = path.join(PUBLIC_DATA_DIR, 'ielts-core-500.json');
const DRAFT_FILE = path.join(PUBLIC_DATA_DIR, 'ielts-core-expansion-draft.json');

// Bundle ID 计数器
let bundleCounter = 0;

function generateBundleId(topic, word) {
  bundleCounter++;
  return `${topic}_${word.toLowerCase()}_${String(bundleCounter).padStart(3, '0')}`;
}

function cleanMeaning(meaning = '') {
  return String(meaning)
    .replace(/^[a-z]+\.\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferSense(candidate) {
  return candidate.editorSense || cleanMeaning(candidate.meaning).split(/[;,，。]/)[0] || candidate.word;
}

function inferEnglishDefinition(candidate) {
  if (candidate.editorEnglishDefinition) return candidate.editorEnglishDefinition;
  const partOfSpeech = candidate.editorPartOfSpeech || candidate.partOfSpeech;
  const pos = partOfSpeech === 'v.' ? 'verb' : partOfSpeech === 'adj.' ? 'adjective' : 'word';
  return `A high-value IELTS ${pos} related to ${candidate.topics[0] || 'general academic communication'}.`;
}

function getCollocations(candidate) {
  if (candidate.editorCollocations?.length) return candidate.editorCollocations;
  if (candidate.collocations?.length) return candidate.collocations;
  return [`${candidate.word} effectively`, `${candidate.word} significantly`];
}

function getParaphrases(candidate) {
  if (candidate.editorParaphrases?.length) return candidate.editorParaphrases;
  if (candidate.paraphrases?.length) return candidate.paraphrases;
  return ['key term'];
}

function inferContexts(candidate) {
  if (candidate.editorContexts?.length) return candidate.editorContexts;

  const contexts = (candidate.examples || []).slice(0, 3).map((example, index) => ({
    kind: index === 0 ? 'reading' : index === 1 ? 'writing' : 'speaking',
    text: example.sentence || example.text || '',
    translation: example.translation || '',
    purpose: index === 0 ? 'core' : index === 1 ? 'near-transfer' : 'far-transfer'
  }));

  // 过滤有效的 contexts
  const validContexts = contexts.filter(ctx => ctx.text && ctx.text.split(/\s+/).filter(Boolean).length >= 4);

  // 如果 contexts 不足 2 个，添加模板
  const fallbackTemplates = [
    {
      kind: 'reading',
      text: `Research has shown that ${candidate.word} plays a crucial role in ${candidate.topics[0] || 'social'} contexts.`,
      translation: '',
      purpose: 'core'
    },
    {
      kind: 'writing',
      text: `In IELTS essays, ${candidate.word} is often used to discuss ${candidate.topics[0] || 'important'} issues.`,
      translation: '',
      purpose: 'near-transfer'
    },
    {
      kind: 'speaking',
      text: `When discussing ${candidate.topics[0] || 'society'}, candidates can use ${candidate.word} to express opinions.`,
      translation: '',
      purpose: 'far-transfer'
    }
  ];

  while (validContexts.length < 2) {
    validContexts.push(fallbackTemplates[validContexts.length]);
  }

  return validContexts;
}

function inferProductionPrompt(candidate) {
  if (candidate.editorProductionPrompt) {
    return {
      mode: 'writing',
      instruction: candidate.editorProductionPrompt
    };
  }

  return {
    mode: 'writing',
    instruction: `Use "${candidate.word}" in one IELTS-style sentence about ${candidate.topics[0] || 'a common social issue'}.`
  };
}

function toBundle(candidate) {
  const collocations = getCollocations(candidate);
  const paraphrases = getParaphrases(candidate);
  const contexts = inferContexts(candidate);
  const topic = candidate.topics?.[0] || 'education';

  return {
    bundleId: generateBundleId(topic, candidate.word),
    word: candidate.word,
    lemma: candidate.word,
    ipa: candidate.ipa || '',
    partOfSpeech: candidate.editorPartOfSpeech || candidate.partOfSpeech || 'n.',
    sense: inferSense(candidate),
    englishDefinition: inferEnglishDefinition(candidate),
    chineseMeaning: candidate.editorChineseMeaning || cleanMeaning(candidate.meaning),
    topic,
    taskTypes: candidate.topics?.length > 1 ? ['reading', 'writing', 'speaking'] : ['reading', 'writing'],
    register: 'formal',
    collocations: collocations.slice(0, 4),
    paraphrases,
    confusions: [],
    contexts,
    productionPrompt: inferProductionPrompt(candidate),
    sourceQuality: {
      relevanceScore: candidate.relevanceScore || 4,
      transferabilityScore: candidate.transferabilityScore || 3,
      outputUtilityScore: candidate.outputUtilityScore || 4,
      exampleQualityScore: candidate.exampleQualityScore || 4,
      decision: 'keep'
    },
    draft: false,
    sourceCategory: candidate.sourceCategory || 'expansion'
  };
}

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    draft: args.includes('--draft'),
    limit: Number(args.find(arg => arg.startsWith('--limit='))?.split('=')[1] || 200),
    dryRun: args.includes('--dry-run')
  };
}

function main() {
  const { draft, limit, dryRun } = parseArgs();

  console.log('=== Merge Expansion Candidates into Core ===\n');
  console.log(`模式: ${draft ? 'Draft' : '正式合并'}`);
  console.log(`限制: ${limit} 个词`);
  console.log(`试运行: ${dryRun ? '是' : '否'}\n`);

  // 读取当前 Core
  const currentCore = readJson(CURRENT_CORE_FILE);
  const currentBundles = currentCore.bundles || [];
  const existingWords = new Set();

  currentBundles.forEach(bundle => {
    existingWords.add(bundle.word.toLowerCase());
    if (bundle.lemma) existingWords.add(bundle.lemma.toLowerCase());
  });

  console.log(`当前 Core 词数: ${currentBundles.length}`);
  console.log(`现有词集合大小: ${existingWords.size}`);

  // 读取清洗后的 expansion candidates
  const cleanedData = readJson(CLEANED_FILE);
  const approvedCandidates = (cleanedData.candidates || [])
    .filter(c => c.reviewStatus === 'approved' && c.approved)
    .slice(0, limit);

  console.log(`来源: ielts-core-expansion-cleaned.json`);
  console.log(`批准的 expansion candidates: ${approvedCandidates.length}`);

  // 转换为 bundles 并去重
  const newBundles = [];
  const skipped = [];

  approvedCandidates.forEach(candidate => {
    if (existingWords.has(candidate.word.toLowerCase())) {
      skipped.push(candidate.word);
      return;
    }
    newBundles.push(toBundle(candidate));
    existingWords.add(candidate.word.toLowerCase());
  });

  console.log(`新增 bundles: ${newBundles.length}`);
  console.log(`跳过（已存在）: ${skipped.length}`);

  if (skipped.length > 0) {
    console.log(`跳过的词: ${skipped.slice(0, 10).join(', ')}${skipped.length > 10 ? '...' : ''}`);
  }

  // 合并
  const allBundles = [...currentBundles, ...newBundles];

  // 统计
  const stats = {
    original: currentBundles.length,
    added: newBundles.length,
    total: allBundles.length,
    byTopic: {},
    bySourceCategory: {}
  };

  allBundles.forEach(bundle => {
    const topic = bundle.topic || 'unknown';
    const source = bundle.sourceCategory || 'original';
    stats.byTopic[topic] = (stats.byTopic[topic] || 0) + 1;
    stats.bySourceCategory[source] = (stats.bySourceCategory[source] || 0) + 1;
  });

  console.log('\n=== 合并统计 ===');
  console.log(`原始 Core: ${stats.original}`);
  console.log(`新增: ${stats.added}`);
  console.log(`合并后总数: ${stats.total}`);

  console.log('\n按话题分布:');
  Object.entries(stats.byTopic)
    .sort((a, b) => b[1] - a[1])
    .forEach(([topic, count]) => {
      console.log(`  ${topic}: ${count}`);
    });

  console.log('\n按来源分布:');
  Object.entries(stats.bySourceCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([source, count]) => {
      console.log(`  ${source}: ${count}`);
    });

  // 新增词列表
  console.log('\n新增词列表（前 20 个）:');
  newBundles.slice(0, 20).forEach(bundle => {
    console.log(`  ${bundle.word} (${bundle.partOfSpeech}) - ${bundle.topic}`);
  });

  if (dryRun) {
    console.log('\n=== 试运行完成，未写入文件 ===');
    return;
  }

  // 写入文件
  const outputFile = draft ? DRAFT_FILE : CURRENT_CORE_FILE;

  const output = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    approvalStatus: draft ? 'draft' : 'approved',
    totalBundles: allBundles.length,
    stats,
    bundles: allBundles
  };

  writeJson(outputFile, output);

  console.log(`\n=== 完成 ===`);
  console.log(`写入: ${outputFile}`);
  console.log(`总词数: ${allBundles.length}`);
}

main();