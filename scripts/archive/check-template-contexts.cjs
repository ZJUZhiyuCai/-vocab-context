const fs = require('fs');
const core = JSON.parse(fs.readFileSync('public/data/ielts-core-500.json', 'utf8'));

const templatePatterns = [
  /Scientists have documented how/,
  /Research has shown that/,
  /Recent studies indicate that/,
  /Researchers often use \w+ when discussing/,
  /In IELTS essays, \w+ can be used to explain/,
  /In speaking tasks, candidates may use/
];

const withTemplate = core.bundles.filter(b => {
  const contexts = b.contexts || [];
  return contexts.some(ctx => templatePatterns.some(p => p.test(ctx.text)));
});

console.log('Template contexts count:', withTemplate.length);
console.log('\nEntries with template contexts:');
withTemplate.forEach(b => {
  const badContexts = (b.contexts || []).filter(ctx => templatePatterns.some(p => p.test(ctx.text)));
  console.log(`\n- ${b.word}:`);
  badContexts.forEach(ctx => {
    console.log(`  [${ctx.kind}] "${ctx.text.substring(0, 80)}..."`);
  });
});