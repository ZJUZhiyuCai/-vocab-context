#!/usr/bin/env node
/**
 * Generate comprehensive protection list for CET4 pruning
 * Combines AWL, IELTS Foundation, IELTS Core, and Topic Packs (excluding drafts)
 *
 * Updated: 2026-03-28
 * - Exclude draft files
 * - Dedupe sources array
 * - Fix P2 classification (topic-only words)
 */

import fs from 'fs';
import path from 'path';

// Read source files
const awlPath = './data/protection-awl.json';
const foundationPath = './public/data/ielts-foundation.json';
const corePath = './public/data/ielts-core-500.json';

// Exclude draft files from topic packs
const topicFiles = fs.readdirSync('./public/data')
  .filter(f =>
    f.startsWith('ielts-topic-') &&
    f.endsWith('.json') &&
    !f.includes('-draft')
  );

console.log('Topic files (excluding drafts):', topicFiles);

// Load AWL headwords (only headwords, not expanded family)
const awlData = JSON.parse(fs.readFileSync(awlPath, 'utf8'));
const awlSet = new Set(awlData.headwords);

// Load Foundation lemmas
const foundationData = JSON.parse(fs.readFileSync(foundationPath, 'utf8'));
const foundationSet = new Set(foundationData.bundles.map(b => b.lemma));

// Load Core lemmas
const coreData = JSON.parse(fs.readFileSync(corePath, 'utf8'));
const coreSet = new Set(coreData.bundles.map(b => b.lemma));

// Load Topic Pack lemmas (excluding drafts)
const topicMap = new Map(); // lemma -> topic sources
for (const file of topicFiles) {
  const topicData = JSON.parse(fs.readFileSync(path.join('./public/data', file), 'utf8'));
  const topicName = topicData.topic || file.replace('ielts-topic-', '').replace('.json', '');
  for (const bundle of topicData.bundles) {
    const lemma = bundle.lemma;
    if (!topicMap.has(lemma)) {
      topicMap.set(lemma, []);
    }
    const sources = topicMap.get(lemma);
    if (!sources.includes(topicName)) {  // Dedupe sources
      sources.push(topicName);
    }
  }
}

console.log('Topic lemmas (unique):', topicMap.size);

// Determine protection levels correctly
// H1: AWL or Foundation/Core overlap
// H2: Topic-only (in topic packs but NOT in Foundation/Core)
// SF: Single source (AWL-only, not in Foundation/Core/Topics)

const protectionWords = new Map();

// Process Foundation/Core first (H1)
for (const lemma of foundationSet) {
  const sources = ['foundation'];
  if (coreSet.has(lemma)) sources.push('core');
  if (awlSet.has(lemma)) sources.push('awl');
  // Check if in any topic pack
  if (topicMap.has(lemma)) {
    sources.push(...topicMap.get(lemma));
  }
  protectionWords.set(lemma, {
    sources: [...new Set(sources)],  // Dedupe
    protectionLevel: 'H1'
  });
}

// Process Core-only (H1)
for (const lemma of coreSet) {
  if (!protectionWords.has(lemma)) {
    const sources = ['core'];
    if (awlSet.has(lemma)) sources.push('awl');
    if (topicMap.has(lemma)) {
      sources.push(...topicMap.get(lemma));
    }
    protectionWords.set(lemma, {
      sources: [...new Set(sources)],
      protectionLevel: 'H1'
    });
  }
}

// Process Topic-only (H2) - in topics but NOT in Foundation/Core
for (const [lemma, topics] of topicMap) {
  if (!protectionWords.has(lemma)) {
    const sources = [...topics];
    if (awlSet.has(lemma)) sources.push('awl');
    // If also has AWL, it's H1 (academic + topic)
    const level = awlSet.has(lemma) ? 'H1' : 'H2';
    protectionWords.set(lemma, {
      sources: [...new Set(sources)],
      protectionLevel: level
    });
  }
}

// Process AWL-only (SF - Review Floor)
for (const lemma of awlSet) {
  if (!protectionWords.has(lemma)) {
    protectionWords.set(lemma, {
      sources: ['awl'],
      protectionLevel: 'SF'  // Changed from P3 to SF
    });
  }
}

// Generate output
const output = {
  version: '2.0.0',
  generatedAt: new Date().toISOString(),
  totalWords: protectionWords.size,
  sourceStats: {
    awl: awlSet.size,
    foundation: foundationSet.size,
    core: coreSet.size,
    topics: topicMap.size
  },
  levelStats: {
    H1: [...protectionWords.values()].filter(w => w.protectionLevel === 'H1').length,
    H2: [...protectionWords.values()].filter(w => w.protectionLevel === 'H2').length,
    SF: [...protectionWords.values()].filter(w => w.protectionLevel === 'SF').length
  },
  words: [...protectionWords.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([lemma, data]) => ({
      lemma,
      sources: data.sources,
      protectionLevel: data.protectionLevel
    }))
};

// Write output
fs.writeFileSync('./data/protection-list-final.json', JSON.stringify(output, null, 2));
console.log(`Generated protection list with ${output.totalWords} words`);
console.log(`H1: ${output.levelStats.H1}, H2: ${output.levelStats.H2}, SF: ${output.levelStats.SF}`);