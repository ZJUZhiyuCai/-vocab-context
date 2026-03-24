const fs = require('fs');
const path = require('path');

const reviewedPath = path.join(__dirname, '..', '..', 'data', 'ielts-core-500-reviewed.json');
const reviewed = JSON.parse(fs.readFileSync(reviewedPath, 'utf8'));

const partOfSpeechUpdates = {
  maintain: 'v.',
  assess: 'v.',
  assist: 'v.',
  justify: 'v.',
  analyse: 'v.',
  affect: 'v.',
  indicate: 'v.',
  link: 'v.',
  positive: 'adj.',
  assessment: 'n.',
  community: 'n.',
  consume: 'v.',
  export: 'v.',
  interpret: 'v.',
  obtain: 'v.',
  relevant: 'adj.',
  appropriate: 'adj.',
  regulate: 'v.',
  reside: 'v.',
  equate: 'v.',
  distinction: 'n.',
  normal: 'adj.',
  assume: 'v.',
  create: 'v.',
  design: 'v.',
  focus: 'v.',
  function: 'n.',
  identify: 'v.',
  impact: 'n.',
  issue: 'n.',
  locate: 'v.',
  proceed: 'v.',
  process: 'n.',
  range: 'n.',
  require: 'v.',
  secure: 'v.',
  seek: 'v.',
  achieve: 'v.',
  acquire: 'v.',
  compensate: 'v.'
};

let touched = 0;

for (const entry of reviewed.candidates) {
  if (entry.reviewStatus !== 'approved' || entry.approved !== true) continue;
  const editorPartOfSpeech = partOfSpeechUpdates[entry.key];
  if (!editorPartOfSpeech) continue;
  if (entry.editorPartOfSpeech === editorPartOfSpeech) continue;

  entry.editorPartOfSpeech = editorPartOfSpeech;
  touched += 1;
}

fs.writeFileSync(reviewedPath, JSON.stringify(reviewed, null, 2) + '\n');
console.log(`Updated ${touched} approved entries in ${reviewedPath}`);
