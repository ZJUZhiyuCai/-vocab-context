import path from 'path';
import { fileURLToPath } from 'url';
import {
  ensureDir,
  mergeLegacyCandidates,
  writeJson
} from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'ielts-audit-result.json');

function summarizeCandidates(candidates) {
  return candidates.reduce((summary, candidate) => {
    Object.entries(candidate.flags).forEach(([flag, enabled]) => {
      if (!enabled) return;
      summary.flagCounts[flag] = (summary.flagCounts[flag] || 0) + 1;
    });

    summary.topicCoverage[candidate.topics[0] || 'unclassified'] =
      (summary.topicCoverage[candidate.topics[0] || 'unclassified'] || 0) + 1;

    return summary;
  }, {
    flagCounts: {},
    topicCoverage: {}
  });
}

function main() {
  ensureDir(OUTPUT_DIR);

  const { fileStats, candidates } = mergeLegacyCandidates();
  const summary = summarizeCandidates(candidates);

  const auditResult = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    totalCandidates: candidates.length,
    fileStats,
    summary,
    candidates
  };

  writeJson(OUTPUT_FILE, auditResult);

  console.log('IELTS candidate audit\n');
  console.log(`Total deduplicated candidates: ${candidates.length}`);
  console.log('');

  Object.entries(fileStats).forEach(([filename, stats]) => {
    console.log(`${filename}: ${stats.total}`);
  });

  console.log('\nFlag summary:');
  Object.entries(summary.flagCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([flag, count]) => {
      console.log(`  ${flag}: ${count}`);
    });

  console.log(`\nWrote ${OUTPUT_FILE}`);
}

main();
