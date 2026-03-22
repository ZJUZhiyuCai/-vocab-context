const fs = require('fs');
const core = JSON.parse(fs.readFileSync('public/data/ielts-core-500.json', 'utf8'));

const invalidCollocPatterns = [/^and /i, /^with$/i, /^or /i, /^to$/i, /^the$/i];
const invalidColloc = core.bundles.filter(b => {
  const cols = b.collocations || [];
  return cols.some(c => invalidCollocPatterns.some(p => p.test(c)));
});

console.log('Invalid collocations count:', invalidColloc.length);
invalidColloc.forEach(b => {
  const bad = (b.collocations || []).filter(c => invalidCollocPatterns.some(p => p.test(c)));
  console.log(`\n- ${b.word}: ${bad.join(', ')}`);
  console.log(`  All collocations: [${(b.collocations || []).join(', ')}]`);
});