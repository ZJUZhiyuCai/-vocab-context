const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/ielts-core-500-reviewed.json', 'utf8'));
const targets = ['international', 'consequently', 'adequate', 'persist', 'maximum', 'certificate', 'curriculum', 'literacy', 'sustainability', 'innovation', 'digital', 'conservation', 'phenomenon', 'endorse', 'perspective', 'underlying', 'stem', 'trigger', 'barrier'];

console.log('=== Target Words Quality Status ===\n');

targets.forEach(word => {
  const entry = data.candidates.find(c => c.key === word);
  if (entry) {
    const hasEditorContexts = entry.editorContexts && entry.editorContexts.length > 0;
    const hasTemplateContext = hasEditorContexts && entry.editorContexts.some(c =>
      c.text.includes('Scientists have documented how') ||
      c.text.includes('Research has shown that') ||
      c.text.includes('Recent studies indicate that')
    );
    console.log(`${word}:`);
    console.log(`  reviewStatus: ${entry.reviewStatus || 'none'}`);
    console.log(`  approved: ${entry.approved || false}`);
    console.log(`  hasEditorContexts: ${hasEditorContexts}`);
    console.log(`  hasTemplateContext: ${hasTemplateContext}`);
    console.log(`  ipa: ${entry.ipa || entry.editorIpa || 'missing'}`);
    console.log('');
  } else {
    console.log(`${word}: NOT FOUND\n`);
  }
});

// 统计整体质量债
console.log('\n=== Overall Quality Debt ===\n');

const approved = data.candidates.filter(c => c.approved);
const withEditorContexts = approved.filter(c => c.editorContexts && c.editorContexts.length > 0);
const withTemplateContexts = approved.filter(c =>
  c.editorContexts && c.editorContexts.some(ctx =>
    ctx.text.includes('Scientists have documented how') ||
    ctx.text.includes('Research has shown that') ||
    ctx.text.includes('Recent studies indicate that')
  )
);
const withMissingIpa = approved.filter(c => !c.ipa && !c.editorIpa);
const withGenericDef = approved.filter(c =>
  c.editorEnglishDefinition && (
    c.editorEnglishDefinition.includes('A high-value IELTS') ||
    c.editorEnglishDefinition.includes('A useful IELTS')
  )
);

console.log(`Total approved: ${approved.length}`);
console.log(`With editorContexts: ${withEditorContexts.length}`);
console.log(`With template contexts (needs fix): ${withTemplateContexts.length}`);
console.log(`Missing IPA: ${withMissingIpa.length}`);
console.log(`Generic definitions: ${withGenericDef.length}`);