const fs = require('fs');
const reviewed = JSON.parse(fs.readFileSync('data/ielts-core-500-reviewed.json', 'utf8'));
const core = JSON.parse(fs.readFileSync('public/data/ielts-core-500.json', 'utf8'));

// 获取 Core 中有中文问题的词
const chineseIssues = core.bundles.filter(b => {
  const cm = b.chineseMeaning || '';
  const hasMojibake = /[\u0000-\u001F]/.test(cm);
  return hasMojibake;
});

console.log('=== Chinese Meaning Analysis ===\n');
console.log('Total with issues in Core:', chineseIssues.length);

// 检查这些词在 reviewed 中是否有 editorChineseMeaning
const withoutEditor = [];
const withEditor = [];

chineseIssues.forEach(b => {
  const entry = reviewed.candidates.find(c => c.key === b.word && c.approved);
  if (entry) {
    if (entry.editorChineseMeaning && entry.editorChineseMeaning.trim() !== '') {
      withEditor.push({ word: b.word, editor: entry.editorChineseMeaning });
    } else {
      withoutEditor.push(b.word);
    }
  }
});

console.log('\nWith editorChineseMeaning:', withEditor.length);
console.log('Without editorChineseMeaning:', withoutEditor.length);

console.log('\n--- Words needing editorChineseMeaning ---');
withoutEditor.forEach(w => console.log(`  - ${w}`));