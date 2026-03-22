/**
 * IELTS Core Expansion Candidates 质量审计脚本 v3
 *
 * 直接审计 expansion reviewed 文件中的 168 条候选词
 * 检查问题：
 * - 模板化 context
 * - collocation / paraphrase 过弱
 * - 词本身的 IELTS 核心价值
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { readJson, writeJson } from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const EXPANSION_REVIEWED_FILE = path.join(DATA_DIR, 'ielts-core-expansion-reviewed.json');

// 模板化 context 的特征
const TEMPLATE_PATTERNS = [
  /Research has shown that \w+ plays/i,
  /In IELTS essays, \w+ (is often used|can be used)/i,
  /When discussing \w+, candidates can use/i,
  /Scientists have documented how \w+ affects/i,
  /Policy analysts have debated the role of/i,
  /Health experts have examined how \w+ influences/i,
  /Studies have shown that \w+ significantly affects/i,
  /Recent studies indicate that \w+ is transforming/i
];

// 过弱的 collocation 模式
const WEAK_COLLOCATION_PATTERNS = [
  /^\w+ effectively$/i,
  /^\w+ significantly$/i,
  /^\w+ carefully$/i,
  /^\w+ change$/i,
  /^\w+ impact$/i,
  /^\w+ issue$/i,
  /^\w+ trend$/i,
  /to \w+$/i  // 像 "to contend" 这种
];

// 过弱的 paraphrase
const WEAK_PARAPHRASES = ['key term', 'act on', 'carry out', 'important', 'relevant'];

// ========================================
// 词的价值分类
// ========================================

// 高价值词 - IELTS Writing Task 2 常用，教学价值高
const HIGH_VALUE_WORDS = new Set([
  // 学术论证动词 - Task 2 高频
  'advocate', 'oppose', 'acknowledge', 'elaborate', 'fluctuate', 'stabilize', 'escalate', 'diminish',
  'transform', 'evolve', 'emerge', 'prevail', 'persist', 'outweigh', 'trigger', 'stem',
  'underscore', 'amplify', 'subside', 'recede',
  // 高分形容词 - 写作替换词
  'substantial', 'considerable', 'favorable', 'constructive', 'productive', 'fruitful', 'rewarding',
  'valuable', 'adverse', 'counterproductive', 'undesirable', 'detrimental', 'pivotal', 'decisive',
  'influential', 'notable', 'prominent', 'divergent', 'rising', 'declining',
  'mounting', 'waning', 'diminishing', 'shrinking', 'burgeoning',
  // 话题核心名词 - Task 2 高频话题
  'sustainability', 'legislation', 'accountability', 'transparency', 'curriculum', 'literacy',
  'competency', 'proficiency', 'attainment', 'enrollment', 'emission', 'conservation',
  'biodiversity', 'automation', 'innovation', 'breakthrough', 'connectivity', 'wellbeing',
  'mortality', 'prevalence', 'outbreak', 'pandemic', 'epidemic', 'vaccination', 'immunity',
  'intervention', 'subsidy', 'incentive', 'precedent', 'spectrum', 'disparity', 'phenomenon',
  'premise', 'implication', 'deterrent', 'controversy', 'consensus', 'stance', 'perspective',
  'similarity', 'distinction', 'differentiation',
  // 同义词家族 - Writing 常用替换
  'surge', 'soar', 'plummet', 'dwindle'
]);

// 边缘词 - 过于正式/生僻，可能不适合大多数考生
const MARGINAL_WORDS = new Set([
  'obsolescence', 'jurisdiction', 'bipartisan', 'sovereign', 'numeracy', 'morbidity',
  'deleterious', 'pernicious', 'salient', 'elucidate', 'contend', 'rebut', 'corroborate',
  'substantiate', 'refute', 'precipitate', 'engender', 'ramification',
  'paradigm',  // 虽然是学术词，但对普通考生可能过于抽象
  'analogous', 'ensuing', 'consequent', 'comparable',
  'indispensable', 'imperative', 'paramount',  // 过于正式
  'renewable', 'non-renewable', 'biodegradable',  // 专门术语
  'sedentary', 'nutritious', 'contagious', 'chronic', 'acute',  // 健康专门词
  'vocational', 'compulsory', 'extracurricular', 'standardized', 'remedial'  // 教育专门词
]);

// 低价值词 - 应该从 Core 剔除
const LOW_VALUE_WORDS = new Set([
  'obsolescence', 'jurisdiction', 'morbidity', 'cybersecurity', 'surveillance',
  'pernicious', 'deleterious', 'salient', 'elucidate', 'corroborate',
  'digitization',  // 过于技术
  'bipartisan', 'sovereign',  // 政治专门词
  'electoral', 'legislative', 'administrative',  // 政府专门词
  'cutting-edge', 'obsolete', 'sophisticated',  // 技术形容词，过于泛化
  'preventable', 'sedentary', 'nutritious', 'contagious', 'acute'  // 健康专门词
]);

function hasTemplateContext(examples) {
  if (!Array.isArray(examples)) return true;
  return examples.some(ex => {
    const text = ex.sentence || '';
    return TEMPLATE_PATTERNS.some(pattern => pattern.test(text));
  });
}

function hasWeakCollocations(collocations) {
  if (!Array.isArray(collocations) || collocations.length < 2) return true;
  const weakCount = collocations.filter(col =>
    WEAK_COLLOCATION_PATTERNS.some(pattern => pattern.test(col))
  ).length;
  return weakCount >= Math.ceil(collocations.length / 2);
}

function hasWeakParaphrases(paraphrases) {
  if (!Array.isArray(paraphrases) || paraphrases.length < 2) return true;
  return paraphrases.some(p => WEAK_PARAPHRASES.includes(p.toLowerCase()));
}

function classifyWord(word) {
  const wordLower = word.toLowerCase();
  if (LOW_VALUE_WORDS.has(wordLower)) return 'low-value';
  if (HIGH_VALUE_WORDS.has(wordLower)) return 'high-value';
  if (MARGINAL_WORDS.has(wordLower)) return 'marginal';
  return 'acceptable';
}

function auditCandidate(candidate) {
  const issues = [];
  const wordLower = candidate.word.toLowerCase();

  // 获取 collocations 和 paraphrases
  const collocations = candidate.editorCollocations || [];
  const paraphrases = candidate.editorParaphrases || [];

  // 1. 模板化 context
  if (hasTemplateContext(candidate.examples)) {
    issues.push('template-context');
  }

  // 2. 过弱的 collocation
  if (hasWeakCollocations(collocations)) {
    issues.push('weak-collocations');
  }

  // 3. 过弱的 paraphrase
  if (hasWeakParaphrases(paraphrases)) {
    issues.push('weak-paraphrases');
  }

  // 4. 词的价值分类
  const quality = classifyWord(candidate.word);
  if (quality === 'low-value') {
    issues.push('low-value-word');
  } else if (quality === 'marginal') {
    issues.push('marginal-word');
  }

  return {
    word: candidate.word,
    topic: candidate.topics?.[0] || 'unknown',
    partOfSpeech: candidate.partOfSpeech,
    sourceCategory: candidate.sourceCategory,
    issues,
    quality,
    issueCount: issues.length,
    collocations: collocations.slice(0, 3),
    paraphrases: paraphrases.slice(0, 3)
  };
}

function main() {
  console.log('=== IELTS Core Expansion Candidates 质量审计 v3 ===\n');

  // 读取 expansion reviewed
  const data = readJson(EXPANSION_REVIEWED_FILE);
  const candidates = data.candidates || [];

  console.log(`总候选词数: ${candidates.length}`);

  // 审计每个候选词
  const auditResults = candidates.map(auditCandidate);

  // 统计
  const issuesByType = {};
  const issuesBySource = {};
  const qualityStats = {
    'high-value': 0,
    'acceptable': 0,
    'marginal': 0,
    'low-value': 0
  };

  auditResults.forEach(result => {
    result.issues.forEach(issue => {
      issuesByType[issue] = (issuesByType[issue] || 0) + 1;
    });
    qualityStats[result.quality] = (qualityStats[result.quality] || 0) + 1;

    const source = result.sourceCategory || 'unknown';
    if (!issuesBySource[source]) {
      issuesBySource[source] = { total: 0, issues: 0 };
    }
    issuesBySource[source].total++;
    if (result.issues.length > 0) {
      issuesBySource[source].issues++;
    }
  });

  const wordsWithIssues = auditResults.filter(r => r.issues.length > 0);

  console.log('\n=== 问题统计 ===');
  console.log(`有问题的词数: ${wordsWithIssues.length}/${candidates.length}`);

  console.log('\n按问题类型:');
  Object.entries(issuesByType)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

  console.log('\n按来源统计:');
  Object.entries(issuesBySource)
    .forEach(([source, stats]) => {
      const rate = ((stats.issues / stats.total) * 100).toFixed(1);
      console.log(`  ${source}: ${stats.issues}/${stats.total} 有问题 (${rate}%)`);
    });

  console.log('\n质量分布:');
  Object.entries(qualityStats).forEach(([quality, count]) => {
    console.log(`  ${quality}: ${count}`);
  });

  // 分层抽样审计
  console.log('\n=== 分层抽样审计 ===');

  // 按来源抽样
  const bySource = {};
  auditResults.forEach(r => {
    const source = r.sourceCategory || 'unknown';
    if (!bySource[source]) bySource[source] = [];
    bySource[source].push(r);
  });

  let sampledCount = 0;
  const sampleResults = [];

  Object.entries(bySource).forEach(([source, results]) => {
    // 每个来源抽 3-5 个
    const sampleSize = Math.min(5, results.length);
    const sampled = results.sort(() => Math.random() - 0.5).slice(0, sampleSize);

    console.log(`\n【${source}】抽样 ${sampleSize} 个:`);
    sampled.forEach(r => {
      const status = r.quality === 'low-value' ? '❌' :
                     r.quality === 'marginal' ? '⚠️' :
                     r.quality === 'high-value' ? '✅' : '○';
      console.log(`  ${status} ${r.word} (${r.topic}): ${r.issues.join(', ') || '无明显问题'}`);
      sampleResults.push(r);
    });
    sampledCount += sampleSize;
  });

  console.log(`\n抽样总数: ${sampledCount}`);

  // 低价值词列表
  const lowValueWords = auditResults.filter(r => r.quality === 'low-value');
  console.log(`\n=== 建议剔除的低价值词: ${lowValueWords.length} 个 ===`);
  lowValueWords.forEach(r => {
    console.log(`  ❌ ${r.word} (${r.sourceCategory}): ${r.issues.join(', ')}`);
  });

  // 边缘词列表
  const marginalWords = auditResults.filter(r => r.quality === 'marginal');
  console.log(`\n=== 边缘词（需人工确认）: ${marginalWords.length} 个 ===`);
  marginalWords.slice(0, 20).forEach(r => {
    console.log(`  ⚠️ ${r.word} (${r.sourceCategory}): ${r.issues.filter(i => !i.includes('marginal')).join(', ') || '可能过于正式/生僻'}`);
  });

  // 高价值词统计
  const highValueWords = auditResults.filter(r => r.quality === 'high-value');
  console.log(`\n=== 高价值词（强烈推荐）: ${highValueWords.length} 个 ===`);
  highValueWords.slice(0, 15).forEach(r => {
    const extraIssues = r.issues.filter(i => !i.includes('high-value'));
    console.log(`  ✅ ${r.word} (${r.sourceCategory}): ${extraIssues.join(', ') || '质量良好'}`);
  });

  // 问题最多的词
  const worstWords = auditResults
    .filter(r => r.issueCount >= 2)
    .sort((a, b) => b.issueCount - a.issueCount);

  console.log(`\n=== 问题最多的词 (>=2 个问题): ${worstWords.length} 个 ===`);
  worstWords.slice(0, 15).forEach(r => {
    console.log(`  ${r.word} (${r.sourceCategory}): ${r.issues.join(', ')}`);
  });

  // 输出详细报告
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalCandidates: candidates.length,
      wordsWithIssues: wordsWithIssues.length,
      issuesByType,
      qualityStats
    },
    sampledWords: sampleResults.map(r => ({
      word: r.word,
      topic: r.topic,
      sourceCategory: r.sourceCategory,
      quality: r.quality,
      issues: r.issues
    })),
    lowValueWords: lowValueWords.map(r => ({
      word: r.word,
      topic: r.topic,
      sourceCategory: r.sourceCategory,
      issues: r.issues
    })),
    marginalWords: marginalWords.map(r => ({
      word: r.word,
      topic: r.topic,
      sourceCategory: r.sourceCategory,
      issues: r.issues
    })),
    highValueWords: highValueWords.map(r => ({
      word: r.word,
      topic: r.topic,
      sourceCategory: r.sourceCategory
    })),
    recommendations: {
      remove: lowValueWords.map(r => r.word),
      review: marginalWords.map(r => r.word),
      keep: highValueWords.map(r => r.word)
    }
  };

  const reportFile = path.join(DATA_DIR, 'ielts-expansion-quality-audit.json');
  writeJson(reportFile, report);

  console.log(`\n=== 完成 ===`);
  console.log(`审计报告: ${reportFile}`);

  // 最终建议
  console.log('\n=== 最终建议 ===');
  console.log(`1. 剔除 ${lowValueWords.length} 个低价值词`);
  console.log(`2. 人工审核 ${marginalWords.length} 个边缘词`);
  console.log(`3. 优先保留 ${highValueWords.length} 个高价值词`);
  console.log(`4. 修复 ${issuesByType['template-context'] || 0} 个模板化 context`);
  console.log(`5. 增强 ${issuesByType['weak-collocations'] || 0} 个过弱的 collocation`);
}

main();