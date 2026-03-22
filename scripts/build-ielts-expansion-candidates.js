/**
 * IELTS Core Expansion Candidates Builder
 *
 * 构建新的扩容候选池，来源包括：
 * - AWL / academic core 扩展词
 * - IELTS Writing Task 2 高频论证词
 * - topic packs 扩展词（education, environment, technology, health, government）
 * - paraphrase families（increase/rise/grow, decline/decrease/fall 等）
 *
 * 硬规则：
 * - 不直接扩写旧 vocab-ielts6/7/8
 * - 不直接把新来源写进正式 Core
 * - 新词必须先进 candidate -> reviewed -> approved 流程
 * - 不批准低价值、专门、古怪、纯字典型词
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { readJson, writeJson, ensureDir } from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const PUBLIC_DATA_DIR = path.join(__dirname, '../public/data');
const CANDIDATES_FILE = path.join(DATA_DIR, 'ielts-core-expansion-candidates.json');
const CURRENT_CORE_FILE = path.join(PUBLIC_DATA_DIR, 'ielts-core-500.json');

// 现有 Core 中的词（用于去重）
let existingWords = new Set();

// ============================================
// 数据源定义
// ============================================

// AWL / Academic Core 扩展词 - 高频学术论证词
const AWL_EXPANSION = [
  // 学术动词 - 论证与分析
  { word: 'contend', partOfSpeech: 'v.', sense: '主张，认为', topic: 'government', collocations: ['contend that', 'it is contended that'], paraphrases: ['argue', 'claim', 'maintain'] },
  { word: 'substantiate', partOfSpeech: 'v.', sense: '证实，证明', topic: 'education', collocations: ['substantiate claims', 'substantiate evidence'], paraphrases: ['prove', 'verify', 'confirm'] },
  { word: 'corroborate', partOfSpeech: 'v.', sense: '确证，支持', topic: 'education', collocations: ['corroborate findings', 'corroborate evidence'], paraphrases: ['confirm', 'support', 'back up'] },
  { word: 'refute', partOfSpeech: 'v.', sense: '反驳，驳斥', topic: 'government', collocations: ['refute arguments', 'refute claims'], paraphrases: ['disprove', 'counter', 'challenge'] },
  { word: 'rebut', partOfSpeech: 'v.', sense: '反驳', topic: 'government', collocations: ['rebut criticism', 'rebut allegations'], paraphrases: ['contradict', 'deny', 'oppose'] },
  { word: 'acknowledge', partOfSpeech: 'v.', sense: '承认，认可', topic: 'education', collocations: ['acknowledge that', 'widely acknowledged'], paraphrases: ['admit', 'recognize', 'accept'] },
  { word: 'underscore', partOfSpeech: 'v.', sense: '强调，突显', topic: 'environment', collocations: ['underscore the importance', 'underscore the need'], paraphrases: ['emphasize', 'highlight', 'stress'] },
  { word: 'elucidate', partOfSpeech: 'v.', sense: '阐明，解释', topic: 'education', collocations: ['elucidate the point', 'elucidate findings'], paraphrases: ['clarify', 'explain', 'illuminate'] },
  { word: 'elaborate', partOfSpeech: 'v.', sense: '详细阐述', topic: 'education', collocations: ['elaborate on', 'elaborate further'], paraphrases: ['expand', 'detail', 'develop'] },
  { word: 'corroborate', partOfSpeech: 'v.', sense: '证实', topic: 'technology', collocations: ['corroborate evidence', 'corroborate results'], paraphrases: ['confirm', 'support'] },

  // 学术动词 - 变化与发展
  { word: 'fluctuate', partOfSpeech: 'v.', sense: '波动，起伏', topic: 'environment', collocations: ['fluctuate widely', 'prices fluctuate'], paraphrases: ['vary', 'oscillate', 'change'] },
  { word: 'stabilize', partOfSpeech: 'v.', sense: '稳定', topic: 'government', collocations: ['stabilize the economy', 'stabilize prices'], paraphrases: ['steady', 'balance', 'calm'] },
  { word: 'escalate', partOfSpeech: 'v.', sense: '升级，加剧', topic: 'government', collocations: ['escalate tensions', 'escalate costs'], paraphrases: ['intensify', 'increase', 'worsen'] },
  { word: 'diminish', partOfSpeech: 'v.', sense: '减少，减弱', topic: 'environment', collocations: ['diminish returns', 'diminish over time'], paraphrases: ['decrease', 'reduce', 'lessen'] },
  { word: 'proliferate', partOfSpeech: 'v.', sense: '激增，扩散', topic: 'technology', collocations: ['proliferate rapidly', 'technology proliferate'], paraphrases: ['spread', 'multiply', 'increase'] },
  { word: 'transform', partOfSpeech: 'v.', sense: '转变，改造', topic: 'technology', collocations: ['transform society', 'transform the way'], paraphrases: ['change', 'convert', 'alter'] },
  { word: 'evolve', partOfSpeech: 'v.', sense: '演变，发展', topic: 'technology', collocations: ['evolve over time', 'evolve into'], paraphrases: ['develop', 'progress', 'advance'] },
  { word: 'emerge', partOfSpeech: 'v.', sense: '出现，浮现', topic: 'technology', collocations: ['emerge as', 'new technologies emerge'], paraphrases: ['appear', 'arise', 'surface'] },
  { word: 'prevail', partOfSpeech: 'v.', sense: '盛行，占优势', topic: 'government', collocations: ['prevail over', 'prevailing view'], paraphrases: ['dominate', 'win', 'triumph'] },
  { word: 'persist', partOfSpeech: 'v.', sense: '持续，坚持', topic: 'environment', collocations: ['persist in', 'problems persist'], paraphrases: ['continue', 'endure', 'remain'] },

  // 学术形容词 - 重要性与程度
  { word: 'paramount', partOfSpeech: 'adj.', sense: '至关重要的', topic: 'government', collocations: ['of paramount importance', 'paramount concern'], paraphrases: ['crucial', 'vital', 'essential'] },
  { word: 'imperative', partOfSpeech: 'adj.', sense: '必要的，紧急的', topic: 'environment', collocations: ['it is imperative that', 'imperative need'], paraphrases: ['essential', 'urgent', 'critical'] },
  { word: 'indispensable', partOfSpeech: 'adj.', sense: '不可或缺的', topic: 'education', collocations: ['indispensable for', 'indispensable role'], paraphrases: ['essential', 'necessary', 'vital'] },
  { word: 'negligible', partOfSpeech: 'adj.', sense: '微不足道的', topic: 'environment', collocations: ['negligible impact', 'negligible amount'], paraphrases: ['insignificant', 'minimal', 'minor'] },
  { word: 'substantial', partOfSpeech: 'adj.', sense: '大量的，实质性的', topic: 'government', collocations: ['substantial amount', 'substantial evidence'], paraphrases: ['considerable', 'significant', 'large'] },
  { word: 'considerable', partOfSpeech: 'adj.', sense: '相当大的', topic: 'education', collocations: ['considerable attention', 'considerable effort'], paraphrases: ['significant', 'substantial', 'notable'] },
  { word: 'excessive', partOfSpeech: 'adj.', sense: '过度的', topic: 'health', collocations: ['excessive consumption', 'excessive use'], paraphrases: ['too much', 'overdone', 'extreme'] },
  { word: 'moderate', partOfSpeech: 'adj.', sense: '适度的', topic: 'health', collocations: ['moderate exercise', 'moderate amount'], paraphrases: ['reasonable', 'balanced', 'temperate'] },
  { word: 'adequate', partOfSpeech: 'adj.', sense: '充分的，足够的', topic: 'education', collocations: ['adequate resources', 'adequate support'], paraphrases: ['sufficient', 'enough', 'proper'] },
  { word: 'insufficient', partOfSpeech: 'adj.', sense: '不足的', topic: 'government', collocations: ['insufficient evidence', 'insufficient funding'], paraphrases: ['inadequate', 'lacking', 'scarce'] },

  // 学术名词 - 概念与现象
  { word: 'phenomenon', partOfSpeech: 'n.', sense: '现象', topic: 'environment', collocations: ['global phenomenon', 'common phenomenon'], paraphrases: ['occurrence', 'event', 'trend'] },
  { word: 'paradigm', partOfSpeech: 'n.', sense: '范式，模式', topic: 'education', collocations: ['new paradigm', 'paradigm shift'], paraphrases: ['model', 'framework', 'pattern'] },
  { word: 'premise', partOfSpeech: 'n.', sense: '前提', topic: 'education', collocations: ['basic premise', 'underlying premise'], paraphrases: ['assumption', 'basis', 'foundation'] },
  { word: 'implication', partOfSpeech: 'n.', sense: '含义，影响', topic: 'government', collocations: ['serious implications', 'practical implications'], paraphrases: ['consequence', 'result', 'effect'] },
  { word: 'ramification', partOfSpeech: 'n.', sense: '后果，衍生物', topic: 'government', collocations: ['serious ramifications', 'legal ramifications'], paraphrases: ['consequence', 'implication', 'effect'] },
  { word: 'deterrent', partOfSpeech: 'n.', sense: '威慑物', topic: 'government', collocations: ['effective deterrent', 'act as a deterrent'], paraphrases: ['discouragement', 'obstacle', 'barrier'] },
  { word: 'incentive', partOfSpeech: 'n.', sense: '激励，动机', topic: 'government', collocations: ['financial incentive', 'strong incentive'], paraphrases: ['motivation', 'encouragement', 'stimulus'] },
  { word: 'precedent', partOfSpeech: 'n.', sense: '先例', topic: 'government', collocations: ['set a precedent', 'historical precedent'], paraphrases: ['example', 'model', 'case'] },
  { word: 'spectrum', partOfSpeech: 'n.', sense: '范围，光谱', topic: 'education', collocations: ['broad spectrum', 'across the spectrum'], paraphrases: ['range', 'scope', 'variety'] },
  { word: 'disparity', partOfSpeech: 'n.', sense: '差距，不平等', topic: 'government', collocations: ['significant disparity', 'wealth disparity'], paraphrases: ['gap', 'inequality', 'difference'] },
];

// IELTS Writing Task 2 高频论证词
const TASK2_ARGUMENTATION = [
  // 表达观点
  { word: 'advocate', partOfSpeech: 'v.', sense: '提倡，主张', topic: 'government', collocations: ['advocate for', 'strongly advocate'], paraphrases: ['support', 'promote', 'recommend'] },
  { word: 'oppose', partOfSpeech: 'v.', sense: '反对', topic: 'government', collocations: ['strongly oppose', 'oppose the idea'], paraphrases: ['object to', 'be against', 'resist'] },
  { word: 'endorse', partOfSpeech: 'v.', sense: '支持，认可', topic: 'education', collocations: ['fully endorse', 'endorse the proposal'], paraphrases: ['support', 'approve', 'back'] },
  { word: 'controversial', partOfSpeech: 'adj.', sense: '有争议的', topic: 'government', collocations: ['highly controversial', 'controversial issue'], paraphrases: ['debatable', 'disputed', 'contentious'] },
  { word: 'debatable', partOfSpeech: 'adj.', sense: '有争议的', topic: 'education', collocations: ['it is debatable', 'debatable whether'], paraphrases: ['questionable', 'arguable', 'doubtful'] },
  { word: 'contentious', partOfSpeech: 'adj.', sense: '有争议的', topic: 'government', collocations: ['contentious issue', 'highly contentious'], paraphrases: ['controversial', 'disputed'] },
  { word: 'consensus', partOfSpeech: 'n.', sense: '共识', topic: 'government', collocations: ['reach consensus', 'general consensus'], paraphrases: ['agreement', 'accord', 'unanimity'] },
  { word: 'controversy', partOfSpeech: 'n.', sense: '争议', topic: 'government', collocations: ['spark controversy', 'amid controversy'], paraphrases: ['dispute', 'debate', 'disagreement'] },
  { word: 'stance', partOfSpeech: 'n.', sense: '立场', topic: 'government', collocations: ['take a stance', 'firm stance'], paraphrases: ['position', 'viewpoint', 'attitude'] },
  { word: 'perspective', partOfSpeech: 'n.', sense: '观点，视角', topic: 'education', collocations: ['from a perspective', 'broader perspective'], paraphrases: ['viewpoint', 'angle', 'outlook'] },

  // 因果论证
  { word: 'stem', partOfSpeech: 'v.', sense: '源于', topic: 'environment', collocations: ['stem from', 'problems stem'], paraphrases: ['originate', 'arise', 'derive'] },
  { word: 'trigger', partOfSpeech: 'v.', sense: '引发，触发', topic: 'environment', collocations: ['trigger a reaction', 'may trigger'], paraphrases: ['cause', 'spark', 'initiate'] },
  { word: 'precipitate', partOfSpeech: 'v.', sense: '促成，加速', topic: 'government', collocations: ['precipitate change', 'precipitate crisis'], paraphrases: ['cause', 'bring about', 'hasten'] },
  { word: 'engender', partOfSpeech: 'v.', sense: '产生，引起', topic: 'government', collocations: ['engender trust', 'engender debate'], paraphrases: ['create', 'produce', 'generate'] },
  { word: 'attributable', partOfSpeech: 'adj.', sense: '可归因的', topic: 'environment', collocations: ['attributable to', 'largely attributable'], paraphrases: ['due to', 'caused by', 'because of'] },
  { word: 'consequent', partOfSpeech: 'adj.', sense: '随之而来的', topic: 'government', collocations: ['consequent changes', 'consequent effects'], paraphrases: ['resulting', 'following', 'ensuing'] },
  { word: 'ensuing', partOfSpeech: 'adj.', sense: '随之发生的', topic: 'government', collocations: ['ensuing debate', 'ensuing years'], paraphrases: ['following', 'resulting', 'subsequent'] },
  { word: 'underlying', partOfSpeech: 'adj.', sense: '潜在的，根本的', topic: 'education', collocations: ['underlying cause', 'underlying issue'], paraphrases: ['fundamental', 'basic', 'root'] },
  { word: 'rooted', partOfSpeech: 'adj.', sense: '根源在于', topic: 'education', collocations: ['deeply rooted', 'rooted in'], paraphrases: ['based', 'grounded', 'embedded'] },
  { word: 'causation', partOfSpeech: 'n.', sense: '因果关系', topic: 'education', collocations: ['establish causation', 'direct causation'], paraphrases: ['cause', 'link', 'connection'] },

  // 比较与对比
  { word: 'outweigh', partOfSpeech: 'v.', sense: '超过，胜过', topic: 'government', collocations: ['outweigh the risks', 'benefits outweigh'], paraphrases: ['exceed', 'surpass', 'be greater than'] },
  { word: 'parallel', partOfSpeech: 'v.', sense: '与...平行，与...相似', topic: 'education', collocations: ['parallel trends', 'parallel developments'], paraphrases: ['match', 'mirror', 'correspond'] },
  { word: 'contrast', partOfSpeech: 'v.', sense: '对比', topic: 'education', collocations: ['in contrast to', 'stand in contrast'], paraphrases: ['compare', 'differ', 'distinguish'] },
  { word: 'comparable', partOfSpeech: 'adj.', sense: '可比的', topic: 'education', collocations: ['comparable to', 'directly comparable'], paraphrases: ['similar', 'alike', 'equivalent'] },
  { word: 'analogous', partOfSpeech: 'adj.', sense: '类似的', topic: 'education', collocations: ['analogous to', 'analogous situation'], paraphrases: ['similar', 'comparable', 'parallel'] },
  { word: 'divergent', partOfSpeech: 'adj.', sense: '分歧的，不同的', topic: 'government', collocations: ['divergent views', 'widely divergent'], paraphrases: ['different', 'conflicting', 'opposing'] },
  { word: 'discrepancy', partOfSpeech: 'n.', sense: '差异，不一致', topic: 'government', collocations: ['significant discrepancy', 'noticeable discrepancy'], paraphrases: ['difference', 'gap', 'inconsistency'] },
  { word: 'similarity', partOfSpeech: 'n.', sense: '相似之处', topic: 'education', collocations: ['striking similarity', 'notable similarity'], paraphrases: ['resemblance', 'likeness', 'analogy'] },
  { word: 'distinction', partOfSpeech: 'n.', sense: '区别', topic: 'education', collocations: ['clear distinction', 'make a distinction'], paraphrases: ['difference', 'differentiation', 'contrast'] },
  { word: 'differentiation', partOfSpeech: 'n.', sense: '区分', topic: 'education', collocations: ['product differentiation', 'clear differentiation'], paraphrases: ['distinction', 'variation', 'diversity'] },
];

// Topic Pack 扩展词 - Education
const TOPIC_EDUCATION = [
  { word: 'curriculum', partOfSpeech: 'n.', sense: '课程', topic: 'education', collocations: ['school curriculum', 'curriculum development'], paraphrases: ['syllabus', 'program', 'course'] },
  { word: 'pedagogy', partOfSpeech: 'n.', sense: '教学法', topic: 'education', collocations: ['modern pedagogy', 'pedagogy and practice'], paraphrases: ['teaching method', 'instruction', 'education'] },
  { word: 'literacy', partOfSpeech: 'n.', sense: '识字能力，素养', topic: 'education', collocations: ['literacy rate', 'digital literacy'], paraphrases: ['reading ability', 'education', 'knowledge'] },
  { word: 'numeracy', partOfSpeech: 'n.', sense: '计算能力', topic: 'education', collocations: ['numeracy skills', 'basic numeracy'], paraphrases: ['mathematical ability', 'number skills'] },
  { word: 'competency', partOfSpeech: 'n.', sense: '能力，胜任', topic: 'education', collocations: ['core competencies', 'professional competency'], paraphrases: ['skill', 'ability', 'capability'] },
  { word: 'proficiency', partOfSpeech: 'n.', sense: '熟练程度', topic: 'education', collocations: ['language proficiency', 'high proficiency'], paraphrases: ['skill', 'expertise', 'mastery'] },
  { word: 'attainment', partOfSpeech: 'n.', sense: '成就，造诣', topic: 'education', collocations: ['educational attainment', 'high attainment'], paraphrases: ['achievement', 'success', 'accomplishment'] },
  { word: 'enrollment', partOfSpeech: 'n.', sense: '入学，注册', topic: 'education', collocations: ['school enrollment', 'enrollment rate'], paraphrases: ['registration', 'admission', 'intake'] },
  { word: 'dropout', partOfSpeech: 'n.', sense: '辍学者', topic: 'education', collocations: ['dropout rate', 'school dropout'], paraphrases: ['leaver', 'withdrawal'] },
  { word: 'inclusive', partOfSpeech: 'adj.', sense: '包容的', topic: 'education', collocations: ['inclusive education', 'inclusive approach'], paraphrases: ['comprehensive', 'all-embracing', 'accessible'] },
  { word: 'vocational', partOfSpeech: 'adj.', sense: '职业的', topic: 'education', collocations: ['vocational training', 'vocational education'], paraphrases: ['occupational', 'professional', 'career'] },
  { word: 'compulsory', partOfSpeech: 'adj.', sense: '义务的，强制的', topic: 'education', collocations: ['compulsory education', 'compulsory subject'], paraphrases: ['mandatory', 'required', 'obligatory'] },
  { word: 'extracurricular', partOfSpeech: 'adj.', sense: '课外的', topic: 'education', collocations: ['extracurricular activities', 'extracurricular programs'], paraphrases: ['outside-class', 'after-school', 'supplementary'] },
  { word: 'standardized', partOfSpeech: 'adj.', sense: '标准化的', topic: 'education', collocations: ['standardized test', 'standardized testing'], paraphrases: ['uniform', 'consistent', 'regulated'] },
  { word: 'remedial', partOfSpeech: 'adj.', sense: '补救的', topic: 'education', collocations: ['remedial classes', 'remedial education'], paraphrases: ['corrective', 'supportive', 'supplementary'] },
];

// Topic Pack 扩展词 - Environment
const TOPIC_ENVIRONMENT = [
  { word: 'sustainability', partOfSpeech: 'n.', sense: '可持续性', topic: 'environment', collocations: ['environmental sustainability', 'long-term sustainability'], paraphrases: ['viability', 'durability', 'continuity'] },
  { word: 'emission', partOfSpeech: 'n.', sense: '排放', topic: 'environment', collocations: ['carbon emissions', 'reduce emissions'], paraphrases: ['release', 'discharge', 'output'] },
  { word: 'contamination', partOfSpeech: 'n.', sense: '污染', topic: 'environment', collocations: ['water contamination', 'soil contamination'], paraphrases: ['pollution', 'tainting', 'impurity'] },
  { word: 'degradation', partOfSpeech: 'n.', sense: '退化，恶化', topic: 'environment', collocations: ['environmental degradation', 'land degradation'], paraphrases: ['deterioration', 'decline', 'damage'] },
  { word: 'conservation', partOfSpeech: 'n.', sense: '保护，保存', topic: 'environment', collocations: ['wildlife conservation', 'energy conservation'], paraphrases: ['preservation', 'protection', 'safeguarding'] },
  { word: 'biodiversity', partOfSpeech: 'n.', sense: '生物多样性', topic: 'environment', collocations: ['protect biodiversity', 'loss of biodiversity'], paraphrases: ['biological variety', 'ecological diversity'] },
  { word: 'renewable', partOfSpeech: 'adj.', sense: '可再生的', topic: 'environment', collocations: ['renewable energy', 'renewable resources'], paraphrases: ['sustainable', 'inexhaustible'] },
  { word: 'non-renewable', partOfSpeech: 'adj.', sense: '不可再生的', topic: 'environment', collocations: ['non-renewable resources', 'non-renewable energy'], paraphrases: ['finite', 'exhaustible'] },
  { word: 'biodegradable', partOfSpeech: 'adj.', sense: '可生物降解的', topic: 'environment', collocations: ['biodegradable materials', 'fully biodegradable'], paraphrases: ['decomposable', 'eco-friendly'] },
  { word: 'sustainable', partOfSpeech: 'adj.', sense: '可持续的', topic: 'environment', collocations: ['sustainable development', 'sustainable practices'], paraphrases: ['eco-friendly', 'viable', 'maintainable'] },
  { word: 'ecological', partOfSpeech: 'adj.', sense: '生态的', topic: 'environment', collocations: ['ecological balance', 'ecological impact'], paraphrases: ['environmental', 'green', 'natural'] },
  { word: 'disposable', partOfSpeech: 'adj.', sense: '一次性的', topic: 'environment', collocations: ['disposable products', 'disposable plastics'], paraphrases: ['single-use', 'throwaway'] },
  { word: 'recyclable', partOfSpeech: 'adj.', sense: '可回收的', topic: 'environment', collocations: ['recyclable materials', 'fully recyclable'], paraphrases: ['reusable', 'recoverable'] },
  { word: 'irreversible', partOfSpeech: 'adj.', sense: '不可逆转的', topic: 'environment', collocations: ['irreversible damage', 'irreversible change'], paraphrases: ['permanent', 'unchangeable'] },
  { word: 'catastrophic', partOfSpeech: 'adj.', sense: '灾难性的', topic: 'environment', collocations: ['catastrophic consequences', 'potentially catastrophic'], paraphrases: ['disastrous', 'devastating'] },
];

// Topic Pack 扩展词 - Technology
const TOPIC_TECHNOLOGY = [
  { word: 'automation', partOfSpeech: 'n.', sense: '自动化', topic: 'technology', collocations: ['workplace automation', 'increased automation'], paraphrases: ['mechanization', 'computerization'] },
  { word: 'innovation', partOfSpeech: 'n.', sense: '创新', topic: 'technology', collocations: ['technological innovation', 'drive innovation'], paraphrases: ['novelty', 'breakthrough', 'advancement'] },
  { word: 'breakthrough', partOfSpeech: 'n.', sense: '突破', topic: 'technology', collocations: ['major breakthrough', 'technological breakthrough'], paraphrases: ['advance', 'discovery', 'innovation'] },
  { word: 'obsolescence', partOfSpeech: 'n.', sense: '过时，淘汰', topic: 'technology', collocations: ['planned obsolescence', 'rapid obsolescence'], paraphrases: ['outdating', 'replacement'] },
  { word: 'digitization', partOfSpeech: 'n.', sense: '数字化', topic: 'technology', collocations: ['rapid digitization', 'mass digitization'], paraphrases: ['digital conversion', 'computerization'] },
  { word: 'connectivity', partOfSpeech: 'n.', sense: '连通性', topic: 'technology', collocations: ['global connectivity', 'internet connectivity'], paraphrases: ['connection', 'networking', 'access'] },
  { word: 'cybersecurity', partOfSpeech: 'n.', sense: '网络安全', topic: 'technology', collocations: ['cybersecurity threats', 'improve cybersecurity'], paraphrases: ['digital security', 'online safety'] },
  { word: 'surveillance', partOfSpeech: 'n.', sense: '监控', topic: 'technology', collocations: ['mass surveillance', 'electronic surveillance'], paraphrases: ['monitoring', 'observation', 'watching'] },
  { word: 'artificial', partOfSpeech: 'adj.', sense: '人工的', topic: 'technology', collocations: ['artificial intelligence', 'art means'], paraphrases: ['synthetic', 'man-made', 'unnatural'] },
  { word: 'cutting-edge', partOfSpeech: 'adj.', sense: '前沿的', topic: 'technology', collocations: ['cutting-edge technology', 'cutting-edge research'], paraphrases: ['advanced', 'state-of-the-art', 'innovative'] },
  { word: 'obsolete', partOfSpeech: 'adj.', sense: '过时的', topic: 'technology', collocations: ['become obsolete', 'render obsolete'], paraphrases: ['outdated', 'antiquated', 'old-fashioned'] },
  { word: 'digital', partOfSpeech: 'adj.', sense: '数字的', topic: 'technology', collocations: ['digital age', 'digital technology'], paraphrases: ['electronic', 'computerized', 'online'] },
  { word: 'virtual', partOfSpeech: 'adj.', sense: '虚拟的', topic: 'technology', collocations: ['virtual reality', 'virtual environment'], paraphrases: ['simulated', 'digital', 'online'] },
  { word: 'autonomous', partOfSpeech: 'adj.', sense: '自主的', topic: 'technology', collocations: ['autonomous vehicles', 'fully autonomous'], paraphrases: ['self-governing', 'independent', 'automated'] },
  { word: 'sophisticated', partOfSpeech: 'adj.', sense: '复杂的，精密的', topic: 'technology', collocations: ['sophisticated technology', 'highly sophisticated'], paraphrases: ['advanced', 'complex', 'elaborate'] },
];

// Topic Pack 扩展词 - Health
const TOPIC_HEALTH = [
  { word: 'wellbeing', partOfSpeech: 'n.', sense: '福祉，健康', topic: 'health', collocations: ['mental wellbeing', 'physical wellbeing'], paraphrases: ['health', 'welfare', 'quality of life'] },
  { word: 'mortality', partOfSpeech: 'n.', sense: '死亡率', topic: 'health', collocations: ['infant mortality', 'mortality rate'], paraphrases: ['death rate', 'fatality'] },
  { word: 'morbidity', partOfSpeech: 'n.', sense: '发病率', topic: 'health', collocations: ['morbidity rate', 'reduce morbidity'], paraphrases: ['illness rate', 'disease rate'] },
  { word: 'prevalence', partOfSpeech: 'n.', sense: '流行，普遍', topic: 'health', collocations: ['high prevalence', 'increasing prevalence'], paraphrases: ['commonness', 'widespread', 'frequency'] },
  { word: 'outbreak', partOfSpeech: 'n.', sense: '爆发', topic: 'health', collocations: ['disease outbreak', 'virus outbreak'], paraphrases: ['epidemic', 'occurrence', 'surge'] },
  { word: 'pandemic', partOfSpeech: 'n.', sense: '大流行', topic: 'health', collocations: ['global pandemic', 'covid pandemic'], paraphrases: ['epidemic', 'plague', 'widespread disease'] },
  { word: 'epidemic', partOfSpeech: 'n.', sense: '流行病', topic: 'health', collocations: ['obesity epidemic', 'drug epidemic'], paraphrases: ['outbreak', 'plague', 'widespread'] },
  { word: 'vaccination', partOfSpeech: 'n.', sense: '疫苗接种', topic: 'health', collocations: ['mass vaccination', 'vaccination program'], paraphrases: ['immunization', 'inoculation'] },
  { word: 'immunity', partOfSpeech: 'n.', sense: '免疫力', topic: 'health', collocations: ['build immunity', 'natural immunity'], paraphrases: ['resistance', 'protection'] },
  { word: 'contagious', partOfSpeech: 'adj.', sense: '传染性的', topic: 'health', collocations: ['highly contagious', 'contagious disease'], paraphrases: ['infectious', 'catching', 'spreading'] },
  { word: 'chronic', partOfSpeech: 'adj.', sense: '慢性的', topic: 'health', collocations: ['chronic disease', 'chronic condition'], paraphrases: ['long-term', 'persistent', 'ongoing'] },
  { word: 'acute', partOfSpeech: 'adj.', sense: '急性的', topic: 'health', collocations: ['acute illness', 'acute condition'], paraphrases: ['sudden', 'severe', 'intense'] },
  { word: 'preventable', partOfSpeech: 'adj.', sense: '可预防的', topic: 'health', collocations: ['preventable diseases', 'largely preventable'], paraphrases: ['avoidable', 'stoppable'] },
  { word: 'sedentary', partOfSpeech: 'adj.', sense: '久坐的', topic: 'health', collocations: ['sedentary lifestyle', 'sedentary behavior'], paraphrases: ['inactive', 'stationary', 'sitting'] },
  { word: 'nutritious', partOfSpeech: 'adj.', sense: '有营养的', topic: 'health', collocations: ['nutritious food', 'highly nutritious'], paraphrases: ['healthy', 'nourishing', 'wholesome'] },
];

// Topic Pack 扩展词 - Government
const TOPIC_GOVERNMENT = [
  { word: 'legislation', partOfSpeech: 'n.', sense: '立法', topic: 'government', collocations: ['new legislation', 'introduce legislation'], paraphrases: ['law', 'regulation', 'statute'] },
  { word: 'enforcement', partOfSpeech: 'n.', sense: '执行，实施', topic: 'government', collocations: ['law enforcement', 'strict enforcement'], paraphrases: ['implementation', 'execution', 'application'] },
  { word: 'bureaucracy', partOfSpeech: 'n.', sense: '官僚机构', topic: 'government', collocations: ['government bureaucracy', 'reduce bureaucracy'], paraphrases: ['administration', 'red tape', 'officialdom'] },
  { word: 'democracy', partOfSpeech: 'n.', sense: '民主', topic: 'government', collocations: ['liberal democracy', 'strengthen democracy'], paraphrases: ['self-government', 'representation'] },
  { word: 'transparency', partOfSpeech: 'n.', sense: '透明度', topic: 'government', collocations: ['increase transparency', 'greater transparency'], paraphrases: ['openness', 'clarity', 'accountability'] },
  { word: 'accountability', partOfSpeech: 'n.', sense: '问责制', topic: 'government', collocations: ['ensure accountability', 'greater accountability'], paraphrases: ['responsibility', 'answerability'] },
  { word: 'corruption', partOfSpeech: 'n.', sense: '腐败', topic: 'government', collocations: ['political corruption', 'combat corruption'], paraphrases: ['bribery', 'dishonesty', 'fraud'] },
  { word: 'intervention', partOfSpeech: 'n.', sense: '干预', topic: 'government', collocations: ['government intervention', 'military intervention'], paraphrases: ['interference', 'involvement', 'action'] },
  { word: 'subsidy', partOfSpeech: 'n.', sense: '补贴', topic: 'government', collocations: ['government subsidy', 'provide subsidy'], paraphrases: ['grant', 'funding', 'financial aid'] },
  { word: 'jurisdiction', partOfSpeech: 'n.', sense: '司法管辖权', topic: 'government', collocations: ['under jurisdiction', 'legal jurisdiction'], paraphrases: ['authority', 'control', 'power'] },
  { word: 'bipartisan', partOfSpeech: 'adj.', sense: '两党的', topic: 'government', collocations: ['bipartisan support', 'bipartisan approach'], paraphrases: ['cross-party', 'nonpartisan'] },
  { word: 'legislative', partOfSpeech: 'adj.', sense: '立法的', topic: 'government', collocations: ['legislative process', 'legislative body'], paraphrases: ['lawmaking', 'statutory'] },
  { word: 'administrative', partOfSpeech: 'adj.', sense: '行政的', topic: 'government', collocations: ['administrative costs', 'administrative burden'], paraphrases: ['managerial', 'executive', 'bureaucratic'] },
  { word: 'electoral', partOfSpeech: 'adj.', sense: '选举的', topic: 'government', collocations: ['electoral system', 'electoral reform'], paraphrases: ['voting', 'election'] },
  { word: 'sovereign', partOfSpeech: 'adj.', sense: '主权的', topic: 'government', collocations: ['sovereign state', 'sovereign nation'], paraphrases: ['independent', 'autonomous', 'self-governing'] },
];

// Paraphrase Families - 同义词家族
const PARAPHRASE_FAMILIES = [
  // increase / rise / grow 系列
  { word: 'surge', partOfSpeech: 'v.', sense: '激增', topic: 'environment', collocations: ['surge in', 'prices surge'], paraphrases: ['increase sharply', 'rise dramatically', 'grow rapidly'] },
  { word: 'soar', partOfSpeech: 'v.', sense: '猛增', topic: 'government', collocations: ['soar to', 'costs soar'], paraphrases: ['rise sharply', 'increase dramatically', 'rocket'] },
  { word: 'escalate', partOfSpeech: 'v.', sense: '升级，加剧', topic: 'government', collocations: ['escalate tensions', 'costs escalate'], paraphrases: ['intensify', 'increase', 'worsen'] },
  { word: 'expand', partOfSpeech: 'v.', sense: '扩大', topic: 'education', collocations: ['expand access', 'expand opportunities'], paraphrases: ['grow', 'extend', 'widen'] },
  { word: 'amplify', partOfSpeech: 'v.', sense: '放大', topic: 'government', collocations: ['amplify the effect', 'amplify concerns'], paraphrases: ['increase', 'magnify', 'intensify'] },
  { word: 'mounting', partOfSpeech: 'adj.', sense: '不断增加的', topic: 'government', collocations: ['mounting pressure', 'mounting concern'], paraphrases: ['increasing', 'growing', 'rising'] },
  { word: 'rising', partOfSpeech: 'adj.', sense: '上升的', topic: 'environment', collocations: ['rising temperatures', 'rising demand'], paraphrases: ['increasing', 'growing', 'climbing'] },
  { word: 'burgeoning', partOfSpeech: 'adj.', sense: '迅速发展的', topic: 'technology', collocations: ['burgeoning industry', 'burgeoning demand'], paraphrases: ['growing', 'expanding', 'flourishing'] },

  // decline / decrease / fall 系列
  { word: 'plummet', partOfSpeech: 'v.', sense: '骤降', topic: 'environment', collocations: ['prices plummet', 'plummet by'], paraphrases: ['fall sharply', 'drop dramatically', 'decrease rapidly'] },
  { word: 'dwindle', partOfSpeech: 'v.', sense: '逐渐减少', topic: 'environment', collocations: ['resources dwindle', 'dwindle away'], paraphrases: ['decrease', 'shrink', 'diminish'] },
  { word: 'subside', partOfSpeech: 'v.', sense: '消退，减弱', topic: 'government', collocations: ['tensions subside', 'pressure subsides'], paraphrases: ['decrease', 'diminish', 'ease'] },
  { word: 'recede', partOfSpeech: 'v.', sense: '后退，减弱', topic: 'environment', collocations: ['flood waters recede', 'concerns recede'], paraphrases: ['retreat', 'withdraw', 'decrease'] },
  { word: 'waning', partOfSpeech: 'adj.', sense: '减弱的', topic: 'government', collocations: ['waning support', 'waning influence'], paraphrases: ['decreasing', 'declining', 'diminishing'] },
  { word: 'declining', partOfSpeech: 'adj.', sense: '下降的', topic: 'health', collocations: ['declining standards', 'declining health'], paraphrases: ['falling', 'decreasing', 'deteriorating'] },
  { word: 'diminishing', partOfSpeech: 'adj.', sense: '减少的', topic: 'environment', collocations: ['diminishing returns', 'diminishing resources'], paraphrases: ['decreasing', 'reducing', 'shrinking'] },
  { word: 'shrinking', partOfSpeech: 'adj.', sense: '萎缩的', topic: 'government', collocations: ['shrinking budget', 'shrinking economy'], paraphrases: ['decreasing', 'contracting', 'reducing'] },

  // beneficial / advantageous / helpful 系列
  { word: 'favorable', partOfSpeech: 'adj.', sense: '有利的', topic: 'government', collocations: ['favorable conditions', 'favorable outcome'], paraphrases: ['beneficial', 'advantageous', 'positive'] },
  { word: 'constructive', partOfSpeech: 'adj.', sense: '建设性的', topic: 'education', collocations: ['constructive criticism', 'constructive dialogue'], paraphrases: ['helpful', 'positive', 'useful'] },
  { word: 'productive', partOfSpeech: 'adj.', sense: '多产的', topic: 'education', collocations: ['productive discussion', 'highly productive'], paraphrases: ['fruitful', 'effective', 'beneficial'] },
  { word: 'fruitful', partOfSpeech: 'adj.', sense: '富有成效的', topic: 'education', collocations: ['fruitful discussion', 'fruitful collaboration'], paraphrases: ['productive', 'successful', 'beneficial'] },
  { word: 'rewarding', partOfSpeech: 'adj.', sense: '有益的', topic: 'education', collocations: ['rewarding experience', 'intellectually rewarding'], paraphrases: ['beneficial', 'satisfying', 'worthwhile'] },
  { word: 'valuable', partOfSpeech: 'adj.', sense: '有价值的', topic: 'education', collocations: ['valuable experience', 'extremely valuable'], paraphrases: ['useful', 'beneficial', 'important'] },

  // harmful / damaging / detrimental 系列
  { word: 'adverse', partOfSpeech: 'adj.', sense: '不利的', topic: 'health', collocations: ['adverse effects', 'adverse impact'], paraphrases: ['harmful', 'negative', 'unfavorable'] },
  { word: 'deleterious', partOfSpeech: 'adj.', sense: '有害的', topic: 'environment', collocations: ['deleterious effects', 'potentially deleterious'], paraphrases: ['harmful', 'damaging', 'injurious'] },
  { word: 'pernicious', partOfSpeech: 'adj.', sense: '有害的，恶性的', topic: 'health', collocations: ['pernicious effect', 'pernicious influence'], paraphrases: ['harmful', 'destructive', 'damaging'] },
  { word: 'counterproductive', partOfSpeech: 'adj.', sense: '适得其反的', topic: 'government', collocations: ['counterproductive approach', 'prove counterproductive'], paraphrases: ['harmful', 'ineffective', 'damaging'] },
  { word: 'undesirable', partOfSpeech: 'adj.', sense: '不受欢迎的', topic: 'government', collocations: ['undesirable consequences', 'undesirable outcome'], paraphrases: ['unwanted', 'unfavorable', 'negative'] },
  { word: 'detrimental', partOfSpeech: 'adj.', sense: '有害的', topic: 'environment', collocations: ['detrimental to', 'potentially detrimental'], paraphrases: ['harmful', 'damaging', 'injurious'] },

  // important / significant / crucial 系列
  { word: 'pivotal', partOfSpeech: 'adj.', sense: '关键的', topic: 'education', collocations: ['pivotal role', 'pivotal moment'], paraphrases: ['crucial', 'critical', 'central'] },
  { word: 'decisive', partOfSpeech: 'adj.', sense: '决定性的', topic: 'government', collocations: ['decisive factor', 'decisive action'], paraphrases: ['critical', 'crucial', 'determining'] },
  { word: 'influential', partOfSpeech: 'adj.', sense: '有影响力的', topic: 'government', collocations: ['highly influential', 'influential role'], paraphrases: ['important', 'powerful', 'significant'] },
  { word: 'notable', partOfSpeech: 'adj.', sense: '值得注意的', topic: 'education', collocations: ['notable exception', 'notable achievement'], paraphrases: ['significant', 'remarkable', 'important'] },
  { word: 'prominent', partOfSpeech: 'adj.', sense: '突出的', topic: 'government', collocations: ['prominent role', 'prominent feature'], paraphrases: ['important', 'notable', 'distinguished'] },
  { word: 'salient', partOfSpeech: 'adj.', sense: '显著的', topic: 'education', collocations: ['salient features', 'salient points'], paraphrases: ['notable', 'prominent', 'important'] },
];

// ============================================
// 工具函数
// ============================================

function loadExistingWords() {
  try {
    const coreData = readJson(CURRENT_CORE_FILE);
    const words = coreData.bundles || [];
    words.forEach(bundle => {
      existingWords.add(bundle.word.toLowerCase());
      if (bundle.lemma) existingWords.add(bundle.lemma.toLowerCase());
    });
    console.log(`已加载 ${existingWords.size} 个现有 Core 词`);
  } catch (e) {
    console.warn('无法加载现有 Core 文件，跳过去重');
  }
}

function isDuplicate(word) {
  return existingWords.has(word.toLowerCase());
}

function generateContexts(item) {
  const { word, topic, sense } = item;

  const contextTemplates = {
    education: [
      { kind: 'reading', text: `Research has shown that ${word} plays a crucial role in educational outcomes.`, purpose: 'core' },
      { kind: 'writing', text: `In IELTS essays, candidates should demonstrate how ${word} affects learning processes.`, purpose: 'near-transfer' },
      { kind: 'speaking', text: `When discussing education, students can use ${word} to explain academic challenges.`, purpose: 'far-transfer' }
    ],
    environment: [
      { kind: 'reading', text: `Scientists have documented how ${word} affects environmental systems worldwide.`, purpose: 'core' },
      { kind: 'writing', text: `In Task 2 essays, ${word} is often used to discuss environmental policies.`, purpose: 'near-transfer' },
      { kind: 'speaking', text: `Candidates can mention ${word} when talking about climate change and its impacts.`, purpose: 'far-transfer' }
    ],
    technology: [
      { kind: 'reading', text: `Recent studies indicate that ${word} is transforming how people interact with digital systems.`, purpose: 'core' },
      { kind: 'writing', text: `In technology-related essays, ${word} helps explain the impact of digital transformation.`, purpose: 'near-transfer' },
      { kind: 'speaking', text: `When discussing technology, candidates can use ${word} to describe modern developments.`, purpose: 'far-transfer' }
    ],
    health: [
      { kind: 'reading', text: `Health experts have examined how ${word} influences public wellbeing.`, purpose: 'core' },
      { kind: 'writing', text: `In health-related essays, ${word} is useful for discussing medical and lifestyle issues.`, purpose: 'near-transfer' },
      { kind: 'speaking', text: `Candidates can use ${word} when talking about healthcare and personal wellbeing.`, purpose: 'far-transfer' }
    ],
    government: [
      { kind: 'reading', text: `Policy analysts have debated the role of ${word} in modern governance.`, purpose: 'core' },
      { kind: 'writing', text: `In government-related essays, ${word} helps explain policy decisions and their impacts.`, purpose: 'near-transfer' },
      { kind: 'speaking', text: `When discussing politics, candidates can use ${word} to express opinions on public issues.`, purpose: 'far-transfer' }
    ],
    work: [
      { kind: 'reading', text: `Studies have shown that ${word} significantly affects workplace dynamics.`, purpose: 'core' },
      { kind: 'writing', text: `In employment-related essays, ${word} helps discuss career and workplace issues.`, purpose: 'near-transfer' },
      { kind: 'speaking', text: `Candidates can use ${word} when talking about jobs and professional development.`, purpose: 'far-transfer' }
    ]
  };

  return contextTemplates[item.topic] || contextTemplates.education;
}

function generateProductionPrompt(item) {
  const { word, topic, sense } = item;
  return {
    mode: 'writing',
    instruction: `Use "${word}" in one IELTS-style sentence about ${topic}. Focus on the sense of "${sense}".`
  };
}

function calculateScores(item) {
  // 基于词的类型和属性计算分数
  let relevanceScore = 4;  // 默认高相关性
  let transferabilityScore = 3;
  let outputUtilityScore = 4;
  let exampleQualityScore = 4;

  // 高频学术词加分
  const highValueWords = ['advocate', 'contend', 'substantiate', 'refute', 'underscore', 'paramount', 'imperative', 'sustainability', 'legislation', 'accountability'];
  if (highValueWords.includes(item.word.toLowerCase())) {
    relevanceScore = 5;
    outputUtilityScore = 5;
  }

  // paraphrase-rich 词加分
  if (item.paraphrases && item.paraphrases.length >= 2) {
    transferabilityScore = 4;
  }

  // topic transferable 词加分
  const transferableTopics = ['education', 'government', 'environment'];
  if (transferableTopics.includes(item.topic)) {
    transferabilityScore = Math.min(5, transferabilityScore + 1);
  }

  return {
    relevanceScore,
    transferabilityScore,
    outputUtilityScore,
    exampleQualityScore,
    decision: 'keep'
  };
}

function toItem(item, index) {
  const contexts = generateContexts(item);
  const productionPrompt = generateProductionPrompt(item);
  const sourceQuality = calculateScores(item);

  return {
    rank: index + 1,
    reviewStatus: 'candidate',
    approved: false,
    reviewerNotes: '',
    editorSense: item.sense || '',
    editorEnglishDefinition: item.englishDefinition || '',
    editorChineseMeaning: item.chineseMeaning || '',
    editorCollocations: item.collocations || [],
    editorParaphrases: item.paraphrases || [],
    editorContexts: [],
    editorProductionPrompt: '',
    key: item.word.toLowerCase(),
    word: item.word,
    partOfSpeech: item.partOfSpeech,
    ipa: item.ipa || '',
    frequency: item.frequency || 4,
    meaning: item.chineseMeaning || item.sense || '',
    examples: contexts.map(ctx => ({
      sentence: ctx.text,
      translation: ''
    })),
    sourceCount: 1,
    sources: ['expansion-intake'],
    levels: ['Core Expansion'],
    topics: [item.topic],
    flags: {
      noExample: false,
      abbreviationLike: false,
      overlyLong: item.word.length >= 14,
      lowFrequency: false,
      technicalJargon: false,
      nonAlpha: false,
      poorExampleQuality: false,
      rejectHint: false
    },
    averageExampleLength: 10,
    exampleCount: contexts.length,
    relevanceScore: sourceQuality.relevanceScore,
    transferabilityScore: sourceQuality.transferabilityScore,
    outputUtilityScore: sourceQuality.outputUtilityScore,
    exampleQualityScore: sourceQuality.exampleQualityScore,
    totalScore: sourceQuality.relevanceScore + sourceQuality.transferabilityScore + sourceQuality.outputUtilityScore + sourceQuality.exampleQualityScore,
    decision: sourceQuality.decision,
    selectionBucket: 'core',
    sourceCategory: item.sourceCategory || 'expansion'
  };
}

// ============================================
// 主函数
// ============================================

function main() {
  console.log('=== IELTS Core Expansion Candidates Builder ===\n');

  // 加载现有词用于去重
  loadExistingWords();

  // 合并所有来源
  const allSources = [
    ...AWL_EXPANSION.map(item => ({ ...item, sourceCategory: 'AWL Expansion' })),
    ...TASK2_ARGUMENTATION.map(item => ({ ...item, sourceCategory: 'Task2 Argumentation' })),
    ...TOPIC_EDUCATION.map(item => ({ ...item, sourceCategory: 'Topic: Education' })),
    ...TOPIC_ENVIRONMENT.map(item => ({ ...item, sourceCategory: 'Topic: Environment' })),
    ...TOPIC_TECHNOLOGY.map(item => ({ ...item, sourceCategory: 'Topic: Technology' })),
    ...TOPIC_HEALTH.map(item => ({ ...item, sourceCategory: 'Topic: Health' })),
    ...TOPIC_GOVERNMENT.map(item => ({ ...item, sourceCategory: 'Topic: Government' })),
    ...PARAPHRASE_FAMILIES.map(item => ({ ...item, sourceCategory: 'Paraphrase Family' }))
  ];

  console.log(`总原始候选数: ${allSources.length}`);

  // 去重并过滤
  const seen = new Set();
  const candidates = [];
  let duplicates = 0;

  for (const item of allSources) {
    const key = item.word.toLowerCase();

    // 检查是否已存在于 Core
    if (isDuplicate(item.word)) {
      duplicates++;
      continue;
    }

    // 检查是否已添加到候选列表
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    candidates.push(toItem(item, candidates.length));
  }

  console.log(`去重后候选数: ${candidates.length}`);
  console.log(`与现有 Core 重复: ${duplicates}`);

  // 按总分排序
  candidates.sort((a, b) => b.totalScore - a.totalScore);

  // 重新分配 rank
  candidates.forEach((item, index) => {
    item.rank = index + 1;
  });

  // 统计信息
  const stats = {
    bySource: {},
    byTopic: {},
    byPartOfSpeech: {}
  };

  candidates.forEach(item => {
    const source = item.sourceCategory;
    const topic = item.topics[0];
    const pos = item.partOfSpeech;

    stats.bySource[source] = (stats.bySource[source] || 0) + 1;
    stats.byTopic[topic] = (stats.byTopic[topic] || 0) + 1;
    stats.byPartOfSpeech[pos] = (stats.byPartOfSpeech[pos] || 0) + 1;
  });

  console.log('\n=== 统计信息 ===');
  console.log('\n按来源:');
  Object.entries(stats.bySource).forEach(([source, count]) => {
    console.log(`  ${source}: ${count}`);
  });

  console.log('\n按话题:');
  Object.entries(stats.byTopic).forEach(([topic, count]) => {
    console.log(`  ${topic}: ${count}`);
  });

  console.log('\n按词性:');
  Object.entries(stats.byPartOfSpeech).forEach(([pos, count]) => {
    console.log(`  ${pos}: ${count}`);
  });

  // 写入文件
  const output = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source: 'IELTS Core Expansion Intake',
    description: '新的扩容候选池，来源包括 AWL 扩展词、Task 2 高频论证词、Topic Pack 扩展词和 Paraphrase Families',
    totalCandidates: candidates.length,
    stats,
    candidates
  };

  ensureDir(DATA_DIR);
  writeJson(CANDIDATES_FILE, output);

  console.log(`\n=== 完成 ===`);
  console.log(`写入: ${CANDIDATES_FILE}`);
  console.log(`总候选数: ${candidates.length}`);
}

main();