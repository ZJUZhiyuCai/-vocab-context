const fs = require('fs');
const path = require('path');

const reviewedPath = path.join(__dirname, '..', '..', 'data', 'ielts-core-500-reviewed.json');
const reviewed = JSON.parse(fs.readFileSync(reviewedPath, 'utf8'));

const partOfSpeechUpdates = {
  conclude: 'v.',
  construct: 'v.',
  define: 'v.',
  distribute: 'v.',
  ensure: 'v.',
  establish: 'v.',
  estimate: 'v.',
  evaluate: 'v.',
  imply: 'v.',
  invest: 'v.',
  sustainable: 'adj.'
};

const senseUpdates = {
  appropriate: 'suitable or acceptable for a particular situation, purpose, or level',
  sustainable: 'able to continue over time without causing serious environmental, social, or financial harm'
};

let touched = 0;

for (const entry of reviewed.candidates) {
  if (entry.reviewStatus !== 'approved' || entry.approved !== true) continue;

  let changed = false;
  const editorPartOfSpeech = partOfSpeechUpdates[entry.key];
  if (editorPartOfSpeech && entry.editorPartOfSpeech !== editorPartOfSpeech) {
    entry.editorPartOfSpeech = editorPartOfSpeech;
    changed = true;
  }

  const editorSense = senseUpdates[entry.key];
  if (editorSense && entry.editorSense !== editorSense) {
    entry.editorSense = editorSense;
    changed = true;
  }

  if (changed) touched += 1;
}

fs.writeFileSync(reviewedPath, JSON.stringify(reviewed, null, 2) + '\n');
console.log(`Updated ${touched} approved entries in ${reviewedPath}`);
