const fs = require('fs');
const path = require('path');

const reviewedPath = path.join(__dirname, '..', 'data', 'ielts-core-500-reviewed.json');
const reviewed = JSON.parse(fs.readFileSync(reviewedPath, 'utf8'));
const candidates = reviewed.candidates || [];

const fixes = {
  evolve: {
    reviewerNotes:
      'Maintenance enrichment: replaced template technology output with a clearer change-over-time sense and IELTS-safe contexts.',
    editorEnglishDefinition:
      'To develop or change gradually over time into a more advanced or different form.',
    editorContexts: [
      {
        kind: 'reading',
        text: 'Communication methods continue to evolve as mobile technology becomes cheaper and more widely available.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'Education systems must evolve if they are to prepare students for a labour market shaped by automation.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'I think public transport apps will evolve further because passengers now expect live updates and digital payment options.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "evolve" in one IELTS-style sentence about technology, education, or public services changing over time.',
    ipa: '/iˈvɒlv/',
  },
  emerge: {
    reviewerNotes:
      'Maintenance enrichment: replaced template technology output with a cleaner emergence sense and more transferable IELTS contexts.',
    editorEnglishDefinition:
      'To appear or become known, especially after a period of change, growth, or uncertainty.',
    editorContexts: [
      {
        kind: 'reading',
        text: 'New privacy concerns often emerge when governments collect more personal data through digital services.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'If new industries emerge in rural regions, fewer young adults may feel forced to move to major cities.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'Interesting career options keep emerging in my city as more companies invest in software and green energy.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "emerge" in one IELTS-style sentence about a new trend, concern, or opportunity appearing.',
    ipa: '/ɪˈmɜːdʒ/',
  },
  breakthrough: {
    reviewerNotes:
      'Maintenance enrichment: replaced template technology output with a learner-safe progress sense for science and technology essays.',
    editorEnglishDefinition:
      'An important discovery or development that leads to major progress in a field.',
    editorContexts: [
      {
        kind: 'reading',
        text: 'A major medical breakthrough can improve life expectancy, but the treatment is often expensive at first.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'Technological breakthroughs should be shared fairly so that poorer regions also benefit from scientific progress.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'The most impressive recent breakthrough for me is translation software that makes international study much easier.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "breakthrough" in one IELTS-style sentence about science, medicine, or technology.',
    ipa: '/ˈbreɪkθruː/',
  },
  artificial: {
    reviewerNotes:
      'Maintenance enrichment: clarified the adjective sense and fixed the collocation set for cleaner technology usage.',
    editorEnglishDefinition:
      'Made by people rather than occurring naturally, or created by technology to copy something natural.',
    editorCollocations: ['artificial intelligence', 'artificial lighting'],
    ipa: '/ˌɑːtɪˈfɪʃəl/',
  },
  virtual: {
    reviewerNotes:
      'Maintenance enrichment: replaced template technology output with online-learning and meeting contexts learners can reuse.',
    editorEnglishDefinition:
      'Existing or happening mainly on computers or online rather than in a physical place.',
    editorContexts: [
      {
        kind: 'reading',
        text: 'Virtual classrooms helped many universities continue teaching when students could not attend in person.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'Virtual meetings reduce travel costs, although they cannot fully replace direct human interaction.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'I sometimes prefer virtual events because they save time and make it easier to join from home.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "virtual" in one IELTS-style sentence about classes, meetings, or online experiences.',
    ipa: '/ˈvɜːtʃuəl/',
  },
  autonomous: {
    reviewerNotes:
      'Maintenance enrichment: replaced template technology output with transport-focused contexts and a cleaner machine-control sense.',
    editorEnglishDefinition:
      'Able to operate independently or with little direct human control.',
    editorContexts: [
      {
        kind: 'reading',
        text: 'Autonomous vehicles rely on sensors and software to make driving decisions in real time.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'Governments should test autonomous transport carefully before allowing it to spread on public roads.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'I would be cautious about using an autonomous taxi until the technology becomes more reliable.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "autonomous" in one IELTS-style sentence about vehicles, machines, or independent systems.',
    ipa: '/ɔːˈtɒnəməs/',
  },
  burgeoning: {
    reviewerNotes:
      'Maintenance enrichment: replaced template technology output with a clearer rapid-growth sense and broader transferable contexts.',
    editorEnglishDefinition: 'Growing or developing very quickly.',
    editorContexts: [
      {
        kind: 'reading',
        text: 'The burgeoning market for electric vehicles has encouraged governments to invest in charging infrastructure.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'A burgeoning tourism industry can create jobs, but it may also put pressure on local housing and transport.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'There is a burgeoning interest in online courses in my area because flexible learning suits working adults.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "burgeoning" in one IELTS-style sentence about a rapidly growing market, industry, or trend.',
    ipa: '/ˈbɜːdʒənɪŋ/',
  },
  wellbeing: {
    reviewerNotes:
      'Maintenance correction: restored a health-focused wellbeing entry after a misapplied editorial patch from a technology batch.',
    editorEnglishDefinition: "A person's general health, comfort, and quality of life.",
    editorContexts: [
      {
        kind: 'reading',
        text: 'Poor housing and long working hours can damage wellbeing even when people have stable incomes.',
        translation: '',
        purpose: 'core',
      },
      {
        kind: 'writing',
        text: 'Schools should protect student wellbeing by balancing academic pressure with exercise and social support.',
        translation: '',
        purpose: 'near-transfer',
      },
      {
        kind: 'speaking',
        text: 'For me, regular sleep and time away from screens are both important for my wellbeing.',
        translation: '',
        purpose: 'far-transfer',
      },
    ],
    editorProductionPrompt:
      'Use "wellbeing" in one IELTS-style sentence about health, lifestyle, or quality of life.',
    ipa: '/ˌwelˈbiːɪŋ/',
  },
};

for (const [word, fix] of Object.entries(fixes)) {
  const candidate = candidates.find((item) => item.word === word);
  if (!candidate) {
    throw new Error(`Missing candidate for ${word}`);
  }
  Object.assign(candidate, fix);
}

fs.writeFileSync(reviewedPath, `${JSON.stringify(reviewed, null, 2)}\n`, 'utf8');
console.log(`Updated ${Object.keys(fixes).length} reviewed candidates.`);
