/**
 * IELTS Core Quality Refinement - 2026-03-22
 * 为 generic definition 的高价值词补充精确定义
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { readJson, writeJson } from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REVIEWED_FILE = path.join(__dirname, '../data/ielts-core-500-reviewed.json');

// 高价值词的精确定义映射
const refinedDefinitions = {
  // Government & Policy
  legislation: {
    editorEnglishDefinition: 'Laws or sets of laws made by a government and formally written down',
    editorChineseMeaning: '立法，法律；政府制定的法律条文'
  },
  accountability: {
    editorEnglishDefinition: 'The fact of being responsible for actions and decisions, and expected to explain them when asked',
    editorChineseMeaning: '问责制，责任；对决策和行为负责的义务'
  },
  enforcement: {
    editorEnglishDefinition: 'The process of making people obey a law or rule',
    editorChineseMeaning: '执行，实施；强制遵守法律或规定的过程'
  },
  bureaucracy: {
    editorEnglishDefinition: 'A system of government in which important decisions are made by state officials rather than elected representatives',
    editorChineseMeaning: '官僚制度；由官员而非民选代表决策的行政体系'
  },
  transparency: {
    editorEnglishDefinition: 'The quality of being open and honest, without secrets',
    editorChineseMeaning: '透明度；公开、诚实、无隐瞒的品质'
  },
  corruption: {
    editorEnglishDefinition: 'Illegal or dishonest behaviour, especially by people in positions of power',
    editorChineseMeaning: '腐败，贪污；尤其指掌权者的违法或不诚实行为'
  },
  intervention: {
    editorEnglishDefinition: 'The action of becoming involved in a situation to improve or prevent it from getting worse',
    editorChineseMeaning: '干预，介入；为改善或防止恶化而介入某情况'
  },
  subsidy: {
    editorEnglishDefinition: 'Money given by a government or organization to support an activity or reduce prices',
    editorChineseMeaning: '补贴，津贴；政府或机构提供的资金支持'
  },
  consensus: {
    editorEnglishDefinition: 'General agreement among a group of people',
    editorChineseMeaning: '共识，一致意见；群体内的普遍同意'
  },
  controversy: {
    editorEnglishDefinition: 'Public disagreement or discussion about an important matter',
    editorChineseMeaning: '争议，争论；公众对重要议题的分歧或讨论'
  },
  stance: {
    editorEnglishDefinition: 'A stated position or opinion on an issue',
    editorChineseMeaning: '立场，态度；对某议题的公开立场或观点'
  },
  precedent: {
    editorEnglishDefinition: 'An action or decision that is used as an example for future similar situations',
    editorChineseMeaning: '先例，判例；可供未来类似情况参考的行动或决定'
  },
  disparity: {
    editorEnglishDefinition: 'A significant difference between two things',
    editorChineseMeaning: '差距，不平等；两者之间的显著差异'
  },
  contentious: {
    editorEnglishDefinition: 'Likely to cause disagreement or argument',
    editorChineseMeaning: '有争议的，引起争论的；可能导致分歧的'
  },
  deterrent: {
    editorEnglishDefinition: 'Something that discourages or prevents a particular action',
    editorChineseMeaning: '威慑物，遏制因素；阻止或抑制某种行为的事物'
  },
  incentive: {
    editorEnglishDefinition: 'Something that encourages a person to do something',
    editorChineseMeaning: '激励，动力；鼓励某人做某事的因素'
  },
  implication: {
    editorEnglishDefinition: 'A possible future effect or result of an action or decision',
    editorChineseMeaning: '影响，含义；行动或决策可能产生的后果'
  },
  substantial: {
    editorEnglishDefinition: 'Large in amount, value, or importance',
    editorChineseMeaning: '大量的，实质性的；在数量、价值或重要性方面巨大的'
  },
  insufficient: {
    editorEnglishDefinition: 'Not enough; lacking what is needed',
    editorChineseMeaning: '不足的，不够的；缺乏所需数量的'
  },

  // Health
  mortality: {
    editorEnglishDefinition: 'The number of deaths within a particular period or group',
    editorChineseMeaning: '死亡率；特定时期或群体内的死亡人数'
  },
  prevalence: {
    editorEnglishDefinition: 'How common or widespread something is',
    editorChineseMeaning: '流行程度，普遍性；某事物的常见或广泛程度'
  },
  pandemic: {
    editorEnglishDefinition: 'A disease that spreads over a whole country or the whole world',
    editorChineseMeaning: '大流行病；蔓延整个国家或全球的疾病'
  },
  epidemic: {
    editorEnglishDefinition: 'A sudden increase in the number of cases of a disease',
    editorChineseMeaning: '流行病；疾病病例突然增加的现象'
  },
  vaccination: {
    editorEnglishDefinition: 'The act of giving someone a vaccine to protect against a disease',
    editorChineseMeaning: '疫苗接种；为预防疾病而接种疫苗的行为'
  },
  immunity: {
    editorEnglishDefinition: 'Protection from a disease or condition',
    editorChineseMeaning: '免疫力；对疾病或状况的防护能力'
  },
  adverse: {
    editorEnglishDefinition: 'Harmful or unfavorable',
    editorChineseMeaning: '不利的，有害的'
  },

  // Academic & Communication
  implement: {
    editorEnglishDefinition: 'To put a plan or decision into action',
    editorChineseMeaning: '实施，执行；将计划或决定付诸行动'
  },
  authority: {
    editorEnglishDefinition: 'The power or right to make decisions or give orders',
    editorChineseMeaning: '权威，权力；做决策或发布命令的权力'
  },
  available: {
    editorEnglishDefinition: 'Ready to be used or obtained; accessible',
    editorChineseMeaning: '可用的，可获得的；准备就绪或可获取的'
  },
  individual: {
    editorEnglishDefinition: 'Single or separate; relating to one person rather than a group',
    editorChineseMeaning: '个人的，个体的；与个人而非群体相关的'
  },
  substantial: {
    editorEnglishDefinition: 'Large in amount, value, or importance',
    editorChineseMeaning: '大量的，实质性的'
  },
  influential: {
    editorEnglishDefinition: 'Having the power to affect how people think or behave',
    editorChineseMeaning: '有影响力的；能够影响他人思想或行为的'
  },
  prominent: {
    editorEnglishDefinition: 'Important, well-known, or easily seen',
    editorChineseMeaning: '突出的，杰出的；重要、知名或显眼的'
  },
  decisive: {
    editorEnglishDefinition: 'Able to make decisions quickly and confidently',
    editorChineseMeaning: '果断的，决定性的；能够快速自信做决策的'
  },
  favorable: {
    editorEnglishDefinition: 'Expressing approval or support; advantageous',
    editorChineseMeaning: '有利的，赞成的；表示认可或支持的'
  },
  counterproductive: {
    editorEnglishDefinition: 'Having the opposite effect to what is intended',
    editorChineseMeaning: '适得其反的；产生与预期相反效果的'
  },

  // Verbs
  stabilize: {
    editorEnglishDefinition: 'To become or make something steady and unlikely to change',
    editorChineseMeaning: '稳定，使稳定；变得平稳或使某物保持稳定'
  },
  escalate: {
    editorEnglishDefinition: 'To increase in intensity or become more serious',
    editorChineseMeaning: '升级，加剧；强度增加或变得更严重'
  },
  prevail: {
    editorEnglishDefinition: 'To be common or widespread; to win or succeed',
    editorChineseMeaning: '盛行，获胜；普遍存在或取得成功'
  },
  outweigh: {
    editorEnglishDefinition: 'To be more important or valuable than something else',
    editorChineseMeaning: '超过，比……更重要；在重要性或价值上胜过'
  },
  amplify: {
    editorEnglishDefinition: 'To make something louder, stronger, or more intense',
    editorChineseMeaning: '放大，增强；使某物更响、更强或更剧烈'
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

  console.log('\n=== IELTS Core Definition Refinement ===\n');
  console.log(`Total entries refined: ${refinedCount}`);
  console.log('\nRefined words:');
  refined.forEach(word => console.log(`  - ${word}`));

  return { refinedCount, refined };
}

applyRefinements();