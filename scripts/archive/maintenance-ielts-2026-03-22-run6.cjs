const fs = require('fs');
const path = require('path');

const reviewedPath = path.join(__dirname, '..', 'data', 'ielts-core-500-reviewed.json');
const reviewed = JSON.parse(fs.readFileSync(reviewedPath, 'utf8'));
const candidates = reviewed.candidates || [];

const fixes = {
  exclude: {
    reviewerNotes:
      'Maintenance correction: replaced a misapplied evolve definition with a clean high-value verb sense for excluding items, groups, or possibilities in formal IELTS contexts.',
    editorPartOfSpeech: 'v.',
    editorSense: 'to deliberately leave something or someone out, or to prevent it from being included',
    editorEnglishDefinition:
      'To leave something or someone out, or to prevent it from being included in a group, process, calculation, or possibility.',
    editorChineseMeaning: '排除；不包括；把……排除在外',
    editorCollocations: ['exclude from', 'exclude the possibility', 'largely excluded'],
    editorParaphrases: ['leave out', 'omit', 'rule out'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'The researchers excluded unreliable responses before analysing the final results.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'Education policy should not exclude rural students from digital learning opportunities.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'I dislike community events that exclude older people or those with disabilities.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "exclude" in one IELTS-style sentence about leaving out a group, factor, or possible explanation.',
  },
  evidence: {
    reviewerNotes:
      'Maintenance correction: replaced a misapplied emerge definition with a core noun sense for proof, support, and justification in academic reading and writing.',
    editorPartOfSpeech: 'n.',
    editorSense: 'facts, signs, or information that show whether something is true or really exists',
    editorEnglishDefinition:
      'Facts, signs, or information that show whether a belief, claim, or explanation is true.',
    editorChineseMeaning: '证据；依据；迹象',
    editorCollocations: ['strong evidence', 'clear evidence', 'provide evidence'],
    editorParaphrases: ['proof', 'support', 'indication'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'There is growing evidence that air pollution affects children’s long-term health.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'Governments should base transport policy on evidence rather than short-term political pressure.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'I am more likely to change my opinion when someone gives clear evidence instead of just repeating a claim.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "evidence" in one IELTS-style sentence about proof, research findings, or support for an argument.',
  },
  approach: {
    reviewerNotes:
      'Maintenance correction: replaced a misapplied breakthrough definition with the productive noun sense of method or strategy that transfers strongly across IELTS topics.',
    editorPartOfSpeech: 'n.',
    editorSense: 'a way of dealing with something or a method used to achieve a result',
    editorEnglishDefinition:
      'A method, way of thinking, or strategy used to deal with a problem, task, or goal.',
    editorChineseMeaning: '方法；途径；处理方式',
    editorCollocations: ['practical approach', 'traditional approach', 'adopt an approach'],
    editorParaphrases: ['method', 'strategy', 'way'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'A community-based approach to waste reduction can be more effective than short publicity campaigns.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'Schools need a balanced approach that values both academic achievement and practical skills.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'My approach to learning vocabulary is to review words in short sessions every day.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "approach" in one IELTS-style sentence about a method, strategy, or way of solving a problem.',
  },
  debate: {
    reviewerNotes:
      'Maintenance correction: replaced a misapplied wellbeing definition with a clean noun sense for discussion and disagreement in public, academic, and policy contexts.',
    editorPartOfSpeech: 'n.',
    editorSense: 'a serious discussion or public argument in which different views are expressed',
    editorEnglishDefinition:
      'A serious discussion or public argument about an issue on which people have different opinions.',
    editorChineseMeaning: '讨论；辩论；争论',
    editorCollocations: ['public debate', 'spark a debate', 'ongoing debate'],
    editorParaphrases: ['discussion', 'argument', 'controversy'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'There is ongoing debate about whether university education should be free for everyone.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'The debate over remote work often ignores the different needs of urban and rural employees.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'In my country, there is constant debate about how much homework children should receive.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "debate" in one IELTS-style sentence about a public discussion or disagreement over policy or society.',
  },
  advocate: {
    reviewerNotes:
      'Maintenance correction: replaced a misapplied artificial definition with a full verb override for supporting or publicly recommending an idea, policy, or change.',
    editorPartOfSpeech: 'v.',
    editorSense: 'to publicly support, recommend, or argue in favour of something',
    editorEnglishDefinition:
      'To publicly support, recommend, or argue for a particular idea, policy, or course of action.',
    editorChineseMeaning: '提倡；主张；拥护',
    editorCollocations: ['advocate reform', 'strongly advocate', 'advocate for'],
    editorParaphrases: ['support', 'promote', 'recommend'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Many health experts advocate stricter controls on advertising unhealthy food to children.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'Some educators advocate project-based learning because it develops problem-solving skills.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'I would advocate cheaper public transport if a city wants fewer people to rely on cars.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "advocate" in one IELTS-style sentence about supporting a policy, reform, or practical solution.',
  },
};

let changed = 0;
for (const candidate of candidates) {
  const fix = fixes[candidate.word];
  if (!fix) continue;
  Object.assign(candidate, fix);
  changed += 1;
}

reviewed.generatedAt = new Date().toISOString();
fs.writeFileSync(reviewedPath, `${JSON.stringify(reviewed, null, 2)}\n`, 'utf8');
console.log(`Applied ${changed} IELTS maintenance fixes.`);
