<template>
  <div class="meaning-choice">
    <!-- Glass Card -->
    <div class="group relative">
      <!-- Glow Effect -->
      <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-[28px] opacity-15 group-hover:opacity-25 blur-xl transition-all duration-500" />

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
              isDark ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-emerald-100 border border-emerald-300 text-emerald-700'
            ]"
          >
            释义选择
          </span>
        </div>

        <!-- Question -->
        <div class="mb-6">
          <h2 :class="['text-2xl font-bold mb-2', isDark ? 'text-white' : 'text-slate-900']">
            "{{ bundle?.word || '...' }}"
          </h2>
          <p :class="['text-sm', isDark ? 'text-gray-400' : 'text-gray-600']">
            选最贴切的中文义项
          </p>
        </div>

        <!-- Options -->
        <div class="space-y-3 mb-6">
          <button
            v-for="(option, idx) in options"
            :key="option.id"
            :disabled="selectedOption !== null"
            :class="[
              'w-full p-4 rounded-2xl border text-left transition-all',
              getOptionClass(option)
            ]"
            @click="selectOption(option)"
          >
            <div class="flex items-center gap-3">
              <span
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                  selectedOption?.id === option.id
                    ? option.isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    : isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                ]"
              >
                {{ String.fromCharCode(65 + idx) }}
              </span>
              <span :class="['text-base leading-7', isDark ? 'text-gray-200' : 'text-gray-800']">
                {{ option.text }}
              </span>
            </div>
          </button>
        </div>

        <!-- Result & Continue -->
        <div
          v-if="selectedOption"
          class="space-y-4"
        >
          <div
            :class="[
              'p-4 rounded-xl border',
              selectedOption.isCorrect
                ? isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
                : isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-200'
            ]"
          >
            <p :class="['font-medium', selectedOption.isCorrect ? 'text-emerald-400' : 'text-rose-400']">
              {{ selectedOption.isCorrect ? '✓ 正确！' : '✗ 不正确' }}
            </p>
          </div>
          <button
            class="w-full py-4 rounded-2xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            @click="handleContinue"
          >
            继续
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from '../../composables/useTheme.js'

const { isDark } = useTheme()

defineProps({
  bundle: {
    type: Object,
    default: null
  },
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['answer'])

const selectedOption = ref(null)
const startTime = ref(Date.now())

function selectOption(option) {
  if (selectedOption.value) return
  selectedOption.value = option
}

function getOptionClass(option) {
  if (!selectedOption.value) {
    return isDark.value
      ? 'bg-slate-700/50 border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10'
      : 'bg-gray-50 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50'
  }

  if (option.id === selectedOption.value.id) {
    return option.isCorrect
      ? 'bg-emerald-500/20 border-emerald-500'
      : 'bg-rose-500/20 border-rose-500'
  }

  if (option.isCorrect && !selectedOption.value.isCorrect) {
    return isDark.value
      ? 'bg-emerald-500/10 border-emerald-500/30'
      : 'bg-emerald-50 border-emerald-300'
  }

  return isDark.value
    ? 'bg-slate-700/30 border-white/5 opacity-50'
    : 'bg-gray-50 border-gray-200 opacity-50'
}

function handleContinue() {
  emit('answer', {
    correct: selectedOption.value?.isCorrect || false,
    time: Date.now() - startTime.value
  })
}
</script>

<style scoped>
.meaning-choice {
  @apply w-full;
}
</style>
