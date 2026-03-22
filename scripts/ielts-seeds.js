export const AWL_CORE_SEEDS = [
  'analyse', 'analysis', 'approach', 'area', 'assess', 'assessment', 'assume', 'authority',
  'available', 'benefit', 'concept', 'consist', 'constant', 'context', 'contract', 'create',
  'data', 'define', 'derive', 'distribute', 'economy', 'environment', 'establish', 'estimate',
  'evidence', 'export', 'factor', 'finance', 'formula', 'function', 'identify', 'income',
  'indicate', 'individual', 'interpret', 'issue', 'labour', 'legal', 'legislate', 'major',
  'method', 'occur', 'percent', 'period', 'policy', 'principle', 'proceed', 'process',
  'require', 'research', 'response', 'role', 'section', 'sector', 'significant', 'similar',
  'source', 'specific', 'structure', 'theory', 'vary', 'achieve', 'acquire', 'administrate',
  'affect', 'appropriate', 'aspects', 'assist', 'category', 'commission', 'community',
  'complex', 'compute', 'conclude', 'conduct', 'consequent', 'construct', 'consume', 'credit',
  'culture', 'design', 'distinction', 'element', 'equate', 'evaluate', 'features', 'final',
  'focus', 'impact', 'injure', 'institute', 'invest', 'item', 'journal', 'maintain',
  'normal', 'obtain', 'participate', 'perceive', 'positive', 'potential', 'previous',
  'primary', 'purchase', 'range', 'region', 'regulate', 'relevant', 'reside', 'resource',
  'restrict', 'secure', 'seek', 'select', 'site', 'strategy', 'survey', 'text',
  'tradition', 'transfer', 'alternative', 'circumstance', 'comment', 'compensate', 'component',
  'consent', 'considerable', 'contrast', 'cycle', 'debate', 'default', 'demonstrate',
  'document', 'domestic', 'emphasis', 'ensure', 'exclude', 'framework', 'fund', 'illustrate',
  'immigrate', 'imply', 'initial', 'instance', 'interaction', 'justify', 'layer', 'link',
  'locate', 'maximum', 'minor', 'negate', 'outcome', 'partner', 'philosophy', 'physical',
  'proportion', 'publish', 'react', 'register', 'rely', 'remove', 'scheme', 'sequence',
  'sex', 'shift', 'specify', 'sufficient', 'task', 'technical', 'technique', 'technology',
  'valid', 'volume'
];

export const TOPIC_KEYWORDS = {
  education: [
    'education', 'student', 'teacher', 'school', 'university', 'curriculum', 'literacy',
    'academic', 'qualification', 'assessment', 'tuition', 'discipline'
  ],
  environment: [
    'environment', 'climate', 'pollution', 'emission', 'sustainable', 'waste', 'recycle',
    'biodiversity', 'conservation', 'ecosystem', 'renewable', 'urban'
  ],
  technology: [
    'technology', 'digital', 'automation', 'innovation', 'device', 'internet', 'artificial',
    'algorithm', 'platform', 'privacy', 'efficiency', 'infrastructure'
  ],
  health: [
    'health', 'medical', 'diet', 'exercise', 'obesity', 'stress', 'therapy', 'mental',
    'treatment', 'disease', 'prevention', 'wellbeing'
  ],
  government: [
    'government', 'policy', 'regulation', 'public', 'authority', 'tax', 'budget',
    'infrastructure', 'citizen', 'welfare', 'legislation', 'administration'
  ],
  work: [
    'employment', 'salary', 'career', 'labour', 'productivity', 'profession', 'training',
    'workplace', 'promotion', 'recruitment', 'qualification', 'occupation'
  ],
  media: [
    'media', 'journalism', 'advertising', 'broadcast', 'audience', 'content', 'platform',
    'communication', 'screen', 'influence', 'news', 'publication'
  ],
  crime: [
    'crime', 'criminal', 'violence', 'sentence', 'prison', 'police', 'offence',
    'victim', 'justice', 'rehabilitation', 'punishment', 'security'
  ],
  culture: [
    'culture', 'tradition', 'heritage', 'language', 'identity', 'tourism', 'custom',
    'festival', 'diversity', 'globalisation', 'community', 'museum'
  ],
  transport: [
    'transport', 'traffic', 'commute', 'vehicle', 'rail', 'congestion', 'infrastructure',
    'passenger', 'public transport', 'urban planning', 'fuel', 'mobility'
  ]
};

export const OUTPUT_FRIENDLY_POS = new Set(['v.', 'adj.', 'adv.', 'n.']);

export const REJECT_WORD_PATTERNS = [
  /itis$/i,
  /osis$/i,
  /ase$/i,
  /meter$/i,
  /hedron$/i,
  /grammat$/i,
  /ectomy$/i,
  /enzyme$/i,
  /esterase$/i,
  /ceph/i,
  /haem/i,
  /pulmo/i,
  /silico/i,
  /manganese/i
];
