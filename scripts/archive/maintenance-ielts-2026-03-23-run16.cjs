const fs = require('fs');
const path = require('path');

const reviewedPath = path.join(__dirname, '..', '..', 'data', 'ielts-core-500-reviewed.json');
const reviewed = JSON.parse(fs.readFileSync(reviewedPath, 'utf8'));

const posUpdates = {
  environment: 'n.',
  interaction: 'n.',
  data: 'n.',
  percent: 'n.',
  period: 'n.',
  response: 'n.',
  role: 'n.',
  category: 'n.',
  contrast: 'n.',
  economy: 'n.',
  method: 'n.',
  outcome: 'n.'
};

let posTouched = 0;

for (const candidate of reviewed.candidates || []) {
  if (candidate.reviewStatus !== 'approved' || candidate.approved !== true) continue;

  if (Object.prototype.hasOwnProperty.call(posUpdates, candidate.word)) {
    candidate.editorPartOfSpeech = posUpdates[candidate.word];
    posTouched += 1;
  }
}

fs.writeFileSync(reviewedPath, JSON.stringify(reviewed, null, 2) + '\n');

console.log(`Updated editorPartOfSpeech for ${posTouched} approved entries.`);
