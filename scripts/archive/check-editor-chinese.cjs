const fs = require('fs');
const reviewed = JSON.parse(fs.readFileSync('data/ielts-core-500-reviewed.json', 'utf8'));

const problemWords = ['remove', 'transfer', 'cycle', 'layer', 'scheme', 'default', 'negate', 'physical', 'item', 'component', 'text', 'disturbance', 'control', 'graduate', 'level', 'powerful', 'progress', 'risk', 'schedule', 'waste', 'broadcast', 'cope', 'decline', 'dismiss', 'essential', 'flood', 'hazard', 'improve', 'devise', 'speculate', 'initiate', 'isolate', 'restricted', 'conform', 'integrated', 'representative', 'alienated', 'broadcasting', 'experienced'];

console.log('Checking editorChineseMeaning for problem words:\n');

problemWords.forEach(word => {
  const entry = reviewed.candidates.find(c => c.key === word && c.approved);
  if (entry) {
    const hasEditor = entry.editorChineseMeaning && entry.editorChineseMeaning.trim() !== '';
    console.log(`${word}: hasEditorChineseMeaning = ${hasEditor}`);
    if (!hasEditor) {
      console.log(`  meaning: "${(entry.meaning || '').substring(0, 50)}..."`);
    }
  } else {
    console.log(`${word}: NOT FOUND`);
  }
});