import path from 'path';
import { fileURLToPath } from 'url';
import { readJson, writeJson } from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REVIEWED_FILE = path.join(__dirname, '../data/ielts-core-500-reviewed.json');

const APPROVALS = {
  sanction: {
    reviewStatus: 'approved',
    approved: true,
    reviewerNotes:
      'Approved in maintenance mode: formal policy verb with clear IELTS transfer for government, regulation, and public borrowing contexts; editor overrides isolate the approval sense from noun-led source evidence.',
    editorSense: 'to officially approve, permit, or authorise an action or policy',
    editorEnglishDefinition:
      'To give official permission for an action, plan, or change, especially in government, law, or institutional decision-making.',
    editorChineseMeaning: '批准，认可，准许（尤指政府、机构或法律层面的行动、政策或变动）',
    editorCollocations: ['sanction a plan', 'sanction an increase', 'officially sanction'],
    editorParaphrases: ['approve', 'authorise', 'permit'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'The finance ministry refused to sanction further borrowing without a detailed review of public spending.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Governments should not sanction large infrastructure projects unless the long-term environmental costs are clear.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'I think local authorities should only sanction major changes after consulting residents properly.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt:
      'Use "sanction" in one IELTS-style sentence about official approval, public borrowing, or policy change.'
  },
  modernize: {
    reviewStatus: 'approved',
    approved: true,
    reviewerNotes:
      'Approved in maintenance mode: useful government and transport verb despite one corrupted source example; editor overrides supply clean learner-facing contexts.',
    editorSense: 'to update something so it works better in a more modern way',
    editorEnglishDefinition:
      'To improve a system, service, or industry by introducing more modern methods, technology, or infrastructure.',
    editorChineseMeaning: '使现代化；通过更新技术、制度或基础设施来提升系统、服务或行业',
    editorCollocations: ['modernize the network', 'modernize public services', 'modernize industry'],
    editorParaphrases: ['update', 'upgrade', 'bring up to date'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Several countries are trying to modernize their rail systems to reduce congestion and delays.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Governments should modernize public transport before expanding road space for private cars.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'My city needs to modernize its ticketing system because commuters still waste time queueing.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt:
      'Use "modernize" in one IELTS-style sentence about transport, public services, or industrial reform.'
  },
  unofficial: {
    reviewStatus: 'approved',
    approved: true,
    reviewerNotes:
      'Approved in maintenance mode: transferable formal adjective for informal labour, unofficial information, and government communication; editor overrides remove adverb-led source noise and sharpen the topic focus.',
    topics: ['government', 'work'],
    editorSense: 'not formally approved, recognised, or announced by an authority',
    editorEnglishDefinition:
      'Not formally approved, recognised, or announced by an official organisation, authority, or employer.',
    editorChineseMeaning: '非官方的；未被机构、政府或雇主正式承认、批准或公布的',
    editorCollocations: ['unofficial information', 'unofficial sector', 'unofficial report'],
    editorParaphrases: ['informal', 'unconfirmed', 'not officially recognised'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'In some cities, a large unofficial labour market exists outside normal legal protection.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'People should be cautious about acting on unofficial reports before the government releases verified data.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'I usually ignore unofficial news online until I see the same claim confirmed by a reliable source.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt:
      'Use "unofficial" in one IELTS-style sentence about labour, information, or government announcements.'
  }
};

const REJECTIONS = {
  retail:
    'Rejected in maintenance mode: noun-led commercial examples dominate, so the tagged verb entry is not a clean IELTS Core teaching item.',
  smuggle:
    'Rejected in maintenance mode: crime-focused and narrow, with source evidence centred on the noun "smuggler" rather than a transferable core verb.',
  soak:
    'Rejected in maintenance mode: source evidence is corrupted and specialist ("soakage"), making the learner-facing lemma unstable.',
  assassinate:
    'Rejected in maintenance mode: overly violent and narrow for IELTS Core, with little value beyond crime reporting.',
  blip:
    'Rejected in maintenance mode: informal noun-led usage dominates, so it adds little value to formal IELTS production.',
  firewall:
    'Rejected in maintenance mode: technology noun-led and too specialist for the remaining core slots.',
  homeward:
    'Rejected in maintenance mode: low-transfer directional adverb with weak usefulness for IELTS writing and speaking.',
  preserving:
    'Rejected in maintenance mode: inflected form rather than a clean lemma; "preserve" is the stable teachable target.',
  zinc:
    'Rejected in maintenance mode: chemistry-led specialist terminology with weak IELTS Core transfer.',
  collude:
    'Rejected in maintenance mode: low-frequency formal verb with weak and partly corrupted source support.',
  congressional:
    'Rejected in maintenance mode: too US-specific and civics-bound for a globally useful IELTS Core bundle.',
  electromagnetic:
    'Rejected in maintenance mode: specialist scientific adjective that is too narrow for the core learner bundle.',
  auld:
    'Rejected in maintenance mode: effectively limited to a fixed cultural phrase rather than a productive IELTS adjective.',
  beret:
    'Rejected in maintenance mode: concrete clothing noun with low academic and paraphrasing value.',
  bloodshot:
    'Rejected in maintenance mode: descriptive health adjective that is too narrow and low-value for IELTS Core.'
};

const ENRICHMENTS = {
  geographic: {
    reviewerNotes:
      'Maintenance enrichment: replaced generic output with a clean policy-and-location sense for environment and regional inequality contexts.',
    editorSense: 'related to location, physical features, or the spatial distribution of places and populations',
    editorEnglishDefinition:
      'Related to where places are, how land is arranged, or how people and services are distributed across regions.',
    editorChineseMeaning: '地理上的；与位置、地形或人口和资源在不同地区的分布有关',
    editorCollocations: ['geographic location', 'geographic inequality', 'geographic distribution'],
    editorParaphrases: ['spatial', 'regional', 'location-based'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Geographic isolation can make it harder for rural communities to reach hospitals and universities.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Governments should reduce geographic inequality by improving transport links to remote areas.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'In my country, geographic location still affects access to jobs, education, and healthcare.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt:
      'Use "geographic" in one IELTS-style sentence about location, regional inequality, or access to services.'
  },
  expand: {
    reviewerNotes:
      'Maintenance enrichment: replaced template contexts with clean education-policy uses and clarified the growth/extension sense.',
    editorSense: 'to make something larger in size, range, or scope',
    editorEnglishDefinition:
      'To increase the size, range, or scope of something such as a service, programme, or area of knowledge.',
    editorChineseMeaning: '扩大；拓展某项服务、项目、知识范围或影响力',
    editorCollocations: ['expand access', 'expand a programme', 'expand knowledge'],
    editorParaphrases: ['broaden', 'extend', 'increase'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Many schools are trying to expand access to digital resources for students in remote areas.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Governments should expand vocational programmes if they want education to reflect labour-market needs.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'I would like universities to expand internship opportunities because practical experience matters.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt:
      'Use "expand" in one IELTS-style sentence about education access, programmes, or opportunities.'
  },
  surge: {
    reviewerNotes:
      'Maintenance enrichment: replaced generic template output with a cleaner increase sense for environment and energy discussions.',
    editorSense: 'to increase suddenly and strongly',
    editorEnglishDefinition:
      'To rise quickly and sharply in amount, level, or intensity, especially when describing demand, prices, pollution, or population pressure.',
    editorChineseMeaning: '激增；数量、水平或强度在短时间内快速上升',
    editorCollocations: ['surge in demand', 'prices surge', 'emissions surge'],
    editorParaphrases: ['rise sharply', 'increase rapidly', 'jump'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Electricity demand can surge during extremely hot weather when more households use air conditioning.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'If cities keep expanding without planning, traffic emissions may surge in the next decade.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'Prices tend to surge when a city becomes popular with tourists and investors at the same time.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt:
      'Use "surge" in one IELTS-style sentence about demand, prices, emissions, or urban growth.'
  },
  constructive: {
    reviewerNotes:
      'Maintenance enrichment: replaced template filler with discussion- and feedback-based education contexts.',
    editorSense: 'helpful and intended to improve something rather than simply criticise it',
    editorEnglishDefinition:
      'Helpful, practical, and aimed at improving a situation, discussion, or piece of work.',
    editorChineseMeaning: '建设性的；有助于改进问题、讨论或工作的',
    editorCollocations: ['constructive feedback', 'constructive discussion', 'constructive criticism'],
    editorParaphrases: ['helpful', 'productive', 'solution-focused'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Students make faster progress when teachers provide constructive feedback instead of vague criticism.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Classroom debate should be constructive so that learners develop reasoning rather than hostility.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'I appreciate constructive comments because they show me exactly how to improve.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt:
      'Use "constructive" in one IELTS-style sentence about feedback, discussion, or problem-solving.'
  },
  productive: {
    reviewerNotes:
      'Maintenance enrichment: replaced generic template content with learner-safe education and work-readiness uses.',
    editorSense: 'producing useful results or achieving a lot',
    editorEnglishDefinition:
      'Producing useful results, or working in a way that achieves a lot in an effective period of time.',
    editorChineseMeaning: '富有成效的；能有效产出成果或完成较多工作的',
    editorCollocations: ['productive lesson', 'productive use of time', 'highly productive'],
    editorParaphrases: ['effective', 'efficient', 'result-oriented'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Shorter classes can still be productive if the lesson goals are clear and realistic.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Students need a quiet environment if they are expected to make productive use of study time.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'I feel most productive when I plan my tasks before I start studying.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt:
      'Use "productive" in one IELTS-style sentence about study habits, lessons, or work routines.'
  },
  fruitful: {
    reviewerNotes:
      'Maintenance enrichment: replaced generic template content with a clearer successful-outcome sense for education and cooperation.',
    editorSense: 'producing good and useful results',
    editorEnglishDefinition:
      'Producing positive, useful, or successful results, especially after discussion, research, or cooperation.',
    editorChineseMeaning: '富有成效的；能够带来积极、有用或成功结果的',
    editorCollocations: ['fruitful discussion', 'fruitful cooperation', 'fruitful research'],
    editorParaphrases: ['successful', 'beneficial', 'productive'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'The partnership between schools and local employers has led to fruitful training opportunities.',
        translation: '',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'International exchange programmes can be fruitful when students are given clear academic goals.',
        translation: '',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'Group study can be fruitful if everyone prepares seriously before the meeting.',
        translation: '',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt:
      'Use "fruitful" in one IELTS-style sentence about discussion, cooperation, or learning outcomes.'
  }
};

function main() {
  const data = readJson(REVIEWED_FILE);
  const candidates = data.candidates || [];

  let approvedCount = 0;
  let rejectedCount = 0;
  let enrichedCount = 0;

  for (const candidate of candidates) {
    const approval = APPROVALS[candidate.key];
    if (approval && candidate.reviewStatus === 'candidate') {
      Object.assign(candidate, approval);
      approvedCount += 1;
      continue;
    }

    const rejectionNote = REJECTIONS[candidate.key];
    if (rejectionNote && candidate.reviewStatus === 'candidate') {
      candidate.reviewStatus = 'rejected';
      candidate.approved = false;
      candidate.reviewerNotes = rejectionNote;
      rejectedCount += 1;
      continue;
    }

    const enrichment = ENRICHMENTS[candidate.key];
    if (enrichment && candidate.reviewStatus === 'approved' && candidate.approved === true) {
      Object.assign(candidate, enrichment);
      enrichedCount += 1;
    }
  }

  data.generatedAt = new Date().toISOString();
  writeJson(REVIEWED_FILE, data);

  console.log(`Approved ${approvedCount} candidate items.`);
  console.log(`Rejected ${rejectedCount} candidate items.`);
  console.log(`Enriched ${enrichedCount} approved items.`);
  console.log(`Updated ${REVIEWED_FILE}`);
}

main();
