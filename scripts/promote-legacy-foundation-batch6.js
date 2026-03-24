import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const INTAKE_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-intake.json');
const REVIEWED_FILE = path.join(ROOT, 'data/ielts-legacy-foundation-batch6-reviewed.json');

const BATCH = [
  {
    word: 'synchronise',
    topic: 'technology',
    chineseMeaning: '同步；使协调一致',
    englishDefinition: 'to make different actions, systems, or devices happen at the same time or work together correctly',
    sense: 'make things happen in the same way or at the same time',
    collocations: ['synchronise data', 'synchronise systems', 'synchronise devices'],
    paraphrases: ['coordinate', 'align', 'sync'],
    contexts: [
      'Cloud services allow users to synchronise files across multiple devices almost instantly.',
      'Public systems work better when departments can synchronise their data instead of keeping isolated records.',
      'In everyday life, people often synchronise calendars and reminders to manage work more efficiently.'
    ]
  },
  {
    word: 'malfeasance',
    topic: 'government',
    chineseMeaning: '渎职；不当或违法行为',
    englishDefinition: 'illegal or dishonest behaviour by a public official or someone in a position of trust',
    sense: 'wrongful conduct by someone in authority',
    collocations: ['official malfeasance', 'evidence of malfeasance', 'accuse of malfeasance'],
    paraphrases: ['misconduct', 'official wrongdoing', 'abuse of office'],
    contexts: [
      'Public anger tends to rise quickly when allegations of malfeasance involve education or healthcare funding.',
      'Independent investigations are needed when there is credible evidence of malfeasance in public office.',
      'Citizens usually lose trust when malfeasance is ignored instead of being examined openly.'
    ]
  },
  {
    word: 'fatality',
    topic: 'health',
    chineseMeaning: '死亡事件；致死病例',
    englishDefinition: 'a death caused by an accident, conflict, disaster, or disease',
    sense: 'a death resulting from a harmful event',
    collocations: ['road fatality', 'workplace fatality', 'fatality rate'],
    paraphrases: ['death', 'death case', 'loss of life'],
    contexts: [
      'Road safety campaigns are often judged by whether they reduce the number of annual fatalities.',
      'Researchers closely monitor fatality rates when a new disease spreads through large populations.',
      'Governments are expected to act quickly when avoidable fatalities reveal a wider policy failure.'
    ]
  },
  {
    word: 'auditing',
    topic: 'government',
    chineseMeaning: '审计；审查财务或制度运行情况',
    englishDefinition: 'the process of checking accounts, systems, or records to make sure they are correct and properly managed',
    sense: 'the formal review of financial records or systems',
    collocations: ['independent auditing', 'auditing process', 'auditing standards'],
    paraphrases: ['financial review', 'inspection', 'formal checking'],
    contexts: [
      'Transparent auditing can reduce waste by showing how public money is actually being used.',
      'A stronger auditing process would make it easier to detect weak controls inside large institutions.',
      'In policy debates, auditing is often presented as a practical tool for accountability rather than punishment.'
    ]
  }
];

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function main() {
  const intake = loadJson(INTAKE_FILE).candidates || [];
  const reviewed = [];

  for (const approved of BATCH) {
    const candidate = intake.find(item => item.word === approved.word);
    if (!candidate) continue;

    reviewed.push({
      ...candidate,
      approved: true,
      reviewStatus: 'approved',
      editorSense: approved.sense,
      editorEnglishDefinition: approved.englishDefinition,
      editorChineseMeaning: approved.chineseMeaning,
      editorCollocations: approved.collocations,
      editorParaphrases: approved.paraphrases,
      editorContexts: approved.contexts.map((text, index) => ({
        kind: index === 0 ? 'reading' : index === 1 ? 'writing' : 'speaking',
        text,
        translation: '',
        purpose: index === 0 ? 'core' : index === 1 ? 'near-transfer' : 'far-transfer'
      })),
      editorProductionPrompt: `Use "${approved.word}" in one IELTS-style sentence about ${approved.topic}.`
    });
  }

  writeJson(REVIEWED_FILE, {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source: 'legacy-foundation-batch6',
    approvedCount: reviewed.length,
    candidates: reviewed
  });

  console.log(JSON.stringify({
    approvedBatch: reviewed.length,
    words: reviewed.map(item => item.word)
  }, null, 2));
}

main();
