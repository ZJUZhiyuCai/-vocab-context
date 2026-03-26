<template>
  <slot v-if="!hasError" />
  <div
    v-else
    class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800"
  >
    <div class="max-w-md w-full text-center">
      <div class="mb-6">
        <svg class="w-16 h-16 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-white mb-2">Something went wrong</h1>
      <p class="text-gray-400 mb-6">{{ errorMessage }}</p>
      <div class="flex gap-3 justify-center">
        <button
          @click="retry"
          class="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors"
        >
          Try Again
        </button>
        <button
          @click="goHome"
          class="px-6 py-3 rounded-xl bg-slate-700 text-gray-300 font-bold hover:bg-slate-600 transition-colors"
        >
          Go Home
        </button>
      </div>
      <button
        v-if="showDetails"
        @click="toggleDetails"
        class="mt-4 text-sm text-gray-500 hover:text-gray-400"
      >
        {{ detailsVisible ? 'Hide Details' : 'Show Details' }}
      </button>
      <pre
        v-if="detailsVisible && errorStack"
        class="mt-4 p-4 bg-slate-950 rounded-xl text-left text-xs text-gray-400 overflow-auto max-h-48"
      >{{ errorStack }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const props = defineProps({
  showDetails: { type: Boolean, default: false }
})

const emit = defineEmits(['error'])

const hasError = ref(false)
const errorMessage = ref('')
const errorStack = ref('')
const detailsVisible = ref(false)

onErrorCaptured((error) => {
  hasError.value = true
  errorMessage.value = error.message || 'An unexpected error occurred'
  errorStack.value = error.stack || ''

  emit('error', error)

  // Log to console for debugging
  console.error('[ErrorBoundary]', error)

  // Return false to prevent the error from propagating further
  return false
})

function retry() {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
}

function goHome() {
  window.location.href = '/'
}

function toggleDetails() {
  detailsVisible.value = !detailsVisible.value
}
</script>