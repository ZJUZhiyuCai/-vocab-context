<template>
  <div class="review-queue-preview animate-fade-in">
    <!-- 头部 -->
    <div class="preview-header">
      <div class="flex items-center gap-2 mb-1">
        <div class="w-1.5 h-6 rounded-full bg-emerald-500" />
        <h2 class="text-xl font-bold text-white uppercase tracking-tight">
          复习队列
        </h2>
      </div>
      <div class="header-stats">
        <span class="stat-badge">
          {{ words.length }} 个学习过的单词
        </span>
        <span
          v-if="overdueCount > 0"
          class="stat-badge warning"
        >
          {{ overdueCount }} 个需要复习
        </span>
      </div>
    </div>

    <!-- 单词列表 -->
    <div class="word-list custom-scrollbar">
      <div
        v-for="(item, index) in sortedWords"
        :key="item.word.id"
        class="word-item group"
        :class="{ 'overdue': isOverdue(item.reviewState) }"
      >
        <!-- 单词信息 -->
        <div
          class="word-info"
          @click="selectWord(index)"
        >
          <div class="word-header">
            <h3 class="word-text group-hover:text-emerald-400 transition-colors">
              {{ item.word.word }}
            </h3>
            <div class="word-meta">
              <span
                v-if="item.word.ipa"
                class="ipa"
              >{{ item.word.ipa }}</span>
              <span class="review-count">已复习 {{ item.reviewState.reviewCount || 0 }} 次</span>
            </div>
          </div>

          <div class="word-stats">
            <div class="stat-item">
              <span class="stat-label">正确率</span>
              <span
                class="stat-value"
                :class="getAccuracyClass(item.reviewState)"
              >
                {{ getAccuracy(item.reviewState) }}%
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">上次复习</span>
              <span class="stat-value">{{ getTimeAgo(item.reviewState.lastReview) }}</span>
            </div>
            <div
              v-if="isOverdue(item.reviewState)"
              class="stat-item overdue"
            >
              <span class="stat-label">超时</span>
              <span class="stat-value text-rose-400">{{ getOverdueText(item.reviewState) }}</span>
            </div>
          </div>

          <div class="word-meaning">
            {{ item.word.meaning }}
          </div>
        </div>

        <!-- 快捷操作 -->
        <div class="word-actions">
          <button
            class="action-btn"
            title="从此单词开始复习"
            @click.stop="startFromIndex(index)"
          >
            <svg
              class="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="text-xs ml-1">从此开始</span>
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div
        v-if="words.length === 0"
        class="empty-state"
      >
        <div class="flex justify-center mb-6 text-slate-700/50">
          <svg
            class="w-20 h-20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.168.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-200 mb-2">
          还没有学习过的单词
        </h3>
        <p class="text-slate-500">
          先去学习一些新单词吧
        </p>
      </div>
    </div>

    <!-- 底部操作 -->
    <div
      v-if="words.length > 0"
      class="preview-footer"
    >
      <button
        class="footer-btn secondary"
        @click="$emit('close')"
      >
        取消
      </button>
      <button
        class="footer-btn primary"
        @click="startReview"
      >
        开始复习
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  words: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'start', 'startFromIndex'])

// 按优先级排序（超时越久、错误次数越多越靠前）
const sortedWords = computed(() => {
  return [...props.words].sort((a, b) => {
    // 计算优先级分数
    const scoreA = getPriorityScore(a.reviewState)
    const scoreB = getPriorityScore(b.reviewState)
    return scoreB - scoreA // 降序
  })
})

// 超时数量
const overdueCount = computed(() => {
  return props.words.filter(item => isOverdue(item.reviewState)).length
})

// 计算优先级分数
const getPriorityScore = (reviewState) => {
  let score = 0

  // 超时时间（分钟）
  const overdueMinutes = Math.max(0, Date.now() - reviewState.nextReview) / (60 * 1000)
  score += Math.floor(overdueMinutes)

  // 错误次数
  score += (reviewState.incorrectCount || 0) * 500

  // 新单词（从未复习过）
  if (reviewState.reviewCount === 0) {
    score += 1000
  }

  return score
}

// 是否超时
const isOverdue = (reviewState) => {
  return Date.now() > reviewState.nextReview
}

// 计算正确率
const getAccuracy = (reviewState) => {
  const total = (reviewState.correctCount || 0) + (reviewState.incorrectCount || 0)
  if (total === 0) return 100
  return Math.round((reviewState.correctCount / total) * 100)
}

// 获取正确率样式类
const getAccuracyClass = (reviewState) => {
  const accuracy = getAccuracy(reviewState)
  if (accuracy >= 80) return 'text-emerald-400'
  if (accuracy >= 60) return 'text-amber-400'
  return 'text-rose-400'
}

// 时间格式化
const getTimeAgo = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (60 * 1000))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return '刚刚'
}

// 超时文本
const getOverdueText = (reviewState) => {
  const overdue = Date.now() - reviewState.nextReview
  const minutes = Math.floor(overdue / (60 * 1000))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}天`
  if (hours > 0) return `${hours}小时`
  return `${minutes}分钟`
}

// 选择单词（查看详情）
const selectWord = () => {
  // 预留：可以添加查看单词详情的逻辑
}

// 从指定索引开始复习
const startFromIndex = (index) => {
  emit('startFromIndex', index)
}

// 开始复习
const startReview = () => {
  emit('start')
}
</script>

<style scoped>
.review-queue-preview {
  @apply bg-slate-900 rounded-2xl shadow-2xl p-6 max-h-[80vh] flex flex-col border border-white/10;
}

.preview-header {
  @apply pb-4 border-b border-white/10;
}

.header-stats {
  @apply flex gap-3 mt-3;
}

.stat-badge {
  @apply px-3 py-1 rounded-full text-sm font-medium;
  @apply bg-slate-800 text-gray-300 border border-white/5;
}

.stat-badge.warning {
  @apply bg-rose-500/10 text-rose-400 border-rose-500/30;
}

.word-list {
  @apply flex-1 overflow-y-auto py-4 space-y-3;
}

.word-item {
  @apply bg-slate-800/50 rounded-xl p-4 border border-white/5;
  @apply transition-all duration-200;
  @apply hover:bg-slate-800 hover:border-emerald-500/30;
}

.word-item.overdue {
  @apply bg-rose-500/5 border-rose-500/10;
}

.word-info {
  @apply cursor-pointer;
}

.word-header {
  @apply flex items-start justify-between mb-2;
}

.word-text {
  @apply text-lg font-bold text-gray-200;
}

.word-meta {
  @apply flex flex-col items-end gap-1 text-sm text-gray-500;
}

.word-stats {
  @apply flex gap-4 mb-2 text-sm;
}

.stat-item {
  @apply flex items-center gap-1;
}

.stat-label {
  @apply text-gray-500;
}

.stat-value {
  @apply font-medium text-gray-300;
}

.word-meaning {
  @apply text-sm text-gray-400 pt-2 border-t border-white/5;
}

.word-actions {
  @apply flex gap-2 mt-3 pt-3 border-t border-white/5;
}

.action-btn {
  @apply flex items-center text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg text-sm transition-colors;
}

.empty-state {
  @apply text-center py-12;
}

.preview-footer {
  @apply flex gap-3 pt-4 border-t border-white/10;
}

.footer-btn {
  @apply flex-1 py-3 px-6 rounded-xl font-bold;
  @apply transition-all duration-200;
}

.footer-btn.primary {
  @apply bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40;
}

.footer-btn.secondary {
  @apply bg-slate-800 text-gray-300 border border-white/10 hover:bg-slate-700;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-slate-800 rounded;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-700 rounded hover:bg-slate-600;
}
</style>
