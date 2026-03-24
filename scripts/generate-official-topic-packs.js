import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Canonical production filename
const coreFile = path.join(__dirname, '../public/data/ielts-foundation.json');
// Legacy compatibility filename (fallback if canonical doesn't exist)
const coreFileLegacy = path.join(__dirname, '../public/data/ielts-core-500.json');
const outputDir = path.join(__dirname, '../public/data');

const TOPIC_CONFIGS = [
  { topic: 'education', file: 'ielts-topic-education.json', name: 'IELTS Topic Pack - Education' },
  { topic: 'government', file: 'ielts-topic-government.json', name: 'IELTS Topic Pack - Government' },
  { topic: 'environment', file: 'ielts-topic-environment.json', name: 'IELTS Topic Pack - Environment' },
  { topic: 'technology', file: 'ielts-topic-technology.json', name: 'IELTS Topic Pack - Technology' },
  { topic: 'health', file: 'ielts-topic-health.json', name: 'IELTS Topic Pack - Health' },
  { topic: 'work', file: 'ielts-topic-work.json', name: 'IELTS Topic Pack - Work' },
  { topic: 'media', file: 'ielts-topic-media.json', name: 'IELTS Topic Pack - Media' },
  { topic: 'crime', file: 'ielts-topic-crime.json', name: 'IELTS Topic Pack - Crime' }
];

function main() {
  // Prefer canonical file, fallback to legacy
  const filePath = fs.existsSync(coreFile) ? coreFile : coreFileLegacy;
  const coreData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const bundles = Array.isArray(coreData.bundles) ? coreData.bundles : [];

  for (const config of TOPIC_CONFIGS) {
    const topicBundles = bundles.filter(bundle => bundle.topic === config.topic);
    const payload = {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      source: 'IELTS Foundation',
      topic: config.topic,
      name: config.name,
      totalBundles: topicBundles.length,
      bundles: topicBundles
    };

    const outputFile = path.join(outputDir, config.file);
    fs.writeFileSync(outputFile, JSON.stringify(payload, null, 2) + '\n', 'utf8');
    console.log(`${config.topic}: ${topicBundles.length} -> ${outputFile}`);
  }
}

main();
