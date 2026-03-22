import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../public/data');
const TARGET_FILES = [
  'vocab-ielts6-breakthrough.json',
  'vocab-ielts7-sprint.json',
  'vocab-ielts8-mastery.json'
];

const technicalHints = /(itis|osis|ase|meter$|hedron$|grammat$|manganese|silico|acetyl|chloro|haem|pulmo|ceph|phyte|enzyme|esterase|salicyl|micro|neuro|bio|chem|geo)/i;

function readWords(filename) {
  const fullPath = path.join(DATA_DIR, filename);
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  return data.words || data;
}

function analyzeWords(words) {
  const stats = {
    count: words.length,
    noExample: 0,
    abbreviationLike: 0,
    longWords: 0,
    technicalHint: 0,
    suspectSamples: []
  };

  for (const word of words) {
    const text = word.word || '';
    const meaning = word.meaning || '';
    const exCount = (word.examples || []).length;

    if (exCount === 0) stats.noExample++;
    if (/^[A-Z]{2,}$/.test(text) || (/^[a-z]{2,6}$/i.test(text) && /abbr\./i.test(meaning))) {
      stats.abbreviationLike++;
    }
    if (text.length >= 14) stats.longWords++;
    if (technicalHints.test(text) || technicalHints.test(meaning)) {
      stats.technicalHint++;
      if (stats.suspectSamples.length < 12) {
        stats.suspectSamples.push({
          word: text,
          meaning,
          examples: exCount
        });
      }
    }
  }

  return stats;
}

function main() {
  console.log('IELTS library audit\n');

  for (const file of TARGET_FILES) {
    const words = readWords(file);
    const stats = analyzeWords(words);

    console.log(`FILE: ${file}`);
    console.log(`  total: ${stats.count}`);
    console.log(`  no-example: ${stats.noExample}`);
    console.log(`  abbreviation-like: ${stats.abbreviationLike}`);
    console.log(`  long-words(>=14): ${stats.longWords}`);
    console.log(`  technical-hint: ${stats.technicalHint}`);
    console.log('  suspect-samples:');

    for (const sample of stats.suspectSamples) {
      console.log(`    - ${sample.word} | examples=${sample.examples}`);
    }

    console.log('');
  }
}

main();
