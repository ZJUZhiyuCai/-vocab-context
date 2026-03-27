const TOPIC_LABELS = {
  education: 'education',
  government: 'government and public policy',
  environment: 'the environment',
  technology: 'technology and innovation',
  health: 'health and healthcare',
  work: 'work and employment',
  media: 'media and communication',
  crime: 'crime and justice'
};

const ACTION_STARTERS = new Set([
  'accept',
  'access',
  'achieve',
  'address',
  'announce',
  'appear',
  'arrest',
  'be',
  'become',
  'broadcast',
  'build',
  'change',
  'close',
  'combat',
  'commit',
  'complete',
  'control',
  'create',
  'cut',
  'debug',
  'decide',
  'demonstrate',
  'destroy',
  'develop',
  'do',
  'drive',
  'expand',
  'face',
  'fight',
  'fill',
  'find',
  'fly',
  'foster',
  'gain',
  'get',
  'grant',
  'have',
  'help',
  'hire',
  'improve',
  'increase',
  'install',
  'keep',
  'kill',
  'launder',
  'learn',
  'maintain',
  'make',
  'manage',
  'meet',
  'miss',
  'pay',
  'plan',
  'post',
  'prevent',
  'prescribe',
  'process',
  'produce',
  'promote',
  'protect',
  'prove',
  'question',
  'reach',
  'recognize',
  'reduce',
  'regulate',
  'remain',
  'remove',
  'resign',
  'spread',
  'stop',
  'suffer',
  'support',
  'take',
  'teach',
  'telecommute',
  'treat',
  'undergo',
  'upgrade',
  'use',
  'visit',
  'work',
  'write'
]);

function stripTrailingPeriod(text) {
  return String(text || '').trim().replace(/\.+$/, '');
}

function capitalize(text) {
  const value = String(text || '').trim();
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function indefiniteArticle(term) {
  const value = String(term || '').trim().toLowerCase();
  if (!value) return 'a';
  if (/^(honest|hour|heir|honou?r)/.test(value)) return 'an';
  if (/^(one|once|uni([^nmd]|$)|use|user|euro|ubiquit)/.test(value)) return 'a';
  return /^[aeiou]/.test(value) ? 'an' : 'a';
}

function withIndefiniteArticle(term) {
  const value = String(term || '').trim();
  if (!value) return '';
  return `${indefiniteArticle(value)} ${value}`;
}

function normalizeCollocations(collocations) {
  if (!Array.isArray(collocations)) return [];
  return collocations
    .map((entry) => String(entry || '').trim())
    .filter(Boolean);
}

function firstToken(phrase) {
  return String(phrase || '')
    .trim()
    .toLowerCase()
    .split(/[\s-]+/)[0];
}

function choosePreferredCollocation(word, partOfSpeech, collocations) {
  const normalized = normalizeCollocations(collocations);
  if (!normalized.length) return '';

  if (partOfSpeech?.startsWith('v')) {
    return (
      normalized.find((phrase) => phrase.toLowerCase().startsWith(String(word || '').toLowerCase())) ||
      normalized[0]
    );
  }

  return normalized.find((phrase) => !ACTION_STARTERS.has(firstToken(phrase))) || normalized[0];
}

function buildReadingSentence(item, topicLabel) {
  const word = String(item.word || '').trim();
  const definition = stripTrailingPeriod(item.englishDefinition || item.sense);

  if (!word) {
    return `This term is commonly used in discussions about ${topicLabel}.`;
  }

  if (!definition) {
    return `The term "${word}" is commonly used in discussions about ${topicLabel}.`;
  }

  if (item.partOfSpeech?.startsWith('n')) {
    const subject = /^(a|an)\b/i.test(definition)
      ? capitalize(withIndefiniteArticle(word))
      : capitalize(word);
    return `${subject} is ${definition}.`;
  }

  if (item.partOfSpeech?.startsWith('v')) {
    if (/^to\b/i.test(definition)) {
      return `To ${word} means ${definition}.`;
    }
    return `To ${word} means to ${definition}.`;
  }

  if (item.partOfSpeech?.startsWith('adj')) {
    return `In ${topicLabel} contexts, "${word}" is an adjective meaning ${definition}.`;
  }

  if (item.partOfSpeech?.startsWith('adv')) {
    return `In ${topicLabel} contexts, "${word}" is an adverb meaning ${definition}.`;
  }

  return `In ${topicLabel} contexts, "${word}" means ${definition}.`;
}

function buildWritingSentence(item, topicLabel, collocation) {
  const word = String(item.word || '').trim();
  const posLabel = item.partOfSpeech?.startsWith('n')
    ? 'noun'
    : item.partOfSpeech?.startsWith('v')
    ? 'verb'
    : item.partOfSpeech?.startsWith('adj')
    ? 'adjective'
    : item.partOfSpeech?.startsWith('adv')
    ? 'adverb'
    : 'term';

  if (collocation) {
    return `In IELTS writing about ${topicLabel}, phrases such as "${collocation}" help you express ideas more precisely.`;
  }

  return `In IELTS writing about ${topicLabel}, the ${posLabel} "${word}" helps you express ideas more precisely.`;
}

function buildSpeakingSentence(item, topicLabel, collocation) {
  const word = String(item.word || '').trim();

  if (collocation) {
    return `In IELTS speaking, you can use "${word}" in phrases such as "${collocation}" when discussing ${topicLabel}.`;
  }

  return `In IELTS speaking, "${word}" is useful when discussing ${topicLabel}.`;
}

export function buildExpansionContexts(item) {
  const topicLabel = TOPIC_LABELS[item.topic] || item.topic || 'this topic';
  const collocation = choosePreferredCollocation(item.word, item.partOfSpeech, item.collocations);

  return [
    {
      kind: 'reading',
      text: buildReadingSentence(item, topicLabel),
      translation: '',
      purpose: 'core'
    },
    {
      kind: 'writing',
      text: buildWritingSentence(item, topicLabel, collocation),
      translation: '',
      purpose: 'near-transfer'
    },
    {
      kind: 'speaking',
      text: buildSpeakingSentence(item, topicLabel, collocation),
      translation: '',
      purpose: 'far-transfer'
    }
  ];
}
