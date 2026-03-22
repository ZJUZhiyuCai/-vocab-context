const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/ielts-core-500-reviewed.json', 'utf8'));
const approved = data.candidates.filter(c => c.approved);

// 找出有 generic definition 的词
const genericPattern = /A high-value IELTS|A useful IELTS/;
const withGenericDef = approved.filter(e => {
  const def = e.editorEnglishDefinition || '';
  return genericPattern.test(def);
});

console.log(`Generic definitions: ${withGenericDef.length}`);
console.log('\nWords with generic definition:');
withGenericDef.forEach(e => {
  console.log(`  - ${e.key}: hasEditor=${!!e.editorEnglishDefinition}`);
});

// 找出没有 editorEnglishDefinition 的
const noEditorDef = approved.filter(e => !e.editorEnglishDefinition);
console.log(`\nNo editorEnglishDefinition: ${noEditorDef.length}`);
noEditorDef.slice(0, 20).forEach(e => {
  console.log(`  - ${e.key}`);
});