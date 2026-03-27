<template>
  <div
    class="wordbook-page animate-slide-right"
    :class="isDark ? 'dark' : 'light'"
  >
    <!-- 顶部导航栏 -->
    <div
      class="backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-6 flex justify-between items-center"
      :class="isDark ? 'bg-slate-800/50 border border-white/10' : 'bg-white/90 border border-gray-200'"
    >
      <button
        class="flex items-center gap-2 transition-colors"
        :class="isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'"
        @click="$emit('back')"
      >
        <span>←</span>
        <span>返回今日学习</span>
      </button>
      <h1
        class="text-xl font-bold"
        :class="isDark ? 'text-white' : 'text-gray-800'"
      >
        单词本
      </h1>
      <div class="w-24" />
    </div>

    <!-- 批量操作栏 -->
    <div
      v-if="wordbookWords.length > 0"
      class="backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-6"
      :class="isDark ? 'bg-slate-800/50 border border-white/10' : 'bg-white/90 border border-gray-200'"
    >
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="selectAll"
              type="checkbox"
              class="w-4 h-4 text-emerald-500 rounded bg-slate-700 border-gray-600 focus:ring-emerald-500 focus:ring-offset-slate-800"
              @change="handleSelectAll"
            >
            <span
              class="text-sm"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >全选</span>
          </label>
          <span class="text-sm text-gray-500">
            已选 {{ selectedIds.size }} / {{ wordbookWords.length }} 个
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="selectedIds.size > 0"
            class="px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/30"
            @click="handleBatchRemove"
          >
            批量删除
          </button>
          <div class="relative">
            <button
              class="px-4 py-2 text-sm bg-emerald-600 text-white hover:bg-emerald-500 rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
              @click="showExportMenu = !showExportMenu"
            >
              导出 ↓
            </button>
            <div
              v-if="showExportMenu"
              class="absolute right-0 mt-2 w-48 rounded-xl shadow-xl z-10 overflow-hidden"
              :class="isDark ? 'bg-slate-800 border border-white/10' : 'bg-white border border-gray-200'"
            >
              <button
                class="w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-2"
                :class="isDark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'"
                @click="exportToAnki"
              >
                <svg
                  class="w-4 h-4 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                /></svg>
                <span>导出为 Anki 格式</span>
              </button>
              <button
                class="w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-2"
                :class="isDark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'"
                @click="exportToJSON"
              >
                <svg
                  class="w-4 h-4 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                /></svg>
                <span>导出为 JSON 格式</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div
      v-if="wordbookWords.length === 0"
      class="text-center py-16 rounded-3xl"
      :class="isDark ? 'bg-slate-800/30 border border-white/5' : 'bg-gray-50 border border-gray-200'"
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
            stroke-width="1"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.168.477-4.5 1.253"
          />
        </svg>
      </div>
      <h2
        class="text-2xl font-bold mb-2"
        :class="isDark ? 'text-white' : 'text-gray-800'"
      >
        单词本为空
      </h2>
      <p
        class="mb-6"
        :class="isDark ? 'text-gray-500' : 'text-gray-600'"
      >
        在单词卡片上点击星标按钮收藏单词
      </p>
      <button
        class="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 text-white shadow-lg hover:shadow-emerald-500/30 transition-all"
        @click="$emit('back')"
      >
        去学习单词
      </button>
    </div>

    <!-- 单词列表 -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="word in wordbookWords"
        :key="word.id"
        class="backdrop-blur-sm rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300 group"
        :class="isDark ? 'bg-slate-800/80 border border-white/5 hover:border-emerald-500/30 hover:bg-slate-800/90' : 'bg-white border border-gray-200 hover:border-emerald-400 hover:shadow-lg'"
      >
        <!-- 复选框和收藏按钮 -->
        <div class="flex justify-between items-start mb-3">
          <input
            type="checkbox"
            :checked="selectedIds.has(word.id)"
            class="w-4 h-4 text-emerald-500 rounded bg-slate-700 border-gray-600 focus:ring-emerald-500 focus:ring-offset-slate-800 mt-1"
            @change="toggleSelection(word.id)"
          >
          <button
            class="text-amber-400 hover:text-amber-300 hover:scale-110 transition-transform p-1"
            title="从单词本移除"
            @click="handleRemove(word.id)"
          >
            <svg
              class="w-5 h-5 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        </div>

        <!-- 单词标题 -->
        <h3
          class="text-lg font-bold mb-2 group-hover:text-emerald-500 transition-colors"
          :class="isDark ? 'text-white' : 'text-gray-800'"
        >
          {{ word.word }}
        </h3>

        <!-- 音标和词性 -->
        <div class="flex flex-wrap gap-2 text-sm text-gray-500 mb-3">
          <span
            v-if="word.ipa"
            class="flex items-center gap-1 font-mono text-slate-400"
          >
            <svg
              class="w-3.5 h-3.5 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            /></svg>
            {{ word.ipa }}
          </span>
          <span
            v-if="word.partOfSpeech"
            class="px-2 py-0.5 rounded bg-white/5 text-gray-400 text-xs border border-white/5"
          >{{ word.partOfSpeech }}</span>
        </div>

        <!-- 释义 -->
        <p
          class="text-sm leading-relaxed mb-3 line-clamp-2"
          :class="isDark ? 'text-gray-300' : 'text-gray-600'"
        >
          {{ word.meaning }}
        </p>

        <!-- 收藏时间 -->
        <div class="text-[10px] text-slate-600 border-t border-white/5 pt-2 flex items-center gap-1 uppercase tracking-wider">
          <svg
            class="w-3 h-3 opacity-40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          /></svg>
          收藏于 {{ getFavoriteTime(word.id) }}
        </div>

        <!-- 标签 -->
        <div
          v-if="word.tags && word.tags.length > 0"
          class="flex flex-wrap gap-1 mt-2"
        >
          <span
            v-for="(tag, index) in word.tags.slice(0, 3)"
            :key="index"
            class="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- 导出成功提示 -->
    <div
      v-if="exportSuccess"
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-xl z-50 animate-slide-up border border-emerald-500/50"
    >
      {{ exportSuccess }}
    </div>

    <!-- 确认删除弹窗 -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        class="rounded-2xl p-6 max-w-md w-full shadow-2xl"
        :class="isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-gray-200'"
      >
        <h3
          class="text-lg font-bold mb-2"
          :class="isDark ? 'text-white' : 'text-gray-800'"
        >
          确认删除
        </h3>
        <p
          class="mb-6"
          :class="isDark ? 'text-gray-400' : 'text-gray-600'"
        >
          确定要删除选中的 {{ selectedIds.size }} 个单词吗？
        </p>
        <div class="flex gap-3">
          <button
            class="flex-1 px-4 py-2.5 rounded-xl font-bold bg-rose-600 text-white hover:bg-rose-500 transition-colors"
            @click="confirmBatchRemove"
          >
            确认删除
          </button>
          <button
            class="flex-1 px-4 py-2.5 rounded-xl font-bold transition-colors"
            :class="isDark ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            @click="showDeleteConfirm = false"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme.js'
import logger from '../utils/logger.js'

const { isDark } = useTheme()

const props = defineProps({
  words: {
    type: Array,
    default: () => []
  },
  wordbook: {
    type: Set,
    required: true
  }
})

const emit = defineEmits(['back', 'remove', 'batchRemove'])

// 状态
const selectedIds = ref(new Set())
const selectAll = ref(false)
const showExportMenu = ref(false)
const exportSuccess = ref(null)
const showDeleteConfirm = ref(false)
const favoriteTimes = ref(new Map())

// 计算属性：单词本中的单词列表
const wordbookWords = computed(() => {
  return props.words
    .filter(word => props.wordbook.has(word.id))
    .sort((a, b) => {
      // 按收藏时间倒序排列
      const timeA = favoriteTimes.value.get(a.id) || 0
      const timeB = favoriteTimes.value.get(b.id) || 0
      return timeB - timeA
    })
})

// 获取收藏时间
const getFavoriteTime = (wordId) => {
  const timestamp = favoriteTimes.value.get(wordId)
  if (!timestamp) return '未知'

  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  // 小于1小时
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}分钟前`
  }

  // 今天
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  // 昨天
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  // 更早
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

// 全选/取消全选
const handleSelectAll = () => {
  if (selectAll.value) {
    wordbookWords.value.forEach(word => selectedIds.value.add(word.id))
  } else {
    selectedIds.value.clear()
  }
}

// 切换单个选择
const toggleSelection = (wordId) => {
  if (selectedIds.value.has(wordId)) {
    selectedIds.value.delete(wordId)
  } else {
    selectedIds.value.add(wordId)
  }

  // 更新全选状态
  selectAll.value = selectedIds.value.size === wordbookWords.value.length
}

// 移除单个单词
const handleRemove = (wordId) => {
  emit('remove', wordId)
  selectedIds.value.delete(wordId)
  selectAll.value = false
}

// 批量删除
const handleBatchRemove = () => {
  if (selectedIds.value.size === 0) return
  showDeleteConfirm.value = true
}

// 确认批量删除
const confirmBatchRemove = () => {
  emit('batchRemove', Array.from(selectedIds.value))
  selectedIds.value.clear()
  selectAll.value = false
  showDeleteConfirm.value = false
}

// 导出为 Anki 格式
const exportToAnki = () => {
  if (wordbookWords.value.length === 0) return

  const selectedWords = selectedIds.value.size > 0
    ? wordbookWords.value.filter(w => selectedIds.value.has(w.id))
    : wordbookWords.value

  // Anki 格式：正面\t背面\t标签
  let content = ''
  selectedWords.forEach(word => {
    const front = word.word
    const back = `${word.meaning}\n\n${word.ipa ? '发音: ' + word.ipa : ''}${word.examples && word.examples.length > 0 ? '\n\n例句:\n' + word.examples[0].sentence : ''}`
    const tags = word.tags ? word.tags.join(' ') : ''

    content += `${front}\t${back}\t${tags}\n`
  })

  downloadFile(content, 'vocab-context-anki.txt', 'text/plain')
  showExportSuccess(`已导出 ${selectedWords.length} 个单词到 Anki 格式`)
  showExportMenu.value = false
}

// 导出为 JSON 格式
const exportToJSON = () => {
  if (wordbookWords.value.length === 0) return

  const selectedWords = selectedIds.value.size > 0
    ? wordbookWords.value.filter(w => selectedIds.value.has(w.id))
    : wordbookWords.value

  const data = {
    exportDate: new Date().toISOString(),
    count: selectedWords.length,
    words: selectedWords.map(word => ({
      word: word.word,
      ipa: word.ipa,
      partOfSpeech: word.partOfSpeech,
      meaning: word.meaning,
      examples: word.examples,
      collocations: word.collocations,
      synonyms: word.synonyms,
      tags: word.tags,
      favoriteTime: favoriteTimes.value.get(word.id)
    }))
  }

  downloadFile(JSON.stringify(data, null, 2), 'vocab-context.json', 'application/json')
  showExportSuccess(`已导出 ${selectedWords.length} 个单词到 JSON 格式`)
  showExportMenu.value = false
}

// 下载文件
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 显示导出成功提示
const showExportSuccess = (message) => {
  exportSuccess.value = message
  setTimeout(() => {
    exportSuccess.value = null
  }, 3000)
}

// 点击外部关闭导出菜单
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showExportMenu.value = false
  }
}

// 初始化
onMounted(() => {
  // 加载收藏时间（从 localStorage）
  const saved = localStorage.getItem('vocab-context-favorite-times')
  if (saved) {
    try {
      favoriteTimes.value = new Map(JSON.parse(saved))
    } catch (e) {
      logger.error('加载收藏时间失败:', e)
    }
  }

  // 添加点击外部事件监听
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // 移除点击外部事件监听
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.wordbook-page {
  @apply max-w-7xl mx-auto px-4;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
