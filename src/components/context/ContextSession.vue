<template>
  <div class="context-session animate-slide-right">
    <!-- Progress Bar -->
    <div class="progress-section mb-6">
      <div class="flex items-center justify-between mb-2">
        <span :class="['text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600']">
          Context-first Session
        </span>
        <span :class="['text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600']">
          {{ currentIndex + 1 }} / {{ totalBundles }}
        </span>
      </div>
      <div :class="['h-2 rounded-full overflow-hidden', isDark ? 'bg-slate-700' : 'bg-gray-200']">
        <div
          class="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
          :style="{ width: `${progress}%` }"
        />
      </div>
      <!-- Task indicators -->
      <div class="flex gap-1 mt-3 justify-center">
        <span
          v-for="(task, idx) in taskLabels"
          :key="idx"
          :class="[
            'px-2 py-1 text-xs rounded-full transition-all',
            currentTask === task.type
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : completedTasks.includes(task.type)
                ? 'bg-emerald-500/10 text-emerald-400/50'
                : isDark ? 'bg-slate-800 text-gray-500' : 'bg-gray-100 text-gray-400'
          ]"
        >
          {{ task.label }}
        </span>
      </div>
    </div>

    <!-- Content Area -->
    <div class="session-content">
      <!-- Context Preview -->
      <ContextPromptCard
        v-if="currentTask === 'context_preview'"
        :bundle="currentBundle"
        :context="currentContext"
        @continue="handleContextContinue"
      />

      <!-- Meaning Choice -->
      <MeaningChoice
        v-else-if="currentTask === 'meaning_choice'"
        :bundle="currentBundle"
        :options="meaningOptions"
        @answer="handleMeaningAnswer"
      />

      <!-- Paraphrase Match -->
      <ParaphraseMatch
        v-else-if="currentTask === 'paraphrase_match'"
        :bundle="currentBundle"
        :options="paraphraseOptions"
        @answer="handleParaphraseAnswer"
      />

      <!-- Micro Output -->
      <MicroOutput
        v-else-if="currentTask === 'micro_output'"
        :bundle="currentBundle"
        :prompt="outputPrompt"
        @submit="handleOutputSubmit"
        @skip="handleOutputSkip"
      />

      <!-- Feedback -->
      <FeedbackCard
        v-else-if="currentTask === 'feedback'"
        :bundle="currentBundle"
        :result="currentResult"
        @next="handleNext"
      />

      <!-- Summary -->
      <SessionSummary
        v-else-if="currentTask === 'summary'"
        :summary="summary"
        :remediation-summary="remediationSummary"
        :is-retry-session="isRetrySession"
        @restart="handleRestart"
        @retry-remediation="handleRetryRemediation"
        @exit="handleExit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTheme } from '../../composables/useTheme.js'
import {
  createContextSessionEngine,
  TASK_TYPES,
  saveContextSessionToHistory
} from '../../utils/contextSessionEngine.js'
import { evaluateProductionAttempt } from '../../utils/learningCoach.js'
import ContextPromptCard from './ContextPromptCard.vue'
import MeaningChoice from './MeaningChoice.vue'
import ParaphraseMatch from './ParaphraseMatch.vue'
import MicroOutput from './MicroOutput.vue'
import FeedbackCard from './FeedbackCard.vue'
import SessionSummary from './SessionSummary.vue'

const { isDark } = useTheme()

const props = defineProps({
  bundles: {
    type: Array,
    required: true
  },
  sessionSize: {
    type: Number,
    default: 5
  },
  currentVocab: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['complete', 'exit'])

// Engine
let engine = null

// Reactive state
const currentIndex = ref(0)
const currentTask = ref(TASK_TYPES.CONTEXT_PREVIEW)
const totalBundles = ref(5)
const currentBundle = ref(null)
const currentContext = ref(null)
const meaningOptions = ref([])
const paraphraseOptions = ref([])
const outputPrompt = ref(null)
const currentResult = ref(null)
const summary = ref(null)
const completedTasks = ref([])
const isRetrySession = ref(false)
const retryTargetWords = ref([])

// Task labels for progress
const taskLabels = [
  { type: TASK_TYPES.CONTEXT_PREVIEW, label: '语境' },
  { type: TASK_TYPES.MEANING_CHOICE, label: '释义' },
  { type: TASK_TYPES.PARAPHRASE_MATCH, label: '改写' },
  { type: TASK_TYPES.MICRO_OUTPUT, label: '输出' }
]

// Progress percentage
const progress = computed(() => {
  if (!engine || totalBundles.value === 0) return 0
  const bundleProgress = (currentIndex.value / totalBundles.value) * 100
  return Math.min(100, Math.round(bundleProgress))
})

const remediationSummary = computed(() => {
  if (!summary.value) return null

  const targetWords = (isRetrySession.value && retryTargetWords.value.length
    ? retryTargetWords.value
    : (summary.value.results || []).map(result => result.word)
  ).filter(Boolean)

  if (!targetWords.length) return null

  const resultMap = new Map((summary.value.results || []).map(result => [result.word, result]))
  const passedWords = targetWords.filter(word => {
    const result = resultMap.get(word)
    return Boolean(result?.meaningCorrect && result?.paraphraseCorrect && result?.outputSubmitted)
  })
  const remainingWords = targetWords.filter(word => !passedWords.includes(word))

  return {
    targetWords,
    passedWords,
    remainingWords,
    passRate: targetWords.length ? Math.round((passedWords.length / targetWords.length) * 100) : 0,
    sessionPassed: remainingWords.length === 0
  }
})

const retryActionBundles = computed(() => {
  if (remediationSummary.value?.remainingWords?.length) {
    const remainingSet = new Set(remediationSummary.value.remainingWords)
    return props.bundles.filter(bundle => remainingSet.has(bundle.word))
  }
  return []
})

// Initialize engine
function initEngine(sourceBundles = props.bundles, meta = {}) {
  const bundles = Array.isArray(sourceBundles) ? sourceBundles : props.bundles
  isRetrySession.value = Boolean(meta.retry)
  retryTargetWords.value = isRetrySession.value ? bundles.map(bundle => bundle.word) : []

  engine = createContextSessionEngine(bundles, {
    sessionSize: Math.min(props.sessionSize, bundles.length || props.sessionSize)
  })
  syncState()
}

// Sync state from engine
function syncState() {
  if (!engine) return
  currentIndex.value = engine.state.currentIndex
  currentTask.value = engine.state.currentTask
  totalBundles.value = engine.state.bundles.length
  currentBundle.value = engine.currentBundle()
  currentContext.value = engine.currentContext()
  meaningOptions.value = engine.generateMeaningOptions() || []
  paraphraseOptions.value = engine.generateParaphraseOptions() || []
  outputPrompt.value = engine.getMicroOutputPrompt()

  // Track completed tasks for current bundle
  const currentBundleId = currentBundle.value?.id || currentBundle.value?.bundleId || currentBundle.value?.word
  const result = engine.state.results.find(r => r.bundleId === currentBundleId)
  if (result) {
    completedTasks.value = []
    if (result.meaningCorrect !== undefined) completedTasks.value.push(TASK_TYPES.MEANING_CHOICE)
    if (result.paraphraseCorrect !== undefined) completedTasks.value.push(TASK_TYPES.PARAPHRASE_MATCH)
    if (result.outputSubmitted !== undefined) completedTasks.value.push(TASK_TYPES.MICRO_OUTPUT)
  } else {
    completedTasks.value = []
  }
}

// Handle context preview continue
function handleContextContinue() {
  completedTasks.value.push(TASK_TYPES.CONTEXT_PREVIEW)
  advanceToNextTask()
}

// Handle meaning answer
function handleMeaningAnswer(data) {
  engine.recordResult(TASK_TYPES.MEANING_CHOICE, data)
  completedTasks.value.push(TASK_TYPES.MEANING_CHOICE)
  currentResult.value = {
    ...currentResult.value,
    meaningCorrect: data.correct
  }
  advanceToNextTask()
}

// Handle paraphrase answer
function handleParaphraseAnswer(data) {
  engine.recordResult(TASK_TYPES.PARAPHRASE_MATCH, data)
  completedTasks.value.push(TASK_TYPES.PARAPHRASE_MATCH)
  currentResult.value = {
    ...currentResult.value,
    paraphraseCorrect: data.correct
  }
  advanceToNextTask()
}

// Handle output submit
function handleOutputSubmit(data) {
  const outputFeedback = evaluateProductionAttempt({
    text: data.text || '',
    word: currentBundle.value?.word || '',
    collocations: currentBundle.value?.collocations || [],
    paraphrase: currentBundle.value?.paraphrases?.[0] || '',
    promptType: outputPrompt.value?.mode === 'speaking' ? 'speaking' : 'sentence',
    topic: currentBundle.value?.topic || 'general'
  })

  engine.recordResult(TASK_TYPES.MICRO_OUTPUT, {
    ...data,
    feedback: outputFeedback
  })
  completedTasks.value.push(TASK_TYPES.MICRO_OUTPUT)
  currentResult.value = {
    ...currentResult.value,
    outputSubmitted: data.submitted,
    outputText: data.text,
    outputFeedback
  }
  advanceToNextTask()
}

// Handle output skip
function handleOutputSkip() {
  engine.recordResult(TASK_TYPES.MICRO_OUTPUT, { submitted: false, text: '', time: 0 })
  completedTasks.value.push(TASK_TYPES.MICRO_OUTPUT)
  advanceToNextTask()
}

// Handle next button
function handleNext() {
  completedTasks.value = []
  currentResult.value = null
  advanceToNextTask()
}

// Advance to next task
function advanceToNextTask() {
  const newTask = engine.nextTask()
  syncState()

  if (newTask === TASK_TYPES.SUMMARY) {
    summary.value = engine.getSummary()
    saveContextSessionToHistory(summary.value, {
      vocabId: props.currentVocab?.id || 'unknown',
      topic: props.currentVocab?.topic || 'general',
      trackType: props.currentVocab?.ieltsTrackType || 'foundation'
    })
    emit('complete', summary.value)
  }
}

// Handle restart
function handleRestart() {
  engine.reset()
  completedTasks.value = []
  currentResult.value = null
  summary.value = null
  syncState()
}

function handleRetryRemediation() {
  if (!retryActionBundles.value.length) return
  completedTasks.value = []
  currentResult.value = null
  summary.value = null
  initEngine(retryActionBundles.value, { retry: true })
}

// Handle exit
function handleExit() {
  isRetrySession.value = false
  retryTargetWords.value = []
  emit('exit')
}

// Initialize on mount
onMounted(() => {
  initEngine()
})

// Watch for bundle changes
watch(() => props.bundles, () => {
  initEngine()
}, { deep: true })
</script>

<style scoped>
.context-session {
  @apply w-full max-w-3xl mx-auto;
}

.session-content {
  @apply min-h-[50vh];
}
</style>
