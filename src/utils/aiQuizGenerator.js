import { createAIChatCompletion } from './aiClient.js';
import logger from './logger.js';

/**
 * AI 智能测验生成器
 * 使用硅基流动 API 生成智能选择题
 */

/**
 * 生成单词测验题
 * @param {Object} options - 生成选项
 * @param {string} options.apiKey - API密钥
 * @param {Object} options.word - 单词对象
 * @param {Array<string>} options.otherWords - 其他单词列表（用于生成干扰项）
 * @param {string} options.userLevel - 用户水平（如 'B2', 'C1'）
 * @returns {Promise<Object>} 测验对象
 */
export async function generateQuiz({ apiKey, word, otherWords, userLevel = 'B2' }) {
  const prompt = buildQuizPrompt(word, otherWords, userLevel);

  try {
    const data = await createAIChatCompletion({
      apiKey,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      maxTokens: 800
    });
    return parseQuizResponse(data, word);
  } catch (error) {
    logger.error('生成测验失败:', error);
    throw error;
  }
}

/**
 * 构建测验生成的提示词
 */
function buildQuizPrompt(word, otherWords, userLevel) {
  // 从其他单词中随机选择一些作为候选干扰项
  const candidateWords = otherWords
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
    .map(w => typeof w === 'string' ? w : w.word)
    .join('、');

  return `你是一个专业的英语教学助手。请为以下单词生成一道多项选择题。

**目标单词**：${word.word}
**释义**：${word.meaning || word.translation || ''}
**词性**：${word.pos || word.partOfSpeech || '未标注'}

**干扰项候选词池**（请从中选择3个作为干扰项，选择与目标单词容易混淆的词）：
${candidateWords}

**用户水平**：${userLevel}

**要求**：
1. 题目类型：根据单词的英语释义选择正确的单词
2. 干扰项选择：从候选词池中选择3个，要选择与目标单词在形、音、义上容易混淆的词
3. 释义要清晰准确，体现单词的核心含义和用法
4. 难度要适合${userLevel}水平的学习者
5. 如果词池中没有足够合适的干扰项，可以添加相关的干扰词

**返回格式**（纯JSON，不要markdown标记）：
{
  "question": "单词的英语释义",
  "options": ["A. 单词1", "B. 单词2", "C. 单词3", "D. 单词4"],
  "correctAnswer": "A",
  "explanation": "为什么选这个答案的解释（100字以内）",
  "distractorExplanation": {
    "A": "选项A的解释（如果是正确答案则说明为什么正确）",
    "B": "选项B的解释（说明为什么是干扰项）",
    "C": "选项C的解释",
    "D": "选项D的解释"
  }
}

注意：
- 正确答案必须随机分配到A、B、C、D中的任意一个位置
- 选项中必须包含目标单词${word.word}
- 只返回JSON，不要有任何其他内容`;
}

/**
 * 解析 AI 返回的测验数据
 */
function parseQuizResponse(data, originalWord) {
  const content = data.choices[0].message.content;

  // 尝试提取 JSON（处理可能的 markdown 代码块）
  let jsonStr = content;

  // 移除可能的 markdown 代码块标记
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                    content.match(/```\s*([\s\S]*?)\s*```/) ||
                    content.match(/\{[\s\S]*\}/);

  if (jsonMatch) {
    jsonStr = jsonMatch[1] || jsonMatch[0];
  }

  let quizData;
  try {
    quizData = JSON.parse(jsonStr);
  } catch (parseError) {
    logger.error('JSON解析失败:', jsonStr);
    throw new Error('AI返回的格式无法解析', { cause: parseError });
  }

  // 验证数据完整性
  if (!quizData.question || !quizData.options || !quizData.correctAnswer) {
    throw new Error('测验数据不完整');
  }

  // 确保正确答案对应目标单词
  const correctOptionText = quizData.options[
    quizData.correctAnswer.charCodeAt(0) - 65  // 'A' -> 0, 'B' -> 1, etc.
  ];
  const correctWord = correctOptionText.substring(2).trim(); // 移除 "A. " 前缀

  return {
    id: `quiz-${originalWord.word}-${Date.now()}`,
    word: originalWord.word,
    question: quizData.question,
    options: quizData.options,
    correctAnswer: quizData.correctAnswer,
    explanation: quizData.explanation,
    distractorExplanation: quizData.distractorExplanation,
    generatedAt: new Date().toISOString(),
    verified: correctWord.toLowerCase() === originalWord.word.toLowerCase()
  };
}

/**
 * 批量生成测验（用于预生成）
 * @param {Object} options - 选项
 * @returns {Promise<Array>} 测验数组
 */
export async function generateQuizzesBatch({ apiKey, words, batchSize = 5, userLevel = 'B2' }) {
  const quizzes = [];

  for (let i = 0; i < words.length; i += batchSize) {
    const batch = words.slice(i, i + batchSize);
    const otherWords = words.filter((_, idx) => idx < i || idx >= i + batchSize);

    const batchPromises = batch.map(word =>
      generateQuiz({ apiKey, word, otherWords, userLevel })
        .catch(error => ({
          error: true,
          word: word.word,
          message: error.message
        }))
    );

    const batchResults = await Promise.all(batchPromises);
    quizzes.push(...batchResults);

    // 避免请求过快
    if (i + batchSize < words.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return quizzes;
}

/**
 * 生成交互式填空题
 * @param {Object} options - 选项
 * @returns {Promise<Object>} 填空题对象
 */
export async function generateFillBlankQuestion({ apiKey, word, userLevel = 'B2' }) {
  const prompt = `你是一个专业的英语教学助手。请为以下单词生成一道完形填空题。

**目标单词**：${word.word}
**释义**：${word.meaning || word.translation || ''}
**词性**：${word.pos || word.partOfSpeech || '未标注'}

**用户水平**：${userLevel}

**要求**：
1. 创建一个10-15个单词的英语句子，在目标单词位置留空
2. 句子要体现单词的实际用法和语境
3. 难度适合${userLevel}水平
4. 提供足够的上下文线索，让学习者能够推断出正确答案

**返回格式**（纯JSON）：
{
  "sentence": "完整的句子（目标单词位置用 _____ 表示）",
  "fullSentence": "完整句子（填入目标单词）",
  "correctAnswer": "${word.word}",
  "hint": "提示信息（50字以内）",
  "explanation": "为什么填这个单词（100字以内）"
}

只返回JSON，不要其他内容。`;

  try {
    const data = await createAIChatCompletion({
      apiKey,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      maxTokens: 600
    });
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                      content.match(/```\s*([\s\S]*?)\s*```/) ||
                      content.match(/\{[\s\S]*\}/);

    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
    const questionData = JSON.parse(jsonStr);

    return {
      id: `fillblank-${word.word}-${Date.now()}`,
      word: word.word,
      ...questionData,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    logger.error('生成填空题失败:', error);
    throw error;
  }
}
