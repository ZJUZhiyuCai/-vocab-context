/**
 * 修复弱 paraphrase
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { readJson, writeJson } from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REVIEWED_FILE = path.join(__dirname, '../data/ielts-core-500-reviewed.json');

// Paraphrase 修复映射
const paraphraseFixes = {
  major: ['significant', 'considerable', 'substantial'],
  instance: ['example', 'case', 'occurrence'],
  source: ['origin', 'cause', 'basis'],
  task: ['assignment', 'duty', 'job'],
  finance: ['funding', 'capital', 'investment'],
  initial: ['first', 'beginning', 'original'],
  labour: ['workforce', 'workers', 'employment'],
  select: ['choose', 'pick', 'opt for'],
  sequence: ['order', 'series', 'succession'],
  injure: ['harm', 'hurt', 'damage'],
  vary: ['differ', 'change', 'fluctuate'],
  previous: ['earlier', 'prior', 'former'],
  authority: ['power', 'control', 'influence'],
  available: ['accessible', 'obtainable', 'ready'],
  individual: ['personal', 'single', 'private'],
  prowl: ['lurk', 'rove', 'wander'],
  divulge: ['reveal', 'disclose', 'expose'],
  subscribe: ['sign up', 'enrol', 'register'],
  heartbreaking: ['devastating', 'distressing', 'tragic'],
  boycott: ['avoid', 'reject', 'refuse'],
  concentrate: ['focus', 'direct attention', 'pay attention'],
  debrief: ['question', 'interview', 'examine'],
  discredit: ['disgrace', 'shame', 'humiliate'],
  embark: ['begin', 'start', 'commence'],
  implement: ['apply', 'execute', 'carry out'],
  mislead: ['deceive', 'misguide', 'delude'],
  moot: ['debatable', 'questionable', 'doubtful'],
  parody: ['satire', 'imitation', 'spoof'],
  publication: ['release', 'issue', 'edition'],
  punishable: ['liable', 'subject to penalty', 'prosecutable'],
  communications: ['interaction', 'exchange', 'correspondence'],
  fundamentally: ['essentially', 'basically', 'primarily'],
  procrastinate: ['delay', 'postpone', 'put off'],
  unprofessional: ['unskilled', 'improper', 'inappropriate'],
  date: ['time', 'appointment', 'meeting'],
  respond: ['reply', 'answer', 'react'],
  caution: ['warning', 'care', 'alert'],
  instruct: ['direct', 'guide', 'teach'],
  confiscate: ['seize', 'take', 'impound'],
  coordination: ['organization', 'management', 'cooperation'],
  pivotal: ['crucial', 'essential', 'central'],
  prominent: ['notable', 'distinguished', 'outstanding']
};

function fixParaphrases() {
  const data = readJson(REVIEWED_FILE);
  let fixedCount = 0;
  const fixed = [];

  data.candidates.forEach(entry => {
    if (!entry.approved) return;

    const newParaphrases = paraphraseFixes[entry.key];
    if (newParaphrases) {
      entry.editorParaphrases = newParaphrases;
      fixedCount++;
      fixed.push(entry.key);
    }
  });

  writeJson(REVIEWED_FILE, data);

  console.log('\n=== Paraphrase Fixes ===\n');
  console.log(`Total entries fixed: ${fixedCount}`);
  console.log('\nFixed words:');
  fixed.forEach(word => console.log(`  - ${word}: [${paraphraseFixes[word].join(', ')}]`));

  return { fixedCount, fixed };
}

fixParaphrases();