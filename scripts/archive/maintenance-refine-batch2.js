/**
 * IELTS Core Quality Refinement - Batch 2
 * 为剩余 48 个 generic definition 词补充精确定义
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { readJson, writeJson } from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REVIEWED_FILE = path.join(__dirname, '../data/ielts-core-500-reviewed.json');

const refinedDefinitions = {
  // 常用学术词
  culture: {
    editorEnglishDefinition: 'The beliefs, customs, arts, and way of life of a particular society or group',
    editorChineseMeaning: '文化；特定社会或群体的信仰、习俗、艺术和生活方式'
  },
  instance: {
    editorEnglishDefinition: 'An example or single occurrence of something',
    editorChineseMeaning: '例子，实例；某事物的单个例子或事件'
  },
  source: {
    editorEnglishDefinition: 'The place or thing that something comes from or is obtained from',
    editorChineseMeaning: '来源，源头；某事物的起源或获取之处'
  },
  task: {
    editorEnglishDefinition: 'A piece of work or activity that needs to be done',
    editorChineseMeaning: '任务，工作；需要完成的一项工作或活动'
  },
  finance: {
    editorEnglishDefinition: 'The management of money, especially by governments or large organizations',
    editorChineseMeaning: '财政，金融；资金管理，尤指政府或大型机构的'
  },
  initial: {
    editorEnglishDefinition: 'Happening at the beginning; first',
    editorChineseMeaning: '最初的，开始的；发生在开头的'
  },
  labour: {
    editorEnglishDefinition: 'Work, especially physical work; workers as a group',
    editorChineseMeaning: '劳动，劳动力；工作，尤指体力劳动或工人群体'
  },
  select: {
    editorEnglishDefinition: 'To choose something from a group, especially after careful thought',
    editorChineseMeaning: '选择，挑选；从群体中选出某物'
  },
  sequence: {
    editorEnglishDefinition: 'A series of related things or events in a particular order',
    editorChineseMeaning: '顺序，序列；按特定顺序排列的一系列相关事物或事件'
  },
  vary: {
    editorEnglishDefinition: 'To change or be different depending on the situation',
    editorChineseMeaning: '变化，不同；根据情况而改变或有差异'
  },
  previous: {
    editorEnglishDefinition: 'Happening or existing before the present one',
    editorChineseMeaning: '先前的，以前的；发生在当前之前的'
  },
  instruct: {
    editorEnglishDefinition: 'To tell someone to do something, especially in a formal or official way',
    editorChineseMeaning: '指示，指导；以正式方式告诉某人做某事'
  },
  respond: {
    editorEnglishDefinition: 'To react to something by saying or doing something',
    editorChineseMeaning: '回应，反应；通过言语或行动对某事作出反应'
  },
  caution: {
    editorEnglishDefinition: 'Care taken to avoid danger or mistakes',
    editorChineseMeaning: '谨慎，小心；为避免危险或错误而采取的注意'
  },
  publication: {
    editorEnglishDefinition: 'A book, journal, or other printed or digital work made available to the public',
    editorChineseMeaning: '出版物；向公众提供的书籍、期刊或其他印刷或数字作品'
  },
  communications: {
    editorEnglishDefinition: 'The methods and systems used for exchanging information between people or places',
    editorChineseMeaning: '通讯，通信；人与人或地点之间交换信息的方法和系统'
  },
  fundamentally: {
    editorEnglishDefinition: 'In a basic and essential way; at the most basic level',
    editorChineseMeaning: '根本地，基本上；在最基础的层面上'
  },
  coordination: {
    editorEnglishDefinition: 'The organization of different parts of an activity to work together effectively',
    editorChineseMeaning: '协调，配合；组织活动的不同部分以有效协作'
  },
  democracy: {
    editorEnglishDefinition: 'A system of government where citizens choose their representatives by voting',
    editorChineseMeaning: '民主；公民通过投票选择代表的政府制度'
  },
  discrepancy: {
    editorEnglishDefinition: 'A difference between two things that should be the same',
    editorChineseMeaning: '差异，不一致；本应相同的两事物之间的差别'
  },
  divergent: {
    editorEnglishDefinition: 'Different or developing in different directions',
    editorChineseMeaning: '分歧的，发散的；不同或向不同方向发展的'
  },
  soar: {
    editorEnglishDefinition: 'To increase rapidly to a high level',
    editorChineseMeaning: '猛增，飙升；快速上升到高水平'
  },
  mounting: {
    editorEnglishDefinition: 'Gradually increasing in amount, intensity, or degree',
    editorChineseMeaning: '不断增加的；在数量、强度或程度上逐渐增长的'
  },
  subside: {
    editorEnglishDefinition: 'To become less intense, severe, or strong',
    editorChineseMeaning: '减弱，平息；变得不那么强烈、严重或强劲'
  },
  waning: {
    editorEnglishDefinition: 'Becoming smaller, weaker, or less important',
    editorChineseMeaning: '减弱的，衰退的；变得更小、更弱或不那么重要的'
  },
  shrinking: {
    editorEnglishDefinition: 'Becoming smaller in size, amount, or value',
    editorChineseMeaning: '萎缩的，缩小的；在规模、数量或价值上变小的'
  },
  undesirable: {
    editorEnglishDefinition: 'Not wanted or desirable; unpleasant',
    editorChineseMeaning: '不受欢迎的，不合意的；令人不快的'
  },
  excessive: {
    editorEnglishDefinition: 'More than is necessary, normal, or reasonable',
    editorChineseMeaning: '过度的，过量的；超过必要、正常或合理程度的'
  },
  moderate: {
    editorEnglishDefinition: 'Neither too much nor too little; reasonable',
    editorChineseMeaning: '适度的，中等的；不多不少，合理的'
  },
  declining: {
    editorEnglishDefinition: 'Becoming smaller, fewer, or less important',
    editorChineseMeaning: '下降的，衰退的；变得更少、更小或不那么重要的'
  },

  // 低频/边缘词 - 给出简明定义
  injure: {
    editorEnglishDefinition: 'To cause physical harm or damage to someone',
    editorChineseMeaning: '伤害，损伤；对某人造成身体伤害'
  },
  prowl: {
    editorEnglishDefinition: 'To move around quietly in order to find or catch something',
    editorChineseMeaning: '潜行，徘徊；悄悄移动以寻找或捕捉某物'
  },
  divulge: {
    editorEnglishDefinition: 'To reveal or make known private or secret information',
    editorChineseMeaning: '泄露，透露；公开私人或秘密信息'
  },
  subscribe: {
    editorEnglishDefinition: 'To pay to receive a service or publication regularly',
    editorChineseMeaning: '订阅；付费定期接收服务或出版物'
  },
  heartbreaking: {
    editorEnglishDefinition: 'Causing great sadness or emotional pain',
    editorChineseMeaning: '令人心碎的；引起巨大悲伤或情感痛苦的'
  },
  boycott: {
    editorEnglishDefinition: 'To refuse to buy, use, or take part in something as a protest',
    editorChineseMeaning: '抵制；拒绝购买、使用或参与某事以示抗议'
  },
  concentrate: {
    editorEnglishDefinition: 'To focus attention or energy on a particular activity or subject',
    editorChineseMeaning: '集中，专注；将注意力或精力集中于某活动或主题'
  },
  debrief: {
    editorEnglishDefinition: 'To question someone about a task or mission they have completed',
    editorChineseMeaning: '听取汇报；询问某人完成的任务或行动情况'
  },
  discredit: {
    editorEnglishDefinition: 'To cause people to stop believing in or respecting someone or something',
    editorChineseMeaning: '使丧失信誉；使人们不再相信或尊重某人或某事'
  },
  embark: {
    editorEnglishDefinition: 'To begin a journey or start a new project',
    editorChineseMeaning: '开始，着手；开始旅程或新项目'
  },
  mislead: {
    editorEnglishDefinition: 'To cause someone to believe something that is not true',
    editorChineseMeaning: '误导；使某人相信不真实的事情'
  },
  moot: {
    editorEnglishDefinition: 'Subject to debate or discussion; having no practical relevance',
    editorChineseMeaning: '有争议的；有待讨论或无实际意义的'
  },
  parody: {
    editorEnglishDefinition: 'A humorous imitation of a particular work or style',
    editorChineseMeaning: '戏仿，滑稽模仿；对特定作品或风格的幽默模仿'
  },
  punishable: {
    editorEnglishDefinition: 'Deserving or liable to punishment',
    editorChineseMeaning: '可受惩罚的；应受或可能受惩罚的'
  },
  procrastinate: {
    editorEnglishDefinition: 'To delay doing something that needs to be done',
    editorChineseMeaning: '拖延，耽搁；推迟做需要完成的事情'
  },
  unprofessional: {
    editorEnglishDefinition: 'Not showing the skills or standards expected of a professional',
    editorChineseMeaning: '不专业的；不符合专业标准或技能要求的'
  },
  date: {
    editorEnglishDefinition: 'A specific day, month, and year; a social meeting arranged in advance',
    editorChineseMeaning: '日期；约会；特定的日、月、年或预先安排的社交会面'
  },
  confiscate: {
    editorEnglishDefinition: 'To take something away from someone, especially as a punishment',
    editorChineseMeaning: '没收，充公；拿走某物，尤指作为惩罚'
  }
};

function applyRefinements() {
  const data = readJson(REVIEWED_FILE);
  let refinedCount = 0;
  const refined = [];

  data.candidates.forEach(entry => {
    if (!entry.approved) return;

    const refinement = refinedDefinitions[entry.key];
    if (refinement) {
      if (refinement.editorEnglishDefinition) {
        entry.editorEnglishDefinition = refinement.editorEnglishDefinition;
      }
      if (refinement.editorChineseMeaning) {
        entry.editorChineseMeaning = refinement.editorChineseMeaning;
      }
      refinedCount++;
      refined.push(entry.key);
    }
  });

  writeJson(REVIEWED_FILE, data);

  console.log('\n=== IELTS Core Definition Refinement - Batch 2 ===\n');
  console.log(`Total entries refined: ${refinedCount}`);
  console.log('\nRefined words:');
  refined.forEach(word => console.log(`  - ${word}`));

  return { refinedCount, refined };
}

applyRefinements();