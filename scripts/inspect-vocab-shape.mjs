#!/usr/bin/env node
/**
 * CET4 词库结构检查脚本 (修正版)
 * - 改进启发式规则，减少误报
 * - 去重候选集合
 * - 分层置信度
 */

import fs from 'fs';

const cet4Path = './public/data/vocab-cet4-basic.json';
const protectionPath = './data/protection-list-final.json';

// Load data
const cet4 = JSON.parse(fs.readFileSync(cet4Path, 'utf8'));
const protection = JSON.parse(fs.readFileSync(protectionPath, 'utf8'));

// Create protection lemma set (case-insensitive)
const protectionSet = new Set(protection.words.map(w => w.lemma.toLowerCase()));

// Analysis results with dedupe
const candidateSet = new Map(); // word.id -> { word, reasonCodes, confidence }

// Improved patterns for inflected forms (conservative English morphology)
const inflectedPatterns = {
  // Past tense: only clear -ed forms where the verb base exists
  // Examples: 'died' -> 'die', 'played' -> 'play', 'worked' -> 'work'
  ed: (w) => {
    // Must be at least 4 chars to have meaningful base
    if (w.length < 4 || !w.endsWith('ed')) return null;
    // Common false positives
    if (['need', 'seed', 'feed', 'deed', 'indeed', 'red', 'bed', 'led'].includes(w)) return null;

    // Try common verb patterns:
    // died -> die, tried -> try, played -> play, worked -> work
    const candidates = [
      w.replace(/ied$/, 'y'),      // died -> die (but not tied -> tie which is valid)
      w.replace(/ed$/, ''),         // worked -> work
      w.replace(/d$/, ''),          // moved -> move (if w ends in 'eed')
    ];

    for (const base of candidates) {
      if (base.length >= 2) return base;
    }
    return null;
  },

  // Gerund/present participle: only clear -ing forms where the verb base exists
  // Examples: 'eating' -> 'eat', 'using' -> 'use', 'going' -> 'go'
  ing: (w) => {
    if (w.length < 5 || !w.endsWith('ing')) return null;
    // Common false positives
    if (['thing', 'sing', 'ring', 'king', 'wing', 'bring', 'cling', 'fling', 'string', 'spring', 'during', 'evening', 'morning', 'meaning', 'feeling', 'being', 'anything', 'something', 'nothing', 'everything'].includes(w)) return null;

    // Try common patterns:
    // eating -> eat, using -> use, going -> go, making -> make
    const candidates = [
      w.replace(/ing$/, ''),        // eating -> eat
      w.replace(/ing$/, 'e'),       // using -> use
      w.replace(/ying$/, 'y'),      // studying -> study (handled by first rule actually)
      w.replace(/ing$/, ''),        // make -> making (base form)
    ];

    for (const base of candidates) {
      if (base.length >= 2) return base;
    }
    return null;
  },

  // Plural: very conservative - only clear cases
  // Most -s words in English are NOT plurals (is, as, his, was, has, etc.)
  plural: (w) => {
    // Skip common false positives entirely
    const falsePositives = [
      'news', 'his', 'as', 'is', 'was', 'has', 'does', 'goes', 'yes', 'bus',
      'gas', 'plus', 'thus', 'anus', 'bias', 'chorus', 'focus', 'lotus', 'minus',
      'status', 'virus', 'census', 'cosmos', 'rhinoceros', 'always', 'sometimes',
      'days', 'ways', 'says', 'sees', 'seems', 'sets', 'gets', 'lets', 'puts',
      'looks', 'works', 'makes', 'takes', 'comes', 'gives', 'finds', 'thinks',
      'knows', 'shows', 'wants', 'uses', 'finds', 'gives', 'tells', 'asks', 'seems'
    ];
    if (falsePositives.includes(w)) return null;

    // Only consider if it's clearly a noun plural pattern
    // Must have a singular form that's significantly different
    if (!w.endsWith('s') || w.length < 4) return null;

    const base = w.replace(/s$/, '');
    // Skip if base is too short (could match random words)
    if (base.length < 3) return null;

    // Only return if base is a likely noun (this is conservative)
    return base;
  }
};

// Medical domain keywords (for checking the main meaning, not just examples)
const medicalMeaningKeywords = [
  '医', '药', '病', '症', '病毒', '细菌', '肿瘤', '癌', '手术', '临床', '病理'
];
// Words that are clearly medical terms
const clearMedicalWords = new Set([
  'virus', 'bacteria', 'tumor', 'cancer', 'surgery', 'clinical', 'pathology',
  'diagnosis', 'symptom', 'vaccine', 'antibody', 'enzyme', 'protein', 'cell',
  'membrane', 'chromosome', 'dna', 'rna', 'hormone', 'insulin'
]);

// Religious domain keywords (for checking the main meaning)
const religiousMeaningKeywords = ['圣', '宗教', '圣经', '耶稣', '基督'];
const clearReligiousWords = new Set(['bible', 'christian', 'jesus', 'christ']);

// Named entities and abbreviations (clear noise)
// CET4 stores names in lowercase, so we need a list of common names
// BUT: Some names are also common words (bill, mark, brown, etc.)
// Only flag if the word has NO common word meaning

const purePersonNames = new Set([
  'henry', 'sam', 'danny', 'steve', 'david', 'oscar', 'carmen',
  'aaron', 'adam', 'alan', 'alex', 'alice', 'amanda', 'amy', 'andrew', 'anna',
  'ben', 'billy', 'bob', 'brian', 'charles', 'chris',
  'dick', 'edward', 'elizabeth', 'frank', 'george', 'graham', 'harry',
  'jack', 'james', 'jane', 'jason', 'jean', 'jennifer', 'jerry', 'jessica', 'jim',
  'joan', 'john', 'joseph', 'julia', 'kate', 'kathy', 'kelly',
  'kim', 'larry', 'laura', 'linda', 'lisa', 'lucy',
  'michael', 'mike', 'nancy',
  'nick', 'parker', 'peter', 'phil', 'richard', 'robert',
  'roger', 'ron', 'ruth', 'sally', 'sarah', 'scott', 'susan', 'taylor',
  'tony', 'victor', 'william', 'zhang'
]);

// Names that are also common words - these should NOT be flagged as named entities
// They will be handled by other logic (low frequency, etc.)
const commonWordsThatAreAlsoNames = new Set([
  'bill', 'mark', 'brown', 'wolf', 'rose', 'lily', 'jade', 'ivy', 'dawn', 'daisy',
  'hope', 'grace', 'faith', 'mercy', 'summer', 'autumn', 'april', 'may', 'june',
  'august', 'sky', 'river', 'forest', 'lane', 'park', 'page', 'reed', 'clay',
  'brook', 'field', 'wood', 'stone', 'grant', 'dean', 'cole', 'chase',
  'claire', 'joy', 'patience', 'felix', 'precious', 'spike', 'misty', 'angel',
  'bush', 'clinton', 'kennedy', 'nixon', 'johnson', 'jones', 'miller', 'smith',
  'wilson', 'newton', 'kent'
]);

// Pure place names (no common word meaning) - safe to delete
const placeNames = new Set([
  'berlin', 'london', 'washington'
]);

const abbreviationNoise = new Set(['dr', 'mr', 'mrs', 'ms', 'mm', 'mmm', 'ok', 'tmo', 'tv']);

// Check each word
for (const word of cet4.words) {
  const lemma = word.word.toLowerCase();
  const isProtected = protectionSet.has(lemma);
  const reasonCodes = [];
  let confidence = 100;  // Start with full confidence

  // Extract common fields
  const mainPos = (word.partOfSpeech || '').toLowerCase();
  const meaning = (word.meaning || '').toLowerCase();

  // 1. Named entities (only pure names/place names, not common words that are also names)
  // A word is a pure name if:
  // - It's in our name lists AND
  // - The meaning is ONLY a name explanation (like "n.亨利" or "n.伦敦")
  // - NOT if it has independent meanings (abbr., adj., or substantive non-name content)

  const isPureName =
    !commonWordsThatAreAlsoNames.has(lemma) &&
    (purePersonNames.has(lemma) || placeNames.has(lemma)) &&
    !isProtected;

  // Check if meaning has non-name content
  // Pure name meanings look like: "n.亨利", "n.伦敦(英国首都)", "n.男子名", "n.安娜"
  // Non-pure meanings have: abbr., adj., verb, or substantive non-name noun meaning

  const hasNonNameMeaning =
    meaning.includes('abbr.') ||
    // Check for substantive content beyond just being a name
    (meaning.includes('n.') && !meaning.match(/n\.[男女]子名$/) && !meaning.match(/n\.[^\n，。]+名[）)]?$/)) ||
    meaning.includes('adj.') ||
    meaning.includes('vt.') ||
    meaning.includes('vi.') ||
    meaning.includes('v.') ||
    // Specific independent meanings found in CET4 data
    meaning.includes('抽水马桶') || meaning.includes('厕所') ||     // john
    meaning.includes('骚扰') ||                                     // harry
    meaning.includes('话筒') || meaning.includes('扩音器') ||      // mike
    meaning.includes('高贵的') ||                                   // tony
    meaning.includes('枯竭') || meaning.includes('麻醉品') ||      // peter
    meaning.includes('女人气') ||                                   // nancy
    meaning.includes('警棍') || meaning.includes('棍棒') ||        // billy
    meaning.includes('内室') || meaning.includes('起居室') ||      // ben
    meaning.includes('怜悯') || meaning.includes('悲哀') ||        // ruth
    meaning.includes('小车') || meaning.includes('斗底车');        // larry

  if (isPureName && !hasNonNameMeaning) {
    reasonCodes.push('named-entity');
    confidence = 95;
  }

  // 2. Abbreviation noise
  if (abbreviationNoise.has(lemma)) {
    reasonCodes.push('abbreviation-noise');
    confidence = 95;
  }

  // 2. Missing IPA (data quality issue, LOW confidence)
  if (!word.ipa || word.ipa.trim() === '') {
    // Only flag if also has other issues
    reasonCodes.push('missing-ipa');
    confidence -= 10;
  }

  // 3. Missing examples (data quality issue)
  if (!word.examples || word.examples.length === 0) {
    reasonCodes.push('missing-evidence');
    confidence -= 15;
  } else if (word.examples.length < 2) {
    reasonCodes.push('insufficient-evidence');
    confidence -= 5;
  }

  // 4. Low frequency + unprotected (potential low-ielts-transfer)
  if (word.frequency <= 5 && !isProtected) {
    reasonCodes.push('low-ielts-transfer');
    confidence -= 10;
  }

  // 5. Potential inflected forms (conservative - only clear cases)
  // Only flag if: (a) it matches a clear inflection pattern, AND (b) the base form exists in CET4
  let inflectedFormBase = null;
  for (const [type, fn] of Object.entries(inflectedPatterns)) {
    const possibleBase = fn(lemma);
    if (possibleBase && possibleBase.length >= 2) {
      // Check if base form exists in CET4
      const baseExists = cet4.words.some(w => w.word.toLowerCase() === possibleBase);
      if (baseExists) {
        inflectedFormBase = possibleBase;
        break;
      }
    }
  }

  if (inflectedFormBase) {
    // Classify based on meaning text analysis
    // Key: if the meaning ONLY describes a conjugation (过去式, 现在分词, etc.),
    // it's an obvious inflected form; if it also has independent meaning, it's lexicalized

    const meaningLower = meaning.toLowerCase();

    // Check if meaning indicates it's a conjugated form
    const hasConjugationMeaning =
      meaningLower.includes('过去式') ||
      meaningLower.includes('过去分词') ||
      meaningLower.includes('现在分词') ||
      meaningLower.includes('第三人称单数') ||
      meaningLower.includes('复数') ||
      /v\.\s*(过去|过去式|过去分词|现在分词)/.test(meaningLower);

    // Check if it has independent meaning (not just conjugation)
    // Independent meaning = the word can be used as noun/adj/adv/conj in its own right
    // Check both the part of speech and the meaning text
    // Key insight: if meaning contains BOTH n./adj. AND verb conjugation, it's lexicalized
    const hasNounAdjMeaning =
      meaningLower.includes('n.') ||
      meaningLower.includes('adj.') ||
      meaningLower.includes('adv.') ||
      meaningLower.includes('conj.') ||
      meaningLower.includes('int.');

    const hasIndependentMeaning =
      // Check part of speech for non-verb primary
      mainPos.includes('adj') ||
      mainPos.includes('n.') ||
      mainPos.includes('adv.') ||
      mainPos.includes('conj.') ||
      mainPos.includes('prep.') ||
      mainPos.includes('int.') ||
      // Check if meaning starts with independent part of speech
      meaningLower.match(/^(adj\.|n\.|adv\.|conj\.|prep\.|int\.)/) ||
      // If meaning contains noun/adj definition, it's lexicalized (even if also has verb)
      hasNounAdjMeaning;

    // If it has both conjugation meaning AND independent meaning, it's lexicalized
    if (hasConjugationMeaning && hasIndependentMeaning) {
      reasonCodes.push('lexicalized-derived-form');
      confidence = 70;
    } else if (hasConjugationMeaning && !hasIndependentMeaning) {
      // Pure conjugation - can be deleted
      reasonCodes.push('obvious-inflected-form');
      confidence = 80;
    } else {
      // No conjugation meaning - treat as lexicalized
      reasonCodes.push('lexicalized-derived-form');
      confidence = 70;
    }
  }

  // 6. Medical domain (only for clear medical terms, not common words with medical examples)
  // Check if the word itself is a medical term based on:
  // (a) it's in the clearMedicalWords set, OR
  // (b) the main meaning contains medical keywords
  const hasMedicalMeaning = medicalMeaningKeywords.some(k => meaning.includes(k));
  const isClearMedicalWord = clearMedicalWords.has(lemma);

  if ((isClearMedicalWord || hasMedicalMeaning) && !isProtected) {
    reasonCodes.push('specialist-domain');
    confidence = 70;
  }

  // 7. Religious domain (only for clear religious terms)
  const hasReligiousMeaning = religiousMeaningKeywords.some(k => meaning.includes(k));
  const isClearReligiousWord = clearReligiousWords.has(lemma);

  if ((isClearReligiousWord || hasReligiousMeaning) && !isProtected) {
    reasonCodes.push('specialist-domain');
    confidence = 70;
  }

  // Add to candidate set if has reason codes and not high protection
  if (reasonCodes.length > 0 && confidence < 100) {
    candidateSet.set(word.id, {
      id: word.id,
      word: word.word,
      frequency: word.frequency,
      isProtected,
      reasonCodes: [...new Set(reasonCodes)],  // Dedupe
      confidence
    });
  }
}

// Generate confidence-stratified report
// Fix: ensure all candidates are covered
const hardDeleteReasons = ['named-entity', 'abbreviation-noise', 'obvious-inflected-form'];

const highConfidenceDelete = [...candidateSet.values()]
  .filter(c => c.confidence >= 80 && c.reasonCodes.some(r => hardDeleteReasons.includes(r)));

const mediumConfidenceReview = [...candidateSet.values()]
  .filter(c => {
    // Confidence 60-79 OR confidence >= 80 but only lexicalized/specialist reasons
    if (c.confidence >= 60 && c.confidence < 80) return true;
    if (c.confidence >= 80 && !c.reasonCodes.some(r => hardDeleteReasons.includes(r))) return true;
    return false;
  });

const lowConfidenceReview = [...candidateSet.values()]
  .filter(c => c.confidence < 60);

// Verify all candidates are accounted for
const accountedFor = highConfidenceDelete.length + mediumConfidenceReview.length + lowConfidenceReview.length;
if (accountedFor !== candidateSet.size) {
  console.warn(`Warning: ${candidateSet.size - accountedFor} candidates not accounted for in stratification`);
}

// Generate report
const report = {
  version: '2.0.0',
  generatedAt: new Date().toISOString(),
  totalWords: cet4.totalWords,
  protectedOverlap: cet4.words.filter(w => protectionSet.has(w.word.toLowerCase())).length,
  candidatePool: {
    totalCandidates: candidateSet.size,
    highConfidenceDelete: highConfidenceDelete.length,
    mediumConfidenceReview: mediumConfidenceReview.length,
    lowConfidenceReview: lowConfidenceReview.length
  },
  summary: {
    namedEntity: [...candidateSet.values()].filter(c => c.reasonCodes.includes('named-entity')).length,
    abbreviationNoise: [...candidateSet.values()].filter(c => c.reasonCodes.includes('abbreviation-noise')).length,
    obviousInflectedForm: [...candidateSet.values()].filter(c => c.reasonCodes.includes('obvious-inflected-form')).length,
    lexicalizedDerivedForm: [...candidateSet.values()].filter(c => c.reasonCodes.includes('lexicalized-derived-form')).length,
    specialistDomain: [...candidateSet.values()].filter(c => c.reasonCodes.includes('specialist-domain')).length,
    missingEvidence: [...candidateSet.values()].filter(c => c.reasonCodes.includes('missing-evidence')).length,
    lowIeltsTransfer: [...candidateSet.values()].filter(c => c.reasonCodes.includes('low-ielts-transfer')).length
  },
  candidates: {
    highConfidenceDelete: highConfidenceDelete.slice(0, 50),
    mediumConfidenceReview: mediumConfidenceReview.slice(0, 30),
    lowConfidenceReview: lowConfidenceReview.slice(0, 20)
  },
  frequencyDistribution: {
    freq4: cet4.words.filter(w => w.frequency === 4).length,
    freq5: cet4.words.filter(w => w.frequency === 5).length,
    freq6: cet4.words.filter(w => w.frequency === 6).length,
    freq7: cet4.words.filter(w => w.frequency === 7).length,
    freq8: cet4.words.filter(w => w.frequency === 8).length,
    freq9: cet4.words.filter(w => w.frequency === 9).length,
    freq10: cet4.words.filter(w => w.frequency === 10).length
  }
};

// Output report
fs.writeFileSync('./data/cet4-structure-report.json', JSON.stringify(report, null, 2));

console.log('CET4 Structure Report Generated (v2)');
console.log(`Total words: ${cet4.totalWords}`);
console.log(`Protected overlap: ${report.protectedOverlap}`);
console.log(`\nCandidate Pool (deduplicated):`);
console.log(`- Total candidates: ${report.candidatePool.totalCandidates}`);
console.log(`- High confidence delete: ${report.candidatePool.highConfidenceDelete}`);
console.log(`- Medium confidence review: ${report.candidatePool.mediumConfidenceReview}`);
console.log(`- Low confidence review: ${report.candidatePool.lowConfidenceReview}`);
console.log(`\nReason code distribution:`);
console.log(`- Named entity: ${report.summary.namedEntity}`);
console.log(`- Abbreviation noise: ${report.summary.abbreviationNoise}`);
console.log(`- Obvious inflected form: ${report.summary.obviousInflectedForm}`);
console.log(`- Lexicalized derived form: ${report.summary.lexicalizedDerivedForm}`);
console.log(`- Specialist domain: ${report.summary.specialistDomain}`);
console.log(`- Low IELTS transfer: ${report.summary.lowIeltsTransfer}`);