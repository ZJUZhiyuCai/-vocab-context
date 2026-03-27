<template>
  <div class="speaking-topic-panel">
    <!-- Header -->
    <div class="mb-6">
      <h2 :class="['text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900']">
        Speaking Part 2 话题词群
      </h2>
      <p :class="['text-sm mt-1', isDark ? 'text-gray-400' : 'text-gray-600']">
        选择话题，获取高分词汇和句型模板
      </p>
    </div>

    <!-- Topic Selector -->
    <div v-if="!selectedTopic" class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <button
        v-for="topic in topics"
        :key="topic.id"
        @click="selectTopic(topic)"
        :class="[
          'p-4 rounded-xl border transition-all hover:scale-[1.02]',
          isDark
            ? 'bg-slate-800/50 border-white/10 hover:border-white/20'
            : 'bg-white border-gray-200 hover:border-gray-300'
        ]"
      >
        <div class="text-2xl mb-2">{{ topic.icon }}</div>
        <div :class="['text-sm font-medium', isDark ? 'text-white' : 'text-slate-900']">
          {{ topic.name.replace('IELTS Topic · ', '') }}
        </div>
        <div :class="['text-xs mt-1', isDark ? 'text-gray-500' : 'text-gray-500']">
          {{ topic.wordCount }} 词汇
        </div>
      </button>
    </div>

    <!-- Word Cluster View -->
    <div v-else>
      <!-- Back Button -->
      <button
        @click="selectedTopic = null; wordCluster = []"
        :class="[
          'mb-4 flex items-center gap-2 text-sm transition-colors',
          isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-slate-900'
        ]"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        返回话题选择
      </button>

      <!-- Topic Header -->
      <div :class="['p-4 rounded-xl mb-4', isDark ? 'bg-slate-800/50' : 'bg-gray-50']">
        <div class="flex items-center gap-3">
          <span class="text-3xl">{{ selectedTopic.icon }}</span>
          <div>
            <h3 :class="['text-lg font-bold', isDark ? 'text-white' : 'text-slate-900']">
              {{ selectedTopic.name }}
            </h3>
            <p :class="['text-sm', isDark ? 'text-gray-400' : 'text-gray-600']">
              {{ wordCluster.length }} 个高分词汇
            </p>
          </div>
        </div>
      </div>

      <!-- Speaking Templates -->
      <div :class="['p-4 rounded-xl mb-4 border', isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200']">
        <h4 :class="['text-sm font-bold mb-2', isDark ? 'text-emerald-400' : 'text-emerald-700']">
          开头模板
        </h4>
        <p :class="['text-sm italic', isDark ? 'text-emerald-200/80' : 'text-emerald-800']">
          {{ currentTemplate }}
        </p>
      </div>

      <!-- Word Cards -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
        <p :class="['text-sm mt-2', isDark ? 'text-gray-400' : 'text-gray-600']">加载中...</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="word in wordCluster"
          :key="word.word"
          :class="[
            'p-4 rounded-xl border transition-all',
            isDark
              ? 'bg-slate-800/50 border-white/10 hover:border-emerald-500/30'
              : 'bg-white border-gray-200 hover:border-emerald-300'
          ]"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span :class="['text-lg font-bold', isDark ? 'text-white' : 'text-slate-900']">
                  {{ word.word }}
                </span>
                <span :class="['text-xs px-2 py-0.5 rounded', isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600']">
                  {{ word.partOfSpeech }}
                </span>
              </div>
              <p :class="['text-sm mt-1', isDark ? 'text-gray-300' : 'text-gray-700']">
                {{ word.sense }}
              </p>
              <div v-if="word.collocations.length > 0" class="mt-2 flex flex-wrap gap-1">
                <span
                  v-for="col in word.collocations.slice(0, 3)"
                  :key="col"
                  :class="['text-xs px-2 py-0.5 rounded', isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700']"
                >
                  {{ col }}
                </span>
              </div>
            </div>
            <button
              @click="playWord(word.word)"
              :class="['p-2 rounded-lg transition-colors', isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100']"
            >
              <svg class="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- High Score Phrases -->
      <div :class="['mt-6 p-4 rounded-xl border', isDark ? 'bg-slate-800/50 border-white/10' : 'bg-gray-50 border-gray-200']">
        <h4 :class="['text-sm font-bold mb-3', isDark ? 'text-white' : 'text-slate-900']">
          高分句型
        </h4>
        <div class="grid gap-2">
          <div v-for="(phrase, key) in highScorePhrases" :key="key">
            <span :class="['text-xs font-medium', isDark ? 'text-gray-400' : 'text-gray-500']">
              {{ phraseLabels[key] }}:
            </span>
            <p :class="['text-sm italic', isDark ? 'text-gray-200' : 'text-gray-700']">
              {{ phrase[0] }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTheme } from '../composables/useTheme.js'
import { getSpeakingTopics, getTopicWordCluster, getSpeakingTemplatesForTopic, HIGH_SCORE_PHRASES } from '../utils/speakingTopicEngine.js'
import { getTTS } from '../utils/text-to-speech.js'

const { isDark } = useTheme()

const topics = getSpeakingTopics()
const selectedTopic = ref(null)
const wordCluster = ref([])
const loading = ref(false)
const highScorePhrases = HIGH_SCORE_PHRASES

const phraseLabels = {
  opening: '开头',
  elaboration: '展开',
  feeling: '感受',
  conclusion: '结尾'
}

const currentTemplate = computed(() => {
  if (!selectedTopic.value) return ''
  const templates = getSpeakingTemplatesForTopic(selectedTopic.value.topic)
  return templates.templates[0]
})

async function selectTopic(topic) {
  selectedTopic.value = topic
  loading.value = true
  try {
    wordCluster.value = await getTopicWordCluster(topic.id, 12)
  } finally {
    loading.value = false
  }
}

async function playWord(word) {
  const tts = getTTS()
  if (tts.isSupported()) {
    await tts.speakWord(word)
  }
}
</script>
