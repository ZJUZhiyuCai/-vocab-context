import path from 'path';
import { fileURLToPath } from 'url';
import { readJson } from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_FILE = path.join(__dirname, '../public/data/ielts-core-500-generated-draft.json');
const PLACEHOLDER_PATTERNS = [/todo/i, /tbd/i, /placeholder/i];

function getFilePath() {
  return process.argv[2] || DEFAULT_FILE;
}

function hasPlaceholder(value) {
  return PLACEHOLDER_PATTERNS.some(pattern => pattern.test(String(value || '')));
}

function validateBundle(bundle, seenIds) {
  const errors = [];
  const requiredFields = [
    'bundleId',
    'word',
    'sense',
    'topic',
    'taskTypes',
    'register',
    'englishDefinition',
    'chineseMeaning',
    'collocations',
    'paraphrases',
    'contexts',
    'productionPrompt',
    'sourceQuality'
  ];

  requiredFields.forEach(field => {
    if (bundle[field] === undefined || bundle[field] === null || bundle[field] === '') {
      errors.push(`missing:${field}`);
    }
  });

  if (seenIds.has(bundle.bundleId)) {
    errors.push('duplicate:bundleId');
  }
  seenIds.add(bundle.bundleId);

  if (!Array.isArray(bundle.contexts) || bundle.contexts.length < 2) {
    errors.push('contexts:length');
  }
  if (!Array.isArray(bundle.collocations) || bundle.collocations.length < 2) {
    errors.push('collocations:length');
  }
  if (!Array.isArray(bundle.paraphrases) || bundle.paraphrases.length < 1) {
    errors.push('paraphrases:length');
  }
  if (hasPlaceholder(bundle.englishDefinition) || hasPlaceholder(bundle.productionPrompt?.instruction)) {
    errors.push('placeholder:text');
  }
  if ((bundle.contexts || []).some(context => !context.text || context.text.split(/\s+/).length < 4)) {
    errors.push('contexts:quality');
  }

  const sourceQuality = bundle.sourceQuality || {};
  ['relevanceScore', 'transferabilityScore', 'outputUtilityScore', 'exampleQualityScore'].forEach(key => {
    const value = Number(sourceQuality[key]);
    if (Number.isNaN(value) || value < 0 || value > 5 || !Number.isInteger(value)) {
      errors.push(`sourceQuality:${key}`);
    }
  });

  if (!['keep', 'keep_with_review', 'hold', 'reject'].includes(sourceQuality.decision)) {
    errors.push('sourceQuality:decision');
  }

  return errors;
}

function main() {
  const filePath = getFilePath();
  const data = readJson(filePath);
  const bundles = data.bundles || [];
  const seenIds = new Set();
  const failures = [];

  bundles.forEach(bundle => {
    const errors = validateBundle(bundle, seenIds);
    if (errors.length > 0) {
      failures.push({
        bundleId: bundle.bundleId,
        errors
      });
    }
  });

  console.log(`Validated ${bundles.length} bundles from ${filePath}`);
  console.log(`Failures: ${failures.length}`);

  failures.slice(0, 20).forEach(failure => {
    console.log(`- ${failure.bundleId}: ${failure.errors.join(', ')}`);
  });

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

main();
