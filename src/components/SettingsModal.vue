<template>
  <div
    class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    :class="isDark ? 'bg-black/80' : 'bg-black/50'"
    @click.self="$emit('close')"
  >
    <div
      :class="[
        'rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl',
        isDark ? 'bg-slate-900 border border-white/10 text-gray-200' : 'bg-white border border-gray-200 text-gray-800'
      ]"
      @click.stop
    >
      <h2 :class="['text-xl font-bold mb-6', isDark ? 'text-white' : 'text-gray-800']">Settings</h2>

      <!-- Study Plan -->
      <div :class="['mb-6 pb-6 border-b', isDark ? 'border-gray-700' : 'border-gray-200']">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-1 h-4 rounded-full bg-emerald-500"></div>
          <h3 :class="['text-sm font-bold uppercase tracking-wider', isDark ? 'text-gray-400' : 'text-gray-600']">Study Plan</h3>
        </div>

        <!-- Daily Goal -->
        <div class="mb-4">
          <label :class="['block text-sm font-medium mb-2', isDark ? 'text-gray-400' : 'text-gray-600']">Daily Goal</label>
          <div class="flex items-center gap-3">
            <input
              type="range"
              v-model.number="localSettings.dailyGoal"
              min="5"
              max="100"
              step="5"
              :class="[
                'flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500',
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              ]"
            >
            <span class="text-sm font-bold text-emerald-400 w-16 text-center">{{ localSettings.dailyGoal }}</span>
          </div>
        </div>

        <!-- Study Mode -->
        <div>
          <label :class="['block text-sm font-medium mb-2', isDark ? 'text-gray-400' : 'text-gray-600']">Study Mode</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="localSettings.studyMode = 'sequence'"
              class="p-3 text-sm rounded-xl border transition-all"
              :class="getModeButtonClass('sequence')"
            >
              <div class="font-bold mb-1">Sequential</div>
              <div class="text-xs opacity-75">Learn in order</div>
            </button>
            <button
              @click="localSettings.studyMode = 'random'"
              class="p-3 text-sm rounded-xl border transition-all"
              :class="getModeButtonClass('random')"
            >
              <div class="font-bold mb-1">Random</div>
              <div class="text-xs opacity-75">Shuffle words</div>
            </button>
          </div>
        </div>

        <!-- Purpose -->
        <div class="mt-4">
          <label :class="['block text-sm font-medium mb-2', isDark ? 'text-gray-400' : 'text-gray-600']">Purpose</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="p in purposes"
              :key="p.value"
              @click="localSettings.purpose = p.value"
              class="p-3 text-sm rounded-xl border transition-all"
              :class="getPurposeButtonClass(p.value)"
            >
              <div class="font-bold mb-1">{{ p.label }}</div>
              <div class="text-xs opacity-75">{{ p.desc }}</div>
            </button>
          </div>
        </div>
      </div>

      <!-- API Settings -->
      <div :class="['mb-6 pb-6 border-b', isDark ? 'border-gray-700' : 'border-gray-200']">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-1 h-4 rounded-full bg-cyan-500"></div>
          <h3 :class="['text-sm font-bold uppercase tracking-wider', isDark ? 'text-gray-400' : 'text-gray-600']">AI Features</h3>
        </div>
        <div class="mb-4">
          <label :class="['block text-sm font-medium mb-2', isDark ? 'text-gray-400' : 'text-gray-600']">{{ apiProviderLabel }} API Key</label>
          <input
            type="password"
            v-model="localSettings.apiKey"
            placeholder="sk-..."
            :class="[
              'w-full rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none',
              isDark ? 'bg-slate-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-800 border'
            ]"
          >
          <p class="mt-2 text-xs leading-6 text-gray-500">{{ apiHelperText }}</p>
        </div>
      </div>

      <!-- Theme Settings -->
      <div :class="['mb-6 pb-6 border-b', isDark ? 'border-gray-700' : 'border-gray-200']">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-1 h-4 rounded-full bg-violet-500"></div>
          <h3 :class="['text-sm font-bold uppercase tracking-wider', isDark ? 'text-gray-400' : 'text-gray-600']">Appearance</h3>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="t in themeOptions"
            :key="t.value"
            @click="$emit('set-theme', t.value)"
            class="p-3 text-sm rounded-xl border transition-all"
            :class="getThemeButtonClass(t.value)"
          >
            <div class="font-bold mb-1">{{ t.icon }} {{ t.label }}</div>
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 mt-6">
        <button
          @click="saveSettings"
          class="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all"
        >
          Save
        </button>
        <button
          @click="$emit('close')"
          :class="[
            'flex-1 py-3 rounded-xl font-bold active:scale-95 transition-all',
            isDark ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { AI_PROVIDER_LABEL, AI_ENV_API_KEY_NAME, AI_MODEL } from '../utils/aiClient.js'

const props = defineProps({
  isDark: { type: Boolean, default: true },
  currentTheme: { type: String, default: 'dark' },
  settings: { type: Object, required: true },
  apiProviderLabel: { type: String, default: AI_PROVIDER_LABEL }
})

const emit = defineEmits(['close', 'save', 'set-theme'])

const localSettings = ref({ ...props.settings })

const apiHelperText = `Enter your ${AI_PROVIDER_LABEL} key here; if ${AI_ENV_API_KEY_NAME} is configured in .env.local or deployment, the app will automatically use ${AI_MODEL}.`

const purposes = [
  { value: 'exam', label: 'Exam', desc: 'IELTS/TOEFL' },
  { value: 'work', label: 'Work', desc: 'Business' },
  { value: 'academic', label: 'Academic', desc: 'Papers' },
  { value: 'daily', label: 'Daily', desc: 'Conversation' }
]

const themeOptions = [
  { value: 'light', icon: '☀', label: 'Light' },
  { value: 'dark', icon: '🌙', label: 'Dark' },
  { value: 'system', icon: '🖥', label: 'System' }
]

watch(() => props.settings, (newVal) => {
  localSettings.value = { ...newVal }
}, { deep: true })

function getModeButtonClass(mode) {
  const base = localSettings.value.studyMode === mode
    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
    : props.isDark
      ? 'border-gray-700 bg-slate-800 text-gray-400 hover:border-gray-600'
      : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400'
  return base
}

function getPurposeButtonClass(purpose) {
  const base = localSettings.value.purpose === purpose
    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
    : props.isDark
      ? 'border-gray-700 bg-slate-800 text-gray-400 hover:border-gray-600'
      : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400'
  return base
}

function getThemeButtonClass(theme) {
  const base = props.currentTheme === theme
    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
    : props.isDark
      ? 'border-gray-700 bg-slate-800 text-gray-400 hover:border-gray-600'
      : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400'
  return base
}

function saveSettings() {
  emit('save', localSettings.value)
}
</script>