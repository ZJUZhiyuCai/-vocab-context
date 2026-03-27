<template>
  <aside class="sidebar w-60 bg-white border-r border-gray-200 flex flex-col">
    <!-- Logo区域 -->
    <div class="p-6 border-b border-gray-100">
      <h1 class="text-xl font-bold text-sage-500">
        VocabMan
      </h1>
      <p class="text-xs text-gray-500 mt-1">
        语境词汇学习
      </p>
    </div>

    <!-- 导航菜单 -->
    <nav class="flex-1 p-4">
      <ul class="space-y-2">
        <li>
          <a
            href="#"
            class="nav-item"
            :class="{ 'active': currentPage === 'today' }"
            @click.prevent="$emit('navigate', 'today')"
          >
            <span class="text-xl">📖</span>
            <span>今日学习</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="nav-item"
            :class="{ 'active': currentPage === 'review' }"
            @click.prevent="$emit('navigate', 'review')"
          >
            <span class="text-xl">🔄</span>
            <span>复习列表</span>
            <span
              v-if="reviewCount > 0"
              class="badge"
            >{{ reviewCount }}</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="nav-item"
            :class="{ 'active': currentPage === 'wordbook' }"
            @click.prevent="$emit('navigate', 'wordbook')"
          >
            <span class="text-xl">📓</span>
            <span>单词本</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="nav-item"
            :class="{ 'active': currentPage === 'quiz' }"
            @click.prevent="$emit('navigate', 'quiz')"
          >
            <span class="text-xl">🎯</span>
            <span>测验</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="nav-item"
            :class="{ 'active': currentPage === 'achievements' }"
            @click.prevent="$emit('navigate', 'achievements')"
          >
            <span class="text-xl">🏆</span>
            <span>成就</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="nav-item"
            :class="{ 'active': currentPage === 'speaking' }"
            @click.prevent="$emit('navigate', 'speaking')"
          >
            <span class="text-xl">🗣️</span>
            <span>口语话题</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="nav-item"
            @click.prevent="$emit('open-vocab-selector')"
          >
            <span class="text-xl">📚</span>
            <span>选择词库</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="nav-item"
            @click.prevent="$emit('open-settings')"
          >
            <span class="text-xl">⚙️</span>
            <span>设置</span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- 底部进度卡片 -->
    <div class="p-4 border-t border-gray-100">
      <div class="bg-gradient-to-br from-sage-50 to-beige-50 rounded-lg p-4">
        <div class="text-xs text-gray-600 mb-2">
          今日学习
        </div>
        <div class="flex justify-between items-baseline mb-2">
          <span class="text-2xl font-bold text-sage-500">{{ todayLearned }}</span>
          <span class="text-xs text-gray-500">/ {{ todayTarget }}个</span>
        </div>
        <div class="w-full bg-beige-200 rounded-full h-2">
          <div
            class="bg-sage-500 h-2 rounded-full transition-all duration-500"
            :style="{ width: todayProgress + '%' }"
          />
        </div>
        <p class="text-xs text-gray-500 mt-2">
          {{ todayProgress >= 100 ? '🎉 目标达成！' : '加油，继续学习！' }}
        </p>
      </div>

      <!-- 快速统计 -->
      <div class="mt-4 grid grid-cols-2 gap-2">
        <div class="text-center p-2 bg-beige-50 rounded">
          <div class="text-lg font-bold text-sage-500">
            {{ totalLearned }}
          </div>
          <div class="text-xs text-gray-500">
            已掌握
          </div>
        </div>
        <div class="text-center p-2 bg-beige-50 rounded">
          <div class="text-lg font-bold text-blue-500">
            {{ accuracy }}%
          </div>
          <div class="text-xs text-gray-500">
            正确率
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: String,
    default: 'today'
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  todayLearned: {
    type: Number,
    default: 0
  },
  todayTarget: {
    type: Number,
    default: 20
  },
  totalLearned: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  }
})

defineEmits(['navigate', 'open-settings'])

const todayProgress = computed(() => {
  if (props.todayTarget === 0) return 0
  return Math.min(100, Math.round((props.todayLearned / props.todayTarget) * 100))
})
</script>

<style scoped>
.nav-item {
  @apply flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-beige-50 hover:text-sage-500 transition-colors;
}

.nav-item.active {
  @apply bg-sage-50 text-sage-500 font-medium;
}

.badge {
  @apply ml-auto bg-error text-white text-xs px-2 py-0.5 rounded-full;
}
</style>
