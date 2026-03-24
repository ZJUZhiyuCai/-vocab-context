const fs = require('fs');
const path = require('path');

const reviewedPath = path.join(__dirname, '..', '..', 'data', 'ielts-core-500-reviewed.json');
const reviewed = JSON.parse(fs.readFileSync(reviewedPath, 'utf8'));

const updates = {
  injure: {
    editorPartOfSpeech: 'v.',
    editorSense: 'to cause physical harm or serious damage',
    editorEnglishDefinition: 'To cause physical harm to a person or damage to something valuable.',
    editorCollocations: [
      'seriously injure',
      'injure pedestrians',
      'injure workers',
      'injure wildlife'
    ],
    editorParaphrases: [
      'harm',
      'wound',
      'damage'
    ],
    editorContexts: [
      { kind: 'reading', text: 'Unsafe roads can seriously injure pedestrians and cyclists in densely populated cities.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Factories that ignore safety rules may injure workers and place extra pressure on public hospitals.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'I think careless drivers should face strict penalties because they can easily injure other people.', translation: '', purpose: 'far-transfer' }
    ],
    editorProductionPrompt: 'Use "injure" in one IELTS-style sentence about road safety, workplace safety, or preventable harm.'
  },
  previous: {
    editorPartOfSpeech: 'adj.',
    editorSense: 'happening or existing before the present time or event',
    editorEnglishDefinition: 'Existing, happening, or mentioned before the current time, event, or situation.',
    editorCollocations: [
      'previous year',
      'previous experience',
      'previous studies',
      'previous generation'
    ],
    editorParaphrases: [
      'earlier',
      'prior',
      'former'
    ],
    editorContexts: [
      { kind: 'reading', text: 'Previous studies suggest that children learn languages more quickly when they begin at an early age.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Compared with previous generations, young adults now spend more time communicating through digital platforms.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'My previous school placed much more emphasis on exams than practical projects.', translation: '', purpose: 'far-transfer' }
    ],
    editorProductionPrompt: 'Use "previous" in one IELTS-style sentence comparing an earlier period, study, or experience with the present.'
  },
  individual: {
    editorPartOfSpeech: 'adj.',
    editorSense: 'relating to one person separately rather than to a group as a whole',
    editorEnglishDefinition: 'Relating to one person separately, or designed for each person rather than for a whole group.',
    editorCollocations: [
      'individual needs',
      'individual rights',
      'individual choice',
      'individual support'
    ],
    editorParaphrases: [
      'personal',
      'one-to-one',
      'separate'
    ],
    editorContexts: [
      { kind: 'reading', text: 'Large classes make it harder for teachers to respond to individual learning needs.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Public policy should balance individual freedom with the wider interests of society.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'I prefer individual feedback because it helps me understand my weaknesses more clearly.', translation: '', purpose: 'far-transfer' }
    ],
    editorProductionPrompt: 'Use "individual" in one IELTS-style sentence about personal needs, rights, choices, or support.'
  },
  subscribe: {
    editorPartOfSpeech: 'v.',
    editorSense: 'to pay regularly in order to receive a service, publication, or online platform',
    editorEnglishDefinition: 'To pay regularly so that you can receive a service, publication, or digital platform.',
    editorCollocations: [
      'subscribe to a journal',
      'subscribe to a service',
      'subscribe online',
      'monthly subscription'
    ],
    editorParaphrases: [
      'sign up for',
      'pay for regularly',
      'take out a subscription to'
    ],
    editorContexts: [
      { kind: 'reading', text: 'Many university libraries subscribe to expensive academic journals so students can access reliable research.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Consumers now subscribe to digital services instead of buying physical media outright.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'I subscribe to an online learning platform because it is cheaper than attending extra classes in person.', translation: '', purpose: 'far-transfer' }
    ],
    editorProductionPrompt: 'Use "subscribe" in one IELTS-style sentence about media, research access, or digital services.'
  },
  concentrate: {
    editorPartOfSpeech: 'v.',
    editorSense: 'to focus attention, effort, or resources on one task or area',
    editorEnglishDefinition: 'To direct your attention, effort, or resources towards one subject, task, or problem.',
    editorCollocations: [
      'concentrate on studies',
      'concentrate resources',
      'concentrate efforts',
      'find it hard to concentrate'
    ],
    editorParaphrases: [
      'focus',
      'direct attention',
      'devote attention'
    ],
    editorContexts: [
      { kind: 'reading', text: 'Students often struggle to concentrate in overcrowded classrooms with constant noise.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Governments should concentrate resources on preventive healthcare instead of relying only on hospital treatment.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'I can concentrate better when I turn off notifications and study in a quiet place.', translation: '', purpose: 'far-transfer' }
    ],
    editorProductionPrompt: 'Use "concentrate" in one IELTS-style sentence about focusing attention, effort, or public resources.'
  },
  primary: {
    editorPartOfSpeech: 'adj.',
    editorSense: 'most important, basic, or coming first in a system or process',
    editorEnglishDefinition: 'Most important, basic, or first in order; in education it can also refer to the first stage of formal schooling.',
    editorCollocations: [
      'primary education',
      'primary cause',
      'primary responsibility',
      'primary concern'
    ],
    editorParaphrases: [
      'main',
      'chief',
      'fundamental'
    ],
    editorContexts: [
      { kind: 'reading', text: 'Many reports identify funding shortages as the primary barrier to improving rural primary education.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'In my view, the primary aim of schooling should be to develop literacy, numeracy, and independent thinking.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'The primary reason some parents choose private schools is the belief that class sizes are smaller.', translation: '', purpose: 'far-transfer' }
    ],
    editorProductionPrompt: 'Use "primary" in one IELTS-style sentence about the main goal, cause, concern, or first stage of education.'
  }
};

let touched = 0;

for (const entry of reviewed.candidates) {
  if (entry.reviewStatus !== 'approved' || entry.approved !== true) continue;
  if (!updates[entry.key]) continue;

  Object.assign(entry, updates[entry.key]);
  touched += 1;
}

fs.writeFileSync(reviewedPath, JSON.stringify(reviewed, null, 2) + '\n');
console.log(`Updated ${touched} approved entries in ${reviewedPath}`);
