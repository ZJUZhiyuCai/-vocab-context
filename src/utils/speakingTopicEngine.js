/**
 * Speaking Topic Engine
 *
 * Speaking Part 2 话题词群引擎：
 * - 按话题分组词汇
 * - 提供 Speaking 模板句型
 * - 支持话题词群练习
 */

import { VOCABULARIES } from './vocabularyManager.js';

// Speaking Part 2 常见话题模板
export const SPEAKING_TEMPLATES = {
  // 描述人物
  person: [
    "I'd like to talk about [someone] who has influenced me greatly.",
    "The person I admire most is [someone] because...",
    "[Someone] is a person who has made a significant impact on my life."
  ],
  // 描述地点
  place: [
    "I'm going to describe a place that is very special to me.",
    "One place that I really enjoy visiting is...",
    "The place I want to talk about is [location], which is known for..."
  ],
  // 描述物品
  object: [
    "I'd like to tell you about an object that is important to me.",
    "Something that I use every day and find very useful is...",
    "The object I'm going to describe is [item], which I bought/got..."
  ],
  // 描述事件
  event: [
    "I'm going to talk about a memorable event in my life.",
    "One experience that I'll never forget is when...",
    "A significant event that happened to me was..."
  ],
  // 描述活动
  activity: [
    "I'd like to describe an activity that I enjoy doing.",
    "One thing I love to do in my free time is...",
    "The activity I'm going to talk about is [activity], which I started..."
  ],
  // 通用开头
  general: [
    "I'd like to talk about...",
    "What I'm going to describe is...",
    "The topic I want to discuss is..."
  ]
};

// 高分句型
export const HIGH_SCORE_PHRASES = {
  opening: [
    "What strikes me most about this is...",
    "The first thing that comes to mind is...",
    "If I had to describe it in one word, it would be..."
  ],
  elaboration: [
    "To elaborate further, I should mention that...",
    "Another aspect worth mentioning is...",
    "What's particularly interesting is that..."
  ],
  feeling: [
    "It made me feel incredibly...",
    "I was absolutely [emotion] by...",
    "The experience left me feeling..."
  ],
  conclusion: [
    "Overall, I would say that...",
    "In conclusion, this [topic] has taught me that...",
    "Looking back, I realize how important this was..."
  ]
};

/**
 * 获取所有 Speaking 话题
 * @returns {Array} 话题列表
 */
export function getSpeakingTopics() {
  const topics = VOCABULARIES
    // Speaking Part 2 should only surface dedicated topic packs.
    .filter(v => v.ieltsTrackType === 'topic')
    .map(v => ({
      id: v.id,
      name: v.name,
      topic: v.topic || v.id.replace('ielts-topic-', ''),
      wordCount: v.size,
      icon: v.icon,
      color: v.color
    }));

  return topics;
}

/**
 * 获取话题词群
 * @param {string} topicId - 话题 ID
 * @param {number} size - 词群大小 (默认 12)
 * @returns {Promise<Array>} 词汇列表
 */
export async function getTopicWordCluster(topicId, size = 12) {
  const vocab = VOCABULARIES.find(v => v.id === topicId);
  if (!vocab || !vocab.file) return [];

  try {
    const response = await fetch(vocab.file);
    const data = await response.json();
    const bundles = data.bundles || [];

    // 按质量分数排序，选择高质量词汇
    const sortedBundles = bundles
      .filter(b => !b.draft && b.word)
      .sort((a, b) => {
        const scoreA = a.sourceQuality?.relevanceScore || 0;
        const scoreB = b.sourceQuality?.relevanceScore || 0;
        return scoreB - scoreA;
      })
      .slice(0, size);

    return sortedBundles.map(bundle => ({
      word: bundle.word,
      ipa: bundle.ipa,
      partOfSpeech: bundle.partOfSpeech,
      sense: bundle.sense || bundle.englishDefinition,
      chineseMeaning: bundle.chineseMeaning,
      collocations: bundle.collocations || [],
      paraphrases: bundle.paraphrases || [],
      contexts: bundle.contexts || [],
      topic: bundle.topic
    }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to load topic cluster:', err);
    return [];
  }
}

/**
 * 获取话题的 Speaking 模板
 * @param {string} topic - 话题名称
 * @returns {Object} 模板对象
 */
export function getSpeakingTemplatesForTopic(topic) {
  // 根据话题推荐模板类型
  const topicTemplateMap = {
    education: 'person',
    government: 'event',
    environment: 'place',
    technology: 'object',
    health: 'activity',
    work: 'person',
    media: 'object',
    crime: 'event'
  };

  const templateType = topicTemplateMap[topic] || 'general';

  return {
    type: templateType,
    templates: SPEAKING_TEMPLATES[templateType],
    phrases: HIGH_SCORE_PHRASES
  };
}

/**
 * 生成 Speaking 练习提示
 * @param {Object} wordCluster - 词群
 * @param {string} topic - 话题
 * @returns {Object} 练习提示
 */
export function generateSpeakingPrompt(wordCluster, topic) {
  const templates = getSpeakingTemplatesForTopic(topic);
  const keyWords = wordCluster.slice(0, 5).map(w => w.word);
  const keyCollocations = wordCluster
    .flatMap(w => w.collocations.slice(0, 2))
    .slice(0, 8);

  return {
    topic,
    suggestedOpening: templates.templates[0],
    keyWords,
    keyCollocations,
    phrases: templates.phrases,
    instruction: `Use at least 3 words from the key words list and 2 collocations in your response.`
  };
}

export default {
  getSpeakingTopics,
  getTopicWordCluster,
  getSpeakingTemplatesForTopic,
  generateSpeakingPrompt,
  SPEAKING_TEMPLATES,
  HIGH_SCORE_PHRASES
};
