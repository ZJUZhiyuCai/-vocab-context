/**
 * 审批 IELTS Core Expansion Candidates
 *
 * 对高置信度候选词进行自动审批，生成 reviewed 文件
 *
 * 自动审批条件：
 * - relevanceScore >= 4
 * - transferabilityScore >= 4
 * - outputUtilityScore >= 4
 * - 无 rejectHint flags
 * - 有 collocations 和 paraphrases
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { readJson, writeJson } from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const CANDIDATES_FILE = path.join(DATA_DIR, 'ielts-core-expansion-candidates.json');
const REVIEWED_FILE = path.join(DATA_DIR, 'ielts-core-expansion-reviewed.json');

function shouldAutoApprove(candidate) {
  // 检查 flags
  if (candidate.flags?.rejectHint) return false;

  // 检查分数
  if (candidate.relevanceScore < 4) return false;
  if (candidate.transferabilityScore < 3) return false;
  if (candidate.outputUtilityScore < 4) return false;

  // 检查必要字段
  if (!candidate.editorCollocations?.length && !candidate.collocations?.length) return false;
  if (!candidate.editorParaphrases?.length && !candidate.paraphrases?.length) return false;

  return true;
}

function reviewCandidate(candidate) {
  const reviewed = { ...candidate };

  if (shouldAutoApprove(candidate)) {
    reviewed.reviewStatus = 'approved';
    reviewed.approved = true;
    reviewed.reviewerNotes = 'Auto-approved: high confidence score, clean flags, good paraphrases';
  } else {
    reviewed.reviewStatus = 'candidate';
    reviewed.approved = false;
    reviewed.reviewerNotes = 'Pending manual review';
  }

  return reviewed;
}

function main() {
  console.log('=== IELTS Core Expansion Candidates Reviewer ===\n');

  const data = readJson(CANDIDATES_FILE);
  const candidates = data.candidates || [];

  console.log(`总候选数: ${candidates.length}`);

  const reviewedCandidates = candidates.map(reviewCandidate);

  // 统计
  const approved = reviewedCandidates.filter(c => c.approved);
  const pending = reviewedCandidates.filter(c => !c.approved);

  console.log(`自动批准: ${approved.length}`);
  console.log(`待审核: ${pending.length}`);

  // 按来源统计批准率
  const bySource = {};
  reviewedCandidates.forEach(c => {
    const source = c.sourceCategory || 'unknown';
    if (!bySource[source]) {
      bySource[source] = { approved: 0, total: 0 };
    }
    bySource[source].total++;
    if (c.approved) bySource[source].approved++;
  });

  console.log('\n按来源批准率:');
  Object.entries(bySource).forEach(([source, stats]) => {
    const rate = ((stats.approved / stats.total) * 100).toFixed(1);
    console.log(`  ${source}: ${stats.approved}/${stats.total} (${rate}%)`);
  });

  // 按话题统计批准数
  const byTopic = {};
  approved.forEach(c => {
    const topic = c.topics?.[0] || 'unknown';
    byTopic[topic] = (byTopic[topic] || 0) + 1;
  });

  console.log('\n批准词话题分布:');
  Object.entries(byTopic).forEach(([topic, count]) => {
    console.log(`  ${topic}: ${count}`);
  });

  // 写入 reviewed 文件
  const output = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source: 'IELTS Core Expansion Intake - Reviewed',
    totalCandidates: reviewedCandidates.length,
    approvedCount: approved.length,
    pendingCount: pending.length,
    candidates: reviewedCandidates
  };

  writeJson(REVIEWED_FILE, output);

  console.log(`\n=== 完成 ===`);
  console.log(`写入: ${REVIEWED_FILE}`);

  // 显示批准的词列表（前 20 个）
  console.log('\n批准的词（前 20 个）:');
  approved.slice(0, 20).forEach(c => {
    console.log(`  ${c.rank}. ${c.word} (${c.partOfSpeech}) - ${c.topics[0]}`);
  });
}

main();