const fs = require('fs');
const path = require('path');

const reviewedPath = path.join(__dirname, '..', 'data', 'ielts-core-500-reviewed.json');
const reviewed = JSON.parse(fs.readFileSync(reviewedPath, 'utf8'));

const contextUpdates = {
  discretionary: [
    { kind: 'reading', text: 'Discretionary spending on public services has decreased in recent budgets.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Governments should review discretionary policies to ensure they benefit all citizens.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'Teachers often have discretionary power to adapt lessons to student needs.', translation: '', purpose: 'far-transfer' }
  ],
  individualism: [
    { kind: 'reading', text: 'The rise of individualism has changed how people view community responsibilities.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Some argue that excessive individualism can weaken social bonds.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'In my country, there is a growing tension between collectivism and individualism.', translation: '', purpose: 'far-transfer' }
  ],
  investigative: [
    { kind: 'reading', text: 'Investigative journalism plays a crucial role in exposing corruption.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'The report calls for a full investigative review of the incident.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I think investigative reporting is essential for a healthy democracy.', translation: '', purpose: 'far-transfer' }
  ],
  demonstration: [
    { kind: 'reading', text: 'A large demonstration was held outside the parliament building.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Peaceful demonstration is a fundamental right in democratic societies.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I took part in a demonstration about climate policy last year.', translation: '', purpose: 'far-transfer' }
  ],
  developmental: [
    { kind: 'reading', text: "Early developmental stages are critical for children's cognitive growth.", translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Developmental policies should prioritise long-term learning and local needs.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'My university offers developmental programmes for students from disadvantaged backgrounds.', translation: '', purpose: 'far-transfer' }
  ],
  precautionary: [
    { kind: 'reading', text: 'The precautionary principle guides environmental policy in many countries.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Precautionary measures should be taken before introducing new technologies.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'Precautionary health advice becomes important during disease outbreaks.', translation: '', purpose: 'far-transfer' }
  ],
  redistribution: [
    { kind: 'reading', text: 'Wealth redistribution remains a controversial topic in economic policy.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Redistribution of resources can help reduce inequality in society.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'Fair redistribution of public funds can improve access to essential services.', translation: '', purpose: 'far-transfer' }
  ],
  rehabilitation: [
    { kind: 'reading', text: 'Rehabilitation programmes help former prisoners reintegrate into society.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'The justice system should balance punishment with rehabilitation.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'After a serious injury, rehabilitation can take months of steady effort.', translation: '', purpose: 'far-transfer' }
  ]
};

const coordinationUpdate = {
  editorCollocations: [
    'close coordination',
    'policy coordination',
    'international coordination'
  ],
  editorContexts: [
    { kind: 'reading', text: 'Close coordination between agencies improved the emergency response.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Effective policy coordination is needed to address complex social problems.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'Good coordination is essential when several teams work on the same project.', translation: '', purpose: 'far-transfer' }
  ]
};

let touched = 0;

for (const entry of reviewed.candidates) {
  if (entry.reviewStatus !== 'approved' || entry.approved !== true) continue;

  if (contextUpdates[entry.key]) {
    entry.editorContexts = contextUpdates[entry.key];
    touched += 1;
  }

  if (entry.key === 'coordination') {
    entry.editorCollocations = coordinationUpdate.editorCollocations;
    entry.editorContexts = coordinationUpdate.editorContexts;
    touched += 1;
  }
}

fs.writeFileSync(reviewedPath, JSON.stringify(reviewed, null, 2) + '\n');
console.log(`Updated ${touched} approved entries in ${reviewedPath}`);
