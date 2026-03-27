<template>
  <div class="flashcard-view">
    <!-- 单词卡片容器 -->
    <div class="flashcard-container">
      <div
        class="flashcard-inner"
        :class="{ 'flipped': showAnswer }"
        @click="$emit('toggle')"
      >
        <!-- 正面 -->
        <div :class="['flashcard-front', isDark ? 'dark' : 'light']">
          <h2 class="word-text">
            {{ word.word }}
          </h2>
          <div
            v-if="word.phonetic"
            class="phonetic-text"
          >
            {{ word.phonetic }}
          </div>
          <div class="tap-hint">
            <svg
              class="w-5 h-5 animate-bounce"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="ml-1 text-sm">点击查看释义</span>
          </div>
        </div>

        <!-- 背面 -->
        <div :class="['flashcard-back', isDark ? 'dark' : 'light']">
          <h3 class="meaning-text">
            {{ word.meaning }}
          </h3>
          <div
            v-if="word.example"
            class="example-text"
          >
            {{ word.example }}
          </div>
          <div
            v-if="word.exampleTranslation"
            class="example-translation"
          >
            {{ word.exampleTranslation }}
          </div>
        </div>
      </div>
    </div>

    <!-- 难度按钮 -->
    <div
      v-if="showAnswer"
      class="difficulty-buttons"
    >
      <button
        class="difficulty-button easy"
        @click.stop="$emit('rate', 'easy')"
      >
        简单
      </button>
      <button
        class="difficulty-button medium"
        @click.stop="$emit('rate', 'medium')"
      >
        一般
      </button>
      <button
        class="difficulty-button hard"
        @click.stop="$emit('rate', 'hard')"
      >
        困难
      </button>
    </div>

    <!-- 导航按钮 -->
    <div class="navigation-buttons">
      <button
        :class="['nav-button', isDark ? 'dark' : 'light']"
        :disabled="!hasPrevious"
        @click.stop="$emit('previous')"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        上一个
      </button>
      <button
        :class="['nav-button', isDark ? 'dark' : 'light']"
        :disabled="!hasNext"
        @click.stop="$emit('next')"
      >
        下一个
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  word: {
    type: Object,
    required: true
  },
  showAnswer: {
    type: Boolean,
    default: false
  },
  hasPrevious: {
    type: Boolean,
    default: true
  },
  hasNext: {
    type: Boolean,
    default: true
  }
})

defineEmits(['toggle', 'previous', 'next', 'rate'])

import { useTheme } from '../../composables/useTheme.js'
const { isDark } = useTheme()
</script>

<style scoped>
.flashcard-view {
  @apply space-y-6;
}

/* 卡片容器 - 提供3D透视 */
.flashcard-container {
  @apply relative w-full h-80;
  perspective: 1000px;
  /* 启用GPU加速 */
  -webkit-perspective: 1000px;
}

/* 卡片内层 - 执行翻转动画 */
.flashcard-inner {
  @apply relative w-full h-full;
  @apply text-center;
  transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
  transform-style: preserve-3d;
  /* 启用GPU加速 */
  will-change: transform;
  -webkit-transform-style: preserve-3d;
  -webkit-backface-visibility: hidden;
}

/* 翻转状态 */
.flashcard-inner.flipped {
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
}

/* 正面和背面 - 共同样式 */
.flashcard-front,
.flashcard-back {
  @apply absolute w-full h-full;
  @apply rounded-3xl shadow-2xl p-8;
  @apply flex flex-col items-center justify-center;
  @apply border-2;
  /* 隐藏背面，启用GPU加速 */
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  /* 提升到独立的合成层 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

.flashcard-front.dark,
.flashcard-back.dark {
  @apply bg-slate-900 border-white/5;
}

.flashcard-front.light,
.flashcard-back.light {
  @apply bg-white border-gray-200;
}

/* 正面 - 初始显示 */
.flashcard-front {
  z-index: 2;
}

/* 背面 - 初始隐藏（旋转180度） */
.flashcard-back {
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
  z-index: 1;
}

.flashcard-back.dark {
  @apply bg-slate-800/80 backdrop-blur-xl border-emerald-500/20;
}

.flashcard-back.light {
  @apply bg-emerald-50 border-emerald-200;
}

.word-text {
  @apply text-6xl font-black mb-4 tracking-tight;
  /* 优化文本渲染 */
  transform: translateZ(30px);
  -webkit-transform: translateZ(30px);
}

.flashcard-front.dark .word-text {
  @apply text-white;
}

.flashcard-front.light .word-text {
  @apply text-slate-900;
}

.phonetic-text {
  @apply text-2xl font-mono text-emerald-400/80 mb-8;
  transform: translateZ(10px);
  -webkit-transform: translateZ(10px);
}

.tap-hint {
  @apply flex items-center text-slate-500 mt-6;
  transform: translateZ(15px);
  -webkit-transform: translateZ(15px);
}

.meaning-text {
  @apply text-3xl font-bold text-emerald-400 mb-6;
  transform: translateZ(30px);
  -webkit-transform: translateZ(30px);
}

.example-text {
  @apply text-xl text-slate-200 mb-3 italic leading-relaxed;
  transform: translateZ(10px);
  -webkit-transform: translateZ(10px);
}

.example-translation {
  @apply text-lg text-slate-500;
  transform: translateZ(10px);
  -webkit-transform: translateZ(10px);
}

.difficulty-buttons {
  @apply flex gap-3 justify-center;
}

.difficulty-button {
  @apply px-6 py-3 rounded-lg font-medium;
  @apply transition-all duration-200;
  /* 启用GPU加速的按钮动画 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  will-change: transform;
}

.difficulty-button:active {
  transform: scale(0.95);
  -webkit-transform: scale(0.95);
}

.difficulty-button.easy {
  @apply bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20;
}

.difficulty-button.medium {
  @apply bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20;
}

.difficulty-button.hard {
  @apply bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20;
}

.navigation-buttons {
  @apply flex justify-between gap-4;
}

.nav-button {
  @apply flex-1 flex items-center justify-center gap-2;
  @apply py-3 px-4 border-2 rounded-2xl;
  @apply font-bold uppercase tracking-wider;
  @apply disabled:opacity-20 disabled:cursor-not-allowed;
  @apply transition-all duration-300;
  /* 启用GPU加速 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

.nav-button.dark {
  @apply bg-slate-800 border-white/5 text-slate-300;
  @apply hover:bg-slate-700 hover:border-emerald-500/30 hover:text-emerald-400;
}

.nav-button.light {
  @apply bg-gray-100 border-gray-200 text-gray-700;
  @apply hover:bg-white hover:border-emerald-500/50 hover:text-emerald-600;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0) translateZ(15px);
  }
  50% {
    transform: translateY(-5px) translateZ(15px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

/* 移动端优化 - 触摸反馈 */
@media (hover: none) and (pointer: coarse) {
  .flashcard-inner:active {
    transform: scale(0.98);
    -webkit-transform: scale(0.98);
  }

  .flashcard-inner.flipped:active {
    transform: rotateY(180deg) scale(0.98);
    -webkit-transform: rotateY(180deg) scale(0.98);
  }
}

/* 减少动画以尊重用户偏好 */
@media (prefers-reduced-motion: reduce) {
  .flashcard-inner {
    transition: transform 0.3s ease-out;
  }

  .animate-bounce {
    animation: none;
  }
}
</style>
