<template>
  <div class="quiz-results">
    <h2 class="text-3xl font-bold text-sage-600 mb-6">
      测验结果
    </h2>

    <!-- 分数概览 -->
    <div class="score-overview">
      <div class="score-circle">
        <div class="score-percentage">
          {{ scorePercentage }}%
        </div>
        <div class="score-label">
          正确率
        </div>
      </div>
      <div class="score-details">
        <div class="score-item">
          <span class="score-label">答对</span>
          <span class="score-value text-green-600">{{ score }}</span>
        </div>
        <div class="score-item">
          <span class="score-label">答错</span>
          <span class="score-value text-red-600">{{ wrongCount }}</span>
        </div>
        <div class="score-item">
          <span class="score-label">总题数</span>
          <span class="score-value text-sage-600">{{ total }}</span>
        </div>
      </div>
    </div>

    <!-- 评价 -->
    <div class="result-message">
      <div class="message-icon">
        {{ gradeIcon }}
      </div>
      <div class="message-text">
        {{ gradeMessage }}
      </div>
    </div>

    <!-- 错题回顾 -->
    <div
      v-if="wrongAnswers.length > 0"
      class="wrong-answers-section"
    >
      <h3 class="text-xl font-bold text-sage-600 mb-4">
        错题回顾
      </h3>
      <div class="wrong-answers-list">
        <div
          v-for="(item, index) in wrongAnswers"
          :key="index"
          class="wrong-answer-item"
        >
          <div class="wrong-word">
            <span class="word-text">{{ item.word.word }}</span>
            <span
              v-if="item.word.phonetic"
              class="word-phonetic"
            >
              {{ item.word.phonetic }}
            </span>
          </div>
          <div class="wrong-details">
            <div class="wrong-row your-answer">
              <span class="row-label">你的答案：</span>
              <span class="row-value wrong">{{ item.userAnswer }}</span>
            </div>
            <div class="wrong-row correct-answer">
              <span class="row-label">正确答案：</span>
              <span class="row-value correct">{{ item.correctAnswer }}</span>
            </div>
          </div>
          <div class="word-meaning">
            {{ item.word.meaning }}
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="result-actions">
      <button
        class="action-button primary"
        @click="$emit('restart')"
      >
        🔄 再测一次
      </button>
      <button
        class="action-button secondary"
        @click="$emit('exit')"
      >
        ✅ 完成测验
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Array,
    default: () => []
  },
  wrongAnswers: {
    type: Array,
    default: () => []
  },
  mode: {
    type: String,
    default: 'multiple-choice'
  }
})

const emit = defineEmits(['restart', 'exit'])

// 错题数量
const wrongCount = computed(() => {
  return props.total - props.score
})

// 正确率
const scorePercentage = computed(() => {
  return props.total > 0 ? Math.round((props.score / props.total) * 100) : 0
})

// 等级图标
const gradeIcon = computed(() => {
  const percentage = scorePercentage.value
  if (percentage >= 90) return '🏆'
  if (percentage >= 80) return '🎉'
  if (percentage >= 70) return '👍'
  if (percentage >= 60) return '💪'
  return '📚'
})

// 等级评语
const gradeMessage = computed(() => {
  const percentage = scorePercentage.value
  if (percentage >= 90) return '太棒了！你的词汇掌握得非常牢固！'
  if (percentage >= 80) return '很好！继续保持这样的学习状态！'
  if (percentage >= 70) return '不错！再接再厉，还有提升空间！'
  if (percentage >= 60) return '及格了，建议多复习错题。'
  return '需要加强学习，重点复习错题吧！'
})
</script>

<style scoped>
.quiz-results {
  @apply space-y-6;
}

.score-overview {
  @apply bg-gradient-to-br from-sage-50 to-sage-100 rounded-lg p-6;
  @apply flex items-center gap-6;
}

.score-circle {
  @apply flex-shrink-0 w-32 h-32 rounded-full bg-white shadow-md;
  @apply flex flex-col items-center justify-center;
  @apply border-4 border-sage-500;
}

.score-percentage {
  @apply text-4xl font-bold text-sage-600;
}

.score-label {
  @apply text-sm text-gray-500;
}

.score-details {
  @apply flex-1 flex justify-around;
}

.score-item {
  @apply text-center;
}

.score-item .score-label {
  @apply block text-sm text-gray-600 mb-1;
}

.score-item .score-value {
  @apply text-2xl font-bold;
}

.result-message {
  @apply bg-white rounded-lg shadow-sm p-6;
  @apply flex items-center gap-4;
}

.message-icon {
  @apply text-5xl;
}

.message-text {
  @apply flex-1 text-lg font-medium text-gray-700;
}

.wrong-answers-section {
  @apply bg-white rounded-lg shadow-sm p-6;
}

.wrong-answers-list {
  @apply space-y-4;
}

.wrong-answer-item {
  @apply bg-red-50 rounded-lg p-4 border border-red-200;
}

.wrong-word {
  @apply flex items-center gap-2 mb-2;
}

.word-text {
  @apply text-lg font-bold text-sage-600;
}

.word-phonetic {
  @apply text-gray-500;
}

.wrong-details {
  @apply space-y-1 mb-2;
}

.wrong-row {
  @apply flex items-center gap-2 text-sm;
}

.row-label {
  @apply text-gray-500;
}

.row-value.wrong {
  @apply text-red-600 font-medium;
  @apply line-through;
}

.row-value.correct {
  @apply text-green-600 font-bold;
}

.word-meaning {
  @apply text-sm text-gray-600 mt-2 pt-2 border-t border-red-200;
}

.result-actions {
  @apply flex gap-4;
}

.action-button {
  @apply flex-1 py-3 px-6 rounded-lg font-medium;
  @apply transition-all duration-200;
  @apply transform hover:scale-105 active:scale-95;
}

.action-button.primary {
  @apply bg-sage-600 text-white hover:bg-sage-700;
}

.action-button.secondary {
  @apply bg-white border-2 border-sage-300 text-sage-600 hover:bg-sage-50;
}
</style>
