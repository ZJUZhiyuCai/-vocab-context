const fs = require('fs');
const core = JSON.parse(fs.readFileSync('public/data/ielts-core-500.json', 'utf8'));
const bundles = core.bundles;

console.log('=== IELTS Core 真实质量审计 ===\n');
console.log('Total bundles:', bundles.length);

// 1. Generic/Fallback Definitions
console.log('\n--- Generic/Fallback Definitions ---');
const genericPatterns = [/A high-value IELTS/, /A useful IELTS/, /related to \w+ academic/];
const genericDefs = bundles.filter(b => {
  const def = b.englishDefinition || '';
  return genericPatterns.some(p => p.test(def));
});
console.log('Count:', genericDefs.length);

// 2. Empty IPA
console.log('\n--- Empty IPA ---');
const emptyIpa = bundles.filter(b => !b.ipa || b.ipa.trim() === '' || b.ipa === '/');
console.log('Count:', emptyIpa.length);

// 3. Chinese Meaning Issues - 只检测真正的乱码
console.log('\n--- Chinese Meaning Issues ---');
const chineseIssues = bundles.filter(b => {
  const cm = b.chineseMeaning || '';
  // 只检测真正的乱码（控制字符），排除正常中文字符
  const hasMojibake = /[\u0000-\u001F]/.test(cm);
  const isEmpty = !cm || cm.trim() === '';
  return hasMojibake || isEmpty;
});
console.log('Count:', chineseIssues.length);
if (chineseIssues.length > 0) {
  chineseIssues.forEach(b => {
    const cm = b.chineseMeaning || '';
    const issue = !cm || cm.trim() === '' ? 'EMPTY' : 'MOJIBAKE';
    console.log(`  - ${b.word} [${issue}]: "${cm.substring(0, 40)}..."`);
  });
}

// 4. Weak Paraphrases
console.log('\n--- Weak Paraphrases ---');
const weakParaphraseWords = ['important', 'relevant', 'key', 'good', 'bad', 'big', 'small', 'useful', 'act on', 'carry out', 'key term'];
const weakParaphrase = bundles.filter(b => {
  const paras = b.paraphrases || [];
  return paras.some(p => weakParaphraseWords.includes(p.toLowerCase()));
});
console.log('Count:', weakParaphrase.length);

// 5. Template Contexts
console.log('\n--- Template Contexts ---');
const templatePatterns = [
  /Scientists have documented how/,
  /Research has shown that/,
  /Recent studies indicate that/,
  /Researchers often use \w+ when discussing/,
  /In IELTS essays, \w+ can be used to explain/,
  /In speaking tasks, candidates may use/
];
const templateContexts = bundles.filter(b => {
  const contexts = b.contexts || [];
  return contexts.some(ctx => templatePatterns.some(p => p.test(ctx.text)));
});
console.log('Count:', templateContexts.length);

// 6. Invalid Collocations
console.log('\n--- Invalid Collocations ---');
const invalidCollocPatterns = [/^and /i, /^with$/i, /^or /i, /^to$/i, /^the$/i];
const invalidColloc = bundles.filter(b => {
  const cols = b.collocations || [];
  return cols.some(c => invalidCollocPatterns.some(p => p.test(c)));
});
console.log('Count:', invalidColloc.length);

// Summary
console.log('\n=== SUMMARY ===');
console.log(`Generic definitions: ${genericDefs.length}`);
console.log(`Empty IPA: ${emptyIpa.length}`);
console.log(`Chinese issues: ${chineseIssues.length}`);
console.log(`Weak paraphrases: ${weakParaphrase.length}`);
console.log(`Template contexts: ${templateContexts.length}`);
console.log(`Invalid collocations: ${invalidColloc.length}`);