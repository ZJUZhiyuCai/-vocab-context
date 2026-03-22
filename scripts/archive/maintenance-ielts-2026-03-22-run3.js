import path from 'path';
import { fileURLToPath } from 'url';
import { readJson, writeJson } from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REVIEWED_FILE = path.join(__dirname, '../data/ielts-core-500-reviewed.json');

const ENRICHMENTS = {
  recede: {
    reviewerNotes:
      'Maintenance enrichment: replaced generic environment filler with a clean retreating-or-weakening sense that works for climate, flood, and public-risk discussion.',
    ipa: '/rɪˈsiːd/',
    editorSense: 'to move back or become less strong, less serious, or less noticeable',
    editorEnglishDefinition:
      'To move further away or to become weaker, lower, or less serious over time.',
    editorCollocations: ['floodwaters recede', 'coastline recede', 'threat recede'],
    editorParaphrases: ['retreat', 'withdraw', 'fade'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'In some regions, glaciers are starting to recede as average temperatures continue to rise.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Governments must support farmers when water supplies recede during longer periods of drought.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'People in my city feel relieved when floodwaters recede, but the damage often remains for months.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt:
      'Use "recede" in one IELTS-style sentence about climate change, flood risk, or a problem becoming weaker.'
  },
  diminishing: {
    reviewerNotes:
      'Maintenance enrichment: replaced generic environment filler with a clear decreasing-amount adjective for resources, returns, and public attention.',
    ipa: '/dɪˈmɪnɪʃɪŋ/',
    editorSense: 'becoming smaller, weaker, or less important over time',
    editorEnglishDefinition:
      'Becoming gradually smaller, fewer, weaker, or less important.',
    editorCollocations: ['diminishing resources', 'diminishing returns', 'diminishing interest'],
    editorParaphrases: ['declining', 'decreasing', 'shrinking'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Many coastal communities are struggling with diminishing fish stocks and unstable incomes.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Governments should respond quickly to diminishing water resources instead of waiting for a severe crisis.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'I think people become anxious when they see diminishing job security in their area.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt:
      'Use "diminishing" in one IELTS-style sentence about resources, returns, or public interest.'
  },
  valuable: {
    reviewerNotes:
      'Maintenance enrichment: replaced generic education filler with a cleaner high-worth sense for skills, feedback, and learning opportunities.',
    ipa: '/ˈvæljuəbəl/',
    editorSense: 'useful, important, or worth a lot because it gives real benefit',
    editorEnglishDefinition:
      'Useful, important, or worth a lot because it provides real benefit, insight, or support.',
    editorCollocations: ['valuable skill', 'valuable feedback', 'valuable experience'],
    editorParaphrases: ['useful', 'beneficial', 'worthwhile'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Work placements can give students valuable experience before they enter the labour market.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Schools should treat critical thinking as a valuable skill rather than focusing only on memorisation.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'I received some valuable feedback from a teacher that completely changed how I prepared for exams.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt:
      'Use "valuable" in one IELTS-style sentence about skills, experience, or feedback.'
  },
  detrimental: {
    reviewerNotes:
      'Maintenance enrichment: replaced generic environment filler with a clean harmful-effect sense for pollution, stress, and public policy discussion.',
    ipa: '/ˌdetrɪˈmentəl/',
    editorSense: 'causing harm or having a damaging effect on something',
    editorEnglishDefinition:
      'Causing harm or having a damaging effect on a person, system, or environment.',
    editorCollocations: ['detrimental effect', 'detrimental to health', 'environmentally detrimental'],
    editorParaphrases: ['harmful', 'damaging', 'adverse'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Heavy plastic use can be detrimental to marine life when waste enters rivers and oceans.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Short-term economic growth should not be prioritised if it is detrimental to public health and air quality.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'I think excessive screen time can be detrimental to young children if it replaces exercise and sleep.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt:
      'Use "detrimental" in one IELTS-style sentence about harmful effects on health, society, or the environment.'
  },
  pivotal: {
    reviewerNotes:
      'Maintenance enrichment: replaced generic education filler with a cleaner central-importance sense for reform, support, and long-term outcomes.',
    ipa: '/ˈpɪvətl/',
    editorSense: 'extremely important because it strongly influences what happens next',
    editorEnglishDefinition:
      'Extremely important because it has a major influence on future events, decisions, or results.',
    editorCollocations: ['pivotal role', 'pivotal moment', 'pivotal factor'],
    editorParaphrases: ['crucial', 'key', 'central'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Parental support plays a pivotal role in shaping children’s long-term attitudes to learning.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Teacher training is pivotal if governments want education reform to succeed beyond the first few years.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'Choosing the right subjects at school can be pivotal for a student’s future career path.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt:
      'Use "pivotal" in one IELTS-style sentence about a key role, decision, or factor in education or society.'
  },
  notable: {
    reviewerNotes:
      'Maintenance enrichment: replaced generic education filler with a clearer worth-noticing sense for trends, improvements, and contrasts in data and essays.',
    ipa: '/ˈnəʊtəbl/',
    editorSense: 'important or interesting enough to deserve attention',
    editorEnglishDefinition:
      'Important, interesting, or unusual enough to be noticed and commented on.',
    editorCollocations: ['notable increase', 'notable difference', 'notable example'],
    editorParaphrases: ['remarkable', 'significant', 'worth noticing'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'The report found a notable difference in test scores between urban and rural schools.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'One notable benefit of smaller classes is that teachers can identify learning problems much earlier.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'There has been a notable increase in online learning opportunities in my city over the past few years.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt:
      'Use "notable" in one IELTS-style sentence about a difference, increase, or example worth attention.'
  }
};

const REJECTIONS = {
  contrived:
    'Rejected in maintenance mode: expressive and literary adjective with weak paraphrase value for IELTS production, plus source evidence that mixes senses rather than supporting a stable core teaching item.',
  fatality:
    'Rejected in maintenance mode: narrow incident-led noun tied to death statistics and crime reporting, with weak value for broad IELTS writing and speaking tasks.'
};

function main() {
  const data = readJson(REVIEWED_FILE);
  const candidates = data.candidates || [];
  let enrichedCount = 0;
  let rejectedCount = 0;

  for (const candidate of candidates) {
    const rejection = REJECTIONS[candidate.key];
    if (rejection && candidate.reviewStatus === 'candidate') {
      candidate.reviewStatus = 'rejected';
      candidate.approved = false;
      candidate.reviewerNotes = rejection;
      rejectedCount += 1;
      continue;
    }

    const enrichment = ENRICHMENTS[candidate.key];
    if (!enrichment) continue;
    if (candidate.reviewStatus !== 'approved' || candidate.approved !== true) continue;
    Object.assign(candidate, enrichment);
    enrichedCount += 1;
  }

  data.generatedAt = new Date().toISOString();
  writeJson(REVIEWED_FILE, data);

  console.log(`Rejected ${rejectedCount} candidate items.`);
  console.log(`Enriched ${enrichedCount} approved items.`);
  console.log(`Updated ${REVIEWED_FILE}`);
}

main();
