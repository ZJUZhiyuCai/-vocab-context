<template>
  <nav class="mobile-tab-bar" :class="isDark ? 'dark' : 'light'">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      @click="$emit('navigate', tab.key)"
      class="tab-item"
      :class="{ active: currentTab === tab.key }"
    >
      <div class="tab-icon-wrapper">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
        </svg>
      </div>
      <span class="tab-label">{{ tab.label }}</span>
      <span v-if="tab.badge && tab.badge > 0" class="tab-badge">{{ tab.badge }}</span>
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme.js'

const { isDark } = useTheme()

const props = defineProps({
  currentTab: {
    type: String,
    default: 'today'
  },
  reviewCount: {
    type: Number,
    default: 0
  }
})

defineEmits(['navigate'])

const tabs = computed(() => [
  {
    key: 'today',
    label: '今日学习',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.168.477-4.5 1.253'
  },
  {
    key: 'vocab',
    label: '词库',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
  },
  {
    key: 'review',
    label: '复习',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    badge: props.reviewCount
  },
  {
    key: 'context',
    label: '语境',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    key: 'wordbook',
    label: '单词本',
    icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
  },
  {
    key: 'achievements',
    label: '成就',
    icon: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.703 2.703 0 01-3 0 2.703 2.703 0 01-3 0 2.703 2.703 0 01-3 0 2.701 2.701 0 01-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9V9a2 2 0 00-2-2H8a2 2 0 00-2 2v3h12z'
  }
])
</script>

<style scoped>
.mobile-tab-bar {
  @apply fixed bottom-0 left-0 right-0 backdrop-blur-xl;
  @apply flex justify-around items-center;
  @apply lg:hidden;
  padding-bottom: max(env(safe-area-inset-bottom, 0), 12px);
  z-index: 40;
}

.dark.mobile-tab-bar {
  @apply bg-slate-900/80 border-t border-white/10;
}

.light.mobile-tab-bar {
  @apply bg-white/95 border-t border-gray-200 shadow-lg;
}

.tab-item {
  @apply relative flex flex-col items-center justify-center;
  @apply py-2 px-1;
  @apply transition-all duration-300;
  min-height: 64px;
  flex: 1;
}

.dark .tab-item {
  @apply text-slate-500;
}

.light .tab-item {
  @apply text-gray-500;
}

.tab-item.active {
  @apply text-emerald-400;
}

.tab-icon-wrapper {
  @apply mb-1 flex items-center justify-center transition-transform duration-300;
}

.tab-item.active .tab-icon-wrapper {
  @apply scale-110;
}

.tab-icon {
  @apply text-2xl mb-1;
  line-height: 1;
}

.tab-label {
  @apply text-xs;
  line-height: 1;
}

.tab-badge {
  @apply absolute top-2 right-4;
  @apply bg-rose-500 text-white;
  @apply text-[10px] font-bold rounded-full;
  @apply min-w-[16px] h-[16px];
  @apply flex items-center justify-center;
  @apply shadow-lg shadow-rose-500/30;
  padding: 0 4px;
  line-height: 1;
}

.dark .tab-badge {
  border: 2px solid #0f172a;
}

.light .tab-badge {
  border: 2px solid #ffffff;
}

.tab-item:active {
  transform: scale(0.95);
}

.tab-item.active {
  transform: scale(1.02);
}
</style>
