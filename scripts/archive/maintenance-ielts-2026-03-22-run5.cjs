const fs = require('fs');
const path = require('path');

const reviewedPath = path.join(__dirname, '..', 'data', 'ielts-core-500-reviewed.json');
const reviewed = JSON.parse(fs.readFileSync(reviewedPath, 'utf8'));
const candidates = reviewed.candidates || [];

const fixes = {
  significant: {
    reviewerNotes:
      'Maintenance correction: replaced a misapplied geographic override with a high-value academic importance sense for data, effects, and policy discussion.',
    editorPartOfSpeech: 'adj.',
    editorSense: 'important enough to be noticed or to have a clear effect on results or decisions',
    editorEnglishDefinition:
      'Important or large enough to be noticed, measured, or to influence a situation in a meaningful way.',
    editorCollocations: ['significant effect', 'significant increase', 'statistically significant'],
    editorParaphrases: ['important', 'substantial', 'notable'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'The researchers found a significant difference in air quality between urban centres and smaller towns.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'Public transport investment can have a significant effect on traffic congestion and productivity.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'For me, the most significant change in education has been the growth of online learning tools.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "significant" in one IELTS-style sentence about an important change, difference, or effect.',
    ipa: '/sɪɡˈnɪfɪkənt/',
  },
  demonstrate: {
    reviewerNotes:
      'Maintenance correction: replaced a misapplied technology override with a clear show-or-prove sense that transfers well to reports, essays, and presentations.',
    editorPartOfSpeech: 'v.',
    editorSense: 'to show clearly, prove something, or make an idea evident with evidence or examples',
    editorEnglishDefinition:
      'To show that something is true or exists, often by giving evidence, results, or a clear example.',
    editorCollocations: ['demonstrate ability', 'demonstrate effectiveness', 'clearly demonstrate'],
    editorParaphrases: ['show', 'prove', 'illustrate'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'The survey results demonstrate that many young adults are worried about housing costs.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'Governments should demonstrate how public money is being used before asking taxpayers to accept higher charges.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'Volunteering can demonstrate practical skills that employers do not always see from exam grades alone.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "demonstrate" in one IELTS-style sentence about showing evidence, ability, or effectiveness.',
    ipa: '/ˈdemənstreɪt/',
  },
  proportion: {
    reviewerNotes:
      'Maintenance correction: replaced a misapplied verb override with a core noun sense for percentages, shares, and data comparison in IELTS tasks.',
    editorPartOfSpeech: 'n.',
    editorSense: 'the amount, share, or percentage of something in relation to the whole',
    editorEnglishDefinition:
      'A part, share, or percentage of a total, especially when comparing groups, trends, or categories.',
    editorCollocations: ['large proportion', 'small proportion', 'significant proportion'],
    editorParaphrases: ['percentage', 'share', 'fraction'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'A high proportion of the population in the study reported difficulty accessing affordable healthcare.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'The proportion of household income spent on rent has risen sharply in many major cities.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'In my area, a growing proportion of students choose online resources instead of printed textbooks.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "proportion" in one IELTS-style sentence about a percentage, share, or part of a whole.',
    ipa: '/prəˈpɔːʃən/',
  },
  major: {
    reviewerNotes:
      'Maintenance correction: replaced a misapplied transport-link override with a broad high-frequency adjective sense for scale, importance, and impact.',
    editorPartOfSpeech: 'adj.',
    editorSense: 'very important, serious, or large in size, scale, or effect',
    editorEnglishDefinition:
      'Very important, serious, or large enough to have a strong effect on people, systems, or events.',
    editorCollocations: ['major problem', 'major city', 'major change'],
    editorParaphrases: ['important', 'large-scale', 'serious'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Traffic congestion is now a major problem in several rapidly expanding cities.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'A major reason for rural migration is the lack of stable employment opportunities.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'For me, one major benefit of public transport is that it reduces stress during long commutes.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "major" in one IELTS-style sentence about an important problem, reason, or change.',
    ipa: '/ˈmeɪdʒə(r)/',
  },
  benefit: {
    reviewerNotes:
      'Maintenance correction: replaced a misapplied transport-link override with a transferable noun sense for advantages, gains, and positive outcomes.',
    editorPartOfSpeech: 'n.',
    editorSense: 'an advantage or positive effect that improves a person, system, or situation',
    editorEnglishDefinition:
      'An advantage or helpful result that makes a person, activity, policy, or system better.',
    editorCollocations: ['economic benefit', 'social benefit', 'benefit from'],
    editorParaphrases: ['advantage', 'gain', 'positive effect'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'One clear benefit of preventive healthcare is that it can reduce long-term pressure on hospitals.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'The main benefit of flexible working is that employees can manage time more efficiently.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'I think the biggest benefit of studying abroad is learning how to adapt to different cultures.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "benefit" in one IELTS-style sentence about an advantage of a policy, habit, or technology.',
    ipa: '/ˈbenɪfɪt/',
  },
  comment: {
    reviewerNotes:
      'Maintenance correction: replaced a misapplied trade override with a clean opinion-or-remark sense for media, feedback, and public discussion.',
    editorPartOfSpeech: 'n./v.',
    editorSense: 'an opinion, remark, or act of expressing a view about something',
    editorEnglishDefinition:
      'A remark or opinion about something, or the act of expressing that opinion publicly or privately.',
    editorCollocations: ['make a comment', 'comment on', 'public comment'],
    editorParaphrases: ['remark', 'opinion', 'observation'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'The article included expert comments on how rising food prices affect low-income families.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'Teachers should comment on students’ ideas as well as their grammar when giving feedback.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'I usually comment on online services only when the experience is either very good or very poor.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "comment" in one IELTS-style sentence about feedback, media, or public opinion.',
    ipa: '/ˈkɒment/',
  },
  amnesty: {
    reviewerNotes:
      'Maintenance correction: replaced a misapplied emergence override with a narrowly governed policy-law sense that is still usable in crime and government discussion.',
    editorPartOfSpeech: 'n.',
    editorSense: 'an official decision to pardon a group of people or cancel penalties for a particular offence',
    editorEnglishDefinition:
      'An official decision by a government or authority to forgive certain offences or cancel punishments for a group of people.',
    editorCollocations: ['declare an amnesty', 'tax amnesty', 'general amnesty'],
    editorParaphrases: ['pardon', 'forgiveness', 'official exemption'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Some governments introduce a tax amnesty to encourage people to declare hidden income voluntarily.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'A limited amnesty may reduce pressure on courts, but it can also raise concerns about fairness and accountability.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'I think any amnesty policy should be explained clearly so the public understands who qualifies and why.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "amnesty" in one IELTS-style sentence about law, government policy, or public fairness.',
    ipa: '/ˈæmnəsti/',
  },
};

for (const [word, fix] of Object.entries(fixes)) {
  const candidate = candidates.find((item) => item.word === word);
  if (!candidate) {
    throw new Error(`Missing candidate for ${word}`);
  }
  Object.assign(candidate, fix);
}

reviewed.generatedAt = new Date().toISOString();
fs.writeFileSync(reviewedPath, `${JSON.stringify(reviewed, null, 2)}\n`, 'utf8');
console.log(`Updated ${Object.keys(fixes).length} reviewed candidates.`);
