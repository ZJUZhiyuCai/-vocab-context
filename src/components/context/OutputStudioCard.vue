<template>
  <div class="output-studio-card">
    <!-- Glass Card -->
    <div class="group relative">
      <!-- Glow Effect -->
      <div class="absolute -inset-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-[28px] opacity-15 group-hover:opacity-25 blur-xl transition-all duration-500"></div>

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
              isDark ? 'bg-violet-500/10 border border-violet-500/20 text-violet-400' : 'bg-violet-100 border border-violet-300 text-violet-700'
            ]">
              {{ promptTypeLabel }}
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

        <!-- Word & Sense -->
        <div class="mb-6">
          <h2 :class="['text-3xl font-black mb-2', isDark ? 'text-white' : 'text-slate-900']">
            {{ task.word }}
          </h2>
          <p :class="['text-sm leading-7', isDark ? 'text-gray-300' : 'text-gray-600']">
            {{ task.sense }}
          </p>
        </div>

        <!-- Collocations -->
        <div v-if="task.collocations && task.collocations.length > 0" class="mb-6">
          <p :class="['text-xs font-semibold uppercase tracking-wider mb-2', isDark ? 'text-gray-400' : 'text-gray-500']">
            常用搭配
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(colloc, idx) in task.collocations"
              :key="idx"
              :class="[
                'px-3 py-1.5 rounded-xl text-sm font-medium border',
                isDark
                  ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'
                  : 'bg-cyan-50 border-cyan-200 text-cyan-700'
              ]"
            >
              {{ colloc }}
            </span>
          </div>
        </div>

        <!-- Paraphrase Hint -->
        <div v-if="task.paraphrase" class="mb-6">
          <p :class="['text-xs font-semibold uppercase tracking-wider mb-2', isDark ? 'text-gray-400' : 'text-gray-500']">
            同义替换
          </p>
          <div :class="[
            'inline-flex items-center px-4 py-2 rounded-xl border',
            isDark
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
              : 'bg-amber-50 border-amber-200 text-amber-700'
          ]">
            <span class="text-sm font-medium">{{ task.paraphrase }}</span>
          </div>
        </div>

        <!-- Reference Context -->
        <div v-if="task.referenceContext" :class="['p-4 rounded-xl border mb-6', isDark ? 'bg-slate-700/30 border-white/5' : 'bg-gray-50 border-gray-200']">
          <p :class="['text-xs font-medium mb-1', isDark ? 'text-gray-400' : 'text-gray-600']">例句参考：</p>
          <p :class="['text-sm leading-7', isDark ? 'text-gray-300' : 'text-gray-700']">
            {{ task.referenceContext.text }}
          </p>
        </div>

        <!-- Prompt Instruction -->
        <div class="mb-6">
          <p :class="['text-xs font-semibold uppercase tracking-wider mb-3', isDark ? 'text-gray-400' : 'text-gray-500']">
            产出任务
          </p>
          <div :class="['p-4 rounded-xl border', isDark ? 'bg-violet-500/5 border-violet-500/10' : 'bg-violet-50 border-violet-200']">
            <p :class="['text-sm leading-7', isDark ? 'text-violet-200/80' : 'text-violet-800']">
              {{ task.prompt?.instruction || '用这个词写一个句子。' }}
            </p>
            <p v-if="task.prompt?.hint" :class="['text-xs mt-2', isDark ? 'text-violet-400/60' : 'text-violet-600']">
              {{ task.prompt.hint }}
            </p>
          </div>
        </div>

        <!-- Text Area -->
        <div class="mb-6">
          <textarea
            v-model="outputText"
            :placeholder="placeholderText"
            rows="4"
            :class="[
              'w-full p-5 rounded-2xl border text-base leading-7 resize-none transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/50',
              isDark
                ? 'bg-slate-700/50 border-white/10 text-white placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            ]"
          ></textarea>
          <div class="flex items-center justify-between mt-2">
            <p :class="['text-xs', isDark ? 'text-gray-500' : 'text-gray-500']">
              {{ outputText.length }} 字符
            </p>
            <p v-if="task.prompt?.mode === 'speaking'" :class="['text-xs', isDark ? 'text-gray-500' : 'text-gray-500']">
              口语任务：可练习口述或记录要点
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
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
            @click="handleSubmit"
            :disabled="!outputText.trim()"
            :class="[
              'flex-1 py-4 rounded-2xl font-semibold shadow-lg transition-all active:scale-[0.98]',
              outputText.trim()
                ? 'bg-violet-600 text-white shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02]'
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
import { getTopicLabel } from '../../utils/outputStudioEngine.js'

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
    default: 5
  }
})

const emit = defineEmits(['submit', 'skip'])

const outputText = ref('')
const startTime = ref(Date.now())

const promptTypeLabel = computed(() => {
  const type = props.task?.promptType || 'sentence'
  const labels = {
    sentence: '写作句子',
    speaking: '口语框架',
    rewrite: '改写练习'
  }
  return labels[type] || '产出练习'
})

const topicLabel = computed(() => {
  return getTopicLabel(props.task?.topic)
})

const placeholderText = computed(() => {
  const word = props.task?.word || '...'
  const type = props.task?.promptType || 'sentence'

  if (type === 'speaking') {
    return `用 ${word} 准备口语回答要点...`
  }

  if (type === 'rewrite') {
    return `用 ${word} 进行改写...`
  }

  return `用 ${word} 写一个句子...`
})

function handleSubmit() {
  if (!outputText.value.trim()) return

  emit('submit', {
    submitted: true,
    text: outputText.value.trim(),
    time: Date.now() - startTime.value,
    promptType: props.task?.promptType
  })

  // 重置状态
  outputText.value = ''
  startTime.value = Date.now()
}

function handleSkip() {
  emit('skip', {
    submitted: false,
    text: '',
    time: 0,
    promptType: props.task?.promptType
  })

  // 重置状态
  outputText.value = ''
  startTime.value = Date.now()
}
</script>

<style scoped>
.output-studio-card {
  @apply w-full;
}
</style>