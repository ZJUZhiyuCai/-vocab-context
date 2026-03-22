/**
 * IELTS Core 质量精修脚本 - 2026-03-22
 *
 * 目标：
 * 1. 修复 IPA 格式（添加斜杠）
 * 2. 修复无效 collocation
 * 3. 修复弱 paraphrase
 * 4. 补充缺失的中文释义
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { readJson, writeJson } from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REVIEWED_FILE = path.join(__dirname, '../data/ielts-core-500-reviewed.json');

// IPA 修正映射（补充斜杠）
function fixIpaFormat(ipa) {
  if (!ipa) return ipa;
  // 如果已经正确格式化，直接返回
  if (ipa.startsWith('/') && ipa.endsWith('/')) return ipa;
  // 添加斜杠
  return `/${ipa}/`;
}

// 需要修复的特定词汇配置
const wordFixes = {
  consequently: {
    collocations: ['consequently lead to', 'consequently result in', 'as a consequence'],
    notes: 'Removed invalid collocation "and consequently"'
  },
  significant: {
    paraphrases: ['substantial', 'considerable', 'noteworthy', 'meaningful'],
    notes: 'Improved weak paraphrase "important"'
  },
  valuable: {
    paraphrases: ['invaluable', 'beneficial', 'worthwhile', 'precious'],
    notes: 'Improved weak paraphrase "useful"'
  },
  essential: {
    paraphrases: ['crucial', 'indispensable', 'vital', 'fundamental'],
    notes: 'Improved weak paraphrase "key"'
  },
  influential: {
    paraphrases: ['powerful', 'impactful', 'persuasive', 'authoritative'],
    notes: 'Improved weak paraphrase "significant"'
  },
  distinguished: {
    paraphrases: ['renowned', 'celebrated', 'notable', 'eminent'],
    notes: 'Improved weak paraphrase "important"'
  }
};

function applyFixes() {
  const data = readJson(REVIEWED_FILE);
  let fixedCount = 0;
  const fixes = [];

  data.candidates.forEach(entry => {
    if (!entry.approved) return;

    let modified = false;

    // 1. 修复 IPA 格式
    if (entry.ipa && !entry.ipa.startsWith('/')) {
      const oldIpa = entry.ipa;
      entry.ipa = fixIpaFormat(entry.ipa);
      if (entry.ipa !== oldIpa) {
        modified = true;
        fixes.push(`[IPA] ${entry.key}: "${oldIpa}" → "${entry.ipa}"`);
      }
    }

    // 2. 应用特定词汇修复
    if (wordFixes[entry.key]) {
      const fix = wordFixes[entry.key];

      if (fix.collocations && entry.editorCollocations) {
        entry.editorCollocations = fix.collocations;
        modified = true;
        fixes.push(`[Collocation] ${entry.key}: ${fix.notes}`);
      }

      if (fix.paraphrases && entry.editorParaphrases) {
        entry.editorParaphrases = fix.paraphrases;
        modified = true;
        fixes.push(`[Paraphrase] ${entry.key}: ${fix.notes}`);
      }
    }

    if (modified) fixedCount++;
  });

  // 保存修改
  writeJson(REVIEWED_FILE, data);

  console.log(`\n=== IELTS Core Quality Fixes ===\n`);
  console.log(`Total entries modified: ${fixedCount}`);
  console.log(`\nFixes applied:\n`);
  fixes.forEach(f => console.log(`  - ${f}`));

  return { fixedCount, fixes };
}

applyFixes();