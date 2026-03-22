/**
 * 精修高价值 bundle 的 editor 字段
 *
 * 目标词：maximum, international, certificate, consequently, persist, adequate,
 * curriculum, literacy, sustainability, innovation, digital, conservation,
 * phenomenon, endorse, perspective, underlying, stem, trigger, barrier
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { readJson, writeJson } from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const REVIEWED_FILE = path.join(DATA_DIR, 'ielts-core-500-reviewed.json');

// 精修数据
const FIXES = {
  'maximum': {
    editorPartOfSpeech: 'adj.',
    editorSense: 'the greatest amount, number, or level possible',
    editorEnglishDefinition: 'The highest amount, level, or limit that can be reached or allowed',
    editorChineseMeaning: '最大的，最高的；最大值，上限',
    ipa: 'ˈmæksɪməm',
    editorCollocations: ['maximum capacity', 'maximum benefit', 'reach maximum'],
    editorParaphrases: ['highest', 'greatest', 'upper limit']
  },
  'international': {
    editorPartOfSpeech: 'adj.',
    editorSense: 'involving or relating to two or more countries',
    editorEnglishDefinition: 'Involving or relating to multiple countries, cultures, or nations',
    editorChineseMeaning: '国际的，跨国的；涉及多个国家的',
    ipa: 'ˌɪntəˈnæʃənəl',
    editorCollocations: ['international students', 'international cooperation', 'international standards'],
    editorParaphrases: ['global', 'worldwide', 'cross-border']
  },
  'certificate': {
    editorPartOfSpeech: 'n.',  // 修正：v. → n.
    editorSense: 'an official document proving someone has completed a course or qualification',
    editorEnglishDefinition: 'An official document that proves a person has completed training, education, or achieved a qualification',
    editorChineseMeaning: '证书，文凭；证明完成课程或取得资格的正式文件',
    ipa: 'səˈtɪfɪkət',
    editorCollocations: ['obtain a certificate', 'teaching certificate', 'graduation certificate'],
    editorParaphrases: ['qualification', 'credential', 'diploma']
  },
  'consequently': {
    editorPartOfSpeech: 'adv.',
    editorSense: 'as a result; therefore',
    editorEnglishDefinition: 'As a result; used to show that something follows logically from what was just mentioned',
    editorChineseMeaning: '因此，所以；结果是',
    ipa: 'ˈkɒnsɪkwəntli',
    editorCollocations: ['consequently, ...', 'and consequently', 'consequently lead to'],
    editorParaphrases: ['therefore', 'as a result', 'thus', 'hence']
  },
  'persist': {
    editorPartOfSpeech: 'v.',
    editorSense: 'to continue to exist or happen, especially when unwanted',
    editorEnglishDefinition: 'To continue to exist or happen over time, especially when this is difficult or unwanted',
    editorChineseMeaning: '持续存在，坚持；尤指问题难以解决时仍然存在',
    ipa: 'pəˈsɪst',
    editorCollocations: ['persist in', 'problems persist', 'persist over time'],
    editorParaphrases: ['continue', 'endure', 'remain', 'carry on']
  },
  'adequate': {
    editorPartOfSpeech: 'adj.',
    editorSense: 'enough or good enough for a particular purpose',
    editorEnglishDefinition: 'Enough in quantity or quality to meet a particular need or standard',
    editorChineseMeaning: '充分的，足够的；达到特定需求或标准的',
    ipa: 'ˈædɪkwət',
    editorCollocations: ['adequate resources', 'adequate support', 'adequate funding', 'adequate protection'],
    editorParaphrases: ['sufficient', 'enough', 'satisfactory']
  },
  'curriculum': {
    editorPartOfSpeech: 'n.',
    editorSense: 'the subjects and content taught in a school or education system',
    editorEnglishDefinition: 'The set of subjects, skills, and learning goals taught by a school or education system',
    editorChineseMeaning: '课程；学校或教育系统教授的科目和内容',
    ipa: 'kəˈrɪkjʊləm',
    editorCollocations: ['school curriculum', 'curriculum development', 'core curriculum'],
    editorParaphrases: ['syllabus', 'course content', 'programme of study']
  },
  'literacy': {
    editorPartOfSpeech: 'n.',
    editorSense: 'the ability to read and write, or knowledge in a particular area',
    editorEnglishDefinition: 'The ability to read and write, or competence in a specific area such as digital or financial skills',
    editorChineseMeaning: '识字能力，读写能力；（某领域的）素养',
    ipa: 'ˈlɪtərəsi',
    editorCollocations: ['literacy rate', 'digital literacy', 'basic literacy', 'improve literacy'],
    editorParaphrases: ['reading ability', 'basic education', 'competence']
  },
  'sustainability': {
    editorPartOfSpeech: 'n.',
    editorSense: 'the ability to continue over time without causing long-term harm',
    editorEnglishDefinition: 'The ability to maintain or continue a process or activity over time without depleting resources or causing damage',
    editorChineseMeaning: '可持续性；长期维持而不造成损害的能力',
    ipa: 'səˌsteɪnəˈbɪləti',
    editorCollocations: ['environmental sustainability', 'long-term sustainability', 'promote sustainability'],
    editorParaphrases: ['long-term viability', 'durability', 'continuity']
  },
  'innovation': {
    editorPartOfSpeech: 'n.',
    editorSense: 'a new idea, method, or product that improves something',
    editorEnglishDefinition: 'A new idea, method, or technology that improves how something is done; the process of introducing such changes',
    editorChineseMeaning: '创新，革新；新方法、新技术或新产品',
    ipa: 'ˌɪnəˈveɪʃən',
    editorCollocations: ['technological innovation', 'drive innovation', 'foster innovation'],
    editorParaphrases: ['breakthrough', 'advancement', 'new development']
  },
  'digital': {
    editorPartOfSpeech: 'adj.',
    editorSense: 'related to computers, the internet, or electronic technology',
    editorEnglishDefinition: 'Relating to computers, the internet, or electronic technology; involving digital signals or data',
    editorChineseMeaning: '数字的，数码的；与计算机或电子技术相关的',
    ipa: 'ˈdɪdʒɪtl',
    editorCollocations: ['digital technology', 'digital skills', 'digital divide', 'digital age'],
    editorParaphrases: ['electronic', 'online', 'technology-based']
  },
  'conservation': {
    editorPartOfSpeech: 'n.',
    editorSense: 'the protection and careful management of natural resources',
    editorEnglishDefinition: 'The protection and careful management of natural resources, wildlife, and the environment',
    editorChineseMeaning: '保护，保存；对自然资源和环境的谨慎管理',
    ipa: 'ˌkɒnsəˈveɪʃən',
    editorCollocations: ['wildlife conservation', 'energy conservation', 'conservation efforts'],
    editorParaphrases: ['preservation', 'protection', 'safeguarding']
  },
  'phenomenon': {
    editorPartOfSpeech: 'n.',
    editorSense: 'an observable fact, event, or situation that can be studied',
    editorEnglishDefinition: 'An observable event, pattern, or situation that can be studied or explained, especially in science or society',
    editorChineseMeaning: '现象；可观察、可研究的事件或情况',
    ipa: 'fəˈnɒmɪnən',
    editorCollocations: ['a common phenomenon', 'natural phenomenon', 'social phenomenon'],
    editorParaphrases: ['occurrence', 'event', 'trend', 'pattern']
  },
  'endorse': {
    editorPartOfSpeech: 'v.',
    editorSense: 'to publicly support or approve an idea, policy, or person',
    editorEnglishDefinition: 'To publicly support, approve, or recommend an idea, policy, or person',
    editorChineseMeaning: '支持，认可，背书；公开表示赞同',
    ipa: 'ɪnˈdɔːs',
    editorCollocations: ['endorse a policy', 'strongly endorse', 'publicly endorse'],
    editorParaphrases: ['support', 'approve', 'back', 'recommend']
  },
  'perspective': {
    editorPartOfSpeech: 'n.',
    editorSense: 'a particular way of viewing or judging something',
    editorEnglishDefinition: 'A particular way of thinking about or judging something; a point of view',
    editorChineseMeaning: '观点，视角；看待事物的特定方式',
    ipa: 'pəˈspektɪv',
    editorCollocations: ['from my perspective', 'broad perspective', 'different perspectives'],
    editorParaphrases: ['viewpoint', 'angle', 'outlook', 'standpoint']
  },
  'underlying': {
    editorPartOfSpeech: 'adj.',
    editorSense: 'basic and important, but not immediately obvious',
    editorEnglishDefinition: 'Basic and fundamental, but not immediately obvious; explaining the real cause or nature of something',
    editorChineseMeaning: '根本的，潜在的；构成基础但不明显的',
    ipa: 'ˌʌndəˈlaɪɪŋ',
    editorCollocations: ['underlying cause', 'underlying issue', 'underlying problem'],
    editorParaphrases: ['fundamental', 'basic', 'root', 'hidden']
  },
  'stem': {
    editorPartOfSpeech: 'v.',
    editorSense: 'to originate or develop from a particular source',
    editorEnglishDefinition: 'To have a particular origin or cause; to come from something',
    editorChineseMeaning: '源于，来自；起源于某事物',
    ipa: 'stem',
    editorCollocations: ['stem from', 'largely stem from', 'problems stem from'],
    editorParaphrases: ['originate', 'arise', 'derive', 'come from']
  },
  'trigger': {
    editorPartOfSpeech: 'v.',
    editorSense: 'to cause something to happen, especially suddenly',
    editorEnglishDefinition: 'To cause something to happen, especially a sudden reaction, change, or problem',
    editorChineseMeaning: '引发，触发；导致某事发生',
    ipa: 'ˈtrɪɡə',
    editorCollocations: ['trigger a reaction', 'trigger a crisis', 'may trigger'],
    editorParaphrases: ['cause', 'spark', 'initiate', 'set off']
  },
  'barrier': {
    editorPartOfSpeech: 'n.',  // 修正：v. → n.
    editorSense: 'an obstacle that prevents progress or communication',
    editorEnglishDefinition: 'An obstacle, problem, or difficulty that prevents progress, access, or communication',
    editorChineseMeaning: '障碍，壁垒；阻碍进步或交流的事物',
    ipa: 'ˈbæriə',
    editorCollocations: ['language barrier', 'major barrier', 'remove barriers', 'trade barrier'],
    editorParaphrases: ['obstacle', 'hindrance', 'block', 'impediment']
  }
};

function main() {
  console.log('=== 精修高价值 bundle ===\n');

  const data = readJson(REVIEWED_FILE);
  const candidates = data.candidates || [];

  console.log(`总候选数: ${candidates.length}`);

  let fixedCount = 0;
  const fixedWords = [];

  candidates.forEach(candidate => {
    const key = candidate.key;
    if (FIXES[key]) {
      const fix = FIXES[key];

      // 应用修复
      candidate.editorPartOfSpeech = fix.editorPartOfSpeech;
      candidate.editorSense = fix.editorSense;
      candidate.editorEnglishDefinition = fix.editorEnglishDefinition;
      candidate.editorChineseMeaning = fix.editorChineseMeaning;
      candidate.ipa = fix.ipa;
      candidate.editorCollocations = fix.editorCollocations;
      candidate.editorParaphrases = fix.editorParaphrases;

      fixedCount++;
      fixedWords.push(key);

      console.log(`✓ ${key}: ${fix.editorPartOfSpeech} - ${fix.editorChineseMeaning.substring(0, 20)}...`);
    }
  });

  console.log(`\n精修完成: ${fixedCount} 个词`);

  // 写回文件
  data.generatedAt = new Date().toISOString();
  writeJson(REVIEWED_FILE, data);

  console.log(`\n写入: ${REVIEWED_FILE}`);

  // 输出精修词列表
  console.log('\n精修词列表:');
  fixedWords.forEach(w => console.log(`  - ${w}`));
}

main();