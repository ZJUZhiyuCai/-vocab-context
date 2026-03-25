/**
 * Output Studio Engine
 *
 * 专注于产出练习的轻量级会话引擎：
 * 1. 选择词汇（5 词一轮）
 * 2. 展示产出提示
 * 3. 收集用户输出
 * 4. 生成总结
 */

const STORAGE_KEY = 'vocabman-output-studio-state';
const HISTORY_KEY = 'vocabman-output-studio-history';
import { buildOutputCoach, evaluateProductionAttempt } from './learningCoach.js';

// 最小 context 文本长度（字符）
const MIN_CONTEXT_LENGTH = 40;

// 最小 sense 文本长度
const MIN_SENSE_LENGTH = 20;

/**
 * 检查 context 是否足够好用于展示
 */
function isContextHighQuality(context) {
  if (!context || typeof context.text !== 'string') return false;

  const text = context.text.trim();

  // 长度检查
  if (text.length < MIN_CONTEXT_LENGTH) return false;

  // 检查是否像完整句子（首字母大写，有标点）
  const hasProperStart = /^[A-Z]/.test(text);
  const hasProperEnd = /[.!?]$/.test(text);

  // 检查是否包含异常模式
  const hasBrokenPatterns = /\.\.\.|---|___|\[|\]|\{|\}/.test(text);
  const hasStitchedFeel = /\s{2,}/.test(text);

  return (hasProperStart || hasProperEnd) && !hasBrokenPatterns && !hasStitchedFeel;
}

/**
 * 检查 bundle 是否足够好用于 Output Studio
 */
function isBundleStudioReady(bundle) {
  if (!bundle || bundle.draft || !bundle.word) return false;

  // 必须有 sense 或 englishDefinition
  const sense = bundle.sense || bundle.englishDefinition || '';
  if (sense.length < MIN_SENSE_LENGTH) return false;

  // 必须有至少一个高质量的 context
  const contexts = bundle.contexts || [];
  const hasGoodContext = contexts.some(c => isContextHighQuality(c));
  if (!hasGoodContext) return false;

  // 必须有至少一个 collocation 或 paraphrase
  const collocations = bundle.collocations || [];
  const paraphrases = bundle.paraphrases || [];
  if (collocations.length === 0 && paraphrases.length === 0) return false;

  return true;
}

/**
 * 选择最佳 reference context
 */
function selectBestContext(bundle) {
  const contexts = bundle.contexts || [];
  if (contexts.length === 0) return null;

  // 收集所有高质量 context
  const goodContexts = contexts.filter(c => isContextHighQuality(c));
  if (goodContexts.length === 0) return null;

  // 优先级：writing > reading > speaking
  // 因为 writing context 通常更学术化，适合产出练习
  const priorityOrder = ['writing', 'reading', 'speaking'];

  for (const kind of priorityOrder) {
    const found = goodContexts.find(c => c.kind === kind);
    if (found) return found;
  }

  // 如果没有按优先级找到，返回第一个好的
  return goodContexts[0];
}

/**
 * 根据词和主题生成自然的 prompt
 */
function generateNaturalPrompt(word, topic, type, productionPrompt) {
  // 如果 bundle 有自定义 productionPrompt，优先使用
  if (productionPrompt && productionPrompt.instruction) {
    return {
      mode: productionPrompt.mode || 'writing',
      instruction: productionPrompt.instruction,
      hint: ''
    };
  }

  // 根据类型生成更自然的 prompt
  const topicHints = {
    education: '教育、学习或学校',
    environment: '环境、可持续发展或自然',
    technology: '科技、创新或数字生活',
    government: '政府政策、公共服务或政治',
    health: '健康、医疗或卫生',
    work: '工作、就业或职业',
    media: '媒体、传播或信息',
    crime: '犯罪、法律或社会问题',
    general: '学术话题'
  };

  const topicHint = topicHints[topic] || topicHints.general;

  const prompts = {
    sentence: {
      mode: 'writing',
      instruction: `用 "${word}" 写一个关于 ${topicHint} 的句子。`,
      hint: '尽量使用自然的搭配。'
    },
    speaking: {
      mode: 'speaking',
      instruction: `用 "${word}" 准备一段关于 ${topicHint} 的口语回答。`,
      hint: '注意表达清晰自然。'
    },
    rewrite: {
      mode: 'writing',
      instruction: `用 "${word}" 改写参考语境中的表达。`,
      hint: '保持原意，改变表达方式。'
    }
  };

  return prompts[type] || prompts.sentence;
}

/**
 * 创建 Output Studio 引擎
 */
export function createOutputStudioEngine(bundles, options = {}) {
  const {
    sessionSize = 5
  } = options;

  // 过滤高质量的 bundles
  const validBundles = bundles.filter(isBundleStudioReady);

  // 随机选择 bundles
  const selectedBundles = shuffleArray([...validBundles])
    .slice(0, sessionSize);

  // Session 状态
  const state = {
    bundles: selectedBundles,
    currentIndex: 0,
    results: [],
    startedAt: Date.now(),
    completedAt: null
  };

  /**
   * 获取当前 bundle
   */
  function currentBundle() {
    return state.bundles[state.currentIndex] || null;
  }

  /**
   * 生成产出任务卡片数据
   */
  function generateOutputTask() {
    const bundle = currentBundle();
    if (!bundle) return null;

    // 选择最佳 reference context（可能为 null）
    const referenceContext = selectBestContext(bundle);

    // 根据 bundle 特征选择 prompt 类型
    const promptType = selectPromptType(bundle, referenceContext);

    // 生成 prompt
    const prompt = generateNaturalPrompt(
      bundle.word,
      bundle.topic,
      promptType,
      bundle.productionPrompt
    );

    return {
      word: bundle.word,
      sense: bundle.sense || bundle.englishDefinition || '',
      chineseMeaning: bundle.chineseMeaning || '',
      collocations: (bundle.collocations || []).slice(0, 3),
      paraphrase: (bundle.paraphrases || [])[0] || null,
      prompt,
      promptType,
      referenceContext: referenceContext ? {
        text: referenceContext.text,
        kind: referenceContext.kind
      } : null,
      topic: bundle.topic || 'general'
    };
  }

  /**
   * 根据 bundle 和 context 选择合适的 prompt 类型
   */
  function selectPromptType(bundle, referenceContext) {
    // 如果 productionPrompt 指定了 mode，遵循它
    if (bundle.productionPrompt && bundle.productionPrompt.mode) {
      const mode = bundle.productionPrompt.mode;
      if (mode === 'speaking') return 'speaking';
      // writing mode 可以是 sentence 或 rewrite
    }

    // 如果有好的 reference context，rewrite 更合适
    if (referenceContext && referenceContext.kind === 'writing') {
      // 50% 几率是 rewrite
      if (Math.random() < 0.5) return 'rewrite';
    }

    // 如果有 speaking context，可以倾向 speaking 任务
    const contexts = bundle.contexts || [];
    const hasSpeakingContext = contexts.some(c => c.kind === 'speaking');
    if (hasSpeakingContext && Math.random() < 0.3) {
      return 'speaking';
    }

    // 默认是 sentence
    return 'sentence';
  }

  /**
   * 记录结果
   */
  function recordResult(data) {
    const bundle = currentBundle();
    if (!bundle) return;

    const feedback = data.submitted
      ? evaluateProductionAttempt({
          text: data.text || '',
          word: bundle.word,
          collocations: bundle.collocations || [],
          paraphrase: (bundle.paraphrases || [])[0] || '',
          promptType: data.promptType,
          topic: bundle.topic || 'general'
        })
      : null;

    const result = {
      bundleId: bundle.bundleId || bundle.id || bundle.word,
      word: bundle.word,
      topic: bundle.topic || 'general',
      submitted: data.submitted,
      text: data.text || '',
      time: data.time || 0,
      promptType: data.promptType,
      feedback
    };

    state.results.push(result);
  }

  /**
   * 前进到下一个词
   */
  function nextWord() {
    state.currentIndex++;
    if (state.currentIndex >= state.bundles.length) {
      state.completedAt = Date.now();
    }
    saveState();
    return state.currentIndex < state.bundles.length;
  }

  /**
   * 获取总结数据
   */
  function getSummary() {
    const totalBundles = state.bundles.length;
    const results = state.results;
    const submitted = results.filter(r => r.submitted);
    const skipped = results.filter(r => !r.submitted);

    // 按主题统计
    const topicStats = {};
    results.forEach(r => {
      if (!topicStats[r.topic]) {
        topicStats[r.topic] = { total: 0, submitted: 0 };
      }
      topicStats[r.topic].total++;
      if (r.submitted) topicStats[r.topic].submitted++;
    });

    // 总时长
    const totalTime = state.completedAt
      ? state.completedAt - state.startedAt
      : 0;

    return {
      totalBundles,
      submittedCount: submitted.length,
      skippedCount: skipped.length,
      completionRate: totalBundles > 0
        ? Math.round((submitted.length / totalBundles) * 100)
        : 0,
      totalTime,
      topicStats,
      results,
      coach: buildOutputCoach(results)
    };
  }

  /**
   * 保存状态
   */
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentIndex: state.currentIndex,
        results: state.results,
        startedAt: state.startedAt
      }));
    } catch (e) {
      console.warn('保存 Output Studio 状态失败:', e);
    }
  }

  /**
   * 加载状态
   */
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // 只恢复 10 分钟内的会话
        if (parsed.startedAt && Date.now() - parsed.startedAt < 10 * 60 * 1000) {
          state.currentIndex = parsed.currentIndex || 0;
          state.results = parsed.results || [];
        }
      }
    } catch (e) {
      console.warn('加载 Output Studio 状态失败:', e);
    }
  }

  /**
   * 清除状态
   */
  function clearState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }

  /**
   * 重置会话
   */
  function reset() {
    state.currentIndex = 0;
    state.results = [];
    state.startedAt = Date.now();
    state.completedAt = null;
    clearState();
  }

  /**
   * 是否已完成
   */
  function isCompleted() {
    return state.currentIndex >= state.bundles.length;
  }

  // 初始化时尝试加载状态
  loadState();

  return {
    state,
    currentBundle,
    generateOutputTask,
    recordResult,
    nextWord,
    getSummary,
    reset,
    isCompleted
  };
}

/**
 * 洗牌算法
 */
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 获取历史统计
 */
export function getOutputStudioHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : {
      sessions: 0,
      totalWords: 0,
      totalOutputs: 0,
      qualityScoreTotal: 0,
      topicStats: {},
      vocabStats: {}
    };
  } catch (e) {
    return { sessions: 0, totalWords: 0, totalOutputs: 0, qualityScoreTotal: 0, topicStats: {}, vocabStats: {} };
  }
}

/**
 * 保存到历史
 */
export function saveOutputStudioToHistory(summary, meta = {}) {
  try {
    const history = getOutputStudioHistory();
    const topicKey = meta.topic || 'general';
    const vocabKey = meta.vocabId || 'unknown';
    const averageScore = summary?.coach?.averageScore || 0;
    history.sessions++;
    history.totalWords += summary.totalBundles;
    history.totalOutputs += summary.submittedCount;
    history.qualityScoreTotal += averageScore;

    if (!history.topicStats[topicKey]) {
      history.topicStats[topicKey] = { sessions: 0, totalWords: 0, totalOutputs: 0, qualityScoreTotal: 0 };
    }
    history.topicStats[topicKey].sessions += 1;
    history.topicStats[topicKey].totalWords += summary.totalBundles;
    history.topicStats[topicKey].totalOutputs += summary.submittedCount;
    history.topicStats[topicKey].qualityScoreTotal += averageScore;

    if (!history.vocabStats[vocabKey]) {
      history.vocabStats[vocabKey] = { sessions: 0, totalWords: 0, totalOutputs: 0, qualityScoreTotal: 0, topic: topicKey, trackType: meta.trackType || 'foundation' };
    }
    history.vocabStats[vocabKey].sessions += 1;
    history.vocabStats[vocabKey].totalWords += summary.totalBundles;
    history.vocabStats[vocabKey].totalOutputs += summary.submittedCount;
    history.vocabStats[vocabKey].qualityScoreTotal += averageScore;
    history.vocabStats[vocabKey].topic = topicKey;
    history.vocabStats[vocabKey].trackType = meta.trackType || history.vocabStats[vocabKey].trackType;

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('保存 Output Studio 历史失败:', e);
  }
}

/**
 * 主题标签映射
 */
export function getTopicLabel(topic) {
  const labels = {
    education: '教育',
    environment: '环境',
    technology: '科技',
    government: '政府',
    health: '健康',
    work: '工作',
    media: '媒体',
    crime: '犯罪',
    culture: '文化',
    transport: '交通',
    society: '社会',
    economy: '经济',
    general: '通用'
  };
  return labels[topic] || topic || '通用';
}
