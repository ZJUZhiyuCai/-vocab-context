import path from 'path';
import { fileURLToPath } from 'url';
import {
  ensureDir,
  readJson,
  writeJson
} from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const REVIEWED_FILE = path.join(DATA_DIR, 'ielts-core-500-reviewed.json');
const CANDIDATE_FILE = path.join(DATA_DIR, 'ielts-core-500-candidates.json');
const FINAL_FILE = path.join(OUTPUT_DIR, 'ielts-core-500.json');
const DRAFT_FILE = path.join(OUTPUT_DIR, 'ielts-core-500-generated-draft.json');

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    draft: args.includes('--draft'),
    limit: Number(args.find(arg => arg.startsWith('--limit='))?.split('=')[1] || 500)
  };
}

function cleanMeaning(meaning = '') {
  return String(meaning)
    .replace(/^[a-z]+\.\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferSense(candidate) {
  return candidate.editorSense || cleanMeaning(candidate.meaning).split(/[;,，。]/)[0] || candidate.word;
}

function inferEnglishDefinition(candidate) {
  if (candidate.editorEnglishDefinition) return candidate.editorEnglishDefinition;
  const partOfSpeech = candidate.editorPartOfSpeech || candidate.partOfSpeech;
  const pos = partOfSpeech === 'v.' ? 'verb' : partOfSpeech === 'adj.' ? 'adjective' : 'word';
  return `A high-value IELTS ${pos} related to ${candidate.topics[0] || 'general academic communication'}.`;
}

function inferCollocations(candidate) {
  if (candidate.editorCollocations?.length) return candidate.editorCollocations;

  const generated = new Set();
  const regex = new RegExp(`\\b${candidate.word}\\b`, 'i');

  for (const example of candidate.examples || []) {
    const tokens = (example.sentence || '').split(/\s+/).filter(Boolean);
    const matchIndex = tokens.findIndex(token => regex.test(token.replace(/[^\w'-]/g, '')));
    if (matchIndex === -1) continue;

    const left = tokens.slice(Math.max(0, matchIndex - 1), matchIndex + 1).join(' ').replace(/[^\w'\s-]/g, '');
    const right = tokens.slice(matchIndex, Math.min(tokens.length, matchIndex + 2)).join(' ').replace(/[^\w'\s-]/g, '');

    if (left.split(/\s+/).length >= 2) generated.add(left);
    if (right.split(/\s+/).length >= 2) generated.add(right);
  }

  const fallbackMap = {
    significant: ['significant effect', 'significant increase'],
    evidence: ['strong evidence', 'clear evidence'],
    approach: ['effective approach', 'practical approach'],
    debate: ['public debate', 'ongoing debate'],
    proportion: ['large proportion', 'small proportion'],
    factor: ['major factor', 'key factor'],
    commission: ['government commission', 'independent commission'],
    benefit: ['social benefit', 'economic benefit'],
    culture: ['local culture', 'cultural change']
  };

  const collocations = Array.from(generated);
  if (fallbackMap[candidate.key]) {
    fallbackMap[candidate.key].forEach(item => collocations.push(item));
  }

  if (collocations.length < 2) {
    if (candidate.partOfSpeech === 'v.') {
      collocations.push(`${candidate.word} effectively`, `${candidate.word} carefully`);
    } else if (candidate.partOfSpeech === 'adj.') {
      collocations.push(`${candidate.word} change`, `${candidate.word} impact`);
    } else {
      collocations.push(`${candidate.word} issue`, `${candidate.word} trend`);
    }
  }

  return Array.from(new Set(collocations)).slice(0, 4);
}

function inferParaphrases(candidate) {
  if (candidate.editorParaphrases?.length) return candidate.editorParaphrases;

  const fallbackMap = {
    significant: ['important', 'major'],
    demonstrate: ['show', 'illustrate'],
    evidence: ['proof', 'support'],
    assess: ['evaluate', 'judge'],
    justify: ['explain', 'defend'],
    proportion: ['share', 'percentage'],
    analyse: ['examine', 'study'],
    approach: ['method', 'strategy'],
    debate: ['discussion', 'argument'],
    maintain: ['preserve', 'sustain'],
    assist: ['help', 'support'],
    commission: ['committee', 'authority'],
    factor: ['element', 'cause'],
    affect: ['influence', 'impact'],
    benefit: ['advantage', 'gain'],
    comment: ['remark', 'observation'],
    conduct: ['carry out', 'perform'],
    culture: ['tradition', 'social values'],
    major: ['important', 'main'],
    decline: ['fall', 'decrease'],
    increase: ['rise', 'grow'],
    allocate: ['assign', 'distribute'],
    beneficial: ['helpful', 'advantageous'],
    detrimental: ['harmful', 'damaging'],
    regulate: ['control', 'govern'],
    relevant: ['related', 'connected'],
    viable: ['workable', 'practical'],
    deteriorate: ['worsen', 'decline']
  };

  if (fallbackMap[candidate.key]) {
    return fallbackMap[candidate.key];
  }

  if (candidate.partOfSpeech === 'v.') {
    return ['act on', 'carry out'];
  }

  if (candidate.partOfSpeech === 'adj.') {
    return ['important', 'relevant'];
  }

  return ['key term'];
}

function inferContexts(candidate) {
  if (candidate.editorContexts?.length) return candidate.editorContexts;

  const contexts = (candidate.examples || []).slice(0, 3).map((example, index) => ({
    kind: candidate.topics.length > 0 && index === 0 ? 'reading' : index === 1 ? 'writing' : 'speaking',
    text: example.sentence,
    translation: example.translation || '',
    purpose: index === 0 ? 'core' : index === 1 ? 'near-transfer' : 'far-transfer'
  }));

  const fallbackTemplates = [
    {
      kind: 'reading',
      text: `Researchers often use ${candidate.word} when discussing ${candidate.topics[0] || 'social'} trends in academic contexts.`,
      translation: '',
      purpose: 'core'
    },
    {
      kind: 'writing',
      text: `In IELTS essays, ${candidate.word} can be used to explain how ${candidate.topics[0] || 'public'} issues change over time.`,
      translation: '',
      purpose: 'near-transfer'
    },
    {
      kind: 'speaking',
      text: `In speaking tasks, candidates may use ${candidate.word} to describe opinions about ${candidate.topics[0] || 'society'}.`,
      translation: '',
      purpose: 'far-transfer'
    }
  ];

  const validContexts = contexts.filter(context => context.text && context.text.split(/\s+/).filter(Boolean).length >= 4);

  while (validContexts.length < 2) {
    validContexts.push(fallbackTemplates[validContexts.length]);
  }

  return validContexts;
}

function inferProductionPrompt(candidate) {
  if (candidate.editorProductionPrompt) {
    return {
      mode: 'writing',
      instruction: candidate.editorProductionPrompt
    };
  }

  return {
    mode: 'writing',
    instruction: `Use "${candidate.word}" in one IELTS-style sentence about ${candidate.topics[0] || 'a common social issue'}.`
  };
}

function toBundle(candidate, index, draftMode) {
  const collocations = inferCollocations(candidate);
  const paraphrases = inferParaphrases(candidate);
  const contexts = inferContexts(candidate);

  return {
    bundleId: `${candidate.topics[0] || 'general'}_${candidate.key}_${String(index + 1).padStart(3, '0')}`,
    word: candidate.word,
    lemma: candidate.word,
    ipa: candidate.ipa || '',
    partOfSpeech: candidate.editorPartOfSpeech || candidate.partOfSpeech || 'n.',
    sense: inferSense(candidate),
    englishDefinition: inferEnglishDefinition(candidate),
    chineseMeaning: candidate.editorChineseMeaning || cleanMeaning(candidate.meaning),
    topic: candidate.topics[0] || 'education',
    taskTypes: candidate.topics.length > 1 ? ['reading', 'writing', 'speaking'] : ['reading', 'writing'],
    register: 'formal',
    collocations,
    paraphrases,
    confusions: [],
    contexts,
    productionPrompt: inferProductionPrompt(candidate),
    sourceQuality: {
      relevanceScore: candidate.relevanceScore,
      transferabilityScore: candidate.transferabilityScore,
      outputUtilityScore: candidate.outputUtilityScore,
      exampleQualityScore: candidate.exampleQualityScore,
      decision: draftMode ? 'keep_with_review' : 'keep'
    },
    draft: draftMode
  };
}

function getSourceCandidates(draftMode) {
  const reviewed = readJson(REVIEWED_FILE).candidates || [];
  if (!draftMode) {
    return reviewed.filter(candidate => candidate.reviewStatus === 'approved' && candidate.approved);
  }

  const candidates = readJson(CANDIDATE_FILE).candidates || [];
  return candidates.filter(candidate => candidate.decision === 'keep' || candidate.decision === 'review');
}

function main() {
  const { draft, limit } = parseArgs();
  ensureDir(OUTPUT_DIR);

  const sourceCandidates = getSourceCandidates(draft).slice(0, limit);
  const bundles = sourceCandidates.map((candidate, index) => toBundle(candidate, index, draft));
  const outputFile = draft ? DRAFT_FILE : FINAL_FILE;

  writeJson(outputFile, {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    approvalStatus: draft ? 'draft' : 'approved',
    totalBundles: bundles.length,
    bundles
  });

  console.log(draft ? 'Generated draft bundle file.' : 'Generated approved bundle file.');
  console.log(`Bundles: ${bundles.length}`);
  console.log(`Wrote ${outputFile}`);
}

main();
