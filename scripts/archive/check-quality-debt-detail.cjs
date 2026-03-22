const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/ielts-core-500-reviewed.json', 'utf8'));

// 获取所有 approved 条目
const approved = data.candidates.filter(c => c.approved);

console.log('=== IPA Quality Check ===\n');

// 检查 IPA 格式问题
const ipaIssues = [];
approved.forEach(entry => {
  const ipa = entry.ipa || entry.editorIpa;
  if (!ipa) {
    ipaIssues.push({ word: entry.key, issue: 'missing' });
  } else if (!ipa.startsWith('/')) {
    ipaIssues.push({ word: entry.key, issue: 'no_slash', ipa });
  }
});

console.log(`Total IPA issues: ${ipaIssues.length}`);
console.log('\nMissing IPA:');
ipaIssues.filter(i => i.issue === 'missing').slice(0, 20).forEach(i => console.log(`  - ${i.word}`));

console.log('\nIPA without slashes (sample):');
ipaIssues.filter(i => i.issue === 'no_slash').slice(0, 10).forEach(i => console.log(`  - ${i.word}: ${i.ipa}`));

// 检查弱 paraphrase
console.log('\n=== Weak Paraphrases Check ===\n');
const weakParaphrases = ['important', 'relevant', 'key', 'good', 'bad', 'big', 'small', 'useful'];
const withWeakParaphrase = approved.filter(e =>
  e.editorParaphrases && e.editorParaphrases.some(p => weakParaphrases.includes(p.toLowerCase()))
);
console.log(`Entries with weak paraphrases: ${withWeakParaphrase.length}`);
withWeakParaphrase.slice(0, 10).forEach(e => {
  console.log(`  - ${e.key}: [${e.editorParaphrases.join(', ')}]`);
});

// 检查无效 collocation
console.log('\n=== Invalid Collocations Check ===\n');
const invalidCollocPatterns = [/^and /, /^with$/, /^or /, /^to$/, /^the$/];
const withInvalidColloc = approved.filter(e =>
  e.editorCollocations && e.editorCollocations.some(c =>
    invalidCollocPatterns.some(p => p.test(c.toLowerCase()))
  )
);
console.log(`Entries with potential invalid collocations: ${withInvalidColloc.length}`);
withInvalidColloc.slice(0, 10).forEach(e => {
  console.log(`  - ${e.key}: ${e.editorCollocations.filter(c => invalidCollocPatterns.some(p => p.test(c.toLowerCase()))).join(', ')}`);
});

// 检查中文乱码
console.log('\n=== Chinese Meaning Check ===\n');
const chineseIssues = approved.filter(e => {
  const cm = e.editorChineseMeaning || e.meaning || '';
  // 检查是否有乱码（非正常中文字符）
  return cm && /[\u0000-\u001F]/.test(cm);
});
console.log(`Entries with potential encoding issues: ${chineseIssues.length}`);

// 统计没有 editorChineseMeaning 的
const noChineseMeaning = approved.filter(e => !e.editorChineseMeaning || e.editorChineseMeaning.trim() === '');
console.log(`Entries without editorChineseMeaning: ${noChineseMeaning.length}`);