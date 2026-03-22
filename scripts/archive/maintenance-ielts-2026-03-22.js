import path from 'path';
import { fileURLToPath } from 'url';
import { readJson, writeJson } from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REVIEWED_FILE = path.join(__dirname, '../data/ielts-core-500-reviewed.json');

const REJECTIONS = {
  enlist: 'Rejected in maintenance mode: military-led core sense and support-seeking examples are weaker than the existing approved IELTS verb set.',
  gauge: 'Rejected in maintenance mode: source evidence is dominated by the noun sense and fuel-gauge examples rather than transferable academic verb usage.',
  havoc: 'Rejected in maintenance mode: noun-led collocations such as "cause havoc" dominate, so the tagged verb entry is too unstable for the reviewed gate.',
  afflict: 'Rejected in maintenance mode: useful but overly dramatic and problem-heavy for a core learner bundle, with no clear topic fit.',
  inconvenience: 'Rejected in maintenance mode: examples overwhelmingly support the noun apology formula rather than a high-value academic verb.',
  premise: 'Rejected in maintenance mode: source evidence is primarily the noun sense, while the approved gate tracks it as a verb.',
  revolutionize: 'Rejected in maintenance mode: high-intensity verb that encourages exaggerated claims and has weaker IELTS transfer than existing approved change verbs.'
};

const ENRICHMENTS = {
  philosophy: {
    reviewerNotes:
      'Maintenance enrichment: added education-safe editor fields so the published bundle targets the academic-discipline sense instead of generic template output.',
    editorSense: 'the study of ideas about knowledge, values, and how people should think or behave',
    editorEnglishDefinition:
      'The academic study of knowledge, reasoning, values, and beliefs, often discussed as a school or university subject.',
    editorChineseMeaning: '哲学；关于知识、价值观和思维方式的学科，也可指某种思想体系',
    editorCollocations: ['study philosophy', 'moral philosophy', 'philosophy course'],
    editorParaphrases: ['school of thought', 'theoretical thinking', 'philosophical study'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Many universities require philosophy modules to strengthen students\' critical thinking.',
        translation: '许多大学要求学习哲学模块，以加强学生的批判性思维。',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'A balanced education should include philosophy as well as practical training.',
        translation: '均衡的教育除了实践训练外，也应包括哲学课程。',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'I think philosophy is useful because it teaches people to question assumptions.',
        translation: '我认为哲学很有用，因为它能教人质疑既有假设。',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "philosophy" in one sentence about higher education or critical thinking.'
  },
  furthermore: {
    reviewerNotes:
      'Maintenance enrichment: replaced the generic linker output with IELTS-style discourse guidance and cleaner academic contexts.',
    editorSense: 'in addition; used to add another formal supporting point',
    editorEnglishDefinition:
      'A formal linking adverb meaning "in addition", used to introduce another reason or supporting point in academic writing.',
    editorChineseMeaning: '此外；而且；用于正式写作中补充另一条论点',
    editorCollocations: ['furthermore,', 'furthermore, this suggests', 'furthermore, governments should'],
    editorParaphrases: ['moreover', 'in addition', 'what is more'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Furthermore, the report highlights a widening gap between rural and urban schools.',
        translation: '此外，报告还强调了城乡学校之间不断扩大的差距。',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Furthermore, public funding can improve equal access to education.',
        translation: '此外，公共资金还能改善教育机会平等。',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'Furthermore, online tools save time when students need quick feedback.',
        translation: '此外，当学生需要快速反馈时，线上工具可以节省时间。',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "furthermore" to add a second supporting point in an IELTS Task 2 sentence.'
  },
  spectrum: {
    reviewerNotes:
      'Maintenance enrichment: clarified the academic "range" sense and replaced expansion-template contexts with usable education examples.',
    ipa: 'ˈspektrəm',
    editorSense: 'a range of different ideas, levels, or types within one area',
    editorEnglishDefinition:
      'A range of related ideas, levels, or types, often used when describing variation across a field or issue.',
    editorChineseMeaning: '范围；一系列不同但相关的事物；也可指光谱',
    editorCollocations: ['a broad spectrum of', 'across the spectrum', 'the full spectrum'],
    editorParaphrases: ['range', 'scope', 'variety'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Schools need support for students across the full spectrum of ability.',
        translation: '学校需要为不同能力层次的学生提供支持。',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'A good curriculum should cover a broad spectrum of practical and academic skills.',
        translation: '好的课程体系应涵盖广泛的实践与学术技能。',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'My class had a wide spectrum of opinions about online learning.',
        translation: '我们班对在线学习有各种不同的看法。',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "spectrum" in one sentence about a range of skills, opinions, or student needs.'
  },
  interaction: {
    reviewerNotes:
      'Maintenance enrichment: repaired corrupted Chinese output and sharpened the learner-facing definition for education and technology contexts.',
    editorSense: 'communication or mutual influence between people, groups, or systems',
    editorEnglishDefinition:
      'Communication or mutual influence between people, groups, or systems, especially in learning or digital environments.',
    editorChineseMeaning: '互动；交流；人、群体或系统之间的相互影响',
    editorCollocations: ['social interaction', 'teacher-student interaction', 'interaction between users and devices'],
    editorParaphrases: ['exchange', 'communication', 'mutual influence'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Classroom interaction often improves when students are given open-ended questions.',
        translation: '当学生被提出开放式问题时，课堂互动往往会改善。',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Technology should support interaction rather than replace meaningful discussion.',
        translation: '技术应当促进互动，而不是取代有意义的讨论。',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'I prefer apps that allow more interaction between teachers and learners.',
        translation: '我更喜欢那些能让教师和学习者之间有更多互动的应用。',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "interaction" in one sentence about education, communication, or technology.'
  },
  emission: {
    reviewerNotes:
      'Maintenance enrichment: replaced expansion-template output with explicit environmental policy usage for the plural academic sense.',
    ipa: 'ɪˈmɪʃən',
    editorSense: 'the production and release of gas, heat, light, or other substances into the environment',
    editorEnglishDefinition:
      'The act of producing and releasing gases or other substances, especially when discussing pollution or climate policy.',
    editorChineseMeaning: '排放；向空气、水体或环境中释放气体、热量或其他物质',
    editorCollocations: ['carbon emissions', 'cut emissions', 'vehicle emissions'],
    editorParaphrases: ['release', 'discharge', 'polluting output'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Transport remains a major source of carbon emissions in many cities.',
        translation: '在许多城市，交通仍然是碳排放的主要来源。',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Governments can reduce emissions by investing in cleaner public transport.',
        translation: '政府可以通过投资更清洁的公共交通来减少排放。',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'People should think about emissions when choosing how to travel every day.',
        translation: '人们在选择日常出行方式时，应考虑排放问题。',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "emissions" in one sentence about transport, energy, or climate policy.'
  },
  contamination: {
    reviewerNotes:
      'Maintenance enrichment: replaced template examples with concrete environment-focused contexts and restored clean learner-facing Chinese.',
    ipa: 'kənˌtæməˈneɪʃən',
    editorSense: 'the process of making something dirty, polluted, or unsafe by adding harmful substances',
    editorEnglishDefinition:
      'The process or state of something becoming polluted or unsafe because harmful substances have entered it.',
    editorChineseMeaning: '污染；因有害物质进入而使空气、水或土壤变得不安全',
    editorCollocations: ['water contamination', 'soil contamination', 'prevent contamination'],
    editorParaphrases: ['pollution', 'tainting', 'unsafe pollution'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Water contamination can spread quickly when industrial waste is not treated properly.',
        translation: '如果工业废弃物处理不当，水污染会迅速扩散。',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Stricter monitoring is needed to prevent contamination of farmland near factories.',
        translation: '需要更严格的监测来防止工厂附近农田受到污染。',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'People in my city worry about contamination in local rivers after heavy rain.',
        translation: '在我所在的城市，暴雨过后人们会担心当地河流受到污染。',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "contamination" in one sentence about water, soil, food, or public health.'
  },
  degradation: {
    reviewerNotes:
      'Maintenance enrichment: replaced generic expansion output with a clearer environmental-decline sense and stronger IELTS-useful contexts.',
    ipa: 'ˌdeɡrəˈdeɪʃən',
    editorSense: 'the process of becoming worse in quality or being damaged over time',
    editorEnglishDefinition:
      'The process by which land, ecosystems, materials, or conditions become worse or are damaged over time.',
    editorChineseMeaning: '退化；恶化；土地、环境或材料质量逐渐下降的过程',
    editorCollocations: ['environmental degradation', 'land degradation', 'prevent degradation'],
    editorParaphrases: ['deterioration', 'decline', 'damage'],
    editorContexts: [
      {
        kind: 'reading',
        text: 'Deforestation is one of the main causes of land degradation in dry regions.',
        translation: '在干旱地区，森林砍伐是土地退化的主要原因之一。',
        purpose: 'core'
      },
      {
        kind: 'writing',
        text: 'Without long-term planning, rapid urban growth can lead to environmental degradation.',
        translation: '如果缺乏长期规划，快速城市化可能导致环境恶化。',
        purpose: 'near-transfer'
      },
      {
        kind: 'speaking',
        text: 'I think people notice environmental degradation when green spaces disappear from their neighbourhood.',
        translation: '我认为，当社区中的绿地消失时，人们就会注意到环境退化。',
        purpose: 'far-transfer'
      }
    ],
    editorProductionPrompt: 'Use "degradation" in one sentence about land, ecosystems, or urban growth.'
  }
};

function main() {
  const data = readJson(REVIEWED_FILE);
  const candidates = data.candidates || [];

  let rejectedCount = 0;
  let enrichedCount = 0;

  for (const candidate of candidates) {
    const rejectionNote = REJECTIONS[candidate.key];
    if (rejectionNote && candidate.reviewStatus === 'candidate') {
      candidate.reviewStatus = 'rejected';
      candidate.approved = false;
      candidate.reviewerNotes = rejectionNote;
      rejectedCount += 1;
    }

    const enrichment = ENRICHMENTS[candidate.key];
    if (enrichment && candidate.reviewStatus === 'approved' && candidate.approved === true) {
      Object.assign(candidate, enrichment);
      enrichedCount += 1;
    }
  }

  data.generatedAt = new Date().toISOString();
  writeJson(REVIEWED_FILE, data);

  console.log(`Rejected ${rejectedCount} candidate items.`);
  console.log(`Enriched ${enrichedCount} approved items.`);
  console.log(`Updated ${REVIEWED_FILE}`);
}

main();
