const fs = require('fs');
const path = require('path');

const reviewedPath = path.join(__dirname, '..', '..', 'data', 'ielts-core-500-reviewed.json');
const reviewed = JSON.parse(fs.readFileSync(reviewedPath, 'utf8'));

const updates = {
  legislation: {
    editorPartOfSpeech: 'n.',
    editorSense: 'laws made officially by a government',
    editorEnglishDefinition: 'Laws, or a set of laws, that a government introduces and officially approves.',
    editorCollocations: ['pass legislation', 'environmental legislation', 'strict legislation'],
    editorParaphrases: ['laws', 'legal measures', 'regulations'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'The article argues that stronger environmental legislation is needed to reduce industrial pollution.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Governments should pass clearer legislation to protect consumers from misleading online advertising.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'I think legislation is necessary when voluntary action is not enough to change harmful behaviour.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "legislation" in one IELTS-style sentence about law, regulation, or public policy.'
  },
  accountability: {
    editorPartOfSpeech: 'n.',
    editorSense: 'the requirement to explain and take responsibility for decisions',
    editorEnglishDefinition: 'The state of being responsible for actions and being expected to explain them to others.',
    editorCollocations: ['public accountability', 'ensure accountability', 'lack of accountability'],
    editorParaphrases: ['responsibility', 'answerability', 'transparency in decision-making'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'The report links weak accountability to repeated failures in local government projects.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Clear reporting systems can improve accountability in both schools and public institutions.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'In my view, accountability matters because officials should justify how public money is spent.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "accountability" in one IELTS-style sentence about responsibility in government, education, or business.'
  },
  stabilize: {
    editorPartOfSpeech: 'v.',
    editorSense: 'to make something steady and less likely to change suddenly',
    editorEnglishDefinition: 'To make something more balanced, controlled, or unlikely to become worse.',
    editorCollocations: ['stabilize prices', 'stabilize the economy', 'stabilize demand'],
    editorParaphrases: ['steady', 'balance', 'make more stable'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'The central bank raised interest rates to stabilize prices after a period of rapid inflation.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Public investment can help stabilize employment in regions that depend on a single industry.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'I think governments should act early to stabilize the housing market before costs rise too far.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "stabilize" in one IELTS-style sentence about prices, employment, or the economy.'
  },
  escalate: {
    editorPartOfSpeech: 'v.',
    editorSense: 'to become more serious or increase quickly',
    editorEnglishDefinition: 'To become more intense, more severe, or more difficult to control.',
    editorCollocations: ['escalate rapidly', 'escalate tensions', 'escalate into conflict'],
    editorParaphrases: ['intensify', 'worsen', 'increase sharply'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Experts warn that water shortages could escalate tensions between farming and urban communities.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'If transport problems are ignored, they may escalate into wider economic and environmental costs.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'Small disagreements can escalate quickly online because people react before checking the facts.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "escalate" in one IELTS-style sentence about a problem becoming more serious.'
  },
  prevail: {
    editorPartOfSpeech: 'v.',
    editorSense: 'to be common in a place or to succeed after difficulty',
    editorEnglishDefinition: 'To exist widely in a particular situation, or to win after facing opposition.',
    editorCollocations: ['prevail in society', 'prevailing attitude', 'ultimately prevail'],
    editorParaphrases: ['dominate', 'be widespread', 'succeed in the end'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'A belief that university education guarantees success still prevails in many societies.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Short-term economic priorities often prevail over long-term environmental concerns.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'I hope practical solutions will prevail when people debate how to improve public transport.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "prevail" in one IELTS-style sentence about an idea, attitude, or side becoming dominant.'
  },
  substantial: {
    editorPartOfSpeech: 'adj.',
    editorSense: 'large in amount, importance, or effect',
    editorEnglishDefinition: 'Large enough to be important, noticeable, or valuable.',
    editorCollocations: ['substantial increase', 'substantial evidence', 'substantial investment'],
    editorParaphrases: ['considerable', 'significant', 'large-scale'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'The study found a substantial increase in energy use during extremely hot summers.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Substantial investment in public transport could reduce congestion in major cities.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'For me, the internet has had a substantial impact on how people access information.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "substantial" in one IELTS-style sentence about a large change, effect, or amount.'
  },
  implication: {
    editorPartOfSpeech: 'n.',
    editorSense: 'a likely effect or consequence of an action or decision',
    editorEnglishDefinition: 'A possible result or consequence that may follow from something.',
    editorCollocations: ['social implications', 'practical implications', 'long-term implications'],
    editorParaphrases: ['consequence', 'result', 'likely effect'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'The paper examines the social implications of replacing workers with automated systems.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Governments should consider the long-term implications of expanding private car use.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'One implication of studying abroad is that students often become more independent.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "implication" in one IELTS-style sentence about a possible result or consequence.'
  },
  deterrent: {
    editorPartOfSpeech: 'n.',
    editorSense: 'something that discourages people from doing something',
    editorEnglishDefinition: 'A factor that makes people less likely to do a particular action.',
    editorCollocations: ['strong deterrent', 'effective deterrent', 'act as a deterrent'],
    editorParaphrases: ['discouraging factor', 'disincentive', 'preventive measure'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'High fines can act as a deterrent to companies that dump waste illegally.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Visible police patrols may be an effective deterrent to petty crime in crowded areas.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'For many people, the cost of public transport is a deterrent to leaving their car at home.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "deterrent" in one IELTS-style sentence about something that discourages harmful behaviour.'
  },
  incentive: {
    editorPartOfSpeech: 'n.',
    editorSense: 'something that motivates people to take a particular action',
    editorEnglishDefinition: 'A benefit or reward that encourages someone to do something.',
    editorCollocations: ['financial incentive', 'offer incentives', 'economic incentive'],
    editorParaphrases: ['motivation', 'encouragement', 'reward'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Tax reductions can provide an incentive for companies to invest in cleaner technology.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Governments could offer financial incentives to households that reduce their energy use.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'A clear career path is a strong incentive for young people to continue their education.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "incentive" in one IELTS-style sentence about motivation created by money, policy, or opportunity.'
  },
  precedent: {
    editorPartOfSpeech: 'n.',
    editorSense: 'an earlier action or decision that becomes an example for later cases',
    editorEnglishDefinition: 'A previous case or decision that influences what is done in similar situations later.',
    editorCollocations: ['set a precedent', 'legal precedent', 'dangerous precedent'],
    editorParaphrases: ['example', 'earlier case', 'guiding case'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'The court ruling may set a precedent for future disputes over digital privacy.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Allowing unchecked advertising to children could create a dangerous precedent for media regulation.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'Once a school relaxes one rule, it can set a precedent that is hard to reverse.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "precedent" in one IELTS-style sentence about an earlier decision affecting later choices.'
  },
  disparity: {
    editorPartOfSpeech: 'n.',
    editorSense: 'a clear and often unfair difference between two things',
    editorEnglishDefinition: 'A noticeable difference, especially one that suggests inequality.',
    editorCollocations: ['income disparity', 'regional disparity', 'widening disparity'],
    editorParaphrases: ['gap', 'inequality', 'imbalance'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'The report highlights a growing disparity in income between urban and rural households.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Policy makers should address regional disparity by improving transport and digital infrastructure.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'I have noticed a disparity in access to good schools between wealthy and poorer areas.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "disparity" in one IELTS-style sentence about inequality or a widening gap.'
  },
  contentious: {
    editorPartOfSpeech: 'adj.',
    editorSense: 'likely to cause disagreement or strong argument',
    editorEnglishDefinition: 'Causing disagreement because people hold opposing opinions about it.',
    editorCollocations: ['contentious issue', 'highly contentious', 'remain contentious'],
    editorParaphrases: ['controversial', 'disputed', 'hotly debated'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Expanding nuclear power remains a contentious issue in many countries.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Raising university tuition fees is contentious because it affects both access and fairness.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'It is a contentious topic where I live because people disagree about who should pay for the service.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "contentious" in one IELTS-style sentence about a policy or social issue people disagree on.'
  }
};

let touched = 0;

for (const entry of reviewed.candidates) {
  if (entry.reviewStatus !== 'approved' || entry.approved !== true) continue;
  const update = updates[entry.key];
  if (!update) continue;

  Object.assign(entry, update);
  touched += 1;
}

fs.writeFileSync(reviewedPath, JSON.stringify(reviewed, null, 2) + '\n');
console.log(`Updated ${touched} approved entries in ${reviewedPath}`);
