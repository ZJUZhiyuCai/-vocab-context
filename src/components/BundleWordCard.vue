<template>
  <div class="lg:col-span-7 flex flex-col gap-4 animate-slide-right min-h-[60vh]">
    <PremiumWordCard
      :word="word"
      :reviewing="reviewing"
      :generating="generating"
      :playing-audio="playingAudio"
      :loading-english-def="loadingEnglishDef"
      :in-wordbook="inWordbook"
      @play-audio="$emit('play-audio')"
      @known="$emit('known')"
      @unknown="$emit('unknown')"
      @generate-ai="$emit('generate-ai')"
      @fetch-english-def="$emit('fetch-english-def')"
      @toggle-wordbook="$emit('toggle-wordbook')"
    />

    <div :class="['rounded-3xl border p-6 backdrop-blur-xl', isDark ? 'bg-slate-800/70 border-white/10' : 'bg-white/80 border-black/10 shadow-lg']">
      <div class="flex flex-wrap items-center gap-2 mb-5">
        <span class="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
          {{ word?.topic || 'general' }}
        </span>
        <span
          v-for="task in word?.taskTypes || []"
          :key="task"
          class="px-2.5 py-1 rounded-full bg-white/5 text-gray-400 text-xs font-semibold border border-white/10"
        >
          {{ task }}
        </span>
        <span class="px-2.5 py-1 rounded-full bg-white/5 text-gray-400 text-xs font-semibold border border-white/10">
          {{ word?.register || 'formal' }}
        </span>
        <span
          v-if="word?.draft"
          class="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20"
        >
          draft
        </span>
      </div>

      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <section :class="panelClass">
          <div class="section-title">
            Sense
          </div>
          <p :class="textClass">
            {{ word?.sense || 'No sense available yet.' }}
          </p>
        </section>

        <section :class="panelClass">
          <div class="section-title">
            Paraphrases
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="paraphrase in word?.paraphrases || []"
              :key="paraphrase"
              class="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20"
            >
              {{ paraphrase }}
            </span>
            <span
              v-if="!(word?.paraphrases || []).length"
              class="text-sm text-gray-500"
            >No paraphrases yet.</span>
          </div>
        </section>
      </div>

      <section :class="[panelClass, 'mb-4']">
        <div class="section-title">
          Collocations
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="collocation in word?.collocations || []"
            :key="collocation"
            class="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20"
          >
            {{ collocation }}
          </span>
          <span
            v-if="!(word?.collocations || []).length"
            class="text-sm text-gray-500"
          >No collocations yet.</span>
        </div>
      </section>

      <section :class="[panelClass, 'mb-4']">
        <div class="flex flex-wrap gap-2 mb-4">
          <button
            v-for="kind in availableKinds"
            :key="kind"
            type="button"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors"
            :class="activeKind === kind ? activeTabClass : inactiveTabClass"
            @click="activeKind = kind"
          >
            {{ kind }}
          </button>
        </div>

        <div
          v-if="activeContexts.length"
          class="space-y-3"
        >
          <article
            v-for="(context, index) in activeContexts"
            :key="`${context.kind}-${index}`"
            :class="['rounded-2xl p-4 border', isDark ? 'bg-slate-900/50 border-white/5' : 'bg-gray-50 border-gray-200']"
          >
            <div class="text-[11px] uppercase tracking-wider text-gray-500 mb-2">
              {{ context.purpose || 'context' }}
            </div>
            <p :class="textClass">
              {{ context.text }}
            </p>
            <p
              v-if="context.translation"
              class="mt-2 text-sm text-gray-500"
            >
              {{ context.translation }}
            </p>
          </article>
        </div>

        <p
          v-else
          class="text-sm text-gray-500"
        >
          No contexts available.
        </p>
      </section>

      <section :class="panelClass">
        <div class="section-title">
          Production Prompt
        </div>
        <p
          v-if="word?.productionPrompt?.instruction"
          :class="textClass"
        >
          {{ word.productionPrompt.instruction }}
        </p>
        <p
          v-else
          class="text-sm text-gray-500"
        >
          No production prompt yet.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import PremiumWordCard from './PremiumWordCard.vue'
import { useTheme } from '../composables/useTheme.js'

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

const activeKind = ref('reading')

const availableKinds = computed(() => {
  const kinds = Array.from(new Set((props.word?.contexts || []).map(context => context.kind).filter(Boolean)))
  return kinds.length ? kinds : ['reading']
})

const activeContexts = computed(() => {
  return (props.word?.contexts || []).filter(context => context.kind === activeKind.value)
})

watch(
  () => props.word?.id,
  () => {
    activeKind.value = availableKinds.value[0] || 'reading'
  },
  { immediate: true }
)

const panelClass = computed(() => [
  'rounded-2xl border p-4',
  isDark.value ? 'bg-slate-900/30 border-white/5' : 'bg-white/60 border-gray-200'
])

const textClass = computed(() => [
  'text-base leading-relaxed',
  isDark.value ? 'text-gray-100' : 'text-gray-800'
])

const activeTabClass = computed(() => (
  isDark.value
    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
    : 'bg-cyan-50 border-cyan-200 text-cyan-700'
))

const inactiveTabClass = computed(() => (
  isDark.value
    ? 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200'
    : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-gray-800'
))
</script>

<style scoped>
.section-title {
  @apply text-xs font-bold uppercase tracking-wider text-gray-500 mb-3;
}

@keyframes slide-right {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-slide-right {
  animation: slide-right 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
}
</style>
