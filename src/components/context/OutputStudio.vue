<template>
  <div class="output-studio animate-slide-right">
    <!-- Session Mode -->
    <div v-if="currentMode === 'session'" :class="['session-shell', isDark ? 'dark' : 'light']">
      <div :class="['session-shell-header', isDark ? 'dark' : 'light']">
        <div>
          <p :class="['text-xs uppercase tracking-[0.24em]', isDark ? 'text-violet-400/80' : 'text-violet-600']">
            Output Studio
          </p>
          <h1 :class="['text-2xl font-bold mt-2', isDark ? 'text-white' : 'text-slate-900']">
            产出练习
          </h1>
          <p :class="['text-sm mt-2', isDark ? 'text-gray-400' : 'text-gray-600']">
            {{ sourceLabel }} · 本次 {{ sessionSize }} 词
          </p>
        </div>
        <button
          @click="exitSession"
          :class="[
            'session-shell-action',
            isDark
              ? 'bg-white/5 border-white/10 text-gray-300 hover:border-violet-500/30 hover:text-violet-400'
              : 'bg-gray-100 border-gray-200 text-gray-700 hover:border-violet-500/30 hover:text-violet-600'
          ]"
        >
          返回
        </button>
      </div>

      <div class="session-shell-body">
        <!-- Progress Bar -->
        <div class="progress-section mb-6">
          <div class="flex items-center justify-between mb-2">
            <span :class="['text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600']">
              进度
            </span>
            <span :class="['text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600']">
              {{ currentIndex + 1 }} / {{ totalWords }}
            </span>
          </div>
          <div :class="['h-2 rounded-full overflow-hidden', isDark ? 'bg-slate-700' : 'bg-gray-200']">
            <div
              class="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>

        <!-- Output Card -->
        <OutputStudioCard
          v-if="currentTask"
          :task="currentTask"
          :current-index="currentIndex"
          :total="totalWords"
          @submit="handleSubmit"
          @skip="handleSkip"
        />

        <!-- Summary -->
        <div v-else-if="showSummary" class="summary-section">
          <div :class="['summary-card', isDark ? 'dark' : 'light']">
            <div class="summary-icon">
              <svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 :class="['text-2xl font-bold mb-2', isDark ? 'text-white' : 'text-slate-900']">
              练习完成！
            </h2>
            <p :class="['text-sm mb-6', isDark ? 'text-gray-400' : 'text-gray-600']">
              本次共练习 {{ summary?.totalBundles || 0 }} 词，完成 {{ summary?.submittedCount || 0 }} 个产出任务。
            </p>

            <!-- Stats -->
            <div class="stats-row">
              <div :class="['stat-item', isDark ? 'dark' : 'light']">
                <div class="stat-value text-violet-500">{{ summary?.submittedCount || 0 }}</div>
                <div class="stat-label">已提交</div>
              </div>
              <div :class="['stat-item', isDark ? 'dark' : 'light']">
                <div class="stat-value text-gray-400">{{ summary?.skippedCount || 0 }}</div>
                <div class="stat-label">已跳过</div>
              </div>
              <div :class="['stat-item', isDark ? 'dark' : 'light']">
                <div class="stat-value text-emerald-500">{{ summary?.completionRate || 0 }}%</div>
                <div class="stat-label">完成率</div>
              </div>
            </div>

            <!-- Topic Distribution -->
            <div v-if="summary?.topicStats" class="topic-stats">
              <p :class="['text-xs font-semibold uppercase tracking-wider mb-3', isDark ? 'text-gray-400' : 'text-gray-500']">
                主题分布
              </p>
              <div class="topic-chips">
                <span
                  v-for="(stat, topic) in summary.topicStats"
                  :key="topic"
                  :class="[
                    'topic-chip',
                    isDark ? 'dark' : 'light'
                  ]"
                >
                  {{ getTopicLabel(topic) }} · {{ stat.submitted }}/{{ stat.total }}
                </span>
              </div>
            </div>

            <div v-if="summary?.coach" class="coach-panel">
              <p :class="['text-xs font-semibold uppercase tracking-wider mb-3', isDark ? 'text-gray-400' : 'text-gray-500']">
                Learning Coach
              </p>
              <div :class="['coach-card', isDark ? 'dark' : 'light']">
                <p :class="['text-sm font-semibold leading-7', isDark ? 'text-white' : 'text-slate-900']">
                  {{ summary.coach.headline }}
                </p>
                <p :class="['text-sm mt-3 leading-7', isDark ? 'text-gray-400' : 'text-gray-600']">
                  平均质量分：{{ summary.coach.averageScore }} · 下一步：{{ summary.coach.nextAction }}
                </p>

                <div class="coach-band-row">
                  <span :class="['coach-band', isDark ? 'dark' : 'light']">强 {{ summary.coach.bandCounts.strong }}</span>
                  <span :class="['coach-band', isDark ? 'dark' : 'light']">可用 {{ summary.coach.bandCounts.usable }}</span>
                  <span :class="['coach-band', isDark ? 'dark' : 'light']">待加强 {{ summary.coach.bandCounts.needsWork }}</span>
                </div>

                <div v-if="summary.coach.strengths?.length" class="coach-block">
                  <p :class="['coach-label', isDark ? 'text-gray-400' : 'text-gray-500']">这轮做得好的地方</p>
                  <div class="coach-chip-row">
                    <span v-for="item in summary.coach.strengths" :key="item" :class="['coach-chip success', isDark ? 'dark' : 'light']">
                      {{ getFocusLabel(item) }}
                    </span>
                  </div>
                </div>

                <div v-if="summary.coach.focusAreas?.length" class="coach-block">
                  <p :class="['coach-label', isDark ? 'text-gray-400' : 'text-gray-500']">下一轮重点补强</p>
                  <div class="coach-chip-row">
                    <span v-for="item in summary.coach.focusAreas" :key="item" :class="['coach-chip warn', isDark ? 'dark' : 'light']">
                      {{ getFocusLabel(item) }}
                    </span>
                  </div>
                </div>

                <div v-if="summary.coach.weakWords?.length" class="coach-block">
                  <p :class="['coach-label', isDark ? 'text-gray-400' : 'text-gray-500']">建议立刻重练</p>
                  <div class="coach-weak-list">
                    <div
                      v-for="item in summary.coach.weakWords"
                      :key="item.word"
                      :class="['coach-weak-card', isDark ? 'dark' : 'light']"
                    >
                      <p :class="['text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900']">{{ item.word }}</p>
                      <p :class="['text-xs mt-2 leading-6', isDark ? 'text-gray-400' : 'text-gray-600']">问题：{{ item.reason }}</p>
                      <p :class="['text-xs mt-1 leading-6', isDark ? 'text-violet-300/80' : 'text-violet-700']">建议：{{ item.nextStep }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="summary-actions">
              <button
                v-if="retryBundles.length"
                @click="handleRetryWeakWords"
                :class="[
                  'flex-1 py-4 rounded-2xl font-semibold transition-all active:scale-[0.98]',
                  isDark
                    ? 'bg-amber-500/15 border border-amber-500/20 text-amber-300 hover:border-amber-400/40'
                    : 'bg-amber-50 border border-amber-200 text-amber-700 hover:border-amber-300'
                ]"
              >
                重练薄弱词
              </button>
              <button
                @click="handleRestart"
                :class="[
                  'flex-1 py-4 rounded-2xl font-semibold transition-all active:scale-[0.98]',
                  'bg-violet-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02]'
                ]"
              >
                再练一轮
              </button>
              <button
                @click="exitSession"
                :class="[
                  'flex-1 py-4 rounded-2xl border font-semibold transition-all active:scale-[0.98]',
                  isDark
                    ? 'bg-slate-700/50 border-white/10 text-gray-300 hover:border-gray-500'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
                ]"
              >
                返回
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Overview Mode -->
    <div v-else class="space-y-6">
      <section :class="['hero-card', isDark ? 'dark' : 'light']">
        <div class="hero-copy">
          <div class="hero-badges">
            <span :class="['hero-badge hero-badge-violet', isDark ? 'dark' : 'light']">
              Output Studio
            </span>
            <span
              v-if="currentVocabName"
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium border',
                isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'
              ]"
            >
              {{ currentVocabName }}
            </span>
          </div>

          <div class="max-w-3xl">
            <h1 :class="['hero-title', isDark ? 'text-white' : 'text-slate-900']">
              把词真正用出来。
            </h1>
            <p :class="['hero-description', isDark ? 'text-gray-400' : 'text-gray-600']">
              每轮 5 词，专注产出练习：写句子、练口语框架、做改写。
            </p>
          </div>

          <div v-if="lastSessionSummary" :class="['last-summary last-summary-violet', isDark ? 'dark' : 'light']">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-500/15 text-violet-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p :class="['text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900']">
                上次练习 {{ lastSessionSummary.totalBundles }} 词 · 完成率 {{ lastSessionSummary.completionRate }}%
              </p>
            </div>
          </div>
        </div>

        <div class="hero-actions">
          <button
            @click="startSession"
            class="btn-primary-violet w-full sm:w-auto"
            :disabled="!hasEligibleBundles"
          >
            开始 5 词练习
          </button>
          <button
            @click="$emit('back')"
            :class="[
              'btn-secondary w-full sm:w-auto',
              isDark ? 'dark' : 'light'
            ]"
          >
            返回学习路径
          </button>
        </div>
      </section>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div :class="['stat-card', isDark ? 'dark' : 'light']">
          <div class="stat-value text-violet-500">{{ eligibleBundles.length }}</div>
          <div class="stat-label">可练习</div>
        </div>
        <div :class="['stat-card', isDark ? 'dark' : 'light']">
          <div class="stat-value text-purple-500">{{ history.sessions }}</div>
          <div class="stat-label">累计轮次</div>
        </div>
        <div :class="['stat-card', isDark ? 'dark' : 'light']">
          <div class="stat-value text-fuchsia-500">{{ history.totalOutputs }}</div>
          <div class="stat-label">产出总数</div>
        </div>
        <div :class="['stat-card', isDark ? 'dark' : 'light']">
          <div class="stat-value text-emerald-500">{{ history.accuracy }}%</div>
          <div class="stat-label">平均完成率</div>
        </div>
      </div>

      <!-- Preview Section -->
      <section v-if="hasEligibleBundles" :class="['content-card', isDark ? 'dark' : 'light']">
        <div class="section-heading">
          <div>
            <h2 class="section-title">本轮预览</h2>
            <p class="section-description">从当前词库随机抽取 5 词进行产出练习。</p>
          </div>
        </div>

        <div class="preview-grid">
          <div
            v-for="bundle in previewBundles"
            :key="bundle.bundleId || bundle.word"
            :class="['preview-pill', isDark ? 'dark' : 'light']"
          >
            <div class="min-w-0">
              <p :class="['text-sm font-semibold truncate', isDark ? 'text-white' : 'text-slate-900']">
                {{ bundle.word }}
              </p>
              <p :class="['text-xs truncate mt-1', isDark ? 'text-gray-400' : 'text-gray-600']">
                {{ bundle.chineseMeaning || bundle.sense }}
              </p>
            </div>
            <span :class="['preview-topic preview-topic-violet', isDark ? 'dark' : 'light']">
              {{ getTopicLabel(bundle.topic) }}
            </span>
          </div>
        </div>

        <div :class="['insight-panel', isDark ? 'dark' : 'light']">
          <div class="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p :class="['text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900']">
                产出练习类型
              </p>
              <p :class="['text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-600']">
                随机分配：写作句子、口语框架、改写练习。
              </p>
            </div>
            <button @click="startSession" class="btn-primary-violet">
              立即开始
            </button>
          </div>
        </div>
      </section>

      <!-- Empty State -->
      <section v-else :class="['empty-card', isDark ? 'dark' : 'light']">
        <div class="empty-icon empty-icon-violet">
          <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <h2 :class="['text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900']">
          当前词库没有足够的产出素材
        </h2>
        <p :class="['max-w-2xl text-sm leading-7', isDark ? 'text-gray-400' : 'text-gray-600']">
          请先切换到 IELTS Foundation 或 Topic Pack 词库，这些词库已包含完整的产出练习素材。
        </p>
        <button @click="$emit('back')" class="btn-primary-violet">
          返回学习路径
        </button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTheme } from '../../composables/useTheme.js'
import OutputStudioCard from './OutputStudioCard.vue'
import {
  createOutputStudioEngine,
  getOutputStudioHistory,
  saveOutputStudioToHistory,
  getTopicLabel
} from '../../utils/outputStudioEngine.js'
import { getFocusLabel } from '../../utils/learningCoach.js'

const { isDark } = useTheme()

const props = defineProps({
  bundles: {
    type: Array,
    default: () => []
  },
  currentVocab: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['back', 'complete'])

// State
const currentMode = ref(null) // null = overview, 'session' = in session
const sessionSize = ref(5)
const lastSessionSummary = ref(null)
const history = ref(loadHistory())

// Engine
let engine = null

// Reactive state from engine
const currentIndex = ref(0)
const totalWords = ref(5)
const currentTask = ref(null)
const showSummary = ref(false)
const summary = ref(null)

// Computed
const currentVocabName = computed(() => props.currentVocab?.name || '当前词库')
const sourceLabel = computed(() => {
  const type = props.currentVocab?.ieltsTrackType
  if (type === 'foundation') return 'Foundation'
  if (type === 'topic') return `Topic · ${getTopicLabel(props.currentVocab?.topic)}`
  return currentVocabName.value
})

const eligibleBundles = computed(() => {
  return props.bundles.filter(b =>
    !b.draft &&
    b.word &&
    (b.productionPrompt || (b.contexts && b.contexts.length > 0))
  )
})

const hasEligibleBundles = computed(() => eligibleBundles.value.length > 0)

const previewBundles = computed(() => {
  return shuffleArray([...eligibleBundles.value]).slice(0, 5)
})

const retryBundles = computed(() => {
  const weakWords = summary.value?.coach?.weakWords || []
  if (!weakWords.length) return []

  const weakWordSet = new Set(weakWords.map(item => item.word))
  return eligibleBundles.value.filter(bundle => weakWordSet.has(bundle.word))
})

const progress = computed(() => {
  if (totalWords.value === 0) return 0
  return Math.round(((currentIndex.value + 1) / totalWords.value) * 100)
})

// Methods
function loadHistory() {
  const raw = getOutputStudioHistory()
  const totalWords = raw.totalWords || 0
  const totalOutputs = raw.totalOutputs || 0

  return {
    ...raw,
    accuracy: totalWords > 0 ? Math.round((totalOutputs / totalWords) * 100) : 0
  }
}

function startSession(customBundles = null) {
  const sourceBundles = Array.isArray(customBundles) && customBundles.length
    ? customBundles
    : eligibleBundles.value

  if (!sourceBundles.length) return

  // Create engine
  engine = createOutputStudioEngine(sourceBundles, {
    sessionSize: Math.min(sessionSize.value, sourceBundles.length)
  })

  // Sync initial state
  syncState()

  currentMode.value = 'session'
  showSummary.value = false
  summary.value = null
}

function syncState() {
  if (!engine) return

  currentIndex.value = engine.state.currentIndex
  totalWords.value = engine.state.bundles.length
  currentTask.value = engine.generateOutputTask()
}

function handleSubmit(data) {
  if (!engine) return

  engine.recordResult(data)
  advanceToNext()
}

function handleSkip(data) {
  if (!engine) return

  engine.recordResult(data)
  advanceToNext()
}

function advanceToNext() {
  const hasMore = engine.nextWord()

  if (!hasMore) {
    // Session complete
    summary.value = engine.getSummary()
    showSummary.value = true
    currentTask.value = null

    // Save to history
    saveOutputStudioToHistory(summary.value)
    lastSessionSummary.value = summary.value
    history.value = loadHistory()

    emit('complete', summary.value)
  } else {
    syncState()
  }
}

function handleRestart() {
  if (!engine) return

  engine.reset()
  syncState()
  showSummary.value = false
  summary.value = null
}

function handleRetryWeakWords() {
  if (!retryBundles.value.length) return
  startSession(retryBundles.value)
}

function exitSession() {
  currentMode.value = null
  showSummary.value = false
  summary.value = null
  currentTask.value = null
  engine = null
  history.value = loadHistory()
}

function shuffleArray(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// Initialize
onMounted(() => {
  history.value = loadHistory()
})
</script>

<style scoped>
.output-studio {
  @apply max-w-4xl mx-auto p-4 md:p-8;
}

/* Session Shell */
.session-shell {
  @apply backdrop-blur-sm rounded-3xl border overflow-hidden;
  box-shadow: 0 18px 45px -28px rgba(15, 23, 42, 0.5);
}

.session-shell.dark {
  @apply bg-slate-800/50 border-white/10;
}

.session-shell.light {
  @apply bg-white border-gray-200;
}

.session-shell-header {
  @apply flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b px-5 py-5;
}

.session-shell-header.dark {
  @apply border-white/10;
}

.session-shell-header.light {
  @apply border-gray-200;
}

.session-shell-action {
  @apply px-4 py-2 rounded-2xl border font-medium transition-all;
}

.session-shell-body {
  @apply p-4 md:p-6;
}

/* Hero Card */
.hero-card,
.content-card,
.empty-card {
  @apply backdrop-blur-sm rounded-3xl border p-6 md:p-8 space-y-6;
  box-shadow: 0 18px 45px -28px rgba(15, 23, 42, 0.5);
}

.hero-card.dark,
.content-card.dark,
.empty-card.dark {
  @apply bg-slate-800/50 border-white/10;
}

.hero-card.light,
.content-card.light,
.empty-card.light {
  @apply bg-white border-gray-200;
}

.hero-copy {
  @apply space-y-5;
}

.hero-badges {
  @apply flex flex-wrap items-center gap-2;
}

.hero-badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-[0.16em];
}

.hero-badge-violet.dark {
  @apply bg-violet-500/10 border-violet-500/20 text-violet-400;
}

.hero-badge-violet.light {
  @apply bg-violet-50 border-violet-200 text-violet-700;
}

.hero-title {
  @apply text-3xl md:text-4xl font-black tracking-tight leading-[1.15];
}

.hero-description {
  @apply text-sm md:text-base leading-8 max-w-2xl;
}

.hero-actions {
  @apply flex flex-wrap gap-3;
}

/* Buttons */
.btn-primary-violet {
  @apply px-6 py-3 rounded-2xl bg-violet-600 text-white font-semibold shadow-lg shadow-violet-500/25 transition-all;
}

.btn-primary-violet:hover {
  @apply shadow-violet-500/40 scale-[1.02];
}

.btn-primary-violet:disabled {
  @apply opacity-50 cursor-not-allowed shadow-none;
  transform: none;
}

.btn-secondary {
  @apply px-6 py-3 rounded-2xl font-semibold border transition-all;
}

.btn-secondary.dark {
  @apply bg-white/5 border-white/10 text-gray-300 hover:border-violet-500/30 hover:text-violet-400;
}

.btn-secondary.light {
  @apply bg-gray-100 border-gray-200 text-gray-700 hover:border-violet-500/30 hover:text-violet-600;
}

/* Stats Grid */
.stats-grid {
  @apply grid grid-cols-2 xl:grid-cols-4 gap-4;
}

.stat-card {
  @apply rounded-2xl border p-5;
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

.stat-label {
  @apply text-sm mt-2 text-gray-500;
}

/* Last Summary */
.last-summary {
  @apply flex items-center gap-4 rounded-2xl border p-4;
}

.last-summary-violet.dark {
  @apply bg-violet-500/5 border-violet-500/10;
}

.last-summary-violet.light {
  @apply bg-violet-50 border-violet-200;
}

/* Section */
.section-heading {
  @apply mb-6;
}

.section-title {
  @apply text-xl font-bold;
}

.section-description {
  @apply text-sm text-gray-500 mt-2 leading-7 max-w-2xl;
}

/* Preview Grid */
.preview-grid {
  @apply grid sm:grid-cols-2 gap-3 mb-6;
}

.preview-pill {
  @apply flex items-start justify-between gap-3 rounded-2xl border p-4;
}

.preview-pill.dark {
  @apply bg-slate-900/40 border-white/5;
}

.preview-pill.light {
  @apply bg-gray-50 border-gray-200;
}

.preview-topic {
  @apply px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap;
}

.preview-topic-violet.dark {
  @apply bg-violet-500/10 text-violet-400;
}

.preview-topic-violet.light {
  @apply bg-violet-100 text-violet-700;
}

/* Insight Panel */
.insight-panel {
  @apply rounded-2xl border p-4;
}

.insight-panel.dark {
  @apply bg-slate-900/40 border-white/5;
}

.insight-panel.light {
  @apply bg-gray-50 border-gray-200;
}

/* Empty Card */
.empty-card {
  @apply text-center space-y-5;
}

.empty-icon {
  @apply mx-auto w-16 h-16 rounded-2xl flex items-center justify-center;
}

.empty-icon-violet {
  @apply bg-violet-500/10 text-violet-500;
}

/* Summary Section */
.summary-section {
  @apply flex justify-center;
}

.summary-card {
  @apply backdrop-blur-sm rounded-3xl border p-8 max-w-lg w-full text-center;
  box-shadow: 0 18px 45px -28px rgba(15, 23, 42, 0.5);
}

.summary-card.dark {
  @apply bg-slate-800/70 border-white/10;
}

.summary-card.light {
  @apply bg-white border-gray-200;
}

.summary-icon {
  @apply mx-auto w-16 h-16 rounded-2xl flex items-center justify-center bg-violet-500/15 text-violet-500 mb-4;
}

.stats-row {
  @apply grid grid-cols-3 gap-4 mb-6;
}

.stat-item {
  @apply rounded-xl border p-4;
}

.stat-item.dark {
  @apply bg-slate-900/40 border-white/5;
}

.stat-item.light {
  @apply bg-gray-50 border-gray-200;
}

.stat-item .stat-value {
  @apply text-2xl font-bold;
}

.stat-item .stat-label {
  @apply text-xs mt-1 text-gray-500;
}

.topic-stats {
  @apply mb-6;
}

.topic-chips {
  @apply flex flex-wrap gap-2 justify-center;
}

.topic-chip {
  @apply px-3 py-1.5 rounded-xl text-sm border;
}

.topic-chip.dark {
  @apply bg-slate-900/40 border-white/5 text-gray-300;
}

.topic-chip.light {
  @apply bg-gray-50 border-gray-200 text-gray-700;
}

.coach-panel {
  @apply mb-6 text-left;
}

.coach-card {
  @apply rounded-2xl border p-4 md:p-5;
}

.coach-card.dark {
  @apply bg-slate-900/40 border-white/5;
}

.coach-card.light {
  @apply bg-gray-50 border-gray-200;
}

.coach-band-row {
  @apply flex flex-wrap gap-2 mt-4;
}

.coach-band {
  @apply px-3 py-1.5 rounded-xl text-sm border;
}

.coach-band.dark {
  @apply bg-white/5 border-white/10 text-gray-300;
}

.coach-band.light {
  @apply bg-white border-gray-200 text-gray-700;
}

.coach-block {
  @apply mt-4;
}

.coach-label {
  @apply text-xs font-semibold uppercase tracking-wider mb-2;
}

.coach-chip-row {
  @apply flex flex-wrap gap-2;
}

.coach-chip {
  @apply px-3 py-1.5 rounded-xl text-sm border;
}

.coach-chip.success.dark {
  @apply bg-emerald-500/10 border-emerald-500/20 text-emerald-300;
}

.coach-chip.success.light {
  @apply bg-emerald-50 border-emerald-200 text-emerald-700;
}

.coach-chip.warn.dark {
  @apply bg-amber-500/10 border-amber-500/20 text-amber-300;
}

.coach-chip.warn.light {
  @apply bg-amber-50 border-amber-200 text-amber-700;
}

.coach-weak-list {
  @apply grid gap-3 md:grid-cols-2;
}

.coach-weak-card {
  @apply rounded-2xl border p-4;
}

.coach-weak-card.dark {
  @apply bg-slate-800/60 border-white/5;
}

.coach-weak-card.light {
  @apply bg-white border-gray-200;
}

.summary-actions {
  @apply flex gap-3;
}
</style>
