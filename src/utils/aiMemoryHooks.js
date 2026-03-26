import { createAIChatCompletion } from './aiClient.js';

/**
 * AI 词汇关联记忆助手
 * 生成记忆法、词根词缀、联想记忆等内容
 */

/**
 * 为单词生成记忆辅助内容
 * @param {Object} options - 选项
 * @param {string} options.apiKey - API密钥
 * @param {Object} options.word - 单词对象
 * @param {string} options.userLevel - 用户水平
 * @returns {Promise<Object>} 记忆辅助内容
 */
export async function generateMemoryHooks({ apiKey, word, userLevel = 'B2' }) {
  const prompt = buildMemoryPrompt(word, userLevel);

  try {
    const data = await createAIChatCompletion({
      apiKey,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      maxTokens: 1200
    });
    return parseMemoryResponse(data, word);
  } catch (error) {
    console.error('生成记忆辅助失败:', error);
    throw error;
  }
}

/**
 * 构建记忆辅助提示词
 */
function buildMemoryPrompt(word, userLevel) {
  return `你是一个专业的英语词汇教学专家，擅长用各种记忆技巧帮助学生学习。请为以下单词生成记忆辅助内容。

**目标单词**：${word.word}
**释义**：${word.meaning || word.translation || ''}
**词性**：${word.pos || word.partOfSpeech || '未标注'}
**音标**：${word.ipa || word.phonetic || '未标注'}
**用户水平**：${userLevel}

**请生成以下记忆辅助内容**（如果某个方面不适用，可以跳过）：

1. **词根词缀分析**：分解单词的词根、前缀、后缀，说明各部分的含义
2. **谐音/联想记忆**：创造有趣的声音或形象联想
3. **语境记忆法**：提供易于记忆的例句或场景
4. **对比记忆**：与形近词或义近词的对比
5. **记忆口诀**：简短易记的口诀或韵文

**返回格式**（纯JSON）：
{
  "word": "${word.word}",
  "etymology": {
    "root": "词根（如果有）",
    "prefix": "前缀（如果有）",
    "suffix": "后缀（如果有）",
    "explanation": "构词法解释，说明各部分如何组合成当前含义（100字以内）"
  },
  "mnemonicDevices": [
    {
      "type": "谐音联想|故事联想|形象记忆",
      "content": "具体的记忆技巧内容（80字以内）",
      "effectiveness": "high|medium|low"
    }
  ],
  "contextualMemory": {
    "scenario": "生动的使用场景描述（100字以内）",
    "exampleSentence": "体现该场景的例句",
    "sentenceTranslation": "例句中文翻译"
  },
  "comparison": {
    "similarWords": [
      {
        "word": "形近词或义近词",
        "difference": "与目标单词的区别（50字以内）"
      }
    ]
  },
  "memoryTrick": {
    "rhyme": "记忆口诀或韵文（如果有）",
    "explanation": "口诀解释（如果有）"
  },
  "visualAssociation": {
    "description": "视觉化联想描述（80字以内）",
    "keywords": ["关键词1", "关键词2", "关键词3"]
  }
}

注意：
- 尽量提供多样化、有趣且有效的记忆技巧
- 如果某个分类不适用，可以设置为 null 或空数组
- 只返回JSON，不要其他内容`;
}

/**
 * 解析记忆辅助响应
 */
function parseMemoryResponse(data, originalWord) {
  const content = data.choices[0].message.content;

  let jsonStr = content;
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                    content.match(/```\s*([\s\S]*?)\s*```/) ||
                    content.match(/\{[\s\S]*\}/);

  if (jsonMatch) {
    jsonStr = jsonMatch[1] || jsonMatch[0];
  }

  try {
    const memoryData = JSON.parse(jsonStr);
    return {
      ...memoryData,
      generatedAt: new Date().toISOString()
    };
  } catch (parseError) {
    console.error('JSON解析失败:', jsonStr);
    throw new Error('AI返回的格式无法解析', { cause: parseError });
  }
}

/**
 * 生成单词网络（相关词汇关联）
 * @param {Object} options - 选项
 * @returns {Promise<Object>} 单词网络
 */
export async function generateWordNetwork({ apiKey, word, userLevel = 'B2' }) {
  const prompt = `你是一个专业的英语词汇教学专家。请为以下单词构建词汇关联网络。

**目标单词**：${word.word}
**释义**：${word.meaning || word.translation || ''}
**词性**：${word.pos || word.partOfSpeech || '未标注'}
**用户水平**：${userLevel}

**请构建以下关联网络**：

1. **同义词网络**：含义相同或相近的词
2. **反义词网络**：含义相反的词
3. **词根家族**：共享相同词根的词
4. **搭配词汇**：常与目标单词一起使用的词
5. **主题关联**：同一主题领域的相关词

**返回格式**（纯JSON）：
{
  "word": "${word.word}",
  "synonyms": [
    {
      "word": "同义词",
      "nuance": "与目标单词的细微差别（30字以内）"
    }
  ],
  "antonyms": [
    {
      "word": "反义词",
      "explanation": "反义关系说明（30字以内）"
    }
  ],
  "wordFamily": [
    {
      "word": "同族词（如不同词性）",
      "relationship": "关系说明（如：名词形式、动词形式等）"
    }
  ],
  "collocations": [
    {
      "phrase": "搭配短语",
      "meaning": "搭配含义",
      "example": "例句"
    }
  ],
  "thematicConnections": [
    {
      "theme": "主题领域",
      "words": ["相关词1", "相关词2", "相关词3"]
    }
  ]
}

只返回JSON，不要其他内容。`;

  try {
    const data = await createAIChatCompletion({
      apiKey,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      maxTokens: 1500
    });
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                      content.match(/```\s*([\s\S]*?)\s*```/) ||
                      content.match(/\{[\s\S]*\}/);

    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
    const networkData = JSON.parse(jsonStr);

    return {
      ...networkData,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('生成单词网络失败:', error);
    throw error;
  }
}

/**
 * 生成场景化例句（多个不同场景）
 * @param {Object} options - 选项
 * @returns {Promise<Object>} 场景化例句
 */
export async function generateScenarioExamples({ apiKey, word, scenarios = [], userLevel = 'B2' }) {
  const defaultScenarios = [
    '日常对话',
    '学术写作',
    '商务交流',
    '社交媒体'
  ];

  const targetScenarios = scenarios.length > 0 ? scenarios : defaultScenarios;

  const prompt = `你是一个专业的英语教学专家。请为以下单词在不同场景下生成例句。

**目标单词**：${word.word}
**释义**：${word.meaning || word.translation || ''}
**词性**：${word.pos || word.partOfSpeech || '未标注'}
**用户水平**：${userLevel}

**目标场景**：
${targetScenarios.map((s, i) => `${i + 1}. ${s}`).join('\n')}

**要求**：
- 为每个场景生成1-2个自然的例句
- 例句要真实反映该场景的用语习惯
- 难度适合${userLevel}水平

**返回格式**（纯JSON）：
{
  "word": "${word.word}",
  "scenarios": [
    {
      "scenario": "场景名称",
      "examples": [
        {
          "sentence": "英语例句",
          "translation": "中文翻译",
          "note": "用法说明（30字以内，可选）"
        }
      ]
    }
  ]
}

只返回JSON，不要其他内容。`;

  try {
    const data = await createAIChatCompletion({
      apiKey,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      maxTokens: 1500
    });
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                      content.match(/```\s*([\s\S]*?)\s*```/) ||
                      content.match(/\{[\s\S]*\}/);

    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
    const examplesData = JSON.parse(jsonStr);

    return {
      ...examplesData,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('生成场景化例句失败:', error);
    throw error;
  }
}

/**
 * 生成单词学习路径建议
 * @param {Object} options - 选项
 * @returns {Promise<Object>} 学习路径
 */
export async function generateLearningPath({ apiKey, words, goal = 'master', userLevel = 'B2' }) {
  const wordsList = words.map(w => typeof w === 'string' ? w : w.word).join('、');

  const prompt = `你是一个专业的英语教学专家。请为以下单词组设计学习路径。

**单词列表**：${wordsList}
**学习目标**：${goal === 'master' ? '完全掌握' : goal === 'recognize' ? '能够识别' : '熟练使用'}
**用户水平**：${userLevel}
**单词数量**：${words.length}个

**请设计一个高效的学习路径**：

1. **分组策略**：如何将这些单词分组学习（按主题、难度、关联等）
2. **学习顺序**：建议的学习顺序和理由
3. **复习安排**：复习间隔和重点
4. **预期时间**：完成学习的预估时间

**返回格式**（纯JSON）：
{
  "overview": "学习路径概述（100字以内）",
  "groups": [
    {
      "groupName": "分组名称",
      "words": ["单词1", "单词2", "单词3"],
      "groupingReason": "分组理由",
      "studyOrder": 1,
      "estimatedMinutes": 30,
      "keyPoints": ["学习要点1", "要点2"]
    }
  ],
  "reviewSchedule": [
    {
      "stage": "复习阶段",
      "timeAfterStudy": "学习后多长时间",
      "focus": "复习重点"
    }
  ],
  "totalEstimatedMinutes": 120,
  "tips": ["学习建议1", "建议2", "建议3"]
}

只返回JSON，不要其他内容。`;

  try {
    const data = await createAIChatCompletion({
      apiKey,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      maxTokens: 1800
    });
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                      content.match(/```\s*([\s\S]*?)\s*```/) ||
                      content.match(/\{[\s\S]*\}/);

    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
    const pathData = JSON.parse(jsonStr);

    return {
      ...pathData,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('生成学习路径失败:', error);
    throw error;
  }
}
