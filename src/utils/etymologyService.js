import { createAIChatCompletion } from './aiClient.js';

/**
 * 词根词缀API服务
 * 调用AI获取单词的词根词缀信息
 */

/**
 * 获取词根词缀信息
 * @param {Object} options - 配置选项
 * @param {string} options.apiKey - API密钥
 * @param {string} options.word - 目标单词
 * @returns {Promise<Object>} 词根词缀信息
 */
export async function getEtymology({ apiKey, word }) {
  const prompt = buildPrompt(word)

  const data = await createAIChatCompletion({
    apiKey,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.3,
    maxTokens: 800,
    topP: 0.7
  })
  return parseResponse(data)
}

/**
 * 构建AI Prompt
 * @param {string} word - 单词
 * @returns {string} Prompt文本
 */
function buildPrompt(word) {
  return `你是一个专业的英语词源学专家。请分析单词"${word}"的词根词缀结构。

请返回以下信息：
1. 词根（root）- 单词的核心意义部分
2. 前缀（prefix）- 如果有
3. 后缀（suffix）- 如果有
4. 词源说明（etymology）- 简要说明词源和构词逻辑
5. 记忆提示（mnemonic）- 基于词根词缀的记忆方法

如果无法获取词根词缀信息（如简单词汇、外来词等），请返回null。

请以JSON格式返回，格式如下：
{
  "root": "词根（如果有）",
  "prefix": "前缀（如果有）",
  "suffix": "后缀（如果有）",
  "etymology": "词源说明",
  "mnemonic": "记忆提示"
}

如果无法获取信息，返回：
{
  "root": null,
  "prefix": null,
  "suffix": null,
  "etymology": null,
  "mnemonic": null
}

只返回JSON，不要其他内容。`
}

/**
 * 解析AI响应
 * @param {Object} data - API响应数据
 * @returns {Object} 解析后的词根词缀对象
 */
function parseResponse(data) {
  try {
    const content = data.choices[0].message.content

    // 尝试提取JSON
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                      content.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      throw new Error('无法解析AI响应')
    }

    const result = JSON.parse(jsonMatch[1] || jsonMatch[0])

    // 检查是否为null（无法获取信息）
    if (result.root === null && result.prefix === null && result.suffix === null) {
      return null
    }

    return {
      root: result.root || '',
      prefix: result.prefix || '',
      suffix: result.suffix || '',
      etymology: result.etymology || '',
      mnemonic: result.mnemonic || ''
    }
  } catch (error) {
    console.error('解析响应失败:', error)
    return null
  }
}
