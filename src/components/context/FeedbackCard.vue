<template>
  <div class="feedback-card">
    <!-- Glass Card -->
    <div class="group relative">
      <!-- Glow Effect -->
      <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-[28px] opacity-15 group-hover:opacity-25 blur-xl transition-all duration-500"></div>

      <!-- Card -->
      <div :class="[
        'relative backdrop-blur-xl border rounded-3xl p-8 shadow-2xl transform transition-all duration-500',
        isDark ? 'bg-slate-800/70 border-white/10' : 'bg-white/80 border-black/10 shadow-lg'
      ]">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <span :class="[
            'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold',
            isDark ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-emerald-100 border border-emerald-300 text-emerald-700'
          ]">
            学习反馈
          </span>
          <span v-if="result" :class="[
            'px-3 py-1 rounded-lg text-sm font-bold',
            overallSuccess
              ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
              : isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
          ]">
            {{ overallSuccess ? '✓ 掌握' : '→ 需复习' }}
          </span>
        </div>

        <!-- Word -->
        <div class="mb-6">
          <h2 :class="['text-4xl font-bold mb-2', isDark ? 'text-white' : 'text-slate-900']">
            {{ bundle?.word || '...' }}
          </h2>
          <div class="flex items-center gap-3">
            <span :class="['text-lg', isDark ? 'text-gray-400' : 'text-gray-600']">
              {{ bundle?.ipa || '' }}
            </span>
            <span :class="[
              'px-2 py-0.5 rounded text-xs font-medium',
              isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-100 text-amber-700'
            ]">
              {{ bundle?.partOfSpeech || '' }}
            </span>
          </div>
        </div>

        <!-- Definitions -->
        <div class="space-y-4 mb-6">
          <!-- Chinese Meaning -->
          <div :class="['p-4 rounded-2xl border', isDark ? 'bg-slate-700/30 border-white/5' : 'bg-gray-50 border-gray-200']">
            <p :class="['text-xs font-medium mb-1', isDark ? 'text-gray-400' : 'text-gray-600']">中文释义</p>
            <p :class="['text-lg font-medium', isDark ? 'text-gray-200' : 'text-gray-800']">
              {{ bundle?.meaning || '-' }}
            </p>
          </div>

          <!-- English Definition -->
          <div :class="['p-4 rounded-2xl border', isDark ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50 border-emerald-200']">
            <p :class="['text-xs font-medium mb-1', isDark ? 'text-emerald-400' : 'text-emerald-600']">English Definition</p>
            <p :class="['text-base italic', isDark ? 'text-emerald-200/80' : 'text-emerald-900']">
              {{ bundle?.englishDefinition || '-' }}
            </p>
          </div>
        </div>

        <!-- Collocations -->
        <div v-if="bundle?.collocations?.length" class="mb-6">
          <p :class="['text-xs font-medium mb-2', isDark ? 'text-gray-400' : 'text-gray-600']">常用搭配</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="col in bundle.collocations.slice(0, 4)"
              :key="col"
              :class="[
                'px-3 py-1 rounded-lg text-sm',
                isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
              ]"
            >
              {{ col }}
            </span>
          </div>
        </div>

        <!-- Paraphrases -->
        <div v-if="bundle?.paraphrases?.length" class="mb-6">
          <p :class="['text-xs font-medium mb-2', isDark ? 'text-gray-400' : 'text-gray-600']">同义改写</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="para in bundle.paraphrases.slice(0, 4)"
              :key="para"
              :class="[
                'px-3 py-1 rounded-lg text-sm',
                isDark ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-violet-50 text-violet-700 border border-violet-200'
              ]"
            >
              {{ para }}
            </span>
          </div>
        </div>

        <!-- Result Summary -->
        <div v-if="result" :class="['p-4 rounded-xl border mb-6', isDark ? 'bg-slate-700/30 border-white/5' : 'bg-gray-50 border-gray-200']">
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <p :class="['text-xs mb-1', isDark ? 'text-gray-400' : 'text-gray-600']">释义</p>
              <p :class="['text-lg font-bold', result.meaningCorrect ? 'text-emerald-400' : 'text-rose-400']">
                {{ result.meaningCorrect ? '✓' : '✗' }}
              </p>
            </div>
            <div>
              <p :class="['text-xs mb-1', isDark ? 'text-gray-400' : 'text-gray-600']">改写</p>
              <p :class="['text-lg font-bold', result.paraphraseCorrect ? 'text-emerald-400' : 'text-rose-400']">
                {{ result.paraphraseCorrect ? '✓' : '✗' }}
              </p>
            </div>
            <div>
              <p :class="['text-xs mb-1', isDark ? 'text-gray-400' : 'text-gray-600']">输出</p>
              <p :class="['text-lg font-bold', result.outputSubmitted ? 'text-emerald-400' : 'text-gray-500']">
                {{ result.outputSubmitted ? '✓' : '-' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Next Button -->
        <button
          @click="$emit('next')"
          class="w-full py-4 rounded-2xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>下一个单词</span>
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
  result: {
    type: Object,
    default: null
  }
})

defineEmits(['next'])

const overallSuccess = computed(() => {
  if (!props.result) return false
  return props.result.meaningCorrect && props.result.paraphraseCorrect
})
</script>

<style scoped>
.feedback-card {
  @apply w-full;
}
</style>