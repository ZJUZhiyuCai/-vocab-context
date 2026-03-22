/**
 * 修复中文释义 - 去除换行符，简化为简洁释义
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { readJson, writeJson } from './ielts-rebuild-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REVIEWED_FILE = path.join(__dirname, '../data/ielts-core-500-reviewed.json');

// 简洁中文释义映射
const chineseFixes = {
  remove: '移除，去除；消除，清除',
  transfer: '转移，调任；转让，过户',
  cycle: '循环，周期；自行车；骑车',
  layer: '层，层次；铺设，分层',
  scheme: '计划，方案；体系，制度',
  default: '默认，缺省；不履行，违约',
  negate: '否定，否认；取消，使无效',
  physical: '身体的，物质的；物理的',
  item: '项目，条款；一件商品',
  component: '组成部分，成分；元件，组件',
  text: '文本，正文；课文，教材',
  disturbance: '干扰，扰乱；骚乱，动荡',
  control: '控制，管理；支配，调节',
  graduate: '毕业生；大学毕业；获得学位',
  level: '水平，程度；等级，级别',
  powerful: '强大的，有力的；有影响力的',
  progress: '进步，进展；前进，发展',
  risk: '风险，危险；冒险，隐患',
  schedule: '时间表，进度表；安排，计划',
  waste: '浪费，损耗；废弃物，垃圾',
  broadcast: '广播，播放；传播，散布',
  cope: '应付，处理；应对，对付',
  decline: '下降，衰退；拒绝，谢绝',
  dismiss: '解雇，免职；驳回，不予理会',
  essential: '必要的，基本的；本质的，核心的',
  flood: '洪水，水灾；大量涌入；淹没',
  hazard: '危险，危害；冒险，风险',
  improve: '改善，改进；提高，增进',
  devise: '设计，发明；策划，想出',
  speculate: '推测，猜测；投机，炒作',
  initiate: '开始，发起；创始，启动',
  isolate: '隔离，孤立；使分离，使绝缘',
  restricted: '受限的，有限的；保密的',
  conform: '符合，遵守；顺应，一致',
  integrated: '综合的，整合的；一体化的',
  representative: '代表，代理人；典型的，有代表性的',
  alienated: '疏远的，被孤立的；异化的',
  broadcasting: '广播，播音；广播业',
  experienced: '有经验的，老练的；经验丰富的'
};

function fixChinese() {
  const data = readJson(REVIEWED_FILE);
  let fixedCount = 0;
  const fixed = [];

  data.candidates.forEach(entry => {
    if (!entry.approved) return;

    const fix = chineseFixes[entry.key];
    if (fix) {
      entry.editorChineseMeaning = fix;
      fixedCount++;
      fixed.push(entry.key);
    }
  });

  writeJson(REVIEWED_FILE, data);

  console.log('\n=== Chinese Meaning Fixes ===\n');
  console.log(`Total entries fixed: ${fixedCount}`);
  console.log('\nFixed words:');
  fixed.forEach(word => console.log(`  - ${word}: ${chineseFixes[word]}`));

  return { fixedCount, fixed };
}

fixChinese();