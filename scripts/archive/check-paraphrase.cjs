const fs = require('fs');
const core = JSON.parse(fs.readFileSync('public/data/ielts-core-500.json', 'utf8'));

const weakParaphraseWords = ['important', 'relevant', 'key', 'good', 'bad', 'big', 'small', 'useful', 'act on', 'carry out', 'key term'];
const weakParaphrase = core.bundles.filter(b => {
  const paras = b.paraphrases || [];
  return paras.some(p => weakParaphraseWords.includes(p.toLowerCase()));
});

console.log('Weak paraphrases count:', weakParaphrase.length);
console.log('\nEntries with weak paraphrases:');
weakParaphrase.forEach(b => {
  const paras = b.paraphrases || [];
  const weak = paras.filter(p => weakParaphraseWords.includes(p.toLowerCase()));
  console.log(`- ${b.word}: [${paras.join(', ')}] (weak: ${weak.join(', ')})`);
});