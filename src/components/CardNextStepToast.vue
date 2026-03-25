<template>
  <Transition name="slide-up">
    <div
      v-if="visible"
      :class="[
        'fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-40',
        'max-w-md w-[calc(100%-2rem)] md:w-full',
        'rounded-2xl border shadow-2xl backdrop-blur-xl',
        'p-4 flex items-center gap-4',
        isDark
          ? 'bg-slate-800/90 border-emerald-500/30 shadow-emerald-500/10'
          : 'bg-white/95 border-emerald-200 shadow-emerald-500/5'
      ]"
    >
      <!-- Icon -->
      <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
        <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <p :class="['text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900']">
          {{ recommendation?.title }}
        </p>
        <p :class="['text-xs mt-0.5', isDark ? 'text-gray-400' : 'text-gray-600']">
          下一步建议
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 flex-shrink-0">
        <button
          @click="handleDismiss"
          :class="[
            'px-3 py-2 text-xs font-medium rounded-xl transition-all',
            isDark
              ? 'text-gray-400 hover:text-white hover:bg-white/10'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          ]"
        >
          稍后
        </button>
        <button
          @click="handleAction"
          class="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all"
        >
          {{ recommendation?.ctaLabel }}
        </button>
      </div>

      <!-- Progress Bar -->
      <div
        class="absolute bottom-0 left-0 h-1 bg-emerald-500 rounded-b-2xl transition-all duration-100"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme.js'

const props = defineProps({
  recommendation: {
    type: Object,
    default: null
  },
  duration: {
    type: Number,
    default: 6000 // 6秒后自动消失
  }
})

const emit = defineEmits(['action', 'dismiss'])

const { isDark } = useTheme()
const visible = ref(false)
const progress = ref(100)
let hideTimer = null
let progressTimer = null

function clearTimers() {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}

watch(() => props.recommendation, (newVal) => {
  if (newVal) {
    show()
  }
}, { immediate: true })

function show() {
  // 先清理旧定时器，避免重复显示时旧 timer 提前关闭新 toast
  clearTimers()

  visible.value = true
  progress.value = 100

  // Progress bar animation
  const startTime = Date.now()
  progressTimer = setInterval(() => {
    const elapsed = Date.now() - startTime
    progress.value = Math.max(0, 100 - (elapsed / props.duration) * 100)
    if (progress.value <= 0) {
      clearInterval(progressTimer)
      progressTimer = null
    }
  }, 50)

  // Auto hide
  hideTimer = setTimeout(() => {
    hideTimer = null
    hide()
    // 自动关闭时通知父级清空状态
    emit('dismiss')
  }, props.duration)
}

function hide() {
  visible.value = false
  clearTimers()
}

function handleAction() {
  hide()
  emit('action', props.recommendation)
}

function handleDismiss() {
  hide()
  emit('dismiss')
}

onUnmounted(() => {
  clearTimers()
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>