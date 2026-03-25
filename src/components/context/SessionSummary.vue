<template>
  <div class="session-summary">
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-[28px] opacity-20 blur-xl transition-all duration-500"></div>

      <div :class="[
        'relative backdrop-blur-xl border rounded-3xl p-8 shadow-2xl transform transition-all duration-500',
        isDark ? 'bg-slate-800/70 border-white/10' : 'bg-white/80 border-black/10 shadow-lg'
      ]">
        <div class="text-center mb-8">
          <div :class="[
            'w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4',
            isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
          ]">
            <svg class="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 :class="['text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-slate-900']">
            练习完成
          </h2>
          <p :class="['text-lg', isDark ? 'text-gray-400' : 'text-gray-600']">
            完成了 {{ summary?.totalBundles || 0 }} 个单词的学习
          </p>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-8">
          <div :class="['p-4 rounded-2xl text-center border', isDark ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50 border-emerald-200']">
            <p class="text-3xl font-bold text-emerald-500">
              {{ summary?.accuracy || 0 }}%
            </p>
            <p :class="['text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-600']">准确率</p>
          </div>

          <div :class="['p-4 rounded-2xl text-center border', isDark ? 'bg-cyan-500/5 border-cyan-500/10' : 'bg-cyan-50 border-cyan-200']">
            <p class="text-3xl font-bold text-cyan-500">
              {{ summary?.meaningCorrect || 0 }}/{{ summary?.meaningTotal || 0 }}
            </p>
            <p :class="['text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-600']">释义</p>
          </div>

          <div :class="['p-4 rounded-2xl text-center border', isDark ? 'bg-violet-500/5 border-violet-500/10' : 'bg-violet-50 border-violet-200']">
            <p class="text-3xl font-bold text-violet-500">
              {{ summary?.paraphraseCorrect || 0 }}/{{ summary?.paraphraseTotal || 0 }}
            </p>
            <p :class="['text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-600']">改写</p>
          </div>
        </div>

        <div :class="['p-4 rounded-xl border mb-6', isDark ? 'bg-slate-700/30 border-white/5' : 'bg-gray-50 border-gray-200']">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div :class="['w-10 h-10 rounded-full flex items-center justify-center', isDark ? 'bg-amber-500/20' : 'bg-amber-100']">
                <svg class="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <p :class="['font-medium', isDark ? 'text-white' : 'text-slate-900']">输出练习</p>
                <p :class="['text-sm', isDark ? 'text-gray-400' : 'text-gray-600']">
                  {{ summary?.outputSubmitted || 0 }}/{{ summary?.outputTotal || 0 }} 完成
                </p>
              </div>
            </div>
            <span :class="[
              'px-3 py-1 rounded-lg text-sm font-medium',
              summary?.outputSubmitted >= (summary?.outputTotal || 0) / 2
                ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                : isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
            ]">
              {{ summary?.outputSubmitted >= (summary?.outputTotal || 0) / 2 ? '良好' : '继续努力' }}
            </span>
          </div>
        </div>

        <div v-if="remediationSummary" class="mb-6">
          <p :class="['text-xs font-medium mb-3 uppercase tracking-wider', isDark ? 'text-gray-400' : 'text-gray-600']">
            Retry Gate
          </p>
          <div :class="['rounded-2xl border p-4', isDark ? 'bg-slate-700/30 border-white/5' : 'bg-gray-50 border-gray-200']">
            <p :class="['text-sm font-semibold leading-7', isDark ? 'text-white' : 'text-slate-900']">
              {{ isRetrySession
                ? (remediationSummary.sessionPassed ? '这轮补救已过关。' : '这轮补救还没完全过关。')
                : (remediationSummary.sessionPassed ? '这轮 Context-first 已全部过关。' : '这轮还有词没有过关。') }}
            </p>
            <p :class="['text-sm mt-3 leading-7', isDark ? 'text-gray-400' : 'text-gray-600']">
              过关规则：释义正确、改写正确、并且完成输出。当前通过 {{ remediationSummary.passedWords.length }}/{{ remediationSummary.targetWords.length }}，通过率 {{ remediationSummary.passRate }}%。
            </p>

            <div v-if="remediationSummary.passedWords.length" class="mt-4">
              <p :class="['text-xs font-semibold uppercase tracking-wider mb-2', isDark ? 'text-gray-400' : 'text-gray-500']">已过关</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="word in remediationSummary.passedWords"
                  :key="word"
                  :class="[
                    'px-3 py-1.5 rounded-xl text-sm border',
                    isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  ]"
                >
                  {{ word }}
                </span>
              </div>
            </div>

            <div v-if="remediationSummary.remainingWords.length" class="mt-4">
              <p :class="['text-xs font-semibold uppercase tracking-wider mb-2', isDark ? 'text-gray-400' : 'text-gray-500']">还没过关</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="word in remediationSummary.remainingWords"
                  :key="word"
                  :class="[
                    'px-3 py-1.5 rounded-xl text-sm border',
                    isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-700'
                  ]"
                >
                  {{ word }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="summary?.topicStats" class="mb-6">
          <p :class="['text-xs font-medium mb-2', isDark ? 'text-gray-400' : 'text-gray-600']">主题分布</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(stat, topic) in summary.topicStats"
              :key="topic"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm',
                isDark ? 'bg-slate-700/50 text-gray-300 border border-white/5' : 'bg-gray-100 text-gray-700 border border-gray-200'
              ]"
            >
              {{ topicLabel(topic) }}: {{ stat.correct }}/{{ stat.total }}
            </span>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="$emit('exit')"
            :class="[
              'flex-1 py-4 rounded-2xl border font-semibold transition-all active:scale-[0.98]',
              isDark
                ? 'bg-slate-700/50 border-white/10 text-gray-300 hover:border-gray-500'
                : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
            ]"
          >
            返回
          </button>
          <button
            v-if="retryActionEnabled"
            @click="$emit('retry-remediation')"
            :class="[
              'flex-1 py-4 rounded-2xl border font-semibold transition-all active:scale-[0.98]',
              isDark
                ? 'bg-amber-500/15 border-amber-500/20 text-amber-300 hover:border-amber-400/40'
                : 'bg-amber-50 border-amber-200 text-amber-700 hover:border-amber-300'
            ]"
          >
            {{ remediationSummary?.remainingWords?.length ? '继续修剩余词' : '重练薄弱词' }}
          </button>
          <button
            @click="$emit('restart')"
            class="flex-1 py-4 rounded-2xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>再练一轮</span>
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../../composables/useTheme.js'

const { isDark } = useTheme()

const props = defineProps({
  summary: {
    type: Object,
    default: null
  },
  remediationSummary: {
    type: Object,
    default: null
  },
  isRetrySession: {
    type: Boolean,
    default: false
  }
})

defineEmits(['restart', 'exit', 'retry-remediation'])

const retryActionEnabled = computed(() => {
  return Boolean(props.remediationSummary?.remainingWords?.length)
})

function formatTime(ms) {
  if (!ms) return '0秒'
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  if (minutes > 0) {
    return `${minutes}分 ${seconds % 60}秒`
  }
  return `${seconds}秒`
}

function topicLabel(topic) {
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
  return labels[topic] || topic || '通用'
}
</script>

<style scoped>
.session-summary {
  @apply w-full;
}
</style>
