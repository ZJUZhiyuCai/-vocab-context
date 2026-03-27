import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildExpansionContexts } from './topic-context-helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const FILES = [
  path.join(ROOT, 'public/data/ielts-core-500.json'),
  path.join(ROOT, 'public/data/ielts-foundation.json')
];

const EXPANSION_SOURCE_CATEGORIES = new Set([
  'topic-expansion-batch1',
  'topic-expansion-batch2',
  'topic-expansion-batch3',
  'topic-expansion-batch4',
  'final-batch'
]);

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function repairBundles(data) {
  const stats = {};
  let changed = 0;

  data.bundles = (data.bundles || []).map((bundle) => {
    if (!EXPANSION_SOURCE_CATEGORIES.has(bundle.sourceCategory)) {
      return bundle;
    }

    const nextContexts = buildExpansionContexts(bundle);
    const before = JSON.stringify(bundle.contexts || []);
    const after = JSON.stringify(nextContexts);

    if (before !== after) {
      changed += 1;
      stats[bundle.sourceCategory] = (stats[bundle.sourceCategory] || 0) + 1;
    }

    return {
      ...bundle,
      contexts: nextContexts
    };
  });

  data.generatedAt = new Date().toISOString();
  return { changed, stats };
}

function main() {
  const summary = [];

  for (const file of FILES) {
    if (!fs.existsSync(file)) continue;

    const data = loadJson(file);
    const result = repairBundles(data);
    writeJson(file, data);

    summary.push({
      file: path.relative(ROOT, file),
      changed: result.changed,
      stats: result.stats
    });
  }

  console.log(JSON.stringify(summary, null, 2));
}

main();
