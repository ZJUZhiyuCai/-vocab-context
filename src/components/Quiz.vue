<template>
  <div class="quiz-page animate-slide-right">
    <!-- 主页面：选择学习模式 -->
    <div v-if="!currentMode" class="mode-selection">
      <!-- 统计概览 -->
      <div class="stats-overview">
      <div :class="['stat-card', isDark ? 'dark' : 'light']">
          <div class="stat-value">{{ learnedCount }}</div>
          <div class="stat-label">学习过</div>
        </div>
        <div :class="['stat-card', isDark ? 'dark' : 'light']">
          <div class="stat-value">{{ reviewAccuracy }}%</div>
          <div class="stat-label">正确率</div>
        </div>
        <div :class="['stat-card', isDark ? 'dark' : 'light']">
          <div class="stat-value">{{ totalReviewed }}</div>
          <div class="stat-label">复习次数</div>
        </div>
      </div>

      <!-- 学习模式 -->
      <div :class="['mode-section', isDark ? 'dark' : 'light']">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-1 h-5 rounded-full bg-emerald-500"></div>
          <h2 class="section-title">学习模式</h2>
        </div>
        <p class="section-description">选择你的学习方式</p>

        <div v-if="learnedCount > 0" class="mode-options">
          <button @click="startSession('flashcard')" :class="['mode-card group', isDark ? 'dark' : 'light']">
            <div class="mode-icon-wrapper group-hover:scale-110 transition-transform">
              <svg class="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 class="mode-title">闪卡学习</h3>
            <p class="mode-desc">快速浏览单词，翻转查看详细释义</p>
          </button>
          <button @click="startSession('spelling')" :class="['mode-card group', isDark ? 'dark' : 'light']">
            <div class="mode-icon-wrapper group-hover:scale-110 transition-transform">
              <svg class="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 class="mode-title">拼写练习</h3>
            <p class="mode-desc">根据释义拼写单词，强化拼写记忆</p>
          </button>
        </div>

        <!-- Context-first Session 新模式入口 -->
        <div v-if="learnedCount > 0" :class="['mt-4 p-4 rounded-2xl border', isDark ? 'bg-violet-500/5 border-violet-500/20' : 'bg-violet-50 border-violet-200']">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', isDark ? 'bg-violet-500/20' : 'bg-violet-100']">
                <svg class="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 :class="['font-bold', isDark ? 'text-white' : 'text-slate-900']">语境优先学习</h3>
                <p :class="['text-sm', isDark ? 'text-gray-400' : 'text-gray-600']">先读语境，再做题，深度理解单词用法</p>
              </div>
            </div>
            <button
              @click="startContextSession"
              class="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              开始学习
            </button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="flex justify-center mb-6 text-slate-700/50">
            <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.168.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="empty-title text-xl font-bold text-slate-200">还没有学习过的单词</h3>
          <p class="empty-desc text-slate-500 mb-8">先去今日学习页面学习一些新单词</p>
          <button @click="$emit('navigate', 'today')" class="premium-btn px-8 py-3">🚀 开始学习</button>
        </div>
      </div>

      <!-- 单词列表 -->
      <div :class="['list-section', isDark ? 'dark' : 'light']">
        <div class="list-header">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <div class="w-1 h-5 rounded-full bg-cyan-500"></div>
              <h2 class="section-title">单词列表</h2>
            </div>
            <p class="section-description">查看所有学习过的单词</p>
          </div>
          <button @click="openWordList" class="btn-secondary flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            查看列表
          </button>
        </div>
      </div>
    </div>

    <!-- 学习进行中 -->
    <div v-if="currentMode === 'session'" :class="['session-container', isDark ? 'dark' : 'light']">
      <ReviewSession
        :words="learnedWords"
        :mode="sessionMode"
        :start-index="startIndex"
        @complete="handleSessionComplete"
        @exit="exitSession"
      />
    </div>

    <!-- Context-first Session -->
    <div v-if="currentMode === 'context'" :class="['session-container', isDark ? 'dark' : 'light']">
      <ContextSession
        :bundles="contextBundles"
        @complete="handleContextComplete"
        @exit="exitSession"
      />
    </div>

    <!-- 单词列表弹窗 -->
    <div v-if="showWordList" class="modal-overlay" @click.self="showWordList = false">
      <div :class="['modal-container', isDark ? 'dark' : 'light']">
        <ReviewQueuePreview
          :words="wordListData"
          @close="showWordList = false"
          @start="startSessionFromList"
          @startFromIndex="startSessionFromIndex"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ReviewSession from './quiz/ReviewSession.vue'
import ReviewQueuePreview from './ReviewQueuePreview.vue'
import ContextSession from './context/ContextSession.vue'
import { useTheme } from '../composables/useTheme.js'

const { isDark } = useTheme()

const props = defineProps({
  words: {
    type: Array,
    required: true
  },
  learned: {
    type: Set,
    required: true
  },
  reviewStates: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['navigate'])

// 当前模式：null（选择页面）, 'session'（学习中）
const currentMode = ref(null)
const sessionMode = ref('flashcard')
const showWordList = ref(false)
const startIndex = ref(0)

// 调试：打印传入的数据
onMounted(() => {
  console.log('Quiz收到的数据:', {
    wordsCount: props.words.length,
    reviewStatesKeys: Object.keys(props.reviewStates),
    reviewStates: props.reviewStates
  })
})

// 计算统计数据
const learnedCount = computed(() => {
  return Object.keys(props.reviewStates).length
})

const totalReviewed = computed(() => {
  return Object.values(props.reviewStates).filter(state => state.reviewCount > 0).length
})

const reviewAccuracy = computed(() => {
  let total = 0
  let correct = 0
  Object.values(props.reviewStates).forEach(state => {
    if (state.reviewCount > 0) {
      total += state.reviewCount
      correct += (state.correctCount || 0)
    }
  })
  return total > 0 ? Math.round((correct / total) * 100) : 0
})

// 获取学习过的单词（按优先级排序）
const learnedWords = computed(() => {
  const learnedWordIds = Object.keys(props.reviewStates)

  return props.words.filter(w => learnedWordIds.includes(w.id))
    .sort((a, b) => {
      const stateA = props.reviewStates[a.id]
      const stateB = props.reviewStates[b.id]

      // 按优先级排序：已到期 > 未到期
      const isDueA = stateA.nextReview && Date.now() >= stateA.nextReview
      const isDueB = stateB.nextReview && Date.now() >= stateB.nextReview

      if (isDueA && !isDueB) return -1
      if (!isDueA && isDueB) return 1

      // 都到期或都没到期时，按超时程度排序
      if (isDueA && isDueB) {
        const overdueA = Date.now() - stateA.nextReview
        const overdueB = Date.now() - stateB.nextReview
        return overdueB - overdueA
      }

      // 都没到期，按下次复习时间排序
      return stateA.nextReview - stateB.nextReview
    })
})

// Context-first Session: 将单词转换为 bundle 格式
const contextBundles = computed(() => {
  return learnedWords.value.slice(0, 5).map(word => ({
    bundleId: word.id,
    word: word.word,
    ipa: word.ipa || '',
    partOfSpeech: word.partOfSpeech || '',
    meaning: word.meaning || '',
    englishDefinition: word.englishDefinition || '',
    contexts: word.contexts || [],
    paraphrases: word.paraphrases || [],
    collocations: word.collocations || [],
    topic: word.topic || 'general'
  }))
})

// 获取单词列表详细数据
const wordListData = computed(() => {
  return learnedWords.value.map(word => {
    const reviewState = props.reviewStates[word.id]
    return { word, reviewState }
  })
})

// 打开单词列表
const openWordList = () => {
  showWordList.value = true
}

// 开始学习
const startSession = (mode) => {
  sessionMode.value = mode
  startIndex.value = 0
  currentMode.value = 'session'
}

// 开始 Context-first Session
const startContextSession = () => {
  currentMode.value = 'context'
}

// Context Session 完成
const handleContextComplete = (summary) => {
  console.log('Context session complete:', summary)
  currentMode.value = null
}

// 从列表开始学习
const startSessionFromList = () => {
  showWordList.value = false
  sessionMode.value = 'flashcard'
  startIndex.value = 0
  currentMode.value = 'session'
}

// 从指定索引开始学习
const startSessionFromIndex = (index) => {
  showWordList.value = false
  sessionMode.value = 'flashcard'
  startIndex.value = index
  currentMode.value = 'session'
}

// 学习完成
const handleSessionComplete = (result) => {
  currentMode.value = null
}

// 退出当前会话
const exitSession = () => {
  currentMode.value = null
}
</script>

<style scoped>
.quiz-page {
  @apply max-w-5xl mx-auto p-4 md:p-8;
}

.mode-selection {
  @apply space-y-6;
}

/* 统计概览 */
.stats-overview {
  @apply grid grid-cols-3 gap-4;
}

.stat-card {
  @apply backdrop-blur-sm rounded-2xl p-5 border;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.stat-card.dark {
  @apply bg-slate-800/50 border-white/10;
}

.stat-card.light {
  @apply bg-white border-gray-200;
}

.stat-value {
  @apply text-3xl font-bold;
}

.stat-card.dark .stat-value {
  @apply text-white;
}

.stat-card.light .stat-value {
  @apply text-slate-900;
}

.stat-label {
  @apply text-sm mt-1 text-gray-500;
}

/* 区块 */
.mode-section,
.list-section {
  @apply backdrop-blur-sm rounded-2xl p-6 border;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.mode-section.dark,
.list-section.dark {
  @apply bg-slate-800/50 border-white/10;
}

.mode-section.light,
.list-section.light {
  @apply bg-white border-gray-200;
}

.section-title {
  @apply text-xl font-bold;
  margin-bottom: 0.25rem;
}

.mode-section.dark .section-title,
.list-section.dark .section-title {
  @apply text-white;
}

.mode-section.light .section-title,
.list-section.light .section-title {
  @apply text-slate-900;
}

.section-description {
  @apply text-sm text-gray-400;
  margin-bottom: 1.5rem;
}

/* 学习模式卡片 */
.mode-options {
  @apply grid grid-cols-2 gap-4;
}

.mode-card {
  @apply p-6 rounded-xl border-2;
  @apply transition-all duration-300;
  @apply flex flex-col items-center text-center cursor-pointer;
}

.mode-card.dark {
  @apply border-white/5 bg-slate-900/50;
}

.mode-card.light {
  @apply border-gray-200 bg-gray-50;
}

.mode-card.dark:hover {
  @apply border-emerald-500/50 bg-slate-800;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
}

.mode-card.light:hover {
  @apply border-emerald-500/50 bg-white;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);
}

.mode-icon-wrapper {
  @apply mb-4 flex items-center justify-center p-4 rounded-2xl;
}

.mode-card.dark .mode-icon-wrapper {
  @apply bg-white/5;
}

.mode-card.light .mode-icon-wrapper {
  @apply bg-emerald-50;
}

.mode-title {
  @apply text-lg font-bold mb-2;
}

.mode-card.dark .mode-title {
  @apply text-white;
}

.mode-card.light .mode-title {
  @apply text-slate-900;
}

.mode-desc {
  @apply text-sm text-gray-500;
}

/* 空状态 */
.empty-state {
  @apply text-center py-16;
}

.empty-icon {
  @apply text-6xl text-slate-700 mb-4;
}

.empty-title {
  @apply text-lg font-bold text-white mb-2;
}

.empty-desc {
  @apply text-sm mb-6 text-gray-500;
}

/* 按钮 */
.btn-primary {
  @apply px-6 py-2.5 rounded-xl font-bold;
  @apply bg-gradient-to-r from-emerald-500 to-teal-500 text-white;
  @apply shadow-lg shadow-emerald-500/20;
  @apply transition-all duration-200;
}

.btn-primary:hover {
  @apply shadow-emerald-500/40 scale-105;
}

.btn-secondary {
  @apply px-5 py-2 rounded-xl font-medium border;
  @apply transition-all duration-200;
}

.mode-section.dark .btn-secondary,
.list-section.dark .btn-secondary {
  @apply bg-white/5 border-white/10 text-gray-300;
}

.mode-section.light .btn-secondary,
.list-section.light .btn-secondary {
  @apply bg-gray-100 border-gray-200 text-gray-700;
}

.btn-secondary:hover {
  @apply border-emerald-500/30 text-emerald-400 bg-emerald-500/5;
}

/* 列表区块 */
.list-header {
  @apply flex items-center justify-between;
}

/* 会话容器 */
.session-container {
  @apply rounded-3xl overflow-hidden border;
}

.session-container.dark {
  @apply bg-slate-900 border-white/10;
}

.session-container.light {
  @apply bg-white border-gray-200;
}

/* 弹窗 */
.modal-overlay {
  @apply fixed inset-0 bg-black/80 backdrop-blur-sm;
  @apply flex items-center justify-center z-50 p-4;
}

.modal-container {
  @apply w-full max-w-4xl rounded-3xl overflow-hidden border;
}

.modal-container.dark {
  @apply bg-slate-900 border-white/10;
}

.modal-container.light {
  @apply bg-white border-gray-200;
}
</style>
