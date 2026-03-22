/**
 * 修复模板 contexts
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { readJson, writeJson } from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REVIEWED_FILE = path.join(__dirname, '../data/ielts-core-500-reviewed.json');

// Contexts 修复映射
const contextFixes = {
  discretionary: {
    editorContexts: [
      { kind: 'reading', text: 'Discretionary spending on public services has decreased in recent budgets.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Governments should review discretionary policies to ensure they benefit all citizens.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'Teachers often have discretionary power to adapt lessons to student needs.', translation: '', purpose: 'far-transfer' }
    ]
  },
  individualism: {
    editorContexts: [
      { kind: 'reading', text: 'The rise of individualism has changed how people view community responsibilities.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Some argue that excessive individualism can weaken social bonds.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'In my country, there is a growing tension between collectivism and individualism.', translation: '', purpose: 'far-transfer' }
    ]
  },
  investigative: {
    editorContexts: [
      { kind: 'reading', text: 'Investigative journalism plays a crucial role in exposing corruption.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'The report calls for a full investigative review of the incident.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'I think investigative reporting is essential for a healthy democracy.', translation: '', purpose: 'far-transfer' }
    ]
  },
  demonstration: {
    editorContexts: [
      { kind: 'reading', text: 'A large demonstration was held outside the parliament building.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Peaceful demonstration is a fundamental right in democratic societies.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'I participated in a demonstration about climate change last year.', translation: '', purpose: 'far-transfer' }
    ]
  },
  developmental: {
    editorContexts: [
      { kind: 'reading', text: 'Early developmental stages are critical for children cognitive growth.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Developmental projects should prioritise sustainability and local needs.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'My university offers developmental programmes for students from disadvantaged backgrounds.', translation: '', purpose: 'far-transfer' }
    ]
  },
  precautionary: {
    editorContexts: [
      { kind: 'reading', text: 'The precautionary principle guides environmental policy in many countries.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Precautionary measures should be taken before introducing new technologies.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'I think precautionary health advice is important during disease outbreaks.', translation: '', purpose: 'far-transfer' }
    ]
  },
  redistribution: {
    editorContexts: [
      { kind: 'reading', text: 'Wealth redistribution remains a controversial topic in economic policy.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'Redistribution of resources can help reduce inequality in society.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'I believe fair redistribution of wealth is essential for social stability.', translation: '', purpose: 'far-transfer' }
    ]
  },
  rehabilitation: {
    editorContexts: [
      { kind: 'reading', text: 'Rehabilitation programmes help former prisoners reintegrate into society.', translation: '', purpose: 'core' },
      { kind: 'writing', text: 'The focus of the justice system should shift from punishment to rehabilitation.', translation: '', purpose: 'near-transfer' },
      { kind: 'speaking', text: 'After his injury, rehabilitation took almost six months.', translation: '', purpose: 'far-transfer' }
    ]
  }
};

function fixContexts() {
  const data = readJson(REVIEWED_FILE);
  let fixedCount = 0;
  const fixed = [];

  data.candidates.forEach(entry => {
    if (!entry.approved) return;

    const fix = contextFixes[entry.key];
    if (fix && fix.editorContexts) {
      entry.editorContexts = fix.editorContexts;
      fixedCount++;
      fixed.push(entry.key);
    }
  });

  writeJson(REVIEWED_FILE, data);

  console.log('\n=== Context Fixes ===\n');
  console.log(`Total entries fixed: ${fixedCount}`);
  console.log('\nFixed words:');
  fixed.forEach(word => console.log(`  - ${word}`));

  return { fixedCount, fixed };
}

fixContexts();