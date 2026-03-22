const fs = require('fs');
const core = JSON.parse(fs.readFileSync('public/data/ielts-core-500.json', 'utf8'));
const bundles = core.bundles;

console.log('=== Chinese Meaning Details ===\n');

const chineseIssues = bundles.filter(b => {
  const cm = b.chineseMeaning || '';
  const hasMojibake = /[\u0000-\u001F]/.test(cm);
  const hasGarbled = /[锟斤拷烫乱]/.test(cm);
  const isEmpty = !cm || cm.trim() === '';
  return hasMojibake || hasGarbled || isEmpty;
});

console.log('Total:', chineseIssues.length);
console.log('\nAll entries with Chinese issues:\n');

chineseIssues.forEach(b => {
  const cm = b.chineseMeaning || '';
  const issue = !cm || cm.trim() === '' ? 'EMPTY' : /[\u0000-\u001F]/.test(cm) ? 'MOJIBAKE' : 'GARBLED';
  console.log(`${b.word} [${issue}]:`);
  console.log(`  "${cm.substring(0, 100)}..."`);
  console.log('');
});