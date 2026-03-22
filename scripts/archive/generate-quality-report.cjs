const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/ielts-core-500-reviewed.json', 'utf8'));

const approved = data.candidates.filter(c => c.approved);
const candidates = data.candidates.filter(c => c.decision === 'keep' || c.decision === 'review');
const rejected = data.candidates.filter(c => c.reviewStatus === 'rejected');

// 统计 IPA 情况
const withValidIpa = approved.filter(e => e.ipa && e.ipa.startsWith('/') && e.ipa.endsWith('/'));
const withMissingIpa = approved.filter(e => !e.ipa);
const withInvalidIpa = approved.filter(e => e.ipa && (!e.ipa.startsWith('/') || !e.ipa.endsWith('/')));

// 统计编辑内容
const withEditorContexts = approved.filter(e => e.editorContexts && e.editorContexts.length > 0);
const withEditorChinese = approved.filter(e => e.editorChineseMeaning && e.editorChineseMeaning.trim() !== '');
const withEditorCollocations = approved.filter(e => e.editorCollocations && e.editorCollocations.length > 0);
const withEditorParaphrases = approved.filter(e => e.editorParaphrases && e.editorParaphrases.length > 0);

// 统计模板内容（问题）
const templatePatterns = [
  /Scientists have documented how/,
  /Research has shown that/,
  /Recent studies indicate that/
];
const withTemplateContexts = approved.filter(e =>
  e.editorContexts && e.editorContexts.some(ctx =>
    templatePatterns.some(p => p.test(ctx.text))
  )
);

// 统计 generic definitions
const withGenericDef = approved.filter(e =>
  e.editorEnglishDefinition && (
    e.editorEnglishDefinition.includes('A high-value IELTS') ||
    e.editorEnglishDefinition.includes('A useful IELTS')
  )
);

// 统计弱 paraphrase
const weakParaphrases = ['important', 'relevant', 'key', 'good', 'bad', 'big', 'small', 'useful'];
const withWeakParaphrase = approved.filter(e =>
  e.editorParaphrases && e.editorParaphrases.some(p => weakParaphrases.includes(p.toLowerCase()))
);

// 按 topic 统计
const topicCounts = {};
approved.forEach(e => {
  const topic = e.topics[0] || 'general';
  topicCounts[topic] = (topicCounts[topic] || 0) + 1;
});

// 输出报告
console.log(`# IELTS Core 质量状态报告

生成时间: ${new Date().toISOString()}

## 总体统计

| 指标 | 数量 |
|------|------|
| 已审核批准 (approved) | ${approved.length} |
| 待审核候选 (candidate) | ${candidates.length} |
| 已拒绝 (rejected) | ${rejected.length} |

## IPA 音标状态

| 状态 | 数量 | 百分比 |
|------|------|--------|
| 有效格式 (带斜杠) | ${withValidIpa.length} | ${(withValidIpa.length / approved.length * 100).toFixed(1)}% |
| 缺失 IPA | ${withMissingIpa.length} | ${(withMissingIpa.length / approved.length * 100).toFixed(1)}% |
| 格式问题 (需修复) | ${withInvalidIpa.length} | ${(withInvalidIpa.length / approved.length * 100).toFixed(1)}% |

## 编辑内容覆盖

| 字段 | 数量 | 百分比 |
|------|------|--------|
| editorContexts | ${withEditorContexts.length} | ${(withEditorContexts.length / approved.length * 100).toFixed(1)}% |
| editorChineseMeaning | ${withEditorChinese.length} | ${(withEditorChinese.length / approved.length * 100).toFixed(1)}% |
| editorCollocations | ${withEditorCollocations.length} | ${(withEditorCollocations.length / approved.length * 100).toFixed(1)}% |
| editorParaphrases | ${withEditorParaphrases.length} | ${(withEditorParaphrases.length / approved.length * 100).toFixed(1)}% |

## 质量债统计

| 问题类型 | 数量 | 状态 |
|----------|------|------|
| 模板生成的 contexts | ${withTemplateContexts.length} | ${withTemplateContexts.length === 0 ? '✅ 已清零' : '⚠️ 需修复'} |
| Generic definitions | ${withGenericDef.length} | ${withGenericDef.length === 0 ? '✅ 已清零' : '⚠️ 需修复'} |
| 弱 paraphrases | ${withWeakParaphrase.length} | ${withWeakParaphrase.length === 0 ? '✅ 已清零' : '⚠️ 需修复'} |

## Topic 分布

| Topic | 数量 |
|-------|------|
${Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).map(([topic, count]) => `| ${topic} | ${count} |`).join('\n')}

## 本次修复记录

### 2026-03-22 精修

1. **IPA 格式修复**: 为 318 个条目添加了斜杠格式
2. **无效 collocation 修复**: 修复了 \`consequently\` 的 "and consequently" 问题
3. **弱 paraphrase 改进**: 改进了 \`significant\`, \`essential\`, \`valuable\`, \`influential\` 等词的 paraphrase
4. **工作区整理**: 将一次性维护脚本移至 \`scripts/archive/\`

## 下一步建议

1. 继续为缺失 IPA 的 ${withMissingIpa.length} 个条目补充音标
2. 审核剩余 ${candidates.length} 个候选词
3. 完善 ${approved.length - withEditorChinese.length} 个缺失中文释义的条目
`);