<template>
  <div class="test-session">
    <!-- 顶部进度条 -->
    <div class="session-header">
      <div class="header-info">
        <h2 class="text-xl font-bold text-sage-600">
          {{ modeTitle }}
        </h2>
        <span class="text-sm text-gray-600">{{ currentIndex + 1 }} / {{ words.length }}</span>
      </div>
      <div class="flex items-center gap-4">
        <span class="score-badge">得分: {{ score }}/{{ totalAnswered }}</span>
        <button
          :class="['exit-button', isDark ? 'dark' : 'light']"
          @click="showExitConfirm = true"
        >
          退出
        </button>
      </div>
    </div>

    <!-- 进度条 -->
    <div :class="['progress-bar', isDark ? 'dark' : 'light']">
      <div
        class="progress-fill"
        :style="{ width: progressPercent + '%' }"
      />
    </div>

    <!-- 拼写模式 -->
    <div
      v-if="mode === 'spelling' && !showResults"
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
          @click="nextQuestion"
        >
          {{ isLast ? '查看结果' : '下一题' }}
        </button>
      </div>
    </div>

    <!-- 闪卡模式 -->
    <div
      v-else-if="mode === 'flashcard' && !showResults"
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

    <!-- 结果页面 -->
    <div
      v-if="showResults"
      class="results-view"
    >
      <QuizResults
        :score="score"
        :total="words.length"
        :correct-answers="correctAnswers"
        :wrong-answers="wrongAnswers"
        :mode="mode"
        @restart="restart"
        @exit="handleExit"
      />
    </div>

    <!-- 退出确认弹窗 -->
    <div
      v-if="showExitConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold text-gray-800 mb-2">
          确认退出？
        </h3>
        <p class="text-gray-600 mb-4">
          当前的测试进度将会丢失
        </p>
        <div class="flex gap-3">
          <button
            class="flex-1 btn bg-gray-200 text-gray-700"
            @click="showExitConfirm = false"
          >
            取消
          </button>
          <button
            class="flex-1 btn btn-error"
            @click="handleExit"
          >
            退出
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SpellingQuestion from './SpellingQuestion.vue'
import FlashcardView from './FlashcardView.vue'
import QuizResults from './QuizResults.vue'
import { useTheme } from '../../composables/useTheme.js'

const { isDark } = useTheme()

const props = defineProps({
  words: {
    type: Array,
    required: true
  },
  mode: {
    type: String,
    default: 'spelling'
  }
})

const emit = defineEmits(['complete', 'exit'])

const currentIndex = ref(0)
const score = ref(0)
const totalAnswered = ref(0)
const correctAnswers = ref([])
const wrongAnswers = ref([])
const answered = ref(false)
const userInput = ref('')
const showAnswer = ref(false)
const showResults = ref(false)
const showExitConfirm = ref(false)

const currentWord = computed(() => {
  return props.words[currentIndex.value] || null
})

const progressPercent = computed(() => {
  return ((currentIndex.value + 1) / props.words.length) * 100
})

const isLast = computed(() => {
  return currentIndex.value >= props.words.length - 1
})

const modeTitle = computed(() => {
  const titles = {
    'spelling': '✍️ 拼写测试',
    'flashcard': '⚡ 快速闪卡'
  }
  return titles[props.mode] || '测试'
})

const handleInput = (input) => {
  userInput.value = input
}

const handleSubmit = () => {
  if (answered.value) return

  answered.value = true
  totalAnswered.value++

  const isCorrect = userInput.value.toLowerCase().trim() === currentWord.value.word.toLowerCase()

  if (isCorrect) {
    score.value++
    correctAnswers.value.push({
      word: currentWord.value,
      correct: true
    })
  } else {
    wrongAnswers.value.push({
      word: currentWord.value,
      userAnswer: userInput.value,
      correctAnswer: currentWord.value.word
    })
  }
}

const toggleAnswer = () => {
  showAnswer.value = !showAnswer.value
}

const nextQuestion = () => {
  if (isLast.value) {
    showResults.value = true
  } else {
    currentIndex.value++
    resetState()
  }
}

const resetState = () => {
  answered.value = false
  userInput.value = ''
  showAnswer.value = false
}

const previous = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    resetState()
  }
}

const next = () => {
  if (currentIndex.value < props.words.length - 1) {
    currentIndex.value++
    resetState()
  }
}

const handleRate = (rating) => {
  console.log('评分:', rating)
  next()
}

const restart = () => {
  currentIndex.value = 0
  score.value = 0
  totalAnswered.value = 0
  correctAnswers.value = []
  wrongAnswers.value = []
  showResults.value = false
  resetState()
}

const handleExit = () => {
  emit('exit')
}
</script>

<style scoped>
.test-session {
  @apply p-6;
}

.session-header {
  @apply flex justify-between items-center mb-4;
}

.header-info {
  @apply flex items-center gap-4;
}

.score-badge {
  @apply px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm font-medium;
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
  @apply hover:bg-gray-100;
}

.progress-bar {
  @apply w-full h-2 rounded-full mb-6;
}

.progress-bar.dark {
  @apply bg-slate-700;
}

.progress-bar.light {
  @apply bg-gray-200;
}

.progress-fill {
  @apply h-full bg-sage-500 rounded-full transition-all duration-300;
}

.content-area {
  @apply min-h-[400px];
}

.action-buttons {
  @apply flex justify-center mt-6;
}

.results-view {
  @apply py-6;
}
</style>
