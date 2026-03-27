<template>
  <aside class="stats-panel w-72 flex flex-col gap-4">
    <!-- 今日统计卡片 -->
    <div class="stat-card">
      <h3 class="text-sm font-medium text-gray-700 mb-3">
        今日统计
      </h3>
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">新学单词</span>
          <span
            class="text-lg font-bold"
            style="color: #5c6b5c"
          >{{ todayStats.newWords }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">复习单词</span>
          <span class="text-lg font-bold text-blue-500">{{ todayStats.reviewWords }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">AI例句</span>
          <span class="text-lg font-bold text-purple-500">{{ todayStats.aiExamples }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">学习时长</span>
          <span class="text-sm font-medium text-gray-700">{{ todayStats.duration }}</span>
        </div>
      </div>
    </div>

    <!-- 学习热力图 -->
    <div class="stat-card">
      <h3 class="text-sm font-medium text-gray-700 mb-3">
        学习热力图
      </h3>
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="(day, index) in heatmap"
          :key="index"
          class="aspect-square rounded"
          :class="getHeatmapColor(day.count)"
          :title="`${day.label}: ${day.count}个单词`"
        />
      </div>
      <div class="flex justify-between items-center mt-2 text-xs text-gray-500">
        <span>少</span>
        <div class="flex gap-1">
          <div
            class="w-3 h-3 rounded"
            style="background-color: #f5f5f4"
          />
          <div
            class="w-3 h-3 rounded"
            style="background-color: #d1d5db"
          />
          <div
            class="w-3 h-3 rounded"
            style="background-color: #5c6b5c"
          />
          <div
            class="w-3 h-3 rounded"
            style="background-color: #3d4a3d"
          />
        </div>
        <span>多</span>
      </div>
      <div class="mt-2 text-xs text-gray-500 text-center">
        {{ streakDays > 0 ? `已连续学习 ${streakDays} 天` : '开始你的学习之旅' }}
      </div>
    </div>

    <!-- 成就徽章 -->
    <div class="stat-card">
      <h3 class="text-sm font-medium text-gray-700 mb-3">
        成就
      </h3>
      <div class="grid grid-cols-3 gap-2">
        <div
          v-for="achievement in achievements"
          :key="achievement.id"
          class="achievement-badge"
          :class="{ 'unlocked': achievement.unlocked }"
          :title="achievement.description"
        >
          <div class="text-2xl">
            {{ achievement.icon }}
          </div>
          <div class="text-xs mt-1">
            {{ achievement.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- 学习提示 -->
    <div class="stat-card bg-gradient-to-br from-blue-50 to-sage-50">
      <h3 class="text-sm font-medium text-gray-700 mb-2">
        学习提示
      </h3>
      <p class="text-xs text-gray-600 leading-relaxed">
        {{ tip }}
      </p>
    </div>

    <!-- 单词来源 -->
    <div class="stat-card">
      <h3 class="text-sm font-medium text-gray-700 mb-3">
        单词来源
      </h3>
      <div class="text-xs text-gray-600 space-y-1">
        <p>雅思高频词汇</p>
        <p>学术英语常用词</p>
        <p>来源：IELTS Corpus</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getRecentStudyDays, getStreakDays } from '../utils/studyHistory.js'

const props = defineProps({
  todayStats: {
    type: Object,
    default: () => ({
      newWords: 0,
      reviewWords: 0,
      aiExamples: 0,
      duration: '0分钟'
    })
  }
})

const heatmap = ref([])
const streakDays = ref(0)
const achievements = ref([
  { id: 1, name: '初学者', icon: '—', unlocked: true, description: '开始学习之旅' },
  { id: 2, name: '坚持', icon: '🔥', unlocked: false, description: '连续学习7天' },
  { id: 3, name: '百词达人', icon: '💯', unlocked: false, description: '学习100个单词' },
  { id: 4, name: 'AI助手', icon: '🤖', unlocked: false, description: '生成10个AI例句' },
  { id: 5, name: '完美主义', icon: '⭐', unlocked: false, description: '正确率达到90%' },
  { id: 6, name: '学习狂人', icon: '🚀', unlocked: false, description: '单日学习50个单词' }
])

const tips = [
  '尝试将单词放入句子中记忆，效果更好！',
  '定期复习是记忆的关键，建议使用间隔重复法。',
  'AI例句可以根据你的兴趣定制，试试看！',
  '遇到难记的单词，可以添加到单词本重点复习。',
  '每天坚持学习15分钟，比周末集中学习更有效。',
  '尝试用单词造句，能加深记忆。'
]

const tip = ref('')

// 加载学习热力图数据
const loadHeatmap = () => {
  heatmap.value = getRecentStudyDays(14)
  streakDays.value = getStreakDays()

  console.log('热力图数据:', heatmap.value)
  console.log('连续学习天数:', streakDays.value)

  // 更新成就
  achievements.value[1].unlocked = streakDays.value >= 7
  achievements.value[2].unlocked = props.todayStats.newWords >= 100
  achievements.value[3].unlocked = props.todayStats.aiExamples >= 10
  achievements.value[4].unlocked = calculateAccuracy() >= 90
  achievements.value[5].unlocked = props.todayStats.newWords >= 50
}

// 计算准确率
const calculateAccuracy = () => {
  // 这里需要从todayStats获取，暂时返回0
  return 0
}

// 随机选择一个提示
const selectTip = () => {
  tip.value = tips[Math.floor(Math.random() * tips.length)]
}

// 热力图颜色
const getHeatmapColor = (count) => {
  if (count === 0) return 'bg-gray-100'
  if (count < 5) return 'bg-sage-200'
  if (count < 10) return 'bg-sage-400'
  return 'bg-sage-600'
}

onMounted(() => {
  loadHeatmap()
  selectTip()
})

// 监听todayStats变化，更新成就
watch(() => props.todayStats, () => {
  loadHeatmap()
}, { deep: true })
</script>

<style scoped>
.stat-card {
  @apply bg-white rounded-lg p-4 shadow-sm;
  border: 1px solid #e5e7eb;
}

.achievement-badge {
  @apply text-center p-2 rounded-lg bg-gray-100 text-gray-400 transition-all;
}

.achievement-badge.unlocked {
  @apply bg-gradient-to-br from-sage-100 to-blue-100 text-gray-700;
}
</style>
