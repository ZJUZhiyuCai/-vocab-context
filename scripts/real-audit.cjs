const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
// Canonical production filename
const CORE_FILE_CANONICAL = path.join(ROOT, 'public/data/ielts-foundation.json');
// Legacy compatibility filename (fallback)
const CORE_FILE_LEGACY = path.join(ROOT, 'public/data/ielts-core-500.json');
// Prefer canonical, fallback to legacy
const CORE_FILE = fs.existsSync(CORE_FILE_CANONICAL) ? CORE_FILE_CANONICAL : CORE_FILE_LEGACY;

const weakParaphrases = new Set(['important', 'relevant', 'key term', 'act on', 'carry out']);
const templatePatterns = [
  /Research has shown that .* plays a crucial role/i,
  /In IELTS essays, .* (is often used|can be used)/i,
  /When discussing .* candidates can use/i,
  /Scientists have documented how .* affects/i,
  /Policy analysts have debated the role of/i,
  /Health experts have examined how .* influences/i,
  /Studies have shown that .* significantly affects/i,
  /Recent studies indicate that .* is transforming/i
];
const badCollocationPattern = /^(and|to)\s+|\bcertificate with\b|\bhim international\b|\bInternational Language\b|\band maximum\b/i;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function audit() {
  const core = readJson(CORE_FILE).bundles || [];

  const generic = [];
  const blankIpa = [];
  const chineseIssues = [];
  const weakPara = [];
  const templateContexts = [];
  const badCollocations = [];

  for (const bundle of core) {
    const englishDefinition = String(bundle.englishDefinition || '');
    const ipa = String(bundle.ipa || '').trim();
    const chineseMeaning = String(bundle.chineseMeaning || '');
    const paraphrases = Array.isArray(bundle.paraphrases) ? bundle.paraphrases : [];
    const contexts = Array.isArray(bundle.contexts) ? bundle.contexts : [];
    const collocations = Array.isArray(bundle.collocations) ? bundle.collocations : [];

    if (englishDefinition.startsWith('A high-value IELTS')) {
      generic.push(bundle.word);
    }

    if (!ipa) {
      blankIpa.push(bundle.word);
    }

    if (/\n/.test(chineseMeaning) || /[�]|\?{3,}/.test(chineseMeaning)) {
      chineseIssues.push(bundle.word);
    }

    if (paraphrases.some(item => weakParaphrases.has(String(item).toLowerCase()))) {
      weakPara.push(bundle.word);
    }

    if (contexts.some(context => templatePatterns.some(pattern => pattern.test(String(context.text || ''))))) {
      templateContexts.push(bundle.word);
    }

    if (collocations.some(item => badCollocationPattern.test(String(item)))) {
      badCollocations.push(bundle.word);
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    coreBundles: core.length,
    genericDefinitions: generic,
    blankIpa,
    chineseIssues,
    weakParaphrases: weakPara,
    templateContexts,
    badCollocations
  };
}

const result = audit();
console.log(JSON.stringify({
  coreBundles: result.coreBundles,
  genericDefinitions: result.genericDefinitions.length,
  blankIpa: result.blankIpa.length,
  chineseIssues: result.chineseIssues.length,
  weakParaphrases: result.weakParaphrases.length,
  templateContexts: result.templateContexts.length,
  badCollocations: result.badCollocations.length
}, null, 2));
