const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/ielts-core-500-reviewed.json', 'utf8'));

const entry = data.candidates.find(c => c.key === 'implement');
if (entry && entry.editorParaphrases) {
  entry.editorParaphrases = ['apply', 'execute', 'enforce'];
  fs.writeFileSync('data/ielts-core-500-reviewed.json', JSON.stringify(data, null, 2));
  console.log('Fixed implement paraphrases:', entry.editorParaphrases);
} else {
  console.log('Entry not found or no editorParaphrases');
}