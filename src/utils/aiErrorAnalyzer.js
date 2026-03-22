import { createOpenRouterChatCompletion } from './openRouterClient.js';

/**
 * AI 错题分析与学习建议
 * 分析用户的学习数据，提供个性化建议
 */

/**
 * 分析用户的错误模式并提供学习建议
 * @param {Object} options - 分析选项
 * @param {string} options.apiKey - API密钥
 * @param {Array} options.mistakes - 错题列表
 * @param {Object} options.stats - 学习统计
 * @param {string} options.userLevel - 用户水平
 * @returns {Promise<Object>} 分析结果
 */
export async function analyzeErrors({ apiKey, mistakes, stats, userLevel = 'B2' }) {
  if (!mistakes || mistakes.length === 0) {
    return {
      summary: '太棒了！目前还没有错题记录，继续保持！',
      patterns: [],
      recommendations: [],
      suggestedFocus: []
    };
  }

  const prompt = buildAnalysisPrompt(mistakes, stats, userLevel);

  try {
    const data = await createOpenRouterChatCompletion({
      apiKey,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      maxTokens: 1500
    });
    return parseAnalysisResponse(data);
  } catch (error) {
    console.error('分析错题失败:', error);
    throw error;
  }
}

/**
 * 构建分析提示词
 */
function buildAnalysisPrompt(mistakes, stats, userLevel) {
  // 准备错题数据
  const mistakesData = mistakes.slice(0, 20).map(m => {
    const word = typeof m === 'string' ? m : m.word;
    const context = m.context || m.meaning || '';
    return `- ${word}${context ? ` (${context})` : ''}`;
  }).join('\n');

  // 准备统计数据
  const statsData = stats ? {
    总学习次数: stats.totalSessions || 0,
    学习单词数: stats.totalWords || 0,
    正确率: `${Math.round((stats.accuracy || 0) * 100)}%`,
    遗忘单词数: stats.forgottenCount || 0,
  } : {};

  const statsStr = Object.entries(statsData)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  return `你是一个专业的英语教学分析师。请分析以下学生的学习数据，提供个性化的学习建议。

**学生水平**：${userLevel}

**学习统计**：
${statsStr}

**错题列表**（最近20个）：
${mistakesData}

**分析任务**：

1. **错误模式识别**：找出这些错题的共同特征
   - 是否有特定的词性集中出错（名词、动词、形容词等）
   - 是否有特定的主题领域薄弱
   - 是否有相似的词汇混淆模式
   - 是否有特定的记忆难点

2. **个性化建议**：基于分析结果给出具体建议
   - 应该重点学习哪些内容
   - 采用什么学习方法更有效
   - 需要加强哪些方面的训练

3. **优先级建议**：按重要性排序，最多3-5个

**返回格式**（纯JSON）：
{
  "summary": "整体情况的简要总结（50字以内）",
  "patterns": [
    {
      "type": "错误模式类型（如：动词混淆、形近词混淆等）",
      "description": "具体描述（50字以内）",
      "examples": ["示例单词1", "示例单词2", "示例单词3"],
      "severity": "high|medium|low"
    }
  ],
  "recommendations": [
    {
      "title": "建议标题",
      "description": "具体建议内容（80字以内）",
      "actionItems": ["行动点1", "行动点2", "行动点3"],
      "priority": 1
    }
  ],
  "suggestedFocus": [
    {
      "area": "需要关注的领域",
      "reason": "原因说明",
      "words": ["相关单词1", "相关单词2", "相关单词3"]
    }
  ]
}

注意：
- patterns最多返回3-5个
- recommendations最多返回5个，每个包含2-4个行动点
- suggestedFocus最多返回3个领域
- 只返回JSON，不要其他内容`;
}

/**
 * 解析分析响应
 */
function parseAnalysisResponse(data) {
  const content = data.choices[0].message.content;

  let jsonStr = content;
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                    content.match(/```\s*([\s\S]*?)\s*```/) ||
                    content.match(/\{[\s\S]*\}/);

  if (jsonMatch) {
    jsonStr = jsonMatch[1] || jsonMatch[0];
  }

  try {
    const analysisData = JSON.parse(jsonStr);
    return {
      ...analysisData,
      generatedAt: new Date().toISOString()
    };
  } catch (parseError) {
    console.error('JSON解析失败:', jsonStr);
    throw new Error('AI返回的格式无法解析');
  }
}

/**
 * 分析单个单词的错误原因
 * @param {Object} options - 选项
 * @returns {Promise<Object>} 单词分析结果
 */
export async function analyzeWordError({ apiKey, word, userAnswer, correctAnswer, context = '' }) {
  const prompt = `你是一个专业的英语教学助手。学生回答错了以下题目，请分析错误原因。

**题目单词**：${word.word || word}
**学生答案**：${userAnswer}
**正确答案**：${correctAnswer}
**单词释义**：${word.meaning || word.translation || ''}
**题目语境**：${context || '无'}

**分析任务**：
1. 为什么学生可能会选错？
2. 这个错误反映了什么学习薄弱点？
3. 如何避免类似的错误？

**返回格式**（纯JSON）：
{
  "errorType": "错误类型（如：形近词混淆、词义理解偏差、粗心大意等）",
  "reason": "详细错误原因分析（100字以内）",
  "suggestion": "针对性的学习建议（80字以内）",
  "memoryTips": ["记忆技巧1", "记忆技巧2"],
  "relatedWords": ["容易混淆的相关词1", "相关词2", "相关词3"]
}

只返回JSON，不要其他内容。`;

  try {
    const data = await createOpenRouterChatCompletion({
      apiKey,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      maxTokens: 800
    });
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                      content.match(/```\s*([\s\S]*?)\s*```/) ||
                      content.match(/\{[\s\S]*\}/);

    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
    const analysisData = JSON.parse(jsonStr);

    return {
      word: word.word || word,
      ...analysisData,
      analyzedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('分析单词错误失败:', error);
    throw error;
  }
}

/**
 * 生成个性化学习计划
 * @param {Object} options - 选项
 * @returns {Promise<Object>} 学习计划
 */
export async function generateStudyPlan({ apiKey, stats, weakAreas, goals, userLevel = 'B2' }) {
  const prompt = `你是一个专业的英语教学规划师。请为以下学生制定个性化学习计划。

**学生水平**：${userLevel}

**学习统计**：
- 总学习单词数：${stats?.totalWords || 0}
- 当前正确率：${Math.round((stats?.accuracy || 0) * 100)}%
- 每日学习时长：${stats?.dailyMinutes || 30}分钟
- 已学习天数：${stats?.days || 0}

**薄弱领域**：
${weakAreas.map(area => `- ${area}`).join('\n')}

**学习目标**：${goals || '提高词汇量，准备雅思考试'}

**计划要求**：
1. 制定为期7天的学习计划
2. 每天包含具体的学习任务和目标
3. 针对薄弱领域进行强化
4. 保持渐进难度
5. 包含复习安排

**返回格式**（纯JSON）：
{
  "overview": "学习计划概述（100字以内）",
  "dailyPlan": [
    {
      "day": 1,
      "title": "第1天主题",
      "tasks": [
        {
          "type": "学习新词|复习|练习",
          "content": "具体任务内容",
          "target": "目标（如：学习20个单词）",
          "estimatedMinutes": 30
        }
      ],
      "focusArea": "当天重点领域",
      "tips": ["学习建议1", "建议2"]
    }
  ],
  "milestones": [
    {
      "day": 3,
      "description": "里程碑描述",
      "checkCriteria": "验收标准"
    }
  ],
  "resources": ["推荐资源1", "资源2"]
}

只返回JSON，不要其他内容。`;

  try {
    const data = await createOpenRouterChatCompletion({
      apiKey,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      maxTokens: 2000
    });
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                      content.match(/```\s*([\s\S]*?)\s*```/) ||
                      content.match(/\{[\s\S]*\}/);

    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
    const planData = JSON.parse(jsonStr);

    return {
      ...planData,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('生成学习计划失败:', error);
    throw error;
  }
}
