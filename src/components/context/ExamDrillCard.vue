<template>
  <div class="exam-drill-card">
    <!-- Glass Card -->
    <div class="group relative">
      <!-- Glow Effect -->
      <div :class="[
        'absolute -inset-1 rounded-[28px] opacity-15 group-hover:opacity-25 blur-xl transition-all duration-500',
        glowGradient
      ]"></div>

      <!-- Card -->
      <div :class="[
        'relative backdrop-blur-xl border rounded-3xl p-6 md:p-8 shadow-2xl transform transition-all duration-500',
        isDark ? 'bg-slate-800/70 border-white/10' : 'bg-white/80 border-black/10 shadow-lg'
      ]">
        <!-- Header -->
        <div class="flex items-center justify-between gap-3 mb-6">
          <div class="flex items-center gap-3">
            <span :class="[
              'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold',
              surfaceBadgeClass
            ]">
              {{ surfaceLabel }}
            </span>
            <span v-if="task.topic" :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
              isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
            ]">
              {{ topicLabel }}
            </span>
          </div>
          <span :class="['text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-500']">
            {{ currentIndex + 1 }} / {{ total }}
          </span>
        </div>

        <!-- Reading Paraphrase Surface -->
        <div v-if="task.surfaceType === 'reading_paraphrase'" class="space-y-6">
          <div :class="['p-5 rounded-2xl border', isDark ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50 border-amber-200']">
            <p :class="['text-xs font-medium mb-2', isDark ? 'text-amber-400' : 'text-amber-600']">阅读语境</p>
            <p :class="['text-lg leading-8', isDark ? 'text-amber-100/90' : 'text-amber-900']">
              {{ task.context }}
            </p>
            <p v-if="task.contextTranslation" :class="['text-sm mt-2', isDark ? 'text-amber-300/50' : 'text-amber-700/70']">
              {{ task.contextTranslation }}
            </p>
          </div>

          <div>
            <p :class="['text-sm font-semibold mb-3', isDark ? 'text-white' : 'text-slate-900']">
              {{ task.question }}
            </p>
            <div class="space-y-3">
              <button
                v-for="(option, idx) in task.options"
                :key="option.id"
                @click="selectOption(option)"
                :disabled="selectedOption !== null"
                :class="[
                  'w-full p-4 rounded-2xl border text-left transition-all',
                  getOptionClass(option)
                ]"
              >
                <div class="flex items-center gap-3">
                  <span :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                    selectedOption?.id === option.id
                      ? option.isCorrect ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                      : isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  ]">
                    {{ String.fromCharCode(65 + idx) }}
                  </span>
                  <span :class="['text-base leading-7', isDark ? 'text-gray-200' : 'text-gray-800']">
                    {{ option.text }}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Listening Paraphrase Surface -->
        <div v-else-if="task.surfaceType === 'listening_paraphrase'" class="space-y-6">
          <div :class="['p-5 rounded-2xl border', isDark ? 'bg-cyan-500/5 border-cyan-500/10' : 'bg-cyan-50 border-cyan-200']">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <p :class="['text-xs font-medium', isDark ? 'text-cyan-400' : 'text-cyan-600']">听力文本（模拟）</p>
            </div>
            <p :class="['text-lg leading-8 italic', isDark ? 'text-cyan-100/90' : 'text-cyan-900']">
              "{{ task.transcript }}"
            </p>
            <p v-if="task.transcriptTranslation" :class="['text-sm mt-2', isDark ? 'text-cyan-300/50' : 'text-cyan-700/70']">
              {{ task.transcriptTranslation }}
            </p>
          </div>

          <div>
            <p :class="['text-sm font-semibold mb-3', isDark ? 'text-white' : 'text-slate-900']">
              {{ task.question }}
            </p>
            <div class="space-y-3">
              <button
                v-for="(option, idx) in task.options"
                :key="option.id"
                @click="selectOption(option)"
                :disabled="selectedOption !== null"
                :class="[
                  'w-full p-4 rounded-2xl border text-left transition-all',
                  getOptionClass(option)
                ]"
              >
                <div class="flex items-center gap-3">
                  <span :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                    selectedOption?.id === option.id
                      ? option.isCorrect ? 'bg-cyan-500 text-white' : 'bg-rose-500 text-white'
                      : isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  ]">
                    {{ String.fromCharCode(65 + idx) }}
                  </span>
                  <span :class="['text-base leading-7', isDark ? 'text-gray-200' : 'text-gray-800']">
                    {{ option.text }}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Writing Argument Surface -->
        <div v-else-if="task.surfaceType === 'writing_argument'" class="space-y-6">
          <div :class="['p-5 rounded-2xl border', isDark ? 'bg-violet-500/5 border-violet-500/10' : 'bg-violet-50 border-violet-200']">
            <p :class="['text-xs font-medium mb-2', isDark ? 'text-violet-400' : 'text-violet-600']">IELTS Writing Task 2 风格</p>
            <p :class="['text-lg leading-8', isDark ? 'text-violet-100/90' : 'text-violet-900']">
              {{ task.prompt }}
            </p>
          </div>

          <div class="mb-4">
            <p :class="['text-sm font-semibold mb-2', isDark ? 'text-white' : 'text-slate-900']">
              目标词汇
            </p>
            <div class="flex flex-wrap gap-2">
              <span :class="[
                'px-3 py-1.5 rounded-xl text-sm font-medium border',
                isDark ? 'bg-violet-500/10 border-violet-500/20 text-violet-300' : 'bg-violet-100 border-violet-200 text-violet-700'
              ]">
                {{ task.word }}
              </span>
              <span v-if="task.collocation && task.collocation !== task.word" :class="[
                'px-3 py-1.5 rounded-xl text-sm font-medium border',
                isDark ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300' : 'bg-cyan-100 border-cyan-200 text-cyan-700'
              ]">
                {{ task.collocation }}
              </span>
            </div>
          </div>

          <div :class="['p-4 rounded-xl border mb-4', isDark ? 'bg-slate-700/30 border-white/5' : 'bg-gray-50 border-gray-200']">
            <p :class="['text-sm', isDark ? 'text-gray-300' : 'text-gray-700']">
              {{ task.instruction }}
            </p>
          </div>

          <textarea
            v-model="outputText"
            :placeholder="`用 ${task.word} 写一句话...`"
            rows="3"
            :class="[
              'w-full p-4 rounded-2xl border text-base leading-7 resize-none transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/50',
              isDark
                ? 'bg-slate-700/50 border-white/10 text-white placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            ]"
          ></textarea>
          <p :class="['text-xs mt-1', isDark ? 'text-gray-500' : 'text-gray-500']">
            {{ outputText.length }} 字符
          </p>
        </div>

        <!-- Speaking Frame Surface -->
        <div v-else-if="task.surfaceType === 'speaking_frame'" class="space-y-6">
          <div :class="['p-5 rounded-2xl border', isDark ? 'bg-rose-500/5 border-rose-500/10' : 'bg-rose-50 border-rose-200']">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p :class="['text-xs font-medium', isDark ? 'text-rose-400' : 'text-rose-600']">IELTS Speaking 风格</p>
            </div>
            <p :class="['text-lg leading-8', isDark ? 'text-rose-100/90' : 'text-rose-900']">
              {{ task.prompt }}
            </p>
          </div>

          <div class="mb-4">
            <p :class="['text-sm font-semibold mb-2', isDark ? 'text-white' : 'text-slate-900']">
              目标词汇
            </p>
            <span :class="[
              'inline-flex px-3 py-1.5 rounded-xl text-sm font-medium border',
              isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' : 'bg-rose-100 border-rose-200 text-rose-700'
            ]">
              {{ task.word }}
            </span>
          </div>

          <div :class="['p-4 rounded-xl border mb-4', isDark ? 'bg-slate-700/30 border-white/5' : 'bg-gray-50 border-gray-200']">
            <p :class="['text-sm', isDark ? 'text-gray-300' : 'text-gray-700']">
              {{ task.instruction }}
            </p>
          </div>

          <textarea
            v-model="outputText"
            :placeholder="`准备口语回答要点...`"
            rows="3"
            :class="[
              'w-full p-4 rounded-2xl border text-base leading-7 resize-none transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/50',
              isDark
                ? 'bg-slate-700/50 border-white/10 text-white placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            ]"
          ></textarea>
          <p :class="['text-xs mt-1', isDark ? 'text-gray-500' : 'text-gray-500']">
            {{ outputText.length }} 字符
          </p>
        </div>

        <!-- Result Feedback (for choice tasks) -->
        <div v-if="showChoiceResult" class="mt-6">
          <div :class="[
            'p-4 rounded-xl border',
            selectedOption?.isCorrect
              ? isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
              : isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-200'
          ]">
            <p :class="['font-medium', selectedOption?.isCorrect ? 'text-emerald-400' : 'text-rose-400']">
              {{ selectedOption?.isCorrect ? '✓ 正确！' : '✗ 不正确' }}
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 mt-6">
          <button
            v-if="isChoiceTask"
            @click="handleSkip"
            :disabled="selectedOption !== null"
            :class="[
              'flex-1 py-4 rounded-2xl border font-semibold transition-all active:scale-[0.98]',
              selectedOption !== null ? 'opacity-50 cursor-not-allowed' : '',
              isDark
                ? 'bg-slate-700/50 border-white/10 text-gray-300 hover:border-gray-500'
                : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
            ]"
          >
            跳过
          </button>
          <button
            v-else
            @click="handleSkip"
            :class="[
              'flex-1 py-4 rounded-2xl border font-semibold transition-all active:scale-[0.98]',
              isDark
                ? 'bg-slate-700/50 border-white/10 text-gray-300 hover:border-gray-500'
                : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
            ]"
          >
            跳过
          </button>
          <button
            v-if="isChoiceTask"
            @click="handleSubmitChoice"
            :disabled="!selectedOption"
            :class="[
              'flex-1 py-4 rounded-2xl font-semibold shadow-lg transition-all active:scale-[0.98]',
              selectedOption
                ? 'bg-emerald-600 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02]'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            ]"
          >
            继续
          </button>
          <button
            v-else
            @click="handleSubmitOutput"
            :disabled="!outputText.trim()"
            :class="[
              'flex-1 py-4 rounded-2xl font-semibold shadow-lg transition-all active:scale-[0.98]',
              outputText.trim()
                ? 'bg-emerald-600 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02]'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            ]"
          >
            提交
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTheme } from '../../composables/useTheme.js'
import { SURFACE_LABELS, getTopicLabel } from '../../utils/examDrillEngine.js'

const { isDark } = useTheme()

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 8
  }
})

const emit = defineEmits(['submit', 'skip'])

const selectedOption = ref(null)
const outputText = ref('')
const startTime = ref(Date.now())

// Computed
const surfaceLabel = computed(() => {
  return SURFACE_LABELS[props.task?.surfaceType] || '任务'
})

const topicLabel = computed(() => {
  return getTopicLabel(props.task?.topic)
})

const isChoiceTask = computed(() => {
  return ['reading_paraphrase', 'listening_paraphrase'].includes(props.task?.surfaceType)
})

const showChoiceResult = computed(() => {
  return isChoiceTask.value && selectedOption.value !== null
})

const glowGradient = computed(() => {
  switch (props.task?.surfaceType) {
    case 'reading_paraphrase':
      return 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500'
    case 'listening_paraphrase':
      return 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500'
    case 'writing_argument':
      return 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500'
    case 'speaking_frame':
      return 'bg-gradient-to-r from-rose-500 via-pink-500 to-red-500'
    default:
      return 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500'
  }
})

const surfaceBadgeClass = computed(() => {
  switch (props.task?.surfaceType) {
    case 'reading_paraphrase':
      return isDark.value
        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
        : 'bg-amber-100 border border-amber-300 text-amber-700'
    case 'listening_paraphrase':
      return isDark.value
        ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
        : 'bg-cyan-100 border border-cyan-300 text-cyan-700'
    case 'writing_argument':
      return isDark.value
        ? 'bg-violet-500/10 border border-violet-500/20 text-violet-400'
        : 'bg-violet-100 border border-violet-300 text-violet-700'
    case 'speaking_frame':
      return isDark.value
        ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
        : 'bg-rose-100 border border-rose-300 text-rose-700'
    default:
      return isDark.value
        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
        : 'bg-emerald-100 border border-emerald-300 text-emerald-700'
  }
})

// Methods
function selectOption(option) {
  if (selectedOption.value) return
  selectedOption.value = option
}

function getOptionClass(option) {
  if (!selectedOption.value) {
    return isDark.value
      ? 'bg-slate-700/50 border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10'
      : 'bg-gray-50 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50'
  }

  if (option.id === selectedOption.value.id) {
    return option.isCorrect
      ? 'bg-emerald-500/20 border-emerald-500'
      : 'bg-rose-500/20 border-rose-500'
  }

  if (option.isCorrect && !selectedOption.value.isCorrect) {
    return isDark.value
      ? 'bg-emerald-500/10 border-emerald-500/30'
      : 'bg-emerald-50 border-emerald-300'
  }

  return isDark.value
    ? 'bg-slate-700/30 border-white/5 opacity-50'
    : 'bg-gray-50 border-gray-200 opacity-50'
}

function handleSubmitChoice() {
  if (!selectedOption.value) return

  emit('submit', {
    correct: selectedOption.value.isCorrect,
    submitted: true,
    time: Date.now() - startTime.value
  })

  // Reset
  selectedOption.value = null
  startTime.value = Date.now()
}

function handleSubmitOutput() {
  if (!outputText.value.trim()) return

  emit('submit', {
    correct: true,
    submitted: true,
    text: outputText.value.trim(),
    time: Date.now() - startTime.value
  })

  // Reset
  outputText.value = ''
  startTime.value = Date.now()
}

function handleSkip() {
  emit('skip', {
    correct: false,
    submitted: false,
    time: Date.now() - startTime.value
  })

  // Reset
  selectedOption.value = null
  outputText.value = ''
  startTime.value = Date.now()
}
</script>

<style scoped>
.exam-drill-card {
  @apply w-full;
}
</style>