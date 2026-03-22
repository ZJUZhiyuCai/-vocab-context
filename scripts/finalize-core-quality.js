import path from 'path';
import { fileURLToPath } from 'url';
import { readJson, writeJson } from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const REVIEWED_FILE = path.join(DATA_DIR, 'ielts-core-500-reviewed.json');

const TEMPLATE_WORDS = new Set([
  'legislation', 'accountability', 'stabilize', 'escalate', 'prevail', 'substantial',
  'insufficient', 'implication', 'deterrent', 'incentive', 'precedent', 'disparity',
  'contentious', 'consensus', 'controversy', 'stance', 'outweigh', 'divergent',
  'discrepancy', 'enforcement', 'bureaucracy', 'democracy', 'transparency', 'corruption',
  'intervention', 'subsidy', 'soar', 'amplify', 'mounting', 'subside', 'waning',
  'shrinking', 'favorable', 'counterproductive', 'undesirable', 'decisive', 'influential',
  'prominent', 'excessive', 'moderate', 'mortality', 'prevalence', 'pandemic',
  'epidemic', 'vaccination', 'immunity', 'declining', 'adverse'
]);

const BAD_COLLOCATION_FIXES = {
  culture: {
    editorPartOfSpeech: 'n.',
    editorSense: 'the ideas, customs, and social behaviour of a particular group of people',
    editorEnglishDefinition: 'the ideas, customs, and social behaviour shared by a group or society',
    editorCollocations: ['local culture', 'cultural values', 'popular culture'],
    editorParaphrases: ['traditions', 'social values', 'way of life']
  },
  injure: {
    editorCollocations: ['seriously injure', 'injure workers', 'injure wildlife'],
    editorParaphrases: ['harm', 'damage', 'wound']
  },
  divulge: {
    editorCollocations: ['divulge information', 'divulge details', 'refuse to divulge'],
    editorParaphrases: ['reveal', 'disclose', 'make public']
  },
  discredit: {
    editorCollocations: ['discredit evidence', 'discredit a witness', 'attempt to discredit'],
    editorParaphrases: ['undermine', 'damage', 'cast doubt on']
  },
  embark: {
    editorCollocations: ['embark on reforms', 'embark on a project', 'embark on a career'],
    editorParaphrases: ['begin', 'start', 'set out on']
  },
  implement: {
    editorCollocations: ['implement a policy', 'implement reforms', 'implement changes'],
    editorParaphrases: ['carry out', 'put into effect', 'execute']
  },
  procrastinate: {
    editorCollocations: ['procrastinate repeatedly', 'procrastinate over decisions', 'stop procrastinating'],
    editorParaphrases: ['delay', 'put off', 'postpone']
  },
  date: {
    editorPartOfSpeech: 'n.',
    editorSense: 'a particular day, month, or year when something happens',
    editorEnglishDefinition: 'a particular day or point in time when something happens or is scheduled',
    editorCollocations: ['start date', 'closing date', 'historical date'],
    editorParaphrases: ['day', 'time', 'point in time']
  },
  confiscate: {
    editorCollocations: ['confiscate property', 'confiscate phones', 'confiscate assets'],
    editorParaphrases: ['seize', 'take away', 'impound']
  },
  implement: {
    editorCollocations: ['implement a policy', 'implement reforms', 'implement changes'],
    editorParaphrases: ['execute', 'put into effect', 'apply']
  }
};

const CONTEXT_FIXES = {
  physical: [
    { kind: 'reading', text: 'Children who get enough physical exercise often concentrate better in class and report lower stress levels.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Governments should protect physical education because it supports both health and academic performance.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I think physical activity matters because many students spend too much time sitting indoors.', translation: '', purpose: 'far-transfer' }
  ],
  powerful: [
    { kind: 'reading', text: 'Advertising remains a powerful influence on how consumers form habits and preferences.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'A powerful public campaign can change behaviour more effectively than strict punishment alone.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'In my opinion, teachers can have a powerful impact on whether students stay motivated.', translation: '', purpose: 'far-transfer' }
  ],
  restricted: [
    { kind: 'reading', text: 'In remote regions, restricted internet access can widen the gap between rural and urban students.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'If access to public transport remains restricted, many workers will have fewer job opportunities.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'Some places feel less attractive because services are too restricted outside city centres.', translation: '', purpose: 'far-transfer' }
  ],
  rewarding: [
    { kind: 'reading', text: 'Volunteering can be a rewarding experience because it develops confidence and practical skills.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Teaching may be financially difficult, but it can still be highly rewarding for many people.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I find language learning rewarding because I can use it in travel, study, and work.', translation: '', purpose: 'far-transfer' }
  ],
  viable: [
    { kind: 'reading', text: 'Researchers are considering whether electric buses are a viable solution for crowded cities.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'A policy is only viable if governments can support it financially over the long term.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I think online learning is viable for some courses but not for every subject.', translation: '', purpose: 'far-transfer' }
  ],
  beneficial: [
    { kind: 'reading', text: 'Early language support can be especially beneficial for children from disadvantaged backgrounds.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'It would be beneficial for cities to create more green spaces because they improve wellbeing.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'Part-time work can be beneficial if it does not interfere with study.', translation: '', purpose: 'far-transfer' }
  ],
  representative: [
    { kind: 'reading', text: 'The survey used a representative sample of households from both urban and rural areas.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Policymakers need representative data if they want to design fair social programmes.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I do not think one neighbourhood is representative of the whole city.', translation: '', purpose: 'far-transfer' }
  ],
  conclusive: [
    { kind: 'reading', text: 'The findings were suggestive, but the researchers admitted they were not yet conclusive.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Without conclusive evidence, governments may hesitate to commit large sums of public money.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I would not call the data conclusive because the sample was too small.', translation: '', purpose: 'far-transfer' }
  ],
  contemptuous: [
    { kind: 'reading', text: 'The article criticised a contemptuous attitude toward low-income communities in public debate.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'A contemptuous tone in political discussion can deepen division rather than solve problems.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'People usually react badly when public figures sound contemptuous or dismissive.', translation: '', purpose: 'far-transfer' }
  ],
  diligent: [
    { kind: 'reading', text: 'Diligent students often improve steadily because they review feedback carefully and work consistently.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Academic success depends not only on talent but also on diligent effort over time.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I would describe my best teachers as diligent because they always prepared thoroughly.', translation: '', purpose: 'far-transfer' }
  ],
  insufficient: [
    { kind: 'reading', text: 'Insufficient funding has limited the quality of public services in many remote communities.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'If governments provide insufficient support, social inequality is likely to widen.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I think the current response is insufficient because it does not address the main cause.', translation: '', purpose: 'far-transfer' }
  ],
  undesirable: [
    { kind: 'reading', text: 'Rapid urban growth can produce undesirable effects such as congestion and rising housing costs.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Some economic policies may create undesirable outcomes even if they increase growth in the short term.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'In my view, it would be undesirable if schools focused only on exam scores.', translation: '', purpose: 'far-transfer' }
  ],
  influential: [
    { kind: 'reading', text: 'Parents remain highly influential in shaping children?s attitudes toward education and work.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Influential public figures can help draw attention to environmental issues.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'Teachers were the most influential people in my early academic life.', translation: '', purpose: 'far-transfer' }
  ],
  excessive: [
    { kind: 'reading', text: 'Excessive screen time has been associated with sleep problems and reduced concentration.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Excessive reliance on cars can increase both pollution and congestion.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I think excessive homework can become counterproductive for younger students.', translation: '', purpose: 'far-transfer' }
  ],
  moderate: [
    { kind: 'reading', text: 'Moderate exercise is often recommended as a practical way to improve long-term health.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'A moderate policy response may be more realistic than an extreme one in the short term.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I prefer a moderate approach because it is usually easier for people to accept.', translation: '', purpose: 'far-transfer' }
  ],
  declining: [
    { kind: 'reading', text: 'The report links declining biodiversity to habitat loss and expanding urban development.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Declining public trust can make it harder for governments to implement reform.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'My hometown has changed because the local population has been declining for years.', translation: '', purpose: 'far-transfer' }
  ],
  adverse: [
    { kind: 'reading', text: 'The medicine may cause adverse effects in people with existing health problems.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Adverse weather can disrupt transport systems and raise food prices.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I think the plan had adverse consequences because it ignored local needs.', translation: '', purpose: 'far-transfer' }
  ],
  physical: [
    { kind: 'reading', text: 'Regular physical activity has been linked to better mental health and stronger academic performance among teenagers.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Governments should invest in sports facilities because physical health is closely connected to long-term wellbeing.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I think schools should protect physical education because many children do not exercise enough outside class.', translation: '', purpose: 'far-transfer' }
  ],
  powerful: [
    { kind: 'reading', text: 'Social media has become a powerful influence on how young people form opinions about public issues.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Advertising is a powerful tool, but it can also encourage unhealthy consumption habits.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'In my view, teachers can have a powerful impact on whether students remain motivated.', translation: '', purpose: 'far-transfer' }
  ],
  restricted: [
    { kind: 'reading', text: 'In many regions, access to clean water is still restricted by weak infrastructure and poor planning.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'If internet access remains restricted, students in rural communities will fall further behind.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I think some areas of the city feel less attractive because public transport is too restricted.', translation: '', purpose: 'far-transfer' }
  ],
  rewarding: [
    { kind: 'reading', text: 'Volunteering can be a rewarding experience because it builds confidence as well as practical skills.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Teaching can be financially difficult but still highly rewarding for people who value social contribution.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I find language learning rewarding because I can use it in both travel and work.', translation: '', purpose: 'far-transfer' }
  ],
  viable: [
    { kind: 'reading', text: 'Researchers are exploring whether electric public transport is a viable solution for rapidly growing cities.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'A policy is only viable if governments can fund it over the long term.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I think online learning is viable for some subjects but not for every type of course.', translation: '', purpose: 'far-transfer' }
  ],
  beneficial: [
    { kind: 'reading', text: 'Early language support is especially beneficial for children who enter school with limited literacy skills.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'It would be beneficial for cities to expand green spaces because they improve both health and social wellbeing.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'In my opinion, part-time work can be beneficial if it does not interfere with study.', translation: '', purpose: 'far-transfer' }
  ],
  representative: [
    { kind: 'reading', text: 'The survey was based on a representative sample of households from both urban and rural areas.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'To produce fair policy, governments need data that are truly representative of the population.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I do not think one neighbourhood is representative of the whole city.', translation: '', purpose: 'far-transfer' }
  ],
  conclusive: [
    { kind: 'reading', text: 'The researchers found suggestive evidence, but they admitted it was not yet conclusive.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Without conclusive data, policymakers may struggle to justify expensive reforms.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I would not call the evidence conclusive because the sample size was too small.', translation: '', purpose: 'far-transfer' }
  ],
  contemptuous: [
    { kind: 'reading', text: 'The article criticised a contemptuous attitude toward low-income communities in public debate.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'A contemptuous tone in political discussion can deepen social division instead of solving problems.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'People usually react badly when public figures sound contemptuous or dismissive.', translation: '', purpose: 'far-transfer' }
  ],
  diligent: [
    { kind: 'reading', text: 'Diligent students often improve steadily because they review feedback carefully and work consistently.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Academic success depends not only on talent but also on diligent effort over time.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I would describe my best teachers as diligent because they always prepared lessons thoroughly.', translation: '', purpose: 'far-transfer' }
  ],
  substantial: [
    { kind: 'reading', text: 'The study found a substantial gap in achievement between students from different income groups.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Substantial investment in public transport could reduce traffic and improve air quality.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I think the internet has had a substantial effect on how people communicate.', translation: '', purpose: 'far-transfer' }
  ],
  contentious: [
    { kind: 'reading', text: 'The proposal remains contentious because different groups would experience its costs and benefits unequally.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Raising university fees is a contentious policy because it affects both access and fairness.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'It is a contentious issue in my country because people disagree strongly about who should pay.', translation: '', purpose: 'far-transfer' }
  ],
  divergent: [
    { kind: 'reading', text: 'The report highlights divergent views on whether economic growth can be compatible with strict climate policy.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Different social groups may have divergent priorities when governments allocate limited resources.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'You can see divergent opinions on this topic even within the same family.', translation: '', purpose: 'far-transfer' }
  ],
  mounting: [
    { kind: 'reading', text: 'Cities are facing mounting pressure to improve housing, transport, and environmental standards at the same time.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Mounting public concern about air quality should encourage faster policy action.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I think there is mounting frustration when governments delay obvious reforms.', translation: '', purpose: 'far-transfer' }
  ],
  waning: [
    { kind: 'reading', text: 'The article describes waning public trust in institutions that fail to respond transparently.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Waning interest in reading among teenagers should be treated as an educational warning sign.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'People often notice waning enthusiasm when a project stops producing visible results.', translation: '', purpose: 'far-transfer' }
  ],
  shrinking: [
    { kind: 'reading', text: 'Many rural areas are coping with shrinking populations and reduced public services.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'A shrinking budget can make it harder for schools to maintain quality teaching.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'My hometown has changed because the local job market has been shrinking for years.', translation: '', purpose: 'far-transfer' }
  ],
  favorable: [
    { kind: 'reading', text: 'The policy was introduced at a favorable moment, when public support for reform was unusually strong.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'More favorable economic conditions would make environmental investment easier to sustain.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'Students are more likely to succeed when they study in a favorable home environment.', translation: '', purpose: 'far-transfer' }
  ],
  counterproductive: [
    { kind: 'reading', text: 'The researchers argue that excessive testing can be counterproductive if it reduces real learning time.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Harsh punishment may be counterproductive because it can damage trust instead of improving behaviour.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'In my opinion, banning all phones in class can be counterproductive if teachers never explain why.', translation: '', purpose: 'far-transfer' }
  ],
  decisive: [
    { kind: 'reading', text: 'The report concludes that teacher quality is a decisive factor in long-term student outcomes.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Decisive government action is needed when environmental damage becomes hard to reverse.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'I think family support was decisive in helping me choose my career path.', translation: '', purpose: 'far-transfer' }
  ],
  prominent: [
    { kind: 'reading', text: 'A prominent theme in the report is the unequal distribution of opportunity across regions.', translation: '', purpose: 'core' },
    { kind: 'writing', text: 'Public health should remain a prominent concern in national policy planning.', translation: '', purpose: 'near-transfer' },
    { kind: 'speaking', text: 'One prominent problem in my city is the lack of affordable housing.', translation: '', purpose: 'far-transfer' }
  ]
};

const TOPIC_META = {
  education: {
    noun: [
      'The report highlights how {word} affects student achievement and access to learning opportunities.',
      'Many schools now treat {coll1} as a practical way to improve educational outcomes.',
      'In my view, {word} matters because it shapes how learners respond to formal education.'
    ],
    verb: [
      'Schools often {word} when they are trying to improve access, fairness, or learning quality.',
      'Universities should {word} more effectively if they want better outcomes for students.',
      'I think teachers need to {word} earlier when academic problems begin to appear.'
    ],
    adj: [
      'A {word} policy can make a noticeable difference to student motivation and performance.',
      'Education systems need {word} support if they want long-term improvement.',
      'I would describe this change as {word} because it affects access to learning directly.'
    ]
  },
  environment: {
    noun: [
      'The report suggests that {word} is now central to debates about climate policy and public safety.',
      'Without stronger action, {coll1} could become more serious in the coming decades.',
      'In my view, {word} matters because environmental damage often affects the poorest communities most.'
    ],
    verb: [
      'Environmental pressure tends to {word} when governments ignore long-term costs.',
      'Authorities should {word} earlier if they want to avoid more expensive environmental damage later.',
      'I think policymakers need to {word} carefully when pollution begins to affect public health.'
    ],
    adj: [
      'A {word} response is needed when environmental risks are large and difficult to reverse.',
      'The data show that {word} changes in climate can affect farming, transport, and public health.',
      'I would call this trend {word} because it has clear consequences for future sustainability.'
    ]
  },
  technology: {
    noun: [
      'The article shows that {word} is becoming more important as digital systems shape everyday life.',
      'Many organisations now see {coll1} as essential for efficiency and long-term innovation.',
      'In my view, {word} matters because technology changes how people study, work, and communicate.'
    ],
    verb: [
      'Firms often {word} when they want to modernise services or reduce inefficiency.',
      'Governments should {word} carefully if they want technology policy to benefit the wider public.',
      'I think institutions need to {word} earlier before digital problems become harder to solve.'
    ],
    adj: [
      'A {word} solution can improve access to information and make services more efficient.',
      'Technology policy must stay {word} if it is to respond to rapid digital change.',
      'I would describe this development as {word} because it directly affects how people use technology.'
    ]
  },
  government: {
    noun: [
      'The report argues that {word} remains a key issue in public policy and governance.',
      'Many analysts believe that stronger {coll1} would improve trust in government decisions.',
      'In my view, {word} matters because it shapes how citizens judge public institutions.'
    ],
    verb: [
      'Governments often {word} when they face pressure to respond to social or economic problems.',
      'Leaders should {word} more carefully if they want policy changes to be both fair and effective.',
      'I think authorities need to {word} earlier before public dissatisfaction becomes harder to manage.'
    ],
    adj: [
      'A {word} policy response can influence public trust and long-term stability.',
      'Governments need {word} measures when they are dealing with complex social problems.',
      'I would describe this decision as {word} because it affects public life in a direct way.'
    ]
  },
  health: {
    noun: [
      'The report identifies {word} as a major issue in public health and social wellbeing.',
      'Better {coll1} could reduce long-term pressure on healthcare systems.',
      'In my view, {word} matters because health policy should focus on prevention as well as treatment.'
    ],
    verb: [
      'Health systems must {word} quickly when early signs of risk begin to appear.',
      'Public campaigns should {word} more effectively if they are to improve long-term wellbeing.',
      'I think authorities need to {word} early rather than waiting for the problem to spread.'
    ],
    adj: [
      'A {word} health strategy can reduce pressure on hospitals and improve outcomes.',
      'The evidence shows that {word} conditions often have wider social consequences.',
      'I would describe this as {word} because it affects health and quality of life directly.'
    ]
  },
  media: {
    noun: [
      'The article suggests that {word} has become an important issue in modern media and communication.',
      'Stronger {coll1} may help audiences judge information more critically.',
      'In my view, {word} matters because media influence public understanding of major issues.'
    ],
    verb: [
      'Media organisations may {word} when they want to influence public opinion or shape a story.',
      'Editors should {word} carefully if they want to maintain public trust.',
      'I think news outlets need to {word} responsibly when reporting sensitive issues.'
    ],
    adj: [
      'A {word} media environment can shape how people interpret public events.',
      'The study shows that {word} coverage often affects how audiences understand policy debates.',
      'I would describe this reporting style as {word} because it changes how information is received.'
    ]
  },
  culture: {
    noun: [
      'The text presents {word} as an important feature of social values and cultural change.',
      'Many people see {coll1} as part of a broader shift in modern society.',
      'In my view, {word} matters because it influences how communities define identity and behaviour.'
    ],
    verb: [
      'Social norms can {word} when values and expectations begin to change.',
      'Communities often {word} when they try to protect tradition while adapting to modern life.',
      'I think people may {word} differently depending on the culture they grow up in.'
    ],
    adj: [
      'A {word} attitude can affect how people relate to tradition, identity, and change.',
      'The article suggests that {word} values often shape behaviour in public life.',
      'I would describe this as {word} because it reflects a wider change in social beliefs.'
    ]
  },
  work: {
    noun: [
      'The report identifies {word} as a key issue in employment and workplace organisation.',
      'Better {coll1} may improve efficiency and long-term job satisfaction.',
      'In my view, {word} matters because workplace conditions strongly affect people?s quality of life.'
    ],
    verb: [
      'Employers often {word} when they try to improve performance or reduce costs.',
      'Workplaces should {word} more effectively if they want to retain skilled staff.',
      'I think managers need to {word} earlier when problems begin to affect productivity.'
    ],
    adj: [
      'A {word} workplace policy can affect both performance and staff wellbeing.',
      'The evidence suggests that {word} changes at work can influence long-term productivity.',
      'I would call this trend {word} because it directly shapes employment conditions.'
    ]
  },
  general: {
    noun: [
      'The report identifies {word} as an important issue in modern society.',
      'Stronger {coll1} could help address several related social problems.',
      'In my view, {word} matters because it shapes long-term public outcomes.'
    ],
    verb: [
      'Institutions often {word} when they are trying to respond to major public concerns.',
      'Decision-makers should {word} more carefully if they want sustainable results.',
      'I think leaders need to {word} earlier before the problem becomes harder to manage.'
    ],
    adj: [
      'A {word} response can make a noticeable difference to public outcomes.',
      'The evidence suggests that {word} changes often affect society over the long term.',
      'I would describe this as {word} because it has clear social consequences.'
    ]
  }
};

function cleanMeaning(meaning = '') {
  return String(meaning)
    .replace(/^(n\.|v\.|adj\.|adv\.|vi\.|vt\.|art\.|prep\.|conj\.|pron\.)\s*/i, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function simplifyChineseMeaning(meaning = '') {
  const cleaned = cleanMeaning(meaning)
    .replace(/[()（）]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\[[^\]]+\]/g, '')
    .replace(/“[^”]+”的变体/g, '')
    .replace(/abbr\.[^,，;；。]*/gi, '')
    .trim();

  const parts = cleaned
    .split(/[\n;；]/)
    .flatMap(part => part.split(/[，,]/))
    .map(part => part.trim())
    .filter(Boolean);

  return Array.from(new Set(parts)).slice(0, 3).join('；');
}

function getTemplates(topic, partOfSpeech) {
  const group = TOPIC_META[topic] || TOPIC_META.general;
  if (partOfSpeech === 'v.') return group.verb;
  if (partOfSpeech === 'adj.') return group.adj;
  return group.noun;
}

function renderTemplate(template, candidate, coll1) {
  return template
    .replaceAll('{word}', candidate.word)
    .replaceAll('{coll1}', coll1 || candidate.word);
}

function buildBetterContexts(candidate) {
  const partOfSpeech = candidate.editorPartOfSpeech || candidate.partOfSpeech || 'n.';
  const topic = candidate.topics?.[0] || 'general';
  const collocations = (candidate.editorCollocations?.length ? candidate.editorCollocations : []).filter(Boolean);
  const coll1 = collocations[0] || candidate.word;
  const templates = getTemplates(topic, partOfSpeech);

  const kinds = ['reading', 'writing', 'speaking'];
  const purposes = ['core', 'near-transfer', 'far-transfer'];

  return templates.slice(0, 3).map((template, index) => ({
    kind: kinds[index],
    text: renderTemplate(template, candidate, coll1),
    translation: '',
    purpose: purposes[index]
  }));
}

function fixReviewedFile() {
  const data = readJson(REVIEWED_FILE);
  const candidates = data.candidates || [];

  let chineseFixed = 0;
  let contextsFixed = 0;
  let collocationsFixed = 0;

  for (const candidate of candidates) {
    if (candidate.reviewStatus !== 'approved' || !candidate.approved) continue;

    const currentChinese = String(candidate.editorChineseMeaning || '');
    if (!currentChinese || /\n/.test(currentChinese) || /[�]|\?{3,}/.test(currentChinese)) {
      candidate.editorChineseMeaning = simplifyChineseMeaning(candidate.meaning);
      chineseFixed++;
    }

    if (TEMPLATE_WORDS.has(candidate.key) || CONTEXT_FIXES[candidate.key]) {
      candidate.editorContexts = CONTEXT_FIXES[candidate.key] || buildBetterContexts(candidate);
      contextsFixed++;
    }

    if (BAD_COLLOCATION_FIXES[candidate.key]) {
      const fix = BAD_COLLOCATION_FIXES[candidate.key];
      if (fix.editorPartOfSpeech) candidate.editorPartOfSpeech = fix.editorPartOfSpeech;
      if (fix.editorSense) candidate.editorSense = fix.editorSense;
      if (fix.editorEnglishDefinition) candidate.editorEnglishDefinition = fix.editorEnglishDefinition;
      if (fix.editorCollocations) candidate.editorCollocations = fix.editorCollocations;
      if (fix.editorParaphrases) candidate.editorParaphrases = fix.editorParaphrases;
      collocationsFixed++;
      if (!candidate.editorContexts?.length) {
        candidate.editorContexts = buildBetterContexts(candidate);
      }
    }
  }

  data.generatedAt = new Date().toISOString();
  writeJson(REVIEWED_FILE, data);

  console.log(JSON.stringify({ chineseFixed, contextsFixed, collocationsFixed }, null, 2));
}

fixReviewedFile();
