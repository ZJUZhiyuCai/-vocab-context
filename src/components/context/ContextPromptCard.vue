<template>
  <div class="context-prompt-card">
    <!-- Glass Card -->
    <div class="group relative">
      <!-- Glow Effect -->
      <div class="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-[28px] opacity-15 group-hover:opacity-25 blur-xl transition-all duration-500" />

      <!-- Card -->
      <div
        :class="[
          'relative backdrop-blur-xl border rounded-3xl p-8 shadow-2xl transform transition-all duration-500 hover:shadow-amber-500/10',
          isDark ? 'bg-slate-800/70 border-white/10' : 'bg-white/80 border-black/10 shadow-lg'
        ]"
      >
        <!-- Badge -->
        <div class="flex items-center gap-3 mb-6">
          <span
            :class="[
              'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold',
              isDark ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'bg-amber-100 border border-amber-300 text-amber-700'
            ]"
          >
            <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Context-first
          </span>
          <span
            v-if="bundle?.topic"
            :class="[
              'px-3 py-1 rounded-lg text-xs font-medium',
              isDark ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            ]"
          >
            {{ topicLabel }}
          </span>
        </div>

        <!-- Context -->
        <div :class="['p-7 rounded-2xl border mb-6', isDark ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50 border-amber-200']">
          <div class="flex items-center gap-2 mb-4">
            <span class="w-1.5 h-6 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
            <h3 :class="['text-sm font-bold', isDark ? 'text-amber-400' : 'text-amber-600']">
              语境理解
            </h3>
          </div>
          <p :class="['text-xl leading-[1.9]', isDark ? 'text-amber-100/90' : 'text-amber-900']">
            {{ context?.text || 'Loading context...' }}
          </p>
          <p
            v-if="context?.translation"
            :class="['text-sm mt-3', isDark ? 'text-amber-300/50' : 'text-amber-700/70']"
          >
            {{ context.translation }}
          </p>
        </div>

        <!-- Hint -->
        <div :class="['p-4 rounded-xl border mb-6', isDark ? 'bg-slate-700/30 border-white/5' : 'bg-gray-50 border-gray-200']">
          <p :class="['text-sm', isDark ? 'text-gray-400' : 'text-gray-600']">
            先凭语境猜意思，再答题。
          </p>
        </div>

        <!-- Continue Button -->
        <button
          class="w-full py-4 rounded-2xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          @click="$emit('continue')"
        >
          <span>开始答题</span>
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../../composables/useTheme.js'

const { isDark } = useTheme()

const props = defineProps({
  bundle: {
    type: Object,
    default: null
  },
  context: {
    type: Object,
    default: null
  }
})

defineEmits(['continue'])

const topicLabel = computed(() => {
  const labels = {
    education: '教育',
    environment: '环境',
    technology: '科技',
    government: '政府',
    health: '健康',
    society: '社会',
    economy: '经济',
    work: '工作',
    media: '媒体',
    crime: '犯罪',
    culture: '文化',
    transport: '交通',
    general: '通用'
  }
  return labels[props.bundle?.topic] || props.bundle?.topic || '通用'
})
</script>

<style scoped>
.context-prompt-card {
  @apply w-full;
}
</style>
