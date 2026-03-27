<template>
  <div class="lg:col-span-7 flex flex-col justify-center animate-slide-right min-h-[60vh]">
    <div class="mb-6">
      <div
        v-if="!reviewing"
        class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        正在学习中
      </div>
      <div
        v-else
        class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-6"
      >
        <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        复习模式
      </div>
      <h1 :class="['text-5xl md:text-7xl font-bold mb-3 tracking-tight', isDark ? 'text-white' : 'text-slate-900']">
        {{ word?.word || 'Loading...' }}
      </h1>
      <div class="flex items-center gap-4 text-gray-400">
        <button 
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group"
          :class="{'opacity-50 pointer-events-none': playingAudio}"
          @click="$emit('play-audio')"
        >
          <svg
            class="w-4 h-4 text-emerald-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          ><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
          <span class="text-sm font-medium text-gray-300 group-hover:text-emerald-300">{{ word?.ipa || '/.../' }}</span>
        </button>
        <span class="px-3 py-1 rounded-lg bg-amber-500/15 text-amber-400 text-sm font-medium border border-amber-500/20">{{ word?.partOfSpeech || '单词' }}</span>
        <div class="flex items-center gap-0.5">
          <span
            v-for="i in 5"
            :key="i"
            :class="i <= (word?.frequency || 5) ? 'text-amber-400' : 'text-gray-600'"
            class="text-lg"
          >★</span>
        </div>
        <!-- Wordbook Star Button -->
        <button 
          class="p-2 rounded-lg transition-all"
          :class="inWordbook ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-gray-500 border border-white/10 hover:text-amber-400 hover:border-amber-500/30'"
          :title="inWordbook ? '从单词本移除' : '加入单词本'"
          @click="$emit('toggle-wordbook')"
        >
          <svg
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="inWordbook"
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
            <path
              v-else
              d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Premium Glass Card -->
    <div class="group relative">
      <!-- Glow Effect -->
      <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-[28px] opacity-15 group-hover:opacity-25 blur-xl transition-all duration-500" />
      
      <!-- Card -->
      <div :class="['relative backdrop-blur-xl border rounded-3xl p-8 shadow-2xl transform transition-all duration-500 hover:shadow-emerald-500/10 hover:-translate-y-1', isDark ? 'bg-slate-800/70 border-white/10' : 'bg-white/80 border-black/10 shadow-lg']">
        <div class="flex flex-col gap-6">
          <!-- Chinese Definition -->
          <div :class="['p-5 rounded-2xl border', isDark ? 'bg-slate-900/50 border-white/5' : 'bg-gray-50 border-gray-200']">
            <div class="flex items-center gap-2 mb-3">
              <span class="w-1.5 h-6 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
              <h3 :class="['text-sm font-bold', isDark ? 'text-gray-300' : 'text-gray-700']">
                中文释义
              </h3>
            </div>
            <p :class="['text-xl leading-relaxed font-medium', isDark ? 'text-gray-100' : 'text-gray-900']">
              {{ word?.meaning || '...' }}
            </p>
          </div>

          <!-- English Definition -->
          <div :class="['p-5 rounded-2xl border', isDark ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50 border-emerald-200']">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-emerald-500" />
                <h3 :class="['text-sm font-bold', isDark ? 'text-emerald-400' : 'text-emerald-700']">
                  English Definition
                </h3>
              </div>
              <button 
                v-if="!word?.englishDefinition && !loadingEnglishDef"
                class="text-xs text-emerald-500/70 hover:text-emerald-400 transition-colors"
                @click="$emit('fetch-english-def')"
              >
                🤖 AI获取释义
              </button>
              <span
                v-if="loadingEnglishDef"
                class="text-xs text-emerald-400 animate-pulse"
              >获取中...</span>
            </div>
            <p
              v-if="word?.englishDefinition"
              :class="['text-lg leading-relaxed italic', isDark ? 'text-emerald-200/80' : 'text-emerald-900']"
            >
              {{ word.englishDefinition }}
            </p>
            <p
              v-else-if="loadingEnglishDef"
              :class="['italic', isDark ? 'text-emerald-200/50' : 'text-emerald-600']"
            >
              正在获取英文释义...
            </p>
            <p
              v-else
              :class="['italic', isDark ? 'text-emerald-200/40' : 'text-emerald-600/60']"
            >
              点击右上角按钮获取英文释义
            </p>
          </div>

          <!-- Context Sentence -->
          <div :class="['p-5 rounded-2xl border', isDark ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50 border-amber-200']">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-6 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
                <h3 :class="['text-sm font-bold', isDark ? 'text-amber-400' : 'text-amber-600']">
                  语境例句
                </h3>
              </div>
              <div class="flex gap-2">
                <span
                  v-if="word?.aiExample"
                  class="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-xs font-medium border border-amber-500/20"
                >AI 生成</span>
                <button 
                  class="text-xs text-amber-500/70 hover:text-amber-400"
                  :disabled="generating"
                  @click="$emit('generate-ai')"
                >
                  {{ generating ? '生成中...' : '☁️ AI写例句' }}
                </button>
              </div>
            </div>
              
            <div v-if="currentExample">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <p
                :class="['text-lg leading-relaxed', isDark ? 'text-amber-100/80' : 'text-amber-900']"
                v-html="highlightedSentence"
              />
              <p :class="['text-sm mt-2', isDark ? 'text-amber-300/50' : 'text-amber-700/70']">
                {{ currentExample.translation }}
              </p>
            </div>
            <div
              v-else
              :class="['italic', isDark ? 'text-amber-100/50' : 'text-amber-600/60']"
            >
              暂无例句
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 mt-2">
            <button 
              class="flex-1 py-4 rounded-2xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              @click="$emit('known')"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M5 13l4 4L19 7"
              /></svg>
              <span>认识了</span>
            </button>
            <button 
              :class="['flex-1 py-4 rounded-2xl border font-semibold hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2', isDark ? 'bg-slate-700/50 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700']"
              @click="$emit('unknown')"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              /></svg>
              <span>不认识</span>
            </button>
          </div>

          <!-- Keyboard Shortcuts Hint -->
          <div :class="['mt-4 flex items-center justify-center gap-4 text-xs', isDark ? 'text-gray-500' : 'text-gray-600']">
            <span class="flex items-center gap-1"><kbd :class="['px-1.5 py-0.5 rounded font-mono', isDark ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-600']">Space</kbd> 认识</span>
            <span class="flex items-center gap-1"><kbd :class="['px-1.5 py-0.5 rounded font-mono', isDark ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-600']">Enter</kbd> 不认识</span>
            <span class="flex items-center gap-1"><kbd :class="['px-1.5 py-0.5 rounded font-mono', isDark ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-600']">A</kbd> AI例句</span>
            <span class="flex items-center gap-1"><kbd :class="['px-1.5 py-0.5 rounded font-mono', isDark ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-600']">E</kbd> 英文释义</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme.js'
import { highlightWordSafe } from '../utils/sanitize.js'

const { isDark } = useTheme()

const props = defineProps({
  word: {
    type: Object,
    default: null
  },
  reviewing: {
    type: Boolean,
    default: false
  },
  generating: {
    type: Boolean,
    default: false
  },
  playingAudio: {
    type: Boolean,
    default: false
  },
  loadingEnglishDef: {
    type: Boolean,
    default: false
  },
  inWordbook: {
    type: Boolean,
    default: false
  }
})

defineEmits(['play-audio', 'known', 'unknown', 'generate-ai', 'fetch-english-def', 'toggle-wordbook'])

const currentExample = computed(() => {
  if (props.word?.aiExample) return props.word.aiExample
  if (props.word?.examples && props.word.examples.length > 0) return props.word.examples[0]
  return null
})

const highlightedSentence = computed(() => {
  if (!currentExample.value || !props.word?.word) return ''
  return highlightWordSafe(currentExample.value.sentence, props.word.word)
})
</script>

<style scoped>
@keyframes slide-right {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-slide-right {
  animation: slide-right 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
}
</style>
