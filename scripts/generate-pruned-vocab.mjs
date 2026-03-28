#!/usr/bin/env node
/**
 * Generate pruned CET4 vocabulary file
 * Removes words from final-delete-list.json
 */

import fs from 'fs';

// Load data
const cet4Path = './public/data/vocab-cet4-basic.json';
const deleteListPath = './data/final-delete-list.json';

const cet4 = JSON.parse(fs.readFileSync(cet4Path, 'utf8'));
const deleteList = JSON.parse(fs.readFileSync(deleteListPath, 'utf8'));

// Create delete set
const deleteSet = new Set(deleteList.words.map(w => w.word.toLowerCase()));

console.log(`Original CET4: ${cet4.totalWords} words`);
console.log(`Delete list: ${deleteList.totalDelete} words`);

// Filter words
const keptWords = cet4.words.filter(w => !deleteSet.has(w.word.toLowerCase()));
const deletedWords = cet4.words.filter(w => deleteSet.has(w.word.toLowerCase()));

console.log(`Kept: ${keptWords.length} words`);
console.log(`Deleted: ${deletedWords.length} words`);

// Generate pruned vocabulary
const pruned = {
  version: "3.1.0",
  lastUpdated: new Date().toISOString().split('T')[0],
  totalWords: keptWords.length,
  level: "四级精简版",
  description: "大学英语四级词汇（精简版）- 删除低质量词汇",
  source: "vocab-cet4-basic",
  prunedAt: new Date().toISOString(),
  deletedCount: deletedWords.length,
  words: keptWords
};

// Generate diff report
const diffReport = {
  generatedAt: new Date().toISOString(),
  originalCount: cet4.totalWords,
  deletedCount: deletedWords.length,
  keptCount: keptWords.length,
  deletionRate: ((deletedWords.length / cet4.totalWords) * 100).toFixed(1) + '%',
  reasonDistribution: deleteList.words.reduce((acc, w) => {
    acc[w.reason] = (acc[w.reason] || 0) + 1;
    return acc;
  }, {}),
  sampleDeleted: deletedWords.slice(0, 20).map(w => ({ word: w.word, reason: deleteList.words.find(d => d.word.toLowerCase() === w.word.toLowerCase())?.reason }))
};

// Write output
fs.writeFileSync('./public/data/vocab-cet4-basic-pruned.json', JSON.stringify(pruned, null, 2));
fs.writeFileSync('./data/prune-diff-report.json', JSON.stringify(diffReport, null, 2));

console.log('\nOutput files:');
console.log('- public/data/vocab-cet4-basic-pruned.json');
console.log('- data/prune-diff-report.json');
console.log(`\nDeletion rate: ${diffReport.deletionRate}`);