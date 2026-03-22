const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/ielts-core-500-reviewed.json', 'utf8'));

const entry = data.candidates.find(c => c.key === 'coordination');
if (entry) {
  // 替换无效 collocation
  entry.editorCollocations = ['careful coordination', 'coordination between', 'effective coordination', 'policy coordination'];
  fs.writeFileSync('data/ielts-core-500-reviewed.json', JSON.stringify(data, null, 2));
  console.log('Fixed coordination collocations:', entry.editorCollocations);
} else {
  console.log('Entry not found');
}