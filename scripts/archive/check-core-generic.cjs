const fs = require('fs');
const core = JSON.parse(fs.readFileSync('public/data/ielts-core-500.json', 'utf8'));

// 找出 generic definitions
const genericPattern = /A high-value IELTS|A useful IELTS/;
const generic = core.bundles.filter(b => genericPattern.test(b.englishDefinition || ''));

console.log('Generic definitions in Core:', generic.length);
console.log('\nWords with generic definitions:\n');
generic.forEach(b => {
  console.log(`- ${b.word}: "${b.englishDefinition.substring(0, 60)}..."`);
});