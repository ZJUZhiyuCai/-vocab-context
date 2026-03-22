const fs = require('fs');
const path = require('path');

const reviewedFile = path.join(__dirname, '../data/ielts-core-500-reviewed.json');
const data = JSON.parse(fs.readFileSync(reviewedFile, 'utf8'));

const overrides = {
  document: {
    editorPartOfSpeech: 'v.',
    ipa: '/ˈdɒkjʊment/',
    editorSense: 'to record information or evidence carefully in writing or in an official file',
    editorEnglishDefinition: 'To record, describe, or provide evidence for something in a clear written or official form.',
    editorChineseMeaning: '记录，记载，为…提供书面证明',
    editorCollocations: [
      'document evidence',
      'document a change',
      'officially document',
      'carefully document'
    ],
    editorParaphrases: [
      'record',
      'register',
      'log',
      'provide evidence for'
    ],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Several reports document the long-term impact of air pollution on public health.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Governments should document how public money is spent so that taxpayers can check the results.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'In my view, schools should document student progress with regular feedback rather than one final exam.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "document" in one IELTS-style sentence about recording evidence, changes, or public information.'
  },
  fund: {
    editorPartOfSpeech: 'v.',
    ipa: '/fʌnd/',
    editorSense: 'to provide money for a project, service, or organisation',
    editorEnglishDefinition: 'To provide the money needed for an activity, policy, service, or organisation.',
    editorChineseMeaning: '资助，为…提供资金',
    editorCollocations: [
      'fund a project',
      'fund public services',
      'government-funded programme',
      'adequately fund'
    ],
    editorParaphrases: [
      'finance',
      'support financially',
      'pay for',
      'back'
    ],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Many universities rely on a mix of public and private sources to fund research projects.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Local authorities should fund reliable public transport before expanding road networks.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'I think companies should help fund training programmes if they want workers with stronger digital skills.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "fund" in one IELTS-style sentence about paying for research, services, or infrastructure.'
  },
  react: {
    editorPartOfSpeech: 'v.',
    ipa: '/riˈækt/',
    editorSense: 'to respond to an event, change, idea, or situation',
    editorEnglishDefinition: 'To respond in a particular way to news, pressure, change, or another stimulus.',
    editorChineseMeaning: '作出反应，回应',
    editorCollocations: [
      'react to news',
      'react quickly',
      'react negatively',
      'public reaction'
    ],
    editorParaphrases: [
      'respond',
      'reply',
      'adjust',
      'show a response'
    ],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Consumers often react quickly when prices rise sharply or product quality falls.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Governments need to react faster to scientific warnings about climate risks.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'People in my city usually react positively when a new park or cycle lane is introduced.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "react" in one IELTS-style sentence about how people, consumers, or governments respond to change.'
  },
  circumstance: {
    editorPartOfSpeech: 'n.',
    ipa: '/ˈsɜːkəmstæns/',
    editorSense: 'a condition or fact that affects a situation or event',
    editorEnglishDefinition: 'A condition, event, or set of facts that influences what happens in a situation.',
    editorChineseMeaning: '情况，环境，境遇',
    editorCollocations: [
      'under certain circumstances',
      'in difficult circumstances',
      'changing circumstances',
      'personal circumstances'
    ],
    editorParaphrases: [
      'situation',
      'condition',
      'context',
      'set of facts'
    ],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Children from disadvantaged circumstances often need extra support at school.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'In some circumstances, remote work can improve productivity and reduce commuting time.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'I believe universities should consider personal circumstances as well as exam results.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "circumstance" or "circumstances" in one IELTS-style sentence about conditions that affect a result or decision.'
  },
  emphasis: {
    editorPartOfSpeech: 'n.',
    ipa: '/ˈemfəsɪs/',
    editorSense: 'special importance or attention given to something',
    editorEnglishDefinition: 'Special importance, attention, or priority given to one idea, activity, or objective.',
    editorChineseMeaning: '强调，重视，重点',
    editorCollocations: [
      'place emphasis on',
      'strong emphasis',
      'particular emphasis',
      'with an emphasis on'
    ],
    editorParaphrases: [
      'focus',
      'priority',
      'stress',
      'attention'
    ],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Recent education reforms place greater emphasis on problem-solving and independent learning.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Public health campaigns should put more emphasis on prevention than on costly treatment alone.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'At my school there was a strong emphasis on teamwork, which helped students learn from one another.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "emphasis" in one IELTS-style sentence about what schools, governments, or employers should prioritise.'
  },
  valid: {
    editorPartOfSpeech: 'adj.',
    ipa: '/ˈvælɪd/',
    editorSense: 'based on sound reasoning, acceptable evidence, or official acceptance',
    editorEnglishDefinition: 'Reasonable, well supported, or officially acceptable enough to be considered correct or effective.',
    editorChineseMeaning: '有效的，合理的，站得住脚的',
    editorCollocations: [
      'valid argument',
      'valid reason',
      'valid data',
      'remain valid'
    ],
    editorParaphrases: [
      'sound',
      'well founded',
      'credible',
      'legitimate'
    ],
    editorContexts: [
      {
        kind: 'reading',
        text: 'The researchers repeated the experiment to make sure the results were valid.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'This is a valid argument because it considers both the economic costs and the social benefits.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'I think online qualifications are valid if employers can trust the quality of the training.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "valid" in one IELTS-style sentence about a reason, argument, result, or qualification.'
  }
};

let updated = 0;
for (const entry of data.candidates) {
  const override = overrides[entry.word];
  if (!override || entry.reviewStatus !== 'approved' || entry.approved !== true) continue;
  Object.assign(entry, override);
  updated += 1;
}

fs.writeFileSync(reviewedFile, JSON.stringify(data, null, 2), 'utf8');
console.log(`Updated ${updated} approved entries in ${reviewedFile}`);
