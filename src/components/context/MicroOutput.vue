<template>
  <div class="micro-output">
    <!-- Glass Card -->
    <div class="group relative">
      <!-- Glow Effect -->
      <div class="absolute -inset-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-[28px] opacity-15 group-hover:opacity-25 blur-xl transition-all duration-500" />

      <!-- Card -->
      <div
        :class="[
          'relative backdrop-blur-xl border rounded-3xl p-8 shadow-2xl transform transition-all duration-500',
          isDark ? 'bg-slate-800/70 border-white/10' : 'bg-white/80 border-black/10 shadow-lg'
        ]"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 mb-6">
          <span
            :class="[
              'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold',
              isDark ? 'bg-violet-500/10 border border-violet-500/20 text-violet-400' : 'bg-violet-100 border border-violet-300 text-violet-700'
            ]"
          >
            {{ promptModeLabel }}
          </span>
        </div>

        <!-- Prompt -->
        <div class="mb-7">
          <h2 :class="['text-xl font-bold mb-3', isDark ? 'text-white' : 'text-slate-900']">
            使用 "{{ bundle?.word || '...' }}" 写一个句子
          </h2>
          <div :class="['p-4 rounded-xl border', isDark ? 'bg-violet-500/5 border-violet-500/10' : 'bg-violet-50 border-violet-200']">
            <p :class="['text-sm leading-7', isDark ? 'text-violet-200/80' : 'text-violet-800']">
              {{ promptInstruction }}
            </p>
          </div>
        </div>

        <!-- Context Reference -->
        <div
          v-if="prompt?.context"
          :class="['p-4 rounded-xl border mb-7', isDark ? 'bg-slate-700/30 border-white/5' : 'bg-gray-50 border-gray-200']"
        >
          <p :class="['text-xs font-medium mb-1', isDark ? 'text-gray-400' : 'text-gray-600']">
            参考语境：
          </p>
          <p :class="['text-sm italic leading-7', isDark ? 'text-gray-300' : 'text-gray-700']">
            {{ referenceContextText }}
          </p>
        </div>

        <!-- Text Area -->
        <div class="mb-6">
          <textarea
            v-model="outputText"
            :placeholder="placeholderText"
            rows="3"
            :class="[
              'w-full p-5 rounded-2xl border text-base leading-7 resize-none transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/50',
              isDark
                ? 'bg-slate-700/50 border-white/10 text-white placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            ]"
          />
          <p :class="['text-xs mt-2', isDark ? 'text-gray-500' : 'text-gray-500']">
            {{ outputText.length }} 字符
          </p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            :class="[
              'flex-1 py-4 rounded-2xl border font-semibold transition-all active:scale-[0.98]',
              isDark
                ? 'bg-slate-700/50 border-white/10 text-gray-300 hover:border-gray-500'
                : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
            ]"
            @click="handleSkip"
          >
            跳过
          </button>
          <button
            :disabled="!outputText.trim()"
            :class="[
              'flex-1 py-4 rounded-2xl font-semibold shadow-lg transition-all active:scale-[0.98]',
              outputText.trim()
                ? 'bg-violet-600 text-white shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02]'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            ]"
            @click="handleSubmit"
          >
            提交
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTheme } from '../../composables/useTheme.js'

const { isDark } = useTheme()

const props = defineProps({
  bundle: {
    type: Object,
    default: null
  },
  prompt: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'skip'])

const outputText = ref('')
const startTime = ref(Date.now())

const promptInstruction = computed(() => {
  if (!props.prompt) {
    return '用这个词在学术语境下写一个句子。'
  }

  if (typeof props.prompt.instruction === 'string' && props.prompt.instruction.trim()) {
    return props.prompt.instruction.trim()
  }

  if (typeof props.prompt.prompt === 'string' && props.prompt.prompt.trim()) {
    return props.prompt.prompt.trim()
  }

  if (
    props.prompt.prompt &&
    typeof props.prompt.prompt === 'object' &&
    typeof props.prompt.prompt.instruction === 'string'
  ) {
    return props.prompt.prompt.instruction.trim()
  }

  return '用这个词在学术语境下写一个句子。'
})

const promptModeLabel = computed(() => {
  const mode = props.prompt?.mode || props.prompt?.prompt?.mode || 'writing'
  const labels = {
    writing: '输出练习',
    speaking: '口语输出',
    mixed: '综合输出'
  }

  return labels[mode] || '输出练习'
})

const referenceContextText = computed(() => {
  const rawText = props.prompt?.context?.text || ''
  return rawText.trim()
})

const placeholderText = computed(() => {
  const word = props.bundle?.word || '...'
  return `输入包含 "${word}" 的句子...`
})

function handleSubmit() {
  if (!outputText.value.trim()) return
  emit('submit', {
    submitted: true,
    text: outputText.value.trim(),
    time: Date.now() - startTime.value
  })
}

function handleSkip() {
  emit('skip')
}
</script>

<style scoped>
.micro-output {
  @apply w-full;
}
</style>
