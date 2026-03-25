<template>
  <div
    :class="[
      'backdrop-blur-sm border rounded-3xl p-6 shadow-lg transition-all',
      isDark
        ? 'bg-gradient-to-br from-slate-800/70 to-slate-800/50 border-emerald-500/20'
        : 'bg-white border-emerald-200'
    ]"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <span class="text-lg">📅</span>
        </div>
        <div>
          <h3 :class="['font-bold', isDark ? 'text-white' : 'text-slate-900']">
            首周学习计划
          </h3>
          <p class="text-xs text-gray-500">Day {{ todayTask?.day || 1 }}/7</p>
        </div>
      </div>
      <div :class="['text-sm font-semibold px-3 py-1 rounded-full', isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700']">
        {{ progressPercent }}%
      </div>
    </div>

    <!-- Progress Bar -->
    <div :class="['w-full rounded-full h-2 mb-4', isDark ? 'bg-slate-700' : 'bg-gray-200']">
      <div
        class="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-500"
        :style="{ width: progressPercent + '%' }"
      ></div>
    </div>

    <!-- Day Progress Dots -->
    <div class="flex justify-between mb-5 px-1">
      <div
        v-for="day in 7"
        :key="day"
        :class="[
          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
          isCompletedDay(day)
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
            : day === todayTask?.day
              ? (isDark ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50' : 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500')
              : (isDark ? 'bg-slate-700 text-gray-500' : 'bg-gray-100 text-gray-400')
        ]"
      >
        {{ isCompletedDay(day) ? '✓' : day }}
      </div>
    </div>

    <!-- Today's Tasks -->
    <div v-if="todayTask" :class="['rounded-2xl p-4 mb-4', isDark ? 'bg-slate-900/50' : 'bg-gray-50']">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-sm font-semibold" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
          今天任务
        </span>
        <span :class="['text-xs px-2 py-0.5 rounded-full', isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700']">
          {{ todayTask.title }}
        </span>
      </div>

      <div class="space-y-2">
        <div
          v-for="task in todayTask.tasks"
          :key="task.id"
          :class="[
            'flex items-center gap-3 p-3 rounded-xl transition-all',
            task.completed
              ? (isDark ? 'bg-emerald-500/10' : 'bg-emerald-50')
              : (isDark ? 'bg-white/5' : 'bg-white')
          ]"
        >
          <div
            :class="[
              'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
              task.completed
                ? 'bg-emerald-500 text-white'
                : (isDark ? 'bg-slate-700 border border-slate-600' : 'bg-gray-200 border border-gray-300')
            ]"
          >
            <svg v-if="task.completed" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span
            :class="[
              'text-sm font-medium flex-1',
              task.completed
                ? (isDark ? 'text-emerald-400 line-through' : 'text-emerald-600 line-through')
                : (isDark ? 'text-gray-200' : 'text-gray-800')
            ]"
          >
            {{ task.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- Tip -->
    <div class="flex items-start gap-2 mb-4">
      <span class="text-sm">💡</span>
      <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
        {{ todayTask?.tip || '继续加油！' }}
      </p>
    </div>

    <!-- Action Button -->
    <button
      v-if="!isTodayComplete"
      @click="handleStartTask"
      class="w-full py-3 rounded-2xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:bg-emerald-500 hover:shadow-emerald-500/40 transition-all"
    >
      开始今天的任务
    </button>
    <div
      v-else
      :class="['text-center py-3 rounded-2xl', isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700']"
    >
      <span class="font-semibold">✨ 今日任务已完成！</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useTheme } from '../composables/useTheme.js'
import {
  FIRST_WEEK_PROGRESS_EVENT,
  getOrCreateFirstWeekProgress,
  getTodayTask,
  getFirstWeekProgressPercent,
  calculateCurrentDay,
  checkTaskCompletion
} from '../utils/firstWeekScaffold.js'

const props = defineProps({
  currentVocab: {
    type: Object,
    default: null
  },
  learnedCount: {
    type: Number,
    default: 0
  },
  totalLearned: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['navigate'])

const { isDark } = useTheme()

const progress = ref(getOrCreateFirstWeekProgress())

function refreshProgress(nextProgress = getOrCreateFirstWeekProgress()) {
  progress.value = nextProgress
}

function handleProgressUpdate(event) {
  refreshProgress(event?.detail || getOrCreateFirstWeekProgress())
}

onMounted(() => {
  refreshProgress()
  window.addEventListener(FIRST_WEEK_PROGRESS_EVENT, handleProgressUpdate)
})

onUnmounted(() => {
  window.removeEventListener(FIRST_WEEK_PROGRESS_EVENT, handleProgressUpdate)
})

const todayTask = computed(() => {
  const task = getTodayTask(progress.value)
  if (!task) return null

  // 实时检查任务完成状态
  const context = {
    learnedCount: props.learnedCount,
    totalLearned: props.totalLearned
  }

  return {
    ...task,
    tasks: task.tasks.map(t => ({
      ...t,
      completed: progress.value?.completedTasks?.includes(t.id) || checkTaskCompletion(t.id, context)
    }))
  }
})

const progressPercent = computed(() => getFirstWeekProgressPercent(progress.value))

const isTodayComplete = computed(() => {
  if (!todayTask.value) return false
  return todayTask.value.tasks.every(task => task.completed)
})

function isCompletedDay(day) {
  return progress.value?.dayCompleted?.includes(day)
}

function handleStartTask() {
  // 根据当天任务决定跳转到哪里
  if (!todayTask.value) return

  const currentDay = todayTask.value.day

  // Day 1-2: 留在 Today 页面学习词汇
  if (currentDay <= 2) {
    // 已经在 Today 页面，不需要跳转
    return
  }

  // Day 3: Context-first
  if (currentDay === 3) {
    emit('navigate', 'context')
    return
  }

  // Day 4: Output Studio
  if (currentDay === 4) {
    emit('navigate', 'context')
    return
  }

  // Day 5: Exam Drills
  if (currentDay === 5) {
    emit('navigate', 'context')
    return
  }

  // Day 6: 复习
  if (currentDay === 6) {
    emit('navigate', 'review')
    return
  }

  // Day 7: Context 页面
  if (currentDay === 7) {
    emit('navigate', 'context')
  }
}
</script>
