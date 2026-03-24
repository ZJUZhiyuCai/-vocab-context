const fs = require('fs');
const path = require('path');

const reviewedPath = path.join(__dirname, '..', '..', 'data', 'ielts-core-500-reviewed.json');
const reviewed = JSON.parse(fs.readFileSync(reviewedPath, 'utf8'));

const posUpdates = {
  policy: 'n.',
  similar: 'adj.',
  context: 'n.',
  potential: 'adj.',
  resource: 'n.',
  analysis: 'n.',
  legal: 'adj.',
  domestic: 'adj.',
  principle: 'n.',
  technical: 'adj.',
  alternative: 'adj.',
  considerable: 'adj.'
};

const dateUpdate = {
  editorPartOfSpeech: 'n.',
  editorSense: 'a particular day, month, or year when something happens or is scheduled',
  editorEnglishDefinition: 'A particular day or point in time when an event happens, is recorded, or is planned.',
  editorChineseMeaning: '日期；特定的日、月、年；事情发生或安排的时间点',
  editorCollocations: ['set a date', 'starting date', 'date of birth'],
  editorParaphrases: ['point in time', 'scheduled day', 'specific time'],
  editorContexts: [
    {
      kind: 'reading',
      text: 'The article compares the starting date of the policy with the period when public concern began to rise.',
      translation: '',
      purpose: 'core'
    },
    {
      kind: 'writing',
      text: 'In planning public projects, officials should announce a clear date so that residents can prepare in advance.',
      translation: '',
      purpose: 'near-transfer'
    },
    {
      kind: 'speaking',
      text: 'I usually remember an important date by linking it to a personal event or a deadline on my phone.',
      translation: '',
      purpose: 'far-transfer'
    }
  ],
  editorProductionPrompt: 'Use "date" in one IELTS-style sentence about scheduling, planning, or when an event happened.'
};

let posTouched = 0;
let dateTouched = false;

for (const candidate of reviewed.candidates || []) {
  if (candidate.reviewStatus !== 'approved' || candidate.approved !== true) continue;

  if (Object.prototype.hasOwnProperty.call(posUpdates, candidate.word)) {
    candidate.editorPartOfSpeech = posUpdates[candidate.word];
    posTouched += 1;
  }

  if (candidate.word === 'date') {
    Object.assign(candidate, dateUpdate);
    dateTouched = true;
  }
}

fs.writeFileSync(reviewedPath, JSON.stringify(reviewed, null, 2) + '\n');

console.log(`Updated editorPartOfSpeech for ${posTouched} approved entries.`);
console.log(`Updated date metadata: ${dateTouched}.`);
