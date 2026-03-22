const fs = require('fs');
const core = JSON.parse(fs.readFileSync('public/data/ielts-core-500.json', 'utf8'));

const chineseIssues = core.bundles.filter(b => {
  const cm = b.chineseMeaning || '';
  const hasMojibake = /[\u0000-\u001F]/.test(cm);
  const hasGarbled = /[锟斤拷烫乱]/.test(cm);
  const isEmpty = !cm || cm.trim() === '';
  return hasMojibake || hasGarbled || isEmpty;
});

console.log('Chinese meaning issues:', chineseIssues.length);
console.log('\nProblem entries:');
chineseIssues.forEach(b => {
  const cm = b.chineseMeaning || '';
  const issue = !cm || cm.trim() === '' ? 'EMPTY' : 'MOJIBAKE';
  console.log(`- ${b.word} [${issue}]: "${cm.substring(0, 50)}..."`);
});