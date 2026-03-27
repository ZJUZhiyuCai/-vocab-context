<template>
  <div class="spelling-question">
    <!-- 释义展示 -->
    <div :class="['meaning-display', isDark ? 'dark' : 'light']">
      <div class="flex justify-center mb-6 text-emerald-400">
        <svg
          class="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </div>
      <h2 :class="['meaning-text', isDark ? 'text-white' : 'text-slate-800']">
        {{ word.meaning }}
      </h2>
      <div
        v-if="word.example"
        class="example-text"
      >
        <div class="inline-flex items-center gap-2 text-slate-500 mb-2">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          /></svg>
          <span class="text-xs font-bold uppercase tracking-wider">句子示例</span>
        </div>
        <p>{{ word.example }}</p>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <input
        ref="inputRef"
        v-model="inputValue"
        type="text"
        :class="['spelling-input', isDark ? 'dark' : 'light', { 'correct': answered && isCorrect, 'wrong': answered && !isCorrect }]"
        :disabled="answered"
        placeholder="输入单词拼写..."
        @keyup.enter="handleSubmit"
      >
      <button
        v-if="!answered"
        class="premium-btn px-8"
        :disabled="!inputValue.trim()"
        @click="handleSubmit"
      >
        提交
      </button>
    </div>

    <!-- 反馈信息 -->
    <div
      v-if="answered"
      class="feedback-area"
    >
      <div
        v-if="isCorrect"
        class="feedback-correct rounded-2xl p-4 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="ml-2 font-bold text-lg">太棒了，正确答案！</span>
      </div>
      <div
        v-else
        class="feedback-wrong rounded-2xl p-4 border border-rose-500/20 bg-rose-500/10 text-rose-400"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div class="ml-2">
          <span class="font-bold text-lg">拼写错误</span>
          <div class="text-sm mt-1 opacity-80">
            正确答案：<span class="font-bold text-slate-200">{{ word.word }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 提示 -->
    <div
      v-if="!answered"
      class="hint-area"
    >
      <span class="text-xs text-slate-500 font-bold uppercase tracking-widest">
        按 ENTER 键快速提交
      </span>
    </div>
    <div
      v-else
      class="hint-area"
    >
      <span class="text-xs text-emerald-400 font-bold uppercase tracking-widest">
        按 SPACE 或 ENTER 键继续
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useTheme } from '../../composables/useTheme.js'

const { isDark } = useTheme()

const props = defineProps({
  word: {
    type: Object,
    required: true
  },
  answered: {
    type: Boolean,
    default: false
  },
  userInput: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['input', 'submit'])

const inputRef = ref(null)
const inputValue = ref('')

// 是否正确
const isCorrect = computed(() => {
  return inputValue.value.toLowerCase().trim() === props.word.word.toLowerCase()
})

// 监听userInput prop变化
watch(() => props.userInput, (newValue) => {
  inputValue.value = newValue
})

// 监听inputValue变化
watch(inputValue, (newValue) => {
  emit('input', newValue)
})

// 提交答案
const handleSubmit = () => {
  if (!inputValue.value.trim() || props.answered) return
  emit('submit')
}

// 聚焦输入框
const focus = () => {
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// 暴露focus方法
defineExpose({ focus })

// 自动聚焦
watch(() => props.word, () => {
  inputValue.value = ''
  focus()
}, { immediate: true })
</script>

<style scoped>
.spelling-question {
  @apply space-y-6;
}

.meaning-display {
  @apply text-center pb-8 border-b;
}

.meaning-display.dark {
  @apply border-white/5;
}

.meaning-display.light {
  @apply border-gray-200;
}

.meaning-text {
  @apply text-3xl font-black mb-6 tracking-tight;
}

.example-text {
  @apply text-xl italic leading-relaxed;
}

.meaning-display.dark .example-text {
  @apply text-slate-300;
}

.meaning-display.light .example-text {
  @apply text-slate-600;
}

.input-area {
  @apply flex gap-3 items-center;
}

.spelling-input {
  @apply flex-1 px-6 py-4 text-2xl border-2 rounded-2xl font-mono text-center;
  @apply focus:outline-none;
  @apply disabled:cursor-default;
  @apply transition-all duration-300;
}

.spelling-input.dark {
  @apply bg-slate-900 border-white/5 text-white;
  @apply focus:border-emerald-500/50 focus:bg-slate-800;
  @apply disabled:bg-slate-950;
}

.spelling-input.light {
  @apply bg-white border-gray-300 text-slate-800;
  @apply focus:border-emerald-500 focus:bg-emerald-50/50;
  @apply disabled:bg-gray-100;
}

.spelling-input.correct {
  @apply border-emerald-500 bg-emerald-500/5 text-emerald-400;
}

.spelling-input.wrong {
  @apply border-rose-500 bg-rose-500/5 text-rose-400;
}

.feedback-area {
  @apply p-4 rounded-lg;
}

.feedback-correct {
  @apply flex items-center bg-green-50 text-green-700;
}

.feedback-wrong {
  @apply flex items-center bg-red-50 text-red-700;
}

.hint-area {
  @apply text-center;
}
</style>
