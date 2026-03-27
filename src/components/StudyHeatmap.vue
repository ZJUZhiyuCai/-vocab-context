<template>
  <div
    class="study-heatmap"
    :class="isDark ? 'dark' : 'light'"
  >
    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="stat-card group">
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
        <div
          class="text-2xl font-black tracking-tight"
          :class="isDark ? 'text-white' : 'text-gray-800'"
        >
          {{ totalWords }}
        </div>
        <div class="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
          总词库
        </div>
      </div>
      <div class="stat-card group">
        <div class="text-orange-400 mb-2 transition-transform group-hover:scale-110">
          <svg
            class="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343a7.99 7.99 0 012.344 5.657z"
          /><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          /></svg>
        </div>
        <div
          class="text-2xl font-black tracking-tight"
          :class="isDark ? 'text-white' : 'text-gray-800'"
        >
          {{ streakDays }}
        </div>
        <div class="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
          连续学习
        </div>
      </div>
      <div class="stat-card group">
        <div class="text-blue-400 mb-2 transition-transform group-hover:scale-110">
          <svg
            class="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          /></svg>
        </div>
        <div
          class="text-2xl font-black tracking-tight"
          :class="isDark ? 'text-white' : 'text-gray-800'"
        >
          {{ totalStudyDays }}
        </div>
        <div class="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
          学习天数
        </div>
      </div>
      <div class="stat-card group">
        <div class="text-yellow-400 mb-2 transition-transform group-hover:scale-110">
          <svg
            class="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          /></svg>
        </div>
        <div
          class="text-2xl font-black tracking-tight"
          :class="isDark ? 'text-white' : 'text-gray-800'"
        >
          {{ averageWords }}
        </div>
        <div class="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
          日均词汇
        </div>
      </div>
    </div>

    <!-- 学习热力图 -->
    <div
      class="heatmap-section backdrop-blur-xl p-6 mb-6 rounded-3xl overflow-hidden relative"
      :class="isDark ? 'bg-slate-950/40 border border-white/5' : 'bg-white border border-gray-200 shadow-lg'"
    >
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div class="flex items-center gap-2 mb-6">
        <div class="w-1 h-5 rounded-full bg-emerald-500" />
        <h3
          class="text-sm font-bold uppercase tracking-wider"
          :class="isDark ? 'text-slate-400' : 'text-gray-600'"
        >
          学习热力图
        </h3>
      </div>
      <div class="overflow-x-auto">
        <div class="flex gap-1 min-w-max">
          <div
            v-for="day in recentDays"
            :key="day.date"
            class="flex flex-col items-center gap-2"
          >
            <div
              class="heatmap-cell w-8 h-8 rounded flex items-center justify-center text-xs font-medium transition-all duration-200 hover:scale-110 cursor-pointer"
              :class="getHeatmapClass(day.count)"
              :title="`${day.label}: ${day.count}个单词`"
            >
              {{ day.count || '' }}
            </div>
            <div class="text-xs text-gray-400">
              {{ day.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- 图例 -->
      <div class="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
        <span>少</span>
        <div class="flex gap-1">
          <div class="w-4 h-4 rounded bg-gray-100" />
          <div class="w-4 h-4 rounded bg-green-100" />
          <div class="w-4 h-4 rounded bg-green-300" />
          <div class="w-4 h-4 rounded bg-green-500" />
          <div class="w-4 h-4 rounded bg-green-700" />
        </div>
        <span>多</span>
      </div>
    </div>

    <!-- 月度趋势 -->
    <div
      class="trend-section backdrop-blur-xl p-6 rounded-3xl overflow-hidden relative"
      :class="isDark ? 'bg-slate-950/40 border border-white/5' : 'bg-white border border-gray-200 shadow-lg'"
    >
      <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div class="flex items-center gap-2 mb-8">
        <div class="w-1 h-5 rounded-full bg-cyan-500" />
        <h3
          class="text-sm font-bold uppercase tracking-wider"
          :class="isDark ? 'text-slate-400' : 'text-gray-600'"
        >
          学习趋势
        </h3>
      </div>
      <div class="h-48 flex items-end gap-1">
        <div
          v-for="day in recentDays"
          :key="day.date"
          class="flex-1 flex flex-col items-center gap-1"
        >
          <div
            class="w-full bg-gradient-to-t from-sage-500 to-sage-300 rounded-t transition-all duration-300 hover:from-sage-600 hover:to-sage-400"
            :style="{ height: getBarHeight(day.count) + '%' }"
            :title="`${day.label}: ${day.count}个单词`"
          />
          <div class="text-xs text-gray-400 transform -rotate-45 origin-top-left">
            {{ day.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStudyHistory, getRecentStudyDays, getStreakDays, getTotalStudyDays } from '../utils/studyHistory.js'
import { useTheme } from '../composables/useTheme.js'
import logger from '../utils/logger.js'

const { isDark } = useTheme()

const recentDays = ref([])
const totalWords = ref(0)
const streakDays = ref(0)
const totalStudyDays = ref(0)
const averageWords = ref(0)
const vocab = ref({ color: '#10b981', id: 'default' }) // Default fallback

import { getCurrentVocabulary } from '../utils/vocabularyManager.js'

const loadData = () => {
  // 加载当前词库背景色等信息
  try {
    const currentVocab = getCurrentVocabulary()
    if (currentVocab) vocab.value = currentVocab
  } catch (e) {
    logger.error('Failed to load current vocab info:', e)
  }

  // 加载最近14天的数据
  recentDays.value = getRecentStudyDays(14)

  // 计算统计数据
  const history = getStudyHistory()
  const counts = Object.values(history)

  totalWords.value = counts.reduce((sum, count) => sum + count, 0)
  streakDays.value = getStreakDays()
  totalStudyDays.value = getTotalStudyDays()
  averageWords.value = totalStudyDays.value > 0
    ? Math.round(totalWords.value / totalStudyDays.value)
    : 0
}

const getHeatmapClass = (count) => {
  if (count === 0) return 'bg-gray-100 text-gray-300'
  if (count < 10) return 'bg-green-100 text-green-700'
  if (count < 20) return 'bg-green-300 text-green-800'
  if (count < 50) return 'bg-green-500 text-white'
  return 'bg-green-700 text-white'
}

const getBarHeight = (count) => {
  const maxCount = Math.max(...recentDays.value.map(d => d.count), 1)
  return Math.max(5, (count / maxCount) * 100)
}

onMounted(() => {
  loadData()
})

// 暴露刷新方法
defineExpose({
  refresh: loadData
})
</script>

<style scoped>
.stat-card {
  @apply backdrop-blur-xl p-6 text-center rounded-3xl transition-all duration-300;
  @apply hover:border-emerald-500/30 shadow-xl;
}

.dark .stat-card {
  @apply bg-slate-950/40 border border-white/5 hover:bg-slate-900/60;
}

.light .stat-card {
  @apply bg-white border border-gray-200 hover:bg-gray-50;
}

.heatmap-cell {
  min-width: 32px;
  min-height: 32px;
}
</style>
