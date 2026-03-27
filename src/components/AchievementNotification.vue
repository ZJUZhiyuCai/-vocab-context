<template>
  <Transition name="achievement-pop">
    <div
      v-if="show"
      class="achievement-notification fixed top-24 right-6 z-50 backdrop-blur-xl rounded-3xl shadow-2xl p-5 max-w-sm"
      :class="isDark ? 'bg-slate-900/90 border border-white/10' : 'bg-white border border-gray-200'"
    >
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 flex items-center justify-center bg-emerald-500/10 rounded-xl text-2xl animate-bounce">
          <svg
            v-if="achievement.icon === '⭐'"
            class="w-8 h-8 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 3.917 1.48-8.279L.332 9.306l8.332-1.151L12 .587z" />
          </svg>
          <svg
            v-else-if="achievement.icon === '🏆'"
            class="w-8 h-8 text-amber-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm-1 10h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2z" />
          </svg>
          <svg
            v-else-if="achievement.icon === '✨'"
            class="w-8 h-8 text-purple-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0l3.09 6.26L22 7.27l-5 4.87 1.18 6.88L12 16.5l-6.18 3.52L7 12.14l-5-4.87 6.91-1.01L12 0z" />
          </svg>
          <svg
            v-else-if="achievement.icon === '🚀'"
            class="w-8 h-8 text-blue-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-3.314 0-6 2.686-6 6v12c0 3.314 2.686 6 6 6s6-2.686 6-6V6c0-3.314-2.686-6-6-6zm0 2c2.209 0 4 1.791 4 4v12c0 2.209-1.791 4-4 4s-4-1.791-4-4V6c0-2.209 1.791-4 4-4zm0 4c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm0 4c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm0 4c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z" />
          </svg>
          <span v-else>{{ achievement.icon }}</span>
        </div>
        <div class="flex-1">
          <div class="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
            成就解锁
          </div>
          <div :class="['text-base font-bold mb-1', isDark ? 'text-white' : 'text-gray-800']">
            {{ achievement.name }}
          </div>
          <div :class="['text-sm mb-2', isDark ? 'text-slate-400' : 'text-gray-600']">
            {{ achievement.description }}
          </div>
          <div
            v-if="achievement.reward"
            :class="['text-xs px-2 py-1 rounded inline-block', isDark ? 'text-amber-300 bg-amber-900/30' : 'text-emerald-600 bg-emerald-100']"
          >
            {{ achievement.reward }}
          </div>
        </div>
        <button
          :class="['transition-colors', isDark ? 'text-slate-500 hover:text-white' : 'text-gray-400 hover:text-gray-800']"
          @click="close"
        >
          ✕
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useTheme } from '../composables/useTheme.js'

const { isDark } = useTheme()

const props = defineProps({
  achievement: {
    type: Object,
    required: true
  },
  autoClose: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: 5000 // 5秒后自动关闭
  }
})

const emit = defineEmits(['close'])

const show = ref(true)
let closeTimer = null

const close = () => {
  show.value = false
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  emit('close')
}

// 自动关闭
if (props.autoClose) {
  closeTimer = setTimeout(() => {
    close()
  }, props.duration)
}

// 监听成就变化
watch(() => props.achievement, (newAchievement) => {
  if (newAchievement) {
    show.value = true
    if (props.autoClose) {
      if (closeTimer) clearTimeout(closeTimer)
      closeTimer = setTimeout(close, props.duration)
    }
  }
})
</script>

<style scoped>
.achievement-pop-enter-active {
  animation: slideInRight 0.5s ease-out;
}

.achievement-pop-leave-active {
  animation: slideOutRight 0.3s ease-in;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
