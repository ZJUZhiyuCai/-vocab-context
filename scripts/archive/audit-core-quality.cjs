const fs = require('fs');

// 读取 reviewed 数据
const reviewedData = JSON.parse(fs.readFileSync('data/ielts-core-500-reviewed.json', 'utf8'));
const approved = reviewedData.candidates.filter(c => c.approved);

// 读取正式 Core 数据
const coreData = JSON.parse(fs.readFileSync('public/data/ielts-core-500.json', 'utf8'));
const bundles = coreData.bundles;

console.log('=== IELTS Core Quality Audit ===\n');
console.log(`Total approved in reviewed: ${approved.length}`);
console.log(`Total bundles in Core: ${bundles.length}\n`);

// 1. Generic/Fallback English Definitions
console.log('--- Generic/Fallback Definitions ---');
const genericPatterns = [
  /A high-value IELTS/,
  /A useful IELTS/,
  /related to \w+ academic/
];
const genericDefs = bundles.filter(b => {
  const def = b.englishDefinition || '';
  return genericPatterns.some(p => p.test(def));
});
console.log(`Count: ${genericDefs.length}`);
if (genericDefs.length > 0 && genericDefs.length <= 20) {
  genericDefs.forEach(b => console.log(`  - ${b.word}: "${b.englishDefinition.substring(0, 60)}..."`));
}

// 2. Empty IPA
console.log('\n--- Empty IPA ---');
const emptyIpa = bundles.filter(b => !b.ipa || b.ipa.trim() === '' || b.ipa === '/');
console.log(`Count: ${emptyIpa.length}`);
if (emptyIpa.length <= 20) {
  emptyIpa.forEach(b => console.log(`  - ${b.word}`));
}

// 3. Chinese Meaning Issues
console.log('\n--- Chinese Meaning Issues ---');
const chineseIssues = bundles.filter(b => {
  const cm = b.chineseMeaning || '';
  // 检查乱码或不可读
  const hasMojibake = /[\u0000-\u001F]/.test(cm);
  const hasGarbled = /[锟斤拷烫]/.test(cm);
  const isEmpty = !cm || cm.trim() === '';
  return hasMojibake || hasGarbled || isEmpty;
});
console.log(`Count: ${chineseIssues.length}`);
if (chineseIssues.length <= 20) {
  chineseIssues.forEach(b => console.log(`  - ${b.word}: "${(b.chineseMeaning || '').substring(0, 40)}"`));
}

// 4. Weak Paraphrases
console.log('\n--- Weak Paraphrases ---');
const weakParaphraseWords = ['important', 'relevant', 'key', 'good', 'bad', 'big', 'small', 'useful', 'act on', 'carry out', 'key term'];
const weakParaphrase = bundles.filter(b => {
  const paras = b.paraphrases || [];
  return paras.some(p => weakParaphraseWords.includes(p.toLowerCase()));
});
console.log(`Count: ${weakParaphrase.length}`);
if (weakParaphrase.length <= 30) {
  weakParaphrase.forEach(b => console.log(`  - ${b.word}: [${(b.paraphrases || []).join(', ')}]`));
}

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
console.log(`Count: ${templateContexts.length}`);

// 6. Invalid Collocations
console.log('\n--- Invalid Collocations ---');
const invalidCollocPatterns = [/^and /i, /^with$/i, /^or /i, /^to$/i, /^the$/i];
const invalidColloc = bundles.filter(b => {
  const cols = b.collocations || [];
  return cols.some(c => invalidCollocPatterns.some(p => p.test(c)));
});
console.log(`Count: ${invalidColloc.length}`);
if (invalidColloc.length > 0) {
  invalidColloc.forEach(b => {
    const bad = (b.collocations || []).filter(c => invalidCollocPatterns.some(p => p.test(c)));
    console.log(`  - ${b.word}: ${bad.join(', ')}`);
  });
}

// 7. Topic Pack Stats
console.log('\n--- Topic Pack Stats ---');
const education = JSON.parse(fs.readFileSync('public/data/ielts-topic-education-draft.json', 'utf8'));
const environment = JSON.parse(fs.readFileSync('public/data/ielts-topic-environment-draft.json', 'utf8'));
const technology = JSON.parse(fs.readFileSync('public/data/ielts-topic-technology-draft.json', 'utf8'));
console.log(`Education: ${education.totalBundles} bundles`);
console.log(`Environment: ${environment.totalBundles} bundles`);
console.log(`Technology: ${technology.totalBundles} bundles`);

// Summary
console.log('\n=== SUMMARY ===');
console.log(`Core bundles: ${bundles.length}`);
console.log(`Generic definitions: ${genericDefs.length}`);
console.log(`Empty IPA: ${emptyIpa.length}`);
console.log(`Chinese issues: ${chineseIssues.length}`);
console.log(`Weak paraphrases: ${weakParaphrase.length}`);
console.log(`Template contexts: ${templateContexts.length}`);
console.log(`Invalid collocations: ${invalidColloc.length}`);