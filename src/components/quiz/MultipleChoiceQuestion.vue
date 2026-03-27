<template>
  <div class="multiple-choice-question">
    <!-- 单词展示 -->
    <div class="word-display">
      <h2 class="word-text">
        {{ word.word }}
      </h2>
      <div
        v-if="word.phonetic"
        class="phonetic-text"
      >
        {{ word.phonetic }}
      </div>
    </div>

    <!-- 选项列表 -->
    <div class="options-grid">
      <button
        v-for="(option, index) in options"
        :key="index"
        class="option-button"
        :class="getOptionClass(option)"
        :disabled="answered"
        @click="selectOption(option)"
      >
        <span class="option-label">{{ String.fromCharCode(65 + index) }}</span>
        <span class="option-text">{{ option }}</span>
        <span
          v-if="answered"
          class="option-icon"
        >
          <svg
            v-if="option === word.meaning"
            class="w-5 h-5 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else-if="option === selectedAnswer"
            class="w-5 h-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  word: {
    type: Object,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  answered: {
    type: Boolean,
    default: false
  },
  selectedAnswer: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['answer'])

// 选择选项
const selectOption = (option) => {
  if (props.answered) return
  emit('answer', option)
}

// 获取选项样式类
const getOptionClass = (option) => {
  if (!props.answered) {
    return props.selectedAnswer === option ? 'selected' : 'default'
  }

  if (option === props.word.meaning) {
    return 'correct'
  }

  if (option === props.selectedAnswer) {
    return 'wrong'
  }

  return 'disabled'
}
</script>

<style scoped>
.multiple-choice-question {
  @apply space-y-6;
}

.word-display {
  @apply text-center pb-6 border-b border-gray-200;
}

.word-text {
  @apply text-4xl font-bold text-sage-600 mb-2;
}

.phonetic-text {
  @apply text-lg text-gray-500;
}

.options-grid {
  @apply grid grid-cols-1 gap-3;
}

.option-button {
  @apply w-full p-4 rounded-lg border-2 text-left;
  @apply flex items-center gap-3;
  @apply transition-all duration-200;
}

.option-button.default {
  @apply bg-white border-gray-200 hover:border-sage-300;
}

.option-button.selected {
  @apply bg-sage-50 border-sage-500;
}

.option-button.correct {
  @apply bg-green-50 border-green-500 cursor-default;
}

.option-button.wrong {
  @apply bg-red-50 border-red-500 cursor-default;
}

.option-button.disabled {
  @apply bg-gray-50 border-gray-200 cursor-default opacity-60;
}

.option-label {
  @apply flex-shrink-0 w-8 h-8 flex items-center justify-center;
  @apply rounded-full bg-sage-100 text-sage-600 font-bold;
}

.option-button.correct .option-label {
  @apply bg-green-100 text-green-600;
}

.option-button.wrong .option-label {
  @apply bg-red-100 text-red-600;
}

.option-text {
  @apply flex-1 font-medium text-gray-700;
}

.option-icon {
  @apply flex-shrink-0;
}
</style>
