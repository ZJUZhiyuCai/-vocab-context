<template>
  <div class="vocabulary-selector">
    <!-- 词库卡片网格 - 改为2列确保一屏显示 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
      <div
        v-for="vocab in vocabularies"
        :key="vocab.id"
        :class="['vocab-card group', { 'active': vocab.id === currentVocabId }, isDark ? 'dark' : 'light']"
        @click="selectVocabulary(vocab)"
      >
        <!-- 词库图标 -->
        <div
          class="vocab-icon"
          :style="{ backgroundColor: vocab.color + '15', color: vocab.color, border: '1px solid ' + vocab.color + '30' }"
        >
          <svg
            v-if="vocab.id.includes('cet4')"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.168.477-4.5 1.253"
          /></svg>
          <svg
            v-else-if="vocab.id.includes('cet6')"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          /></svg>
          <svg
            v-else-if="vocab.id.includes('ielts6')"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          /></svg>
          <svg
            v-else-if="vocab.id.includes('ielts7')"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.143-7.714L1 12l7.714-2.143L11 3z"
          /></svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          /></svg>
        </div>

        <!-- 词库信息 -->
        <div class="vocab-info">
          <div class="flex items-center justify-between mb-1">
            <h3 :class="['vocab-title transition-colors', isDark ? 'group-hover:text-white' : 'group-hover:text-emerald-600']">
              {{ vocab.name }}
            </h3>
            <div
              v-if="vocab.id === currentVocabId"
              class="check-badge"
            >
              ✓
            </div>
          </div>

          <!-- 词库统计 -->
          <div class="vocab-stats">
            <span class="vocab-badge">{{ vocab.size }}词</span>
            <span class="vocab-badge">{{ vocab.difficulty.label }}</span>
          </div>

          <!-- 学习进度 -->
          <div
            v-if="getProgress(vocab.id)"
            class="vocab-progress"
          >
            <div class="flex justify-between text-xs text-gray-500 mb-1">
              <span>进度 {{ getProgressPercent(vocab.id) }}%</span>
            </div>
            <div :class="['progress-bar', isDark ? 'dark' : 'light']">
              <div
                class="progress-fill"
                :style="{
                  width: getProgressPercent(vocab.id) + '%',
                  backgroundColor: vocab.color
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 精简提示 -->
    <div class="text-xs text-gray-500 text-center mt-4">
      切换词典会自动保存当前进度
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  VOCABULARIES,
  getCurrentVocabulary,
  setCurrentVocabulary,
  getVocabularyProgress
} from '../utils/vocabularyManager.js'
import { useTheme } from '../composables/useTheme.js'

const { isDark } = useTheme()

const emit = defineEmits(['select'])

const vocabularies = ref(VOCABULARIES)
const currentVocabId = ref(getCurrentVocabulary().id)
const progressMap = ref({})

// 选择词典
const selectVocabulary = (vocab) => {
  if (vocab.id === currentVocabId.value) return

  currentVocabId.value = vocab.id
  setCurrentVocabulary(vocab.id)
  emit('select', vocab)
}

// 获取词库进度
const getProgress = (vocabId) => {
  return progressMap.value[vocabId]
}

// 获取进度百分比
const getProgressPercent = (vocabId) => {
  const progress = progressMap.value[vocabId]
  if (!progress) return 0

  const learned = new Set(progress.learned || [])
  const vocab = VOCABULARIES.find(v => v.id === vocabId)
  if (!vocab) return 0

  return Math.round((learned.size / vocab.size) * 100)
}

// 加载所有词库的进度
const loadAllProgress = () => {
  VOCABULARIES.forEach(vocab => {
    progressMap.value[vocab.id] = getVocabularyProgress(vocab.id)
  })
}

onMounted(() => {
  loadAllProgress()
})
</script>

<style scoped>
.vocab-card {
  @apply backdrop-blur-sm rounded-xl p-4 cursor-pointer border;
  @apply transition-all duration-200;
}

.vocab-card.dark {
  @apply bg-slate-800/50 border-white/5;
  @apply hover:bg-slate-800 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10;
}

.vocab-card.light {
  @apply bg-white border-gray-200;
  @apply hover:bg-gray-50 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10;
}

.vocab-card.active {
  @apply border-emerald-500/50 bg-emerald-500/10 shadow-md shadow-emerald-500/10;
}

.vocab-icon {
  @apply w-12 h-12 rounded-xl flex items-center justify-center mb-3;
}

.vocab-info {
  @apply flex flex-col;
}

.vocab-title {
  @apply text-sm font-bold;
}

.vocab-card.dark .vocab-title {
  @apply text-gray-200;
}

.vocab-card.light .vocab-title {
  @apply text-gray-800;
}

.vocab-stats {
  @apply flex gap-2 mb-3;
}

.vocab-badge {
  @apply text-xs px-2 py-0.5 rounded-md border;
}

.vocab-card.dark .vocab-badge {
  @apply bg-white/5 text-gray-400 border-white/5;
}

.vocab-card.light .vocab-badge {
  @apply bg-gray-100 text-gray-600 border-gray-200;
}

.vocab-progress {
  @apply mt-auto pt-3 border-t;
}

.vocab-card.dark .vocab-progress {
  @apply border-white/5;
}

.vocab-card.light .vocab-progress {
  @apply border-gray-200;
}

.check-badge {
  @apply text-emerald-400 font-bold text-lg flex-shrink-0;
}

.progress-bar {
  @apply w-full h-1.5 rounded-full overflow-hidden;
}

.progress-bar.dark {
  @apply bg-slate-700;
}

.progress-bar.light {
  @apply bg-gray-200;
}

.progress-fill {
  @apply h-full transition-all duration-300 ease-out;
  box-shadow: 0 0 8px currentColor;
}
</style>
