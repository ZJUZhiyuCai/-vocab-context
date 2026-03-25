/**
 * Context-first Session Engine
 *
 * 管理 context-first 学习流程：
 * 1. 显示语境
 * 2. meaning_choice 选择题
 * 3. paraphrase_match 匹配题
 * 4. micro_output 输出题
 * 5. 反馈
 * 6. Summary
 */

const STORAGE_KEY = 'vocabman-context-session-state';

// 任务类型
export const TASK_TYPES = {
  CONTEXT_PREVIEW: 'context_preview',
  MEANING_CHOICE: 'meaning_choice',
  PARAPHRASE_MATCH: 'paraphrase_match',
  MICRO_OUTPUT: 'micro_output',
  FEEDBACK: 'feedback',
  SUMMARY: 'summary'
};

// 优先主题
const PRIORITY_TOPICS = ['education', 'environment', 'technology'];

function getBundleId(bundle) {
  return bundle?.id || bundle?.bundleId || bundle?.word || '';
}

function normalizeProductionPrompt(productionPrompt, word) {
  const fallbackInstruction = `Write a sentence using "${word}" in an academic context.`;

  if (typeof productionPrompt === 'string' && productionPrompt.trim()) {
    return {
      mode: 'writing',
      instruction: productionPrompt.trim()
    };
  }

  if (productionPrompt && typeof productionPrompt === 'object') {
    return {
      mode: productionPrompt.mode || 'writing',
      instruction: productionPrompt.instruction || fallbackInstruction
    };
  }

  return {
    mode: 'writing',
    instruction: fallbackInstruction
  };
}

/**
 * 创建 Session 引擎
 */
export function createContextSessionEngine(bundles, options = {}) {
  const {
    sessionSize = 5,
    topics = PRIORITY_TOPICS
  } = options;

  // 过滤优先主题的 bundles
  let availableBundles = bundles.filter(b =>
    !b.draft && b.contexts && b.contexts.length > 0
  );

  // 优先选择特定主题
  const topicBundles = availableBundles.filter(b =>
    topics.includes(b.topic)
  );

  if (topicBundles.length >= sessionSize) {
    availableBundles = topicBundles;
  }

  // 随机选择 bundles
  const selectedBundles = shuffleArray([...availableBundles])
    .slice(0, sessionSize);

  // Session 状态
  const state = {
    bundles: selectedBundles,
    currentIndex: 0,
    currentTask: TASK_TYPES.CONTEXT_PREVIEW,
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
   * 获取当前语境
   */
  function currentContext() {
    const bundle = currentBundle();
    if (!bundle || !bundle.contexts || bundle.contexts.length === 0) {
      return null;
    }
    // 随机选择一个语境
    return bundle.contexts[Math.floor(Math.random() * bundle.contexts.length)];
  }

  /**
   * 生成 meaning_choice 选项
   */
  function generateMeaningOptions() {
    const bundle = currentBundle();
    if (!bundle) return null;

    const correctAnswer = {
      id: 'correct',
      text: bundle.meaning,
      isCorrect: true
    };

    // 从其他 bundles 获取干扰项
    const bundleId = getBundleId(bundle);
    const otherBundles = state.bundles.filter(b => getBundleId(b) !== bundleId);
    const distractors = shuffleArray(otherBundles)
      .slice(0, 3)
      .map((b, i) => ({
        id: `distractor_${i}`,
        text: b.meaning,
        isCorrect: false
      }));

    return shuffleArray([correctAnswer, ...distractors]);
  }

  /**
   * 生成 paraphrase_match 选项
   */
  function generateParaphraseOptions() {
    const bundle = currentBundle();
    if (!bundle || !bundle.paraphrases || bundle.paraphrases.length === 0) {
      return null;
    }

    const correctParaphrase = bundle.paraphrases[0];
    const correctAnswer = {
      id: 'correct',
      text: correctParaphrase,
      isCorrect: true
    };

    // 从其他 bundles 获取干扰项
    const bundleId = getBundleId(bundle);
    const otherBundles = state.bundles.filter(b =>
      getBundleId(b) !== bundleId && b.paraphrases && b.paraphrases.length > 0
    );

    const distractors = shuffleArray(otherBundles)
      .slice(0, 3)
      .map((b, i) => ({
        id: `distractor_${i}`,
        text: b.paraphrases[0],
        isCorrect: false
      }));

    // 如果干扰项不足，补充一些通用的错误选项
    while (distractors.length < 3) {
      distractors.push({
        id: `filler_${distractors.length}`,
        text: generateFillerParaphrase(),
        isCorrect: false
      });
    }

    return shuffleArray([correctAnswer, ...distractors.slice(0, 3)]);
  }

  /**
   * 生成填充式 paraphrase（当干扰项不足时）
   */
  function generateFillerParaphrase() {
    const fillers = [
      'relates to the topic',
      'is commonly used',
      'refers to a process',
      'describes a situation',
      'indicates a change'
    ];
    return fillers[Math.floor(Math.random() * fillers.length)];
  }

  /**
   * 获取 micro_output prompt
   */
  function getMicroOutputPrompt() {
    const bundle = currentBundle();
    if (!bundle) return null;

    const resolvedPrompt = normalizeProductionPrompt(bundle.productionPrompt, bundle.word);

    return {
      ...resolvedPrompt,
      word: bundle.word,
      context: currentContext()
    };
  }

  /**
   * 记录结果
   */
  function recordResult(taskType, data) {
    const bundle = currentBundle();
    if (!bundle) return;

    const bundleId = getBundleId(bundle);
    const existingResult = state.results.find(r => r.bundleId === bundleId) || {
      bundleId,
      word: bundle.word,
      topic: bundle.topic
    };

    if (taskType === TASK_TYPES.MEANING_CHOICE) {
      existingResult.meaningCorrect = data.correct;
      existingResult.meaningTime = data.time;
    } else if (taskType === TASK_TYPES.PARAPHRASE_MATCH) {
      existingResult.paraphraseCorrect = data.correct;
      existingResult.paraphraseTime = data.time;
    } else if (taskType === TASK_TYPES.MICRO_OUTPUT) {
      existingResult.outputSubmitted = data.submitted;
      existingResult.outputText = data.text;
      existingResult.outputTime = data.time;
      existingResult.outputFeedback = data.feedback || null;
    }

    // 确保结果被记录
    if (!state.results.includes(existingResult)) {
      state.results.push(existingResult);
    }
  }

  /**
   * 前进到下一个任务
   */
  function nextTask() {
    const taskOrder = [
      TASK_TYPES.CONTEXT_PREVIEW,
      TASK_TYPES.MEANING_CHOICE,
      TASK_TYPES.PARAPHRASE_MATCH,
      TASK_TYPES.MICRO_OUTPUT,
      TASK_TYPES.FEEDBACK
    ];

    const currentIdx = taskOrder.indexOf(state.currentTask);

    if (currentIdx < taskOrder.length - 1) {
      state.currentTask = taskOrder[currentIdx + 1];
    } else {
      // 当前 bundle 完成，进入下一个 bundle
      state.currentIndex++;
      if (state.currentIndex >= state.bundles.length) {
        state.currentTask = TASK_TYPES.SUMMARY;
        state.completedAt = Date.now();
      } else {
        state.currentTask = TASK_TYPES.CONTEXT_PREVIEW;
      }
    }

    saveState();
    return state.currentTask;
  }

  /**
   * 获取 summary 数据
   */
  function getSummary() {
    const totalBundles = state.bundles.length;
    const results = state.results;

    const meaningCorrect = results.filter(r => r.meaningCorrect).length;
    const paraphraseCorrect = results.filter(r => r.paraphraseCorrect).length;
    const outputSubmitted = results.filter(r => r.outputSubmitted).length;

    const totalTime = state.completedAt ? state.completedAt - state.startedAt : 0;

    // 按主题统计
    const topicStats = {};
    results.forEach(r => {
      if (!topicStats[r.topic]) {
        topicStats[r.topic] = { total: 0, correct: 0 };
      }
      topicStats[r.topic].total++;
      if (r.meaningCorrect && r.paraphraseCorrect) {
        topicStats[r.topic].correct++;
      }
    });

    return {
      totalBundles,
      meaningCorrect,
      meaningTotal: totalBundles,
      paraphraseCorrect,
      paraphraseTotal: totalBundles,
      outputSubmitted,
      outputTotal: totalBundles,
      accuracy: totalBundles > 0 ? Math.round((meaningCorrect + paraphraseCorrect) / (totalBundles * 2) * 100) : 0,
      totalTime,
      topicStats,
      results
    };
  }

  /**
   * 保存状态到 localStorage
   */
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentIndex: state.currentIndex,
        currentTask: state.currentTask,
        results: state.results,
        startedAt: state.startedAt
      }));
    } catch (e) {
      console.warn('Failed to save session state:', e);
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
        // 只恢复未完成的 session（10分钟内）
        if (parsed.startedAt && Date.now() - parsed.startedAt < 10 * 60 * 1000) {
          state.currentIndex = parsed.currentIndex || 0;
          state.currentTask = parsed.currentTask || TASK_TYPES.CONTEXT_PREVIEW;
          state.results = parsed.results || [];
        }
      }
    } catch (e) {
      console.warn('Failed to load session state:', e);
    }
  }

  /**
   * 清除状态
   */
  function clearState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear session state:', e);
    }
  }

  /**
   * 重置 session
   */
  function reset() {
    state.currentIndex = 0;
    state.currentTask = TASK_TYPES.CONTEXT_PREVIEW;
    state.results = [];
    state.startedAt = Date.now();
    state.completedAt = null;
    clearState();
  }

  // 初始化时尝试加载状态
  loadState();

  return {
    state,
    currentBundle,
    currentContext,
    generateMeaningOptions,
    generateParaphraseOptions,
    getMicroOutputPrompt,
    recordResult,
    nextTask,
    getSummary,
    reset,
    TASK_TYPES
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
 * 获取历史 session 统计
 */
export function getContextSessionHistory() {
  try {
    const key = 'vocabman-context-session-history';
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : { sessions: 0, totalBundles: 0, totalCorrect: 0 };
  } catch (e) {
    return { sessions: 0, totalBundles: 0, totalCorrect: 0 };
  }
}

/**
 * 保存 session 到历史
 */
export function saveContextSessionToHistory(summary) {
  try {
    const key = 'vocabman-context-session-history';
    const history = getContextSessionHistory();
    history.sessions++;
    history.totalBundles += summary.totalBundles;
    history.totalCorrect += summary.meaningCorrect + summary.paraphraseCorrect;
    localStorage.setItem(key, JSON.stringify(history));
  } catch (e) {
    console.warn('Failed to save session history:', e);
  }
}
