<template>
  <div
    class="achievements-panel"
    :class="isDark ? 'dark' : 'light'"
  >
    <!-- 成就统计 -->
    <div
      class="stat-header mb-6 p-8 backdrop-blur-xl rounded-[2.5rem]"
      :class="isDark ? 'bg-slate-900/50 border border-white/10' : 'bg-white/80 border border-gray-200 shadow-lg'"
    >
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-2 h-8 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          <h3
            class="text-2xl font-black tracking-tight uppercase"
            :class="isDark ? 'text-white' : 'text-gray-800'"
          >
            成就系统
          </h3>
        </div>
        <span class="text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
          {{ stats.unlocked }}/{{ stats.total }}
        </span>
      </div>
      <div
        class="w-full rounded-full h-3 overflow-hidden"
        :class="isDark ? 'bg-slate-700/50' : 'bg-gray-200'"
      >
        <div
          class="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          :style="{ width: stats.percentage + '%' }"
        />
      </div>
      <p
        class="text-sm mt-3 text-center"
        :class="isDark ? 'text-gray-400' : 'text-gray-600'"
      >
        已解锁 <span class="text-emerald-500 font-semibold">{{ stats.percentage }}%</span> 的成就
      </p>
    </div>

    <!-- 成就列表 -->
    <div class="space-y-4">
      <h4
        class="text-lg font-semibold mb-4"
        :class="isDark ? 'text-gray-200' : 'text-gray-800'"
      >
        成就列表
      </h4>

      <!-- 分类标签 -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="category in categories"
          :key="category.id"
          class="px-4 py-2 rounded-xl text-sm font-medium transition-all border"
          :class="[
            selectedCategory === category.id
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-lg shadow-emerald-500/25'
              : isDark 
                ? 'bg-slate-800/50 text-gray-400 border-white/10 hover:border-emerald-500/30 hover:text-emerald-400'
                : 'bg-gray-100 text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-600'
          ]"
          @click="selectedCategory = category.id"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- 成就网格 -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="achievement in filteredAchievements"
          :key="achievement.id"
          class="p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
          :class="[
            achievement.unlocked 
              ? isDark 
                ? 'bg-slate-800/70 border-emerald-500/30 shadow-lg hover:shadow-emerald-500/10'
                : 'bg-white border-emerald-300 shadow-lg hover:shadow-emerald-100'
              : isDark
                ? 'bg-slate-900/50 border-white/5'
                : 'bg-gray-50 border-gray-200'
          ]"
        >
          <div
            class="w-12 h-12 flex items-center justify-center rounded-xl mb-3"
            :class="[isDark ? 'bg-white/5' : 'bg-gray-100', { 'grayscale opacity-30': !achievement.unlocked }]"
          >
            <svg
              v-if="achievement.icon === '🌱'"
              class="w-6 h-6 text-emerald-400"
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
              v-else-if="achievement.icon === '📚'"
              class="w-6 h-6 text-blue-400"
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
              v-else-if="achievement.icon === '🏆'"
              class="w-6 h-6 text-amber-400"
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
              v-else-if="achievement.icon === '🔥'"
              class="w-6 h-6 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343a7.99 7.99 0 012.344 5.657z"
            /><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            /></svg>
            <svg
              v-else-if="achievement.icon === '🎯'"
              class="w-6 h-6 text-rose-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            /></svg>
            <span
              v-else
              class="text-2xl"
            >{{ achievement.icon }}</span>
          </div>
          <div
            class="font-semibold text-sm mb-1"
            :class="achievement.unlocked ? (isDark ? 'text-white' : 'text-gray-800') : (isDark ? 'text-gray-500' : 'text-gray-400')"
          >
            {{ achievement.name }}
          </div>
          <div
            class="text-xs mb-2"
            :class="achievement.unlocked ? (isDark ? 'text-gray-400' : 'text-gray-600') : (isDark ? 'text-gray-600' : 'text-gray-400')"
          >
            {{ achievement.description }}
          </div>
          <div
            v-if="achievement.reward"
            class="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg inline-block"
          >
            {{ achievement.reward }}
          </div>
          <div
            v-if="achievement.unlocked"
            class="mt-2 text-xs text-emerald-400 font-bold flex items-center gap-1"
          >
            <svg
              class="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
              d="M5 13l4 4L19 7"
            /></svg>
            已解锁
          </div>
          <div
            v-else
            class="mt-2 text-xs flex items-center gap-1"
            :class="isDark ? 'text-slate-600' : 'text-gray-400'"
          >
            <svg
              class="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            /></svg>
            未解锁
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div
        v-if="filteredAchievements.length === 0"
        class="text-center py-12"
        :class="isDark ? 'text-slate-600' : 'text-gray-500'"
      >
        <div
          class="flex justify-center mb-4"
          :class="isDark ? 'text-slate-700' : 'text-gray-400'"
        >
          <svg
            class="w-16 h-16"
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
        <p>该分类暂无成就</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAchievementsList, getAchievementStats } from '../utils/achievements.js'
import { useTheme } from '../composables/useTheme.js'

const { isDark } = useTheme()

const selectedCategory = ref('all')

const categories = [
  { id: 'all', name: '全部' },
  { id: 'count', name: '学习数量' },
  { id: 'streak', name: '连续学习' },
  { id: 'vocabulary', name: '词库成就' },
  { id: 'accuracy', name: '正确率' },
  { id: 'special', name: '特殊成就' }
]

const achievements = ref([])
const stats = ref({ unlocked: 0, total: 0, percentage: 0 })

const filteredAchievements = computed(() => {
  if (selectedCategory.value === 'all') {
    return achievements.value
  }
  return achievements.value.filter(a => a.type === selectedCategory.value)
})

const loadData = () => {
  achievements.value = getAchievementsList()
  stats.value = getAchievementStats()
}

onMounted(() => {
  loadData()
})

// 暴露刷新方法供父组件调用
defineExpose({
  refresh: loadData
})
</script>
