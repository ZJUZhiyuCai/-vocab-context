const fs = require('fs');
const path = require('path');

const reviewedPath = path.join(__dirname, '..', '..', 'data', 'ielts-core-500-reviewed.json');
const reviewed = JSON.parse(fs.readFileSync(reviewedPath, 'utf8'));

const partOfSpeechUpdates = {
  occur: 'v.',
  perceive: 'v.',
  philosophy: 'n.',
  publish: 'v.',
  rely: 'v.',
  derive: 'v.',
  illustrate: 'v.',
  participate: 'v.',
  complex: 'adj.',
  concept: 'n.',
  constant: 'adj.',
  income: 'n.'
};

let touched = 0;

for (const entry of reviewed.candidates) {
  if (entry.reviewStatus !== 'approved' || entry.approved !== true) continue;

  const editorPartOfSpeech = partOfSpeechUpdates[entry.key];
  if (!editorPartOfSpeech || entry.editorPartOfSpeech === editorPartOfSpeech) continue;

  entry.editorPartOfSpeech = editorPartOfSpeech;
  touched += 1;
}

fs.writeFileSync(reviewedPath, JSON.stringify(reviewed, null, 2) + '\n');
console.log(`Updated ${touched} approved entries in ${reviewedPath}`);
