import path from 'path';
import { fileURLToPath } from 'url';
import {
  ensureDir,
  readJson,
  writeJson
} from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../public/data');
const APPROVED_FILE = path.join(OUTPUT_DIR, 'ielts-core-500.json');
const TOPICS = ['education', 'environment', 'technology'];

function buildTopicPack(topic, bundles) {
  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    approvalStatus: 'draft',
    draft: true,
    topic,
    totalBundles: bundles.length,
    note: 'Draft topic pack generated from approved IELTS Core bundles. Review before learner-facing use.',
    bundles
  };
}

function main() {
  ensureDir(OUTPUT_DIR);
  const approved = readJson(APPROVED_FILE).bundles || [];

  for (const topic of TOPICS) {
    const topicBundles = approved
      .filter(bundle => bundle.topic === topic)
      .map(bundle => ({
        ...bundle,
        draft: true
      }));

    const outputPath = path.join(OUTPUT_DIR, `ielts-topic-${topic}-draft.json`);
    writeJson(outputPath, buildTopicPack(topic, topicBundles));
    console.log(`Generated ${topicBundles.length} bundles for ${topic}: ${outputPath}`);
  }
}

main();
