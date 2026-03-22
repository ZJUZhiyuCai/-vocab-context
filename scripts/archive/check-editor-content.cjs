const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/ielts-core-500-reviewed.json', 'utf8'));

const targets = ['consequently', 'adequate', 'persist', 'maximum', 'certificate', 'curriculum', 'literacy', 'sustainability', 'innovation', 'barrier'];

targets.forEach(word => {
  const entry = data.candidates.find(c => c.key === word);
  if (entry) {
    console.log(`\n=== ${word.toUpperCase()} ===`);
    console.log(`editorSense: ${entry.editorSense || 'N/A'}`);
    console.log(`editorEnglishDefinition: ${entry.editorEnglishDefinition || 'N/A'}`);
    console.log(`editorChineseMeaning: ${entry.editorChineseMeaning || 'N/A'}`);
    console.log(`editorParaphrases: ${JSON.stringify(entry.editorParaphrases || [])}`);
    console.log(`editorCollocations: ${JSON.stringify(entry.editorCollocations || [])}`);
    console.log(`editorContexts:`);
    (entry.editorContexts || []).forEach((ctx, i) => {
      console.log(`  [${i}] ${ctx.kind}: "${ctx.text.substring(0, 100)}..."`);
    });
    console.log(`editorProductionPrompt: ${entry.editorProductionPrompt || 'N/A'}`);
  }
});