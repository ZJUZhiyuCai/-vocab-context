/**
 * 收紧 IELTS Core Expansion 批准门槛
 *
 * 操作：
 * 1. 从 expansion reviewed 中剔除低价值词
 * 2. 将边缘词标记为 pending（需人工审核）
 * 3. 只保留高价值词和可接受词为 approved
 * 4. 重新生成 cleaned 版本
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { readJson, writeJson } from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const REVIEWED_FILE = path.join(DATA_DIR, 'ielts-core-expansion-reviewed.json');
const CLEANED_FILE = path.join(DATA_DIR, 'ielts-core-expansion-cleaned.json');

// 从审计报告中读取分类
const AUDIT_FILE = path.join(DATA_DIR, 'ielts-expansion-quality-audit.json');

function main() {
  console.log('=== 收紧 IELTS Core Expansion 批准门槛 ===\n');

  // 读取审计报告
  const audit = readJson(AUDIT_FILE);
  const recommendations = audit.recommendations || {};

  const removeWords = new Set(recommendations.remove || []);
  const reviewWords = new Set(recommendations.review || []);
  const keepWords = new Set(recommendations.keep || []);

  console.log(`从审计报告加载分类:`);
  console.log(`  - 剔除: ${removeWords.size} 个`);
  console.log(`  - 待审核: ${reviewWords.size} 个`);
  console.log(`  - 保留: ${keepWords.size} 个`);

  // 读取原始 reviewed 文件
  const data = readJson(REVIEWED_FILE);
  const candidates = data.candidates || [];

  console.log(`\n原始候选词数: ${candidates.length}`);

  // 分类处理
  const results = {
    removed: [],
    pending: [],
    approved: []
  };

  candidates.forEach(candidate => {
    const word = candidate.word;

    if (removeWords.has(word)) {
      // 低价值词 - 剔除
      results.removed.push({
        ...candidate,
        reviewStatus: 'rejected',
        approved: false,
        reviewerNotes: 'Rejected: low IELTS Core value'
      });
    } else if (reviewWords.has(word)) {
      // 边缘词 - 标记为待审核
      results.pending.push({
        ...candidate,
        reviewStatus: 'pending',
        approved: false,
        reviewerNotes: 'Pending: marginal word, needs manual review'
      });
    } else {
      // 高价值词和可接受词 - 批准
      results.approved.push({
        ...candidate,
        reviewStatus: 'approved',
        approved: true,
        reviewerNotes: 'Approved: high-value or acceptable word'
      });
    }
  });

  console.log('\n=== 处理结果 ===');
  console.log(`剔除: ${results.removed.length} 个`);
  console.log(`待审核: ${results.pending.length} 个`);
  console.log(`批准: ${results.approved.length} 个`);

  // 显示剔除的词
  console.log('\n剔除的词:');
  results.removed.slice(0, 15).forEach(c => {
    console.log(`  ❌ ${c.word} (${c.sourceCategory})`);
  });
  if (results.removed.length > 15) {
    console.log(`  ... 还有 ${results.removed.length - 15} 个`);
  }

  // 显示待审核的词
  console.log('\n待审核的词:');
  results.pending.slice(0, 10).forEach(c => {
    console.log(`  ⚠️ ${c.word} (${c.sourceCategory})`);
  });
  if (results.pending.length > 10) {
    console.log(`  ... 还有 ${results.pending.length - 10} 个`);
  }

  // 合并所有候选词（剔除的放在最后作为参考）
  const cleanedCandidates = [
    ...results.approved,
    ...results.pending,
    ...results.removed
  ];

  // 重新计算 rank
  cleanedCandidates.forEach((c, i) => {
    c.rank = i + 1;
  });

  // 写入清理后的文件
  const cleaned = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source: 'IELTS Core Expansion Intake - Cleaned',
    description: '经过质量审计和门槛收紧后的候选词池',
    summary: {
      original: candidates.length,
      removed: results.removed.length,
      pending: results.pending.length,
      approved: results.approved.length
    },
    totalCandidates: cleanedCandidates.length,
    approvedCount: results.approved.length,
    pendingCount: results.pending.length,
    removedCount: results.removed.length,
    candidates: cleanedCandidates
  };

  writeJson(CLEANED_FILE, cleaned);

  console.log(`\n=== 完成 ===`);
  console.log(`清理后文件: ${CLEANED_FILE}`);
  console.log(`最终批准数: ${results.approved.length}`);
  console.log(`待审核数: ${results.pending.length}`);
  console.log(`剔除数: ${results.removed.length}`);

  // 输出下一步建议
  console.log('\n=== 下一步建议 ===');
  console.log(`1. 审核清理后的文件: data/ielts-core-expansion-cleaned.json`);
  console.log(`2. 如需调整，手动修改 pending 词的 reviewStatus`);
  console.log(`3. 运行合并脚本将批准的词合并到 Core`);
}

main();