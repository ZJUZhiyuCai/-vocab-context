<template>
  <div class="exam-drills animate-slide-right">
    <!-- Session Mode -->
    <div v-if="currentMode === 'session'" :class="['session-shell', isDark ? 'dark' : 'light']">
      <div :class="['session-shell-header', isDark ? 'dark' : 'light']">
        <div>
          <p :class="['text-xs uppercase tracking-[0.24em]', isDark ? 'text-rose-400/80' : 'text-rose-600']">
            IELTS Exam Drills
          </p>
          <h1 :class="['text-2xl font-bold mt-2', isDark ? 'text-white' : 'text-slate-900']">
            考试模拟练习
          </h1>
          <p :class="['text-sm mt-2', isDark ? 'text-gray-400' : 'text-gray-600']">
            {{ sourceLabel }} · 本次 {{ sessionSize }} 题
          </p>
        </div>
        <button
          @click="exitSession"
          :class="[
            'session-shell-action',
            isDark
              ? 'bg-white/5 border-white/10 text-gray-300 hover:border-rose-500/30 hover:text-rose-400'
              : 'bg-gray-100 border-gray-200 text-gray-700 hover:border-rose-500/30 hover:text-rose-600'
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
              {{ currentIndex + 1 }} / {{ totalItems }}
            </span>
          </div>
          <div :class="['h-2 rounded-full overflow-hidden', isDark ? 'bg-slate-700' : 'bg-gray-200']">
            <div
              class="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 rounded-full transition-all duration-500"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
          <!-- Surface Type Indicators -->
          <div class="flex flex-wrap gap-2 mt-3 justify-center">
            <span
              v-for="(stat, type) in surfaceStats"
              :key="type"
              :class="[
                'px-2 py-1 text-xs rounded-full border transition-all',
                currentSurfaceType === type
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : stat.completed > 0
                    ? isDark ? 'bg-rose-500/10 text-rose-400/50 border-rose-500/10' : 'bg-rose-100 text-rose-600 border-rose-200'
                    : isDark ? 'bg-slate-800 text-gray-500 border-white/5' : 'bg-gray-100 text-gray-400 border-gray-200'
              ]"
            >
              {{ stat.label }} {{ stat.completed }}/{{ stat.total }}
            </span>
          </div>
        </div>

        <!-- Drill Card -->
        <ExamDrillCard
          v-if="currentTask"
          :task="currentTask"
          :current-index="currentIndex"
          :total="totalItems"
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
              本次共完成 {{ summary?.totalItems || 0 }} 道题目，正确 {{ summary?.correctCount || 0 }} 题。
            </p>

            <!-- Stats Grid -->
            <div class="stats-row">
              <div :class="['stat-item', isDark ? 'dark' : 'light']">
                <div class="stat-value text-rose-500">{{ summary?.accuracy || 0 }}%</div>
                <div class="stat-label">正确率</div>
              </div>
              <div :class="['stat-item', isDark ? 'dark' : 'light']">
                <div class="stat-value text-emerald-500">{{ summary?.correctCount || 0 }}</div>
                <div class="stat-label">正确</div>
              </div>
              <div :class="['stat-item', isDark ? 'dark' : 'light']">
                <div class="stat-value text-cyan-500">{{ summary?.completedItems || 0 }}</div>
                <div class="stat-label">已完成</div>
              </div>
            </div>

            <!-- Surface Stats -->
            <div v-if="summary?.surfaceStats" class="surface-stats">
              <p :class="['text-xs font-semibold uppercase tracking-wider mb-3', isDark ? 'text-gray-400' : 'text-gray-500']">
                题型分布
              </p>
              <div class="surface-chips">
                <span
                  v-for="(stat, type) in summary.surfaceStats"
                  :key="type"
                  v-show="stat.total > 0"
                  :class="['surface-chip', isDark ? 'dark' : 'light']"
                >
                  {{ stat.label }} · {{ stat.correct }}/{{ stat.total }}
                </span>
              </div>
            </div>

            <!-- Topic Stats -->
            <div v-if="summary?.topicStats && Object.keys(summary.topicStats).length > 0" class="topic-stats">
              <p :class="['text-xs font-semibold uppercase tracking-wider mb-3', isDark ? 'text-gray-400' : 'text-gray-500']">
                主题分布
              </p>
              <div class="topic-chips">
                <span
                  v-for="(stat, topic) in summary.topicStats"
                  :key="topic"
                  :class="['topic-chip', isDark ? 'dark' : 'light']"
                >
                  {{ getTopicLabel(topic) }} · {{ stat.correct }}/{{ stat.total }}
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
                  下一步：{{ summary.coach.nextAction }}
                </p>

                <div v-if="summary.coach.weakSurfaces?.length" class="coach-block">
                  <p :class="['coach-label', isDark ? 'text-gray-400' : 'text-gray-500']">最弱题型</p>
                  <div class="coach-chip-row">
                    <span v-for="item in summary.coach.weakSurfaces" :key="item.type" :class="['coach-chip warn', isDark ? 'dark' : 'light']">
                      {{ surfaceLabel(item.type) }} · {{ item.accuracy }}%
                    </span>
                  </div>
                </div>

                <div v-if="summary.coach.outputCoach?.strengths?.length" class="coach-block">
                  <p :class="['coach-label', isDark ? 'text-gray-400' : 'text-gray-500']">输出层做得好的地方</p>
                  <div class="coach-chip-row">
                    <span v-for="item in summary.coach.outputCoach.strengths" :key="item" :class="['coach-chip success', isDark ? 'dark' : 'light']">
                      {{ getFocusLabel(item) }}
                    </span>
                  </div>
                </div>

                <div v-if="summary.coach.outputCoach?.focusAreas?.length" class="coach-block">
                  <p :class="['coach-label', isDark ? 'text-gray-400' : 'text-gray-500']">输出层下一轮重点</p>
                  <div class="coach-chip-row">
                    <span v-for="item in summary.coach.outputCoach.focusAreas" :key="item" :class="['coach-chip warn', isDark ? 'dark' : 'light']">
                      {{ getFocusLabel(item) }}
                    </span>
                  </div>
                </div>

                <div v-if="summary.coach.outputCoach?.weakWords?.length" class="coach-block">
                  <p :class="['coach-label', isDark ? 'text-gray-400' : 'text-gray-500']">建议重做的词</p>
                  <div class="coach-weak-list">
                    <div
                      v-for="item in summary.coach.outputCoach.weakWords"
                      :key="item.word"
                      :class="['coach-weak-card', isDark ? 'dark' : 'light']"
                    >
                      <p :class="['text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900']">{{ item.word }}</p>
                      <p :class="['text-xs mt-2 leading-6', isDark ? 'text-gray-400' : 'text-gray-600']">问题：{{ item.reason }}</p>
                      <p :class="['text-xs mt-1 leading-6', isDark ? 'text-rose-300/80' : 'text-rose-700']">建议：{{ item.nextStep }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="remediationSummary" class="coach-panel">
              <p :class="['text-xs font-semibold uppercase tracking-wider mb-3', isDark ? 'text-gray-400' : 'text-gray-500']">
                Retry Gate
              </p>
              <div :class="['coach-card', isDark ? 'dark' : 'light']">
                <p :class="['text-sm font-semibold leading-7', isDark ? 'text-white' : 'text-slate-900']">
                  {{ remediationSummary.sessionPassed ? '这轮补救已过关。' : '这轮补救还没完全过关。' }}
                </p>
                <p :class="['text-sm mt-3 leading-7', isDark ? 'text-gray-400' : 'text-gray-600']">
                  过关规则：该词对应任务已提交，且结果达到“正确”或输出达到“可用/强”。当前通过 {{ remediationSummary.passedWords.length }}/{{ remediationSummary.targetWords.length }}，通过率 {{ remediationSummary.passRate }}%。
                </p>

                <div v-if="remediationSummary.passedWords.length" class="coach-block">
                  <p :class="['coach-label', isDark ? 'text-gray-400' : 'text-gray-500']">已过关</p>
                  <div class="coach-chip-row">
                    <span v-for="word in remediationSummary.passedWords" :key="word" :class="['coach-chip success', isDark ? 'dark' : 'light']">
                      {{ word }}
                    </span>
                  </div>
                </div>

                <div v-if="remediationSummary.remainingWords.length" class="coach-block">
                  <p :class="['coach-label', isDark ? 'text-gray-400' : 'text-gray-500']">还没过关</p>
                  <div class="coach-chip-row">
                    <span v-for="word in remediationSummary.remainingWords" :key="word" :class="['coach-chip warn', isDark ? 'dark' : 'light']">
                      {{ word }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="summary-actions">
              <button
                v-if="retryActionBundles.length"
                @click="handleRetryWeakWords"
                :class="[
                  'flex-1 py-4 rounded-2xl font-semibold transition-all active:scale-[0.98]',
                  isDark
                    ? 'bg-amber-500/15 border border-amber-500/20 text-amber-300 hover:border-amber-400/40'
                    : 'bg-amber-50 border border-amber-200 text-amber-700 hover:border-amber-300'
                ]"
              >
                {{ remediationSummary?.remainingWords?.length ? '继续修剩余词' : '重练薄弱词' }}
              </button>
              <button
                @click="handleRestart"
                :class="[
                  'flex-1 py-4 rounded-2xl font-semibold transition-all active:scale-[0.98]',
                  'bg-rose-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02]'
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
            <span :class="['hero-badge hero-badge-rose', isDark ? 'dark' : 'light']">
              Exam Drills
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
              考试模拟练习。
            </h1>
            <p :class="['hero-description', isDark ? 'text-gray-400' : 'text-gray-600']">
              混合题型训练：阅读改写、听力转述、写作论证、口语框架。在考试压力下运用词汇。
            </p>
          </div>

          <div v-if="lastSessionSummary" :class="['last-summary last-summary-rose', isDark ? 'dark' : 'light']">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-500/15 text-rose-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p :class="['text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900']">
                上次练习 {{ lastSessionSummary.totalItems }} 题 · 正确率 {{ lastSessionSummary.accuracy }}%
              </p>
            </div>
          </div>
        </div>

        <div class="hero-actions">
          <button
            @click="startSession"
            class="btn-primary-rose w-full sm:w-auto"
            :disabled="!hasEligibleBundles"
          >
            开始 8 题练习
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
          <div class="stat-value text-rose-500">{{ eligibleBundles.length }}</div>
          <div class="stat-label">可练习</div>
        </div>
        <div :class="['stat-card', isDark ? 'dark' : 'light']">
          <div class="stat-value text-pink-500">{{ history.sessions }}</div>
          <div class="stat-label">累计轮次</div>
        </div>
        <div :class="['stat-card', isDark ? 'dark' : 'light']">
          <div class="stat-value text-red-500">{{ history.totalItems }}</div>
          <div class="stat-label">完成题目</div>
        </div>
        <div :class="['stat-card', isDark ? 'dark' : 'light']">
          <div class="stat-value text-emerald-500">{{ history.accuracy }}%</div>
          <div class="stat-label">历史正确率</div>
        </div>
      </div>

      <!-- Session Size Selector -->
      <section v-if="hasEligibleBundles" :class="['content-card', isDark ? 'dark' : 'light']">
        <div class="section-heading">
          <div>
            <h2 class="section-title">练习设置</h2>
            <p class="section-description">选择本轮题目数量。</p>
          </div>
        </div>

        <div class="size-grid">
          <button
            v-for="option in sizeOptions"
            :key="option.value"
            @click="sessionSize = option.value"
            :class="[
              'size-card',
              sessionSize === option.value ? 'active' : '',
              isDark ? 'dark' : 'light'
            ]"
          >
            <div class="size-card-head">
              <span class="size-card-value">{{ option.value }}</span>
              <span class="size-card-unit">题</span>
            </div>
            <div class="size-card-label">{{ option.label }}</div>
          </button>
        </div>

        <div :class="['insight-panel', isDark ? 'dark' : 'light']">
          <div class="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p :class="['text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900']">
                题型说明
              </p>
              <p :class="['text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-600']">
                阅读改写 · 听力转述 · 写作论证 · 口语框架
              </p>
            </div>
            <button @click="startSession" class="btn-primary-rose">
              立即开始
            </button>
          </div>
        </div>
      </section>

      <!-- Empty State -->
      <section v-else :class="['empty-card', isDark ? 'dark' : 'light']">
        <div class="empty-icon empty-icon-rose">
          <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 :class="['text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900']">
          当前词库没有足够的练习素材
        </h2>
        <p :class="['max-w-2xl text-sm leading-7', isDark ? 'text-gray-400' : 'text-gray-600']">
          请先切换到 IELTS Foundation 或 Topic Pack 词库，这些词库已包含完整的语境和改写素材。
        </p>
        <button @click="$emit('back')" class="btn-primary-rose">
          返回学习路径
        </button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from '../../composables/useTheme.js'
import ExamDrillCard from './ExamDrillCard.vue'
import {
  createExamDrillEngine,
  getExamDrillHistory,
  saveExamDrillToHistory,
  SURFACE_LABELS,
  getTopicLabel
} from '../../utils/examDrillEngine.js'
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
const sessionSize = ref(8)
const lastSessionSummary = ref(null)
const history = ref(loadHistory())
const isRetrySession = ref(false)
const retryTargetWords = ref([])

// Engine
let engine = null

// Reactive state from engine
const currentIndex = ref(0)
const totalItems = ref(8)
const currentTask = ref(null)
const showSummary = ref(false)
const summary = ref(null)

// Size options
const sizeOptions = [
  { value: 5, label: '快速' },
  { value: 8, label: '标准' },
  { value: 12, label: '完整' }
]

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
    (b.contexts?.length > 0 || b.paraphrases?.length > 0)
  )
})

const hasEligibleBundles = computed(() => eligibleBundles.value.length > 0)

const progress = computed(() => {
  if (totalItems.value === 0) return 0
  return Math.round(((currentIndex.value + 1) / totalItems.value) * 100)
})

const currentSurfaceType = computed(() => {
  return currentTask.value?.surfaceType || null
})

const surfaceStats = computed(() => {
  const stats = {}
  Object.keys(SURFACE_LABELS).forEach(type => {
    stats[type] = {
      label: SURFACE_LABELS[type],
      total: 0,
      completed: 0
    }
  })

  if (engine?.state?.items) {
    engine.state.items.forEach((item, idx) => {
      const type = item.surfaceType
      if (stats[type]) {
        stats[type].total++
        if (idx < currentIndex.value || (idx === currentIndex.value && showSummary.value)) {
          stats[type].completed++
        }
      }
    })
  }

  return stats
})

const retryBundles = computed(() => {
  const weakWords = summary.value?.coach?.outputCoach?.weakWords || []
  if (!weakWords.length) return []

  const weakWordSet = new Set(weakWords.map(item => item.word))
  return eligibleBundles.value.filter(bundle => weakWordSet.has(bundle.word))
})

const remediationSummary = computed(() => {
  if (!isRetrySession.value || !summary.value || !retryTargetWords.value.length) return null

  const resultsByWord = retryTargetWords.value.map(word => ({
    word,
    attempts: (summary.value.results || []).filter(result => result.word === word)
  }))

  const passedWords = resultsByWord
    .filter(({ attempts }) =>
      attempts.some(result =>
        result.submitted && (
          result.feedback
            ? ['usable', 'strong'].includes(result.feedback.band)
            : result.correct
        )
      )
    )
    .map(item => item.word)

  const remainingWords = retryTargetWords.value.filter(word => !passedWords.includes(word))

  return {
    targetWords: retryTargetWords.value,
    passedWords,
    remainingWords,
    passRate: retryTargetWords.value.length
      ? Math.round((passedWords.length / retryTargetWords.value.length) * 100)
      : 0,
    sessionPassed: remainingWords.length === 0
  }
})

const retryActionBundles = computed(() => {
  if (remediationSummary.value?.remainingWords?.length) {
    const remainingSet = new Set(remediationSummary.value.remainingWords)
    return eligibleBundles.value.filter(bundle => remainingSet.has(bundle.word))
  }

  return retryBundles.value
})

// Methods
function loadHistory() {
  const raw = getExamDrillHistory()
  const totalItems = raw.totalItems || 0
  const totalCorrect = raw.totalCorrect || 0

  return {
    ...raw,
    accuracy: totalItems > 0 ? Math.round((totalCorrect / totalItems) * 100) : 0
  }
}

function startSession(customBundles = null, meta = {}) {
  const sourceBundles = Array.isArray(customBundles) && customBundles.length
    ? customBundles
    : eligibleBundles.value

  if (!sourceBundles.length) return

  isRetrySession.value = Boolean(meta.retry)
  retryTargetWords.value = isRetrySession.value ? sourceBundles.map(bundle => bundle.word) : []

  // Create engine
  engine = createExamDrillEngine(sourceBundles, {
    sessionSize: Math.min(sessionSize.value, sourceBundles.length),
    mode: isRetrySession.value ? 'remediation' : 'standard'
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
  totalItems.value = engine.state.items.length
  currentTask.value = engine.currentTask()
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
  const hasMore = engine.nextTask()

  if (!hasMore) {
    // Session complete
    summary.value = engine.getSummary()
    showSummary.value = true
    currentTask.value = null

    // Save to history
    saveExamDrillToHistory(summary.value)
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
  if (!retryActionBundles.value.length) return
  startSession(retryActionBundles.value, { retry: true })
}

function surfaceLabel(type) {
  return SURFACE_LABELS[type] || type
}

function exitSession() {
  currentMode.value = null
  showSummary.value = false
  summary.value = null
  currentTask.value = null
  engine = null
  isRetrySession.value = false
  retryTargetWords.value = []
  history.value = loadHistory()
}

// Initialize
onMounted(() => {
  history.value = loadHistory()
})
</script>

<style scoped>
.exam-drills {
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

.hero-badge-rose.dark {
  @apply bg-rose-500/10 border-rose-500/20 text-rose-400;
}

.hero-badge-rose.light {
  @apply bg-rose-50 border-rose-200 text-rose-700;
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
.btn-primary-rose {
  @apply px-6 py-3 rounded-2xl bg-rose-600 text-white font-semibold shadow-lg shadow-rose-500/25 transition-all;
}

.btn-primary-rose:hover {
  @apply shadow-rose-500/40 scale-[1.02];
}

.btn-primary-rose:disabled {
  @apply opacity-50 cursor-not-allowed shadow-none;
  transform: none;
}

.btn-secondary {
  @apply px-6 py-3 rounded-2xl font-semibold border transition-all;
}

.btn-secondary.dark {
  @apply bg-white/5 border-white/10 text-gray-300 hover:border-rose-500/30 hover:text-rose-400;
}

.btn-secondary.light {
  @apply bg-gray-100 border-gray-200 text-gray-700 hover:border-rose-500/30 hover:text-rose-600;
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

.last-summary-rose.dark {
  @apply bg-rose-500/5 border-rose-500/10;
}

.last-summary-rose.light {
  @apply bg-rose-50 border-rose-200;
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

/* Size Grid */
.size-grid {
  @apply grid grid-cols-3 gap-3 mb-6;
}

.size-card {
  @apply w-full min-h-[100px] rounded-2xl border px-4 py-4 text-left transition-all flex flex-col justify-between items-start;
}

.size-card.dark {
  @apply bg-slate-900/50 border-white/10 text-gray-300;
}

.size-card.light {
  @apply bg-gray-50 border-gray-200 text-gray-700;
}

.size-card.active {
  @apply border-rose-500/40 bg-rose-500/10;
}

.size-card-head {
  @apply flex items-end gap-2 leading-none;
}

.size-card-value {
  @apply text-3xl font-black text-rose-500;
}

.size-card-unit {
  @apply text-sm font-semibold text-gray-500 mb-1 whitespace-nowrap;
}

.size-card-label {
  @apply text-sm font-medium whitespace-nowrap;
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

.empty-icon-rose {
  @apply bg-rose-500/10 text-rose-500;
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
  @apply mx-auto w-16 h-16 rounded-2xl flex items-center justify-center bg-rose-500/15 text-rose-500 mb-4;
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

.surface-stats,
.topic-stats {
  @apply mb-6;
}

.surface-chips,
.topic-chips {
  @apply flex flex-wrap gap-2 justify-center;
}

.surface-chip,
.topic-chip {
  @apply px-3 py-1.5 rounded-xl text-sm border;
}

.surface-chip.dark,
.topic-chip.dark {
  @apply bg-slate-900/40 border-white/5 text-gray-300;
}

.surface-chip.light,
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
