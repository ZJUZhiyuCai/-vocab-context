<template>
  <div class="review-session animate-fade-in">
    <!-- 顶部进度条 -->
    <div class="session-header">
      <div class="header-info">
        <h2 :class="['text-xl font-bold flex items-center gap-2', isDark ? 'text-emerald-400' : 'text-emerald-600']">
          <svg
            v-if="mode === 'flashcard'"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          {{ mode === 'flashcard' ? '闪卡复习' : '拼写复习' }}
        </h2>
        <span :class="['text-sm', isDark ? 'text-gray-400' : 'text-gray-600']">{{ currentIndex + 1 }} / {{ words.length }}</span>
      </div>
      <button
        :class="['exit-button', isDark ? 'dark' : 'light']"
        @click="$emit('exit')"
      >
        退出
      </button>
    </div>

    <!-- 进度条 -->
    <div :class="['progress-bar', isDark ? 'dark' : 'light']">
      <div
        class="progress-fill"
        :style="{ width: progressPercent + '%' }"
      />
    </div>

    <!-- 闪卡模式 -->
    <div
      v-if="mode === 'flashcard'"
      class="content-area"
    >
      <FlashcardView
        :word="currentWord"
        :show-answer="showAnswer"
        :has-previous="currentIndex > 0"
        :has-next="currentIndex < words.length - 1"
        @toggle="toggleAnswer"
        @previous="previous"
        @next="next"
        @rate="handleRate"
      />
    </div>

    <!-- 拼写模式 -->
    <div
      v-else-if="mode === 'spelling'"
      class="content-area"
    >
      <SpellingQuestion
        :word="currentWord"
        :answered="answered"
        :user-input="userInput"
        @input="handleInput"
        @submit="handleSubmit"
      />
      <div
        v-if="answered"
        class="action-buttons"
      >
        <button
          class="btn btn-primary"
          @click="next"
        >
          {{ isLast ? '完成复习' : '下一个' }}
        </button>
      </div>
    </div>

    <!-- 完成页面 -->
    <div
      v-if="currentIndex >= words.length"
      class="completion-view"
    >
      <div class="text-center">
        <div class="mb-8 text-emerald-400 flex justify-center">
          <svg
            class="w-20 h-20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 :class="['text-3xl font-black mb-2 tracking-tight', isDark ? 'text-white' : 'text-slate-800']">
          复习完成！
        </h2>
        <p :class="['mb-8', isDark ? 'text-slate-400' : 'text-slate-600']">
          你复习了 {{ words.length }} 个单词
        </p>
        <button
          class="premium-btn px-10 py-3"
          @click="handleComplete"
        >
          完成
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import FlashcardView from './FlashcardView.vue'
import SpellingQuestion from './SpellingQuestion.vue'
import { useTheme } from '../../composables/useTheme.js'

const { isDark } = useTheme()

const props = defineProps({
  words: {
    type: Array,
    required: true
  },
  mode: {
    type: String,
    default: 'flashcard'
  },
  startIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['complete', 'exit'])

const currentIndex = ref(props.startIndex)
const showAnswer = ref(false)
const answered = ref(false)
const userInput = ref('')

const currentWord = computed(() => {
  return props.words[currentIndex.value] || null
})

const progressPercent = computed(() => {
  return ((currentIndex.value + 1) / props.words.length) * 100
})

const isLast = computed(() => {
  return currentIndex.value >= props.words.length - 1
})

const toggleAnswer = () => {
  showAnswer.value = !showAnswer.value
}

const previous = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    showAnswer.value = false
    answered.value = false
    userInput.value = ''
  }
}

const next = () => {
  if (currentIndex.value < props.words.length - 1) {
    currentIndex.value++
    showAnswer.value = false
    answered.value = false
    userInput.value = ''
  }
}

const handleRate = (rating) => {
  // 可以记录评分
  console.log('评分:', rating)
  next()
}

const handleInput = (input) => {
  userInput.value = input
}

const handleSubmit = () => {
  answered.value = true
}

const handleComplete = () => {
  emit('complete', {
    total: props.words.length,
    reviewed: props.words.length
  })
}

// 🔥 键盘快捷键支持
const handleKeydown = (event) => {
  // 如果在输入框中,不触发快捷键(让输入框自己处理)
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    // 特殊处理:如果已回答,输入框已禁用,此时允许Space/Enter进入下一个
    if (answered.value && (event.key === ' ' || event.key === 'Space' || event.key === 'Enter')) {
      event.preventDefault()
      next()
    }
    return
  }

  // 拼写模式已回答状态下,按Space或Enter进入下一个
  if (props.mode === 'spelling' && answered.value) {
    if (event.key === ' ' || event.key === 'Space' || event.key === 'Enter') {
      event.preventDefault()
      next()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.review-session {
  @apply p-6 max-w-4xl mx-auto;
}

.session-header {
  @apply flex justify-between items-center mb-6;
}

.header-info {
  @apply flex items-center gap-4;
}

.exit-button {
  @apply px-4 py-2 rounded-lg transition-colors;
}

.exit-button.dark {
  @apply text-gray-400 hover:text-white;
  @apply border border-white/10;
  @apply hover:bg-white/5 hover:border-white/20;
}

.exit-button.light {
  @apply text-gray-600 hover:text-gray-800;
  @apply border border-gray-300;
  @apply hover:bg-gray-100 hover:border-gray-400;
}

.progress-bar {
  @apply w-full h-2 rounded-full mb-8 border;
}

.progress-bar.dark {
  @apply bg-slate-800 border-white/5;
}

.progress-bar.light {
  @apply bg-gray-200 border-gray-300;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
}

.content-area {
  @apply min-h-[400px] flex flex-col justify-center;
}

.action-buttons {
  @apply flex justify-center mt-8;
}

.completion-view {
  @apply py-12;
}

/* 按钮 */
.btn-primary {
  @apply px-8 py-3 rounded-xl font-bold;
  @apply bg-gradient-to-r from-emerald-500 to-teal-500 text-white;
  @apply shadow-lg shadow-emerald-500/20;
  @apply transition-all duration-200;
}

.btn-primary:hover {
  @apply shadow-emerald-500/40 scale-105;
}
</style>
