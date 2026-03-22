const fs = require('fs');
const core = JSON.parse(fs.readFileSync('public/data/ielts-core-500.json', 'utf8'));
const emptyIpa = core.bundles.filter(b => !b.ipa || b.ipa.trim() === '' || b.ipa === '/');
console.log('Empty IPA count:', emptyIpa.length);
console.log('\nWords with missing IPA:');
emptyIpa.forEach(b => console.log('-', b.word));