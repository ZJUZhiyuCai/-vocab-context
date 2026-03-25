/**
 * IELTS Exam Drills Engine
 *
 * 模拟 IELTS 考试场景的混合练习引擎：
 * - Reading Paraphrase: 阅读推断 + 改写识别
 * - Listening Paraphrase: 听力转述理解
 * - Writing Argument: 写作论证输出
 * - Speaking Frame: 口语框架输出
 */

const STORAGE_KEY = 'vocabman-exam-drill-state';
const HISTORY_KEY = 'vocabman-exam-drill-history';
import { buildExamCoach, evaluateProductionAttempt } from './learningCoach.js';

// 任务表面类型
export const SURFACE_TYPES = {
  READING_PARAPHRASE: 'reading_paraphrase',
  LISTENING_PARAPHRASE: 'listening_paraphrase',
  WRITING_ARGUMENT: 'writing_argument',
  SPEAKING_FRAME: 'speaking_frame'
};

// 表面类型标签
export const SURFACE_LABELS = {
  [SURFACE_TYPES.READING_PARAPHRASE]: '阅读改写',
  [SURFACE_TYPES.LISTENING_PARAPHRASE]: '听力转述',
  [SURFACE_TYPES.WRITING_ARGUMENT]: '写作论证',
  [SURFACE_TYPES.SPEAKING_FRAME]: '口语框架'
};

/**
 * 获取 bundle ID
 */
function getBundleId(bundle) {
  return bundle?.id || bundle?.bundleId || bundle?.word || '';
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
 * 为 session 分配任务表面类型
 * 确保每种类型都有代表性
 */
function assignSurfaceTypes(sessionSize) {
  const types = [
    SURFACE_TYPES.READING_PARAPHRASE,
    SURFACE_TYPES.LISTENING_PARAPHRASE,
    SURFACE_TYPES.WRITING_ARGUMENT,
    SURFACE_TYPES.SPEAKING_FRAME
  ];

  // 先确保每种类型至少有一个
  const assigned = [...types];

  // 剩余位置随机分配
  const remaining = sessionSize - types.length;
  for (let i = 0; i < remaining; i++) {
    assigned.push(types[Math.floor(Math.random() * types.length)]);
  }

  return shuffleArray(assigned);
}

/**
 * 检查 bundle 是否适合 Reading Paraphrase
 */
function isSuitableForReading(bundle) {
  return bundle &&
    bundle.contexts &&
    bundle.contexts.length > 0 &&
    bundle.paraphrases &&
    bundle.paraphrases.length > 0;
}

/**
 * 检查 bundle 是否适合 Listening Paraphrase
 */
function isSuitableForListening(bundle) {
  return bundle &&
    bundle.contexts &&
    bundle.contexts.length > 0 &&
    bundle.paraphrases &&
    bundle.paraphrases.length > 0;
}

/**
 * 检查 bundle 是否适合 Writing Argument
 */
function isSuitableForWriting(bundle) {
  return bundle &&
    bundle.word &&
    (bundle.sense || bundle.englishDefinition) &&
    bundle.collocations &&
    bundle.collocations.length > 0;
}

/**
 * 检查 bundle 是否适合 Speaking Frame
 */
function isSuitableForSpeaking(bundle) {
  return bundle &&
    bundle.word &&
    (bundle.sense || bundle.englishDefinition);
}

/**
 * 获取适合指定表面类型的 bundles
 */
function getBundlesForSurface(bundles, surfaceType) {
  const checkers = {
    [SURFACE_TYPES.READING_PARAPHRASE]: isSuitableForReading,
    [SURFACE_TYPES.LISTENING_PARAPHRASE]: isSuitableForListening,
    [SURFACE_TYPES.WRITING_ARGUMENT]: isSuitableForWriting,
    [SURFACE_TYPES.SPEAKING_FRAME]: isSuitableForSpeaking
  };

  const checker = checkers[surfaceType];
  return bundles.filter(b => !b.draft && checker(b));
}

/**
 * 生成阅读改写任务
 */
function generateReadingTask(bundle, allBundles) {
  // 选择一个 context
  const context = bundle.contexts[Math.floor(Math.random() * bundle.contexts.length)];

  // 正确答案
  const correctParaphrase = bundle.paraphrases[0];

  // 生成干扰项
  const bundleId = getBundleId(bundle);
  const otherBundles = allBundles.filter(b =>
    getBundleId(b) !== bundleId &&
    b.paraphrases &&
    b.paraphrases.length > 0
  );

  const distractors = shuffleArray(otherBundles)
    .slice(0, 3)
    .map((b, i) => ({
      id: `distractor_${i}`,
      text: b.paraphrases[0],
      isCorrect: false
    }));

  // 补充干扰项
  while (distractors.length < 3) {
    distractors.push({
      id: `filler_${distractors.length}`,
      text: generateFillerParaphrase(),
      isCorrect: false
    });
  }

  const options = shuffleArray([
    { id: 'correct', text: correctParaphrase, isCorrect: true },
    ...distractors.slice(0, 3)
  ]);

  return {
    surfaceType: SURFACE_TYPES.READING_PARAPHRASE,
    word: bundle.word,
    context: context.text,
    contextTranslation: context.translation || '',
    question: '阅读以下语境，选择最贴切的改写表达：',
    options,
    topic: bundle.topic || 'general'
  };
}

/**
 * 生成听力转述任务
 */
function generateListeningTask(bundle, allBundles) {
  // 选择一个 context 作为"听力文本"
  const context = bundle.contexts[Math.floor(Math.random() * bundle.contexts.length)];

  // 正确答案（释义或改写）
  const correctAnswer = bundle.paraphrases[0] || bundle.meaning;

  // 生成干扰项
  const bundleId = getBundleId(bundle);
  const otherBundles = allBundles.filter(b =>
    getBundleId(b) !== bundleId
  );

  const distractors = shuffleArray(otherBundles)
    .slice(0, 3)
    .map((b, i) => ({
      id: `distractor_${i}`,
      text: b.meaning || b.paraphrases?.[0] || '',
      isCorrect: false
    }));

  while (distractors.length < 3) {
    distractors.push({
      id: `filler_${distractors.length}`,
      text: generateFillerMeaning(),
      isCorrect: false
    });
  }

  const options = shuffleArray([
    { id: 'correct', text: correctAnswer, isCorrect: true },
    ...distractors.slice(0, 3)
  ]);

  return {
    surfaceType: SURFACE_TYPES.LISTENING_PARAPHRASE,
    word: bundle.word,
    transcript: context.text,
    transcriptTranslation: context.translation || '',
    question: '模拟听力场景：选择说话者想要表达的意思：',
    options,
    topic: bundle.topic || 'general'
  };
}

/**
 * 生成写作论证任务
 */
function generateWritingTask(bundle) {
  const topic = bundle.topic || 'general';
  const collocation = bundle.collocations?.[0] || bundle.word;

  const prompts = {
    education: 'Some people believe that traditional education is no longer relevant in the digital age.',
    environment: 'Environmental issues should be the responsibility of governments, not individuals.',
    technology: 'Technology has done more harm than good to human relationships.',
    government: 'Government funding should prioritize public services over space exploration.',
    health: 'Healthcare should be free for all citizens regardless of income.',
    work: 'Remote work has more advantages than disadvantages for modern employees.',
    media: 'Social media has a negative impact on young people\'s mental health.',
    crime: 'Stricter punishments are the most effective way to reduce crime rates.',
    general: 'This trend has significant implications for modern society.'
  };

  const prompt = prompts[topic] || prompts.general;

  return {
    surfaceType: SURFACE_TYPES.WRITING_ARGUMENT,
    word: bundle.word,
    sense: bundle.sense || bundle.englishDefinition || '',
    collocation,
    prompt,
    instruction: `使用 "${bundle.word}" 或 "${collocation}" 写一句话来支持或反驳上述观点。`,
    hint: '注意学术语体和清晰的论证结构。',
    topic
  };
}

/**
 * 生成口语框架任务
 */
function generateSpeakingTask(bundle) {
  const topic = bundle.topic || 'general';

  const prompts = {
    education: 'Describe a memorable learning experience you had.',
    environment: 'Talk about an environmental issue that concerns you.',
    technology: 'Describe how technology has changed your daily life.',
    government: 'What government policy do you think has been most effective?',
    health: 'How do you maintain a healthy lifestyle?',
    work: 'Describe your ideal job and why it appeals to you.',
    media: 'How do you think social media has changed communication?',
    crime: 'What do you think is the best way to prevent crime in your community?',
    general: 'Tell me about a time when you had to make an important decision.'
  };

  const prompt = prompts[topic] || prompts.general;

  return {
    surfaceType: SURFACE_TYPES.SPEAKING_FRAME,
    word: bundle.word,
    sense: bundle.sense || bundle.englishDefinition || '',
    prompt,
    instruction: `准备一个简短的口语回答，使用 "${bundle.word}" 来回答问题。`,
    hint: '规划要点，练习自然表达。',
    topic
  };
}

/**
 * 生成填充式改写
 */
function generateFillerParaphrase() {
  const fillers = [
    'relates to the given context',
    'is commonly used in academic writing',
    'refers to a general concept',
    'describes a particular situation',
    'indicates a specific change'
  ];
  return fillers[Math.floor(Math.random() * fillers.length)];
}

/**
 * 生成填充式释义
 */
function generateFillerMeaning() {
  const fillers = [
    'refers to a common concept',
    'describes a general process',
    'indicates a typical situation',
    'relates to everyday life',
    'is important in modern society'
  ];
  return fillers[Math.floor(Math.random() * fillers.length)];
}

/**
 * 创建 Exam Drill 引擎
 */
export function createExamDrillEngine(bundles, options = {}) {
  const {
    sessionSize = 8
  } = options;

  // 过滤有效 bundles
  const validBundles = bundles.filter(b =>
    !b.draft &&
    b.word &&
    (b.contexts?.length > 0 || b.paraphrases?.length > 0)
  );

  // 分配表面类型
  const surfaceAssignments = assignSurfaceTypes(sessionSize);

  // 为每种表面类型选择合适的 bundle
  const selectedItems = [];
  const usedBundleIds = new Set();

  for (const surfaceType of surfaceAssignments) {
    const suitableBundles = getBundlesForSurface(validBundles, surfaceType)
      .filter(b => !usedBundleIds.has(getBundleId(b)));

    if (suitableBundles.length > 0) {
      const bundle = suitableBundles[Math.floor(Math.random() * suitableBundles.length)];
      usedBundleIds.add(getBundleId(bundle));
      selectedItems.push({ bundle, surfaceType });
    }
  }

  // 如果不足，用通用 bundle 补充
  while (selectedItems.length < sessionSize && selectedItems.length < validBundles.length) {
    const remainingBundles = validBundles.filter(b => !usedBundleIds.has(getBundleId(b)));
    if (remainingBundles.length === 0) break;

    const bundle = remainingBundles[Math.floor(Math.random() * remainingBundles.length)];
    usedBundleIds.add(getBundleId(bundle));

    // 选择一个适合的表面类型
    const possibleTypes = [
      SURFACE_TYPES.READING_PARAPHRASE,
      SURFACE_TYPES.LISTENING_PARAPHRASE,
      SURFACE_TYPES.WRITING_ARGUMENT,
      SURFACE_TYPES.SPEAKING_FRAME
    ].filter(t => getBundlesForSurface([bundle], t).length > 0);

    const surfaceType = possibleTypes.length > 0
      ? possibleTypes[Math.floor(Math.random() * possibleTypes.length)]
      : SURFACE_TYPES.SPEAKING_FRAME;

    selectedItems.push({ bundle, surfaceType });
  }

  // Session 状态
  const state = {
    items: selectedItems,
    currentIndex: 0,
    results: [],
    startedAt: Date.now(),
    completedAt: null
  };

  /**
   * 获取当前任务
   */
  function currentTask() {
    const item = state.items[state.currentIndex];
    if (!item) return null;

    const { bundle, surfaceType } = item;

    switch (surfaceType) {
      case SURFACE_TYPES.READING_PARAPHRASE:
        return generateReadingTask(bundle, validBundles);
      case SURFACE_TYPES.LISTENING_PARAPHRASE:
        return generateListeningTask(bundle, validBundles);
      case SURFACE_TYPES.WRITING_ARGUMENT:
        return generateWritingTask(bundle);
      case SURFACE_TYPES.SPEAKING_FRAME:
        return generateSpeakingTask(bundle);
      default:
        return null;
    }
  }

  /**
   * 记录结果
   */
  function recordResult(data) {
    const item = state.items[state.currentIndex];
    if (!item) return;

    const isOutputSurface = [
      SURFACE_TYPES.WRITING_ARGUMENT,
      SURFACE_TYPES.SPEAKING_FRAME
    ].includes(item.surfaceType);

    const feedback = isOutputSurface && data.submitted
      ? evaluateProductionAttempt({
          text: data.text || '',
          word: item.bundle.word,
          collocations: item.bundle.collocations || [],
          paraphrase: item.bundle.paraphrases?.[0] || '',
          promptType: item.surfaceType === SURFACE_TYPES.SPEAKING_FRAME ? 'speaking' : 'sentence',
          topic: item.bundle.topic || 'general'
        })
      : null;

    const derivedCorrect = feedback
      ? feedback.band !== 'needsWork'
      : (data.correct || false);

    state.results.push({
      bundleId: getBundleId(item.bundle),
      word: item.bundle.word,
      surfaceType: item.surfaceType,
      topic: item.bundle.topic || 'general',
      correct: derivedCorrect,
      submitted: data.submitted !== undefined ? data.submitted : true,
      text: data.text || '',
      time: data.time || 0,
      feedback
    });

    saveState();
  }

  /**
   * 前进到下一个任务
   */
  function nextTask() {
    state.currentIndex++;
    if (state.currentIndex >= state.items.length) {
      state.completedAt = Date.now();
    }
    saveState();
    return state.currentIndex < state.items.length;
  }

  /**
   * 获取总结数据
   */
  function getSummary() {
    const totalItems = state.items.length;
    const results = state.results;

    // 按表面类型统计
    const surfaceStats = {};
    Object.values(SURFACE_TYPES).forEach(type => {
      surfaceStats[type] = { total: 0, correct: 0, submitted: 0 };
    });

    results.forEach(r => {
      if (surfaceStats[r.surfaceType]) {
        surfaceStats[r.surfaceType].total++;
        if (r.correct) surfaceStats[r.surfaceType].correct++;
        if (r.submitted) surfaceStats[r.surfaceType].submitted++;
      }
    });

    // 按主题统计
    const topicStats = {};
    results.forEach(r => {
      if (!topicStats[r.topic]) {
        topicStats[r.topic] = { total: 0, correct: 0 };
      }
      topicStats[r.topic].total++;
      if (r.correct) topicStats[r.topic].correct++;
    });

    // 总体统计
    const correctCount = results.filter(r => r.correct).length;
    const submittedCount = results.filter(r => r.submitted).length;
    const totalTime = state.completedAt
      ? state.completedAt - state.startedAt
      : 0;

    return {
      totalItems,
      completedItems: results.length,
      correctCount,
      accuracy: results.length > 0
        ? Math.round((correctCount / results.length) * 100)
        : 0,
      submittedCount,
      totalTime,
      surfaceStats,
      topicStats,
      results,
      coach: buildExamCoach(results, surfaceStats)
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
      console.warn('保存 Exam Drill 状态失败:', e);
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
      console.warn('加载 Exam Drill 状态失败:', e);
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
    return state.currentIndex >= state.items.length;
  }

  // 初始化时尝试加载状态
  loadState();

  return {
    state,
    currentTask,
    recordResult,
    nextTask,
    getSummary,
    reset,
    isCompleted,
    SURFACE_TYPES,
    SURFACE_LABELS
  };
}

/**
 * 获取历史统计
 */
export function getExamDrillHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : {
      sessions: 0,
      totalItems: 0,
      totalCorrect: 0
    };
  } catch (e) {
    return { sessions: 0, totalItems: 0, totalCorrect: 0 };
  }
}

/**
 * 保存到历史
 */
export function saveExamDrillToHistory(summary) {
  try {
    const history = getExamDrillHistory();
    history.sessions++;
    history.totalItems += summary.totalItems;
    history.totalCorrect += summary.correctCount;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('保存 Exam Drill 历史失败:', e);
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
