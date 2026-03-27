<template>
  <div
    :class="[
      'min-h-screen font-sans overflow-hidden relative selection:bg-emerald-500/30 transition-colors duration-300',
      isDark 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-gray-100' 
        : 'bg-gray-100 text-gray-900'
    ]"
  >
    <!-- Background Ambient Effects (Dark mode only) -->
    <div
      v-if="isDark"
      class="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0"
    >
      <div class="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse-slow bg-gradient-to-br from-emerald-600/15 to-teal-600/10" />
      <div class="absolute bottom-[-20%] left-[-10%] w-[45%] h-[45%] rounded-full blur-[120px] animate-pulse-slow delay-1000 bg-gradient-to-tr from-violet-600/15 to-purple-600/10" />
      <div class="absolute top-[40%] left-[50%] w-[25%] h-[25%] rounded-full blur-[80px] animate-float bg-gradient-to-r from-amber-500/10 to-orange-500/8" />
      
      <!-- Subtle Grid Pattern -->
      <div class="absolute inset-0 bg-[size:60px_60px] bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
      
      <!-- Noise Texture Overlay -->
      <div class="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />
    </div>

    <!-- Main Content Container -->
    <div class="relative z-10 container mx-auto px-6 py-8 min-h-screen flex flex-col">
      <!-- Navbar -->
      <nav class="flex justify-between items-center mb-0 md:mb-16 animate-slide-down">
        <div
          class="flex items-center gap-3 group cursor-pointer"
          @click="$emit('navigate', 'today')"
        >
          <div class="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 group-hover:scale-105 transition-all duration-300">
            <span class="text-xl font-bold text-white">V</span>
          </div>
          <div class="flex flex-col">
            <span :class="['text-xl font-bold tracking-tight', isDark ? 'text-white' : 'text-slate-900']">
              VocabMan
            </span>
            <span class="text-[10px] text-emerald-500 font-semibold tracking-widest uppercase">Premium Edition</span>
          </div>
        </div>
        
        <div
          :class="[
            'hidden md:flex items-center gap-1 backdrop-blur-sm rounded-full p-1.5 border shadow-lg',
            isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
          ]"
        >
          <button 
            :class="['px-5 py-2 text-sm font-medium rounded-full shadow-sm transition-all', currentPage === 'today' ? 'text-white bg-emerald-600' : (isDark ? 'text-gray-400 hover:text-emerald-400 hover:bg-white/5' : 'text-gray-600 hover:text-emerald-600 hover:bg-black/5')]"
            @click="$emit('navigate', 'today')"
          >
            学习
          </button>
          <button 
            :class="['px-5 py-2 text-sm font-medium rounded-full shadow-sm transition-all', isDark ? 'text-gray-400 hover:text-emerald-400 hover:bg-white/5' : 'text-gray-600 hover:text-emerald-600 hover:bg-black/5']"
            @click="$emit('open-vocab-selector')"
          >
            词库
          </button>
          <button 
            :class="['px-5 py-2 text-sm font-medium rounded-full shadow-sm transition-all', currentPage === 'wordbook' ? 'text-white bg-emerald-600' : (isDark ? 'text-gray-400 hover:text-emerald-400 hover:bg-white/5' : 'text-gray-600 hover:text-emerald-600 hover:bg-black/5')]"
            @click="$emit('navigate', 'wordbook')"
          >
            单词本
          </button>
          <button 
            :class="['px-5 py-2 text-sm font-medium rounded-full shadow-sm transition-all', currentPage === 'review' ? 'text-white bg-emerald-600' : (isDark ? 'text-gray-400 hover:text-emerald-400 hover:bg-white/5' : 'text-gray-600 hover:text-emerald-600 hover:bg-black/5')]"
            @click="$emit('navigate', 'review')"
          >
            复习
          </button>
          <button
            :class="['px-5 py-2 text-sm font-medium rounded-full shadow-sm transition-all', currentPage === 'quiz' ? 'text-white bg-emerald-600' : (isDark ? 'text-gray-400 hover:text-emerald-400 hover:bg-white/5' : 'text-gray-600 hover:text-emerald-600 hover:bg-black/5')]"
            @click="$emit('navigate', 'quiz')"
          >
            测验
          </button>
          <button
            :class="['px-5 py-2 text-sm font-medium rounded-full shadow-sm transition-all', currentPage === 'context' ? 'text-white bg-emerald-600' : (isDark ? 'text-gray-400 hover:text-emerald-400 hover:bg-white/5' : 'text-gray-600 hover:text-emerald-600 hover:bg-black/5')]"
            @click="$emit('navigate', 'context')"
          >
            语境
          </button>
          <button 
            :class="['px-5 py-2 text-sm font-medium rounded-full shadow-sm transition-all', currentPage === 'achievements' ? 'text-white bg-emerald-600' : (isDark ? 'text-gray-400 hover:text-emerald-400 hover:bg-white/5' : 'text-gray-600 hover:text-emerald-600 hover:bg-black/5')]"
            @click="$emit('navigate', 'achievements')"
          >
            成就
          </button>
        </div>

        <div class="flex items-center gap-3">
          <!-- Login/User Button (only show when Supabase is configured) -->
          <button
            v-if="!isLoggedIn && hasSupabaseConfig"
            :class="[
              'px-4 py-2 text-sm font-bold rounded-xl transition-all active:scale-95',
              isDark 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500' 
                : 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/10 hover:bg-emerald-500'
            ]" 
            @click="showAuth = true"
          >
            登录
          </button>
           
          <button 
            v-else-if="hasUser"
            :class="[
              'w-10 h-10 rounded-xl overflow-hidden border transition-all hover:scale-105 active:scale-95',
              isDark ? 'border-white/10' : 'border-black/10'
            ]"
            @click="toggleUserMenu"
          >
            <img 
              :src="userAvatarUrl"
              class="w-full h-full object-cover"
              :alt="userEmail"
            >
          </button>

          <button
            :class="[
              'p-2.5 rounded-xl backdrop-blur-sm border transition-all',
              isDark 
                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-emerald-500/30 text-gray-400 hover:text-emerald-400' 
                : 'bg-black/5 border-black/10 hover:bg-black/10 hover:border-emerald-500/30 text-gray-600 hover:text-emerald-600'
            ]"
            @click="$emit('open-settings')"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            /><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            /></svg>
          </button>
        </div>
      </nav>

      <!-- User Menu Dropdown -->
      <div 
        v-if="showUserMenu && hasUser" 
        class="absolute top-20 right-6 w-64 bg-slate-900 border border-white/10 rounded-2xl p-2 shadow-2xl z-50 animate-dropdown"
      >
        <div class="p-4 border-b border-white/5 mb-2">
          <p class="text-xs text-slate-500 uppercase tracking-widest mb-1">
            已登录为
          </p>
          <p class="text-sm font-bold truncate text-white">
            {{ userEmail }}
          </p>
        </div>
        <button 
          class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          @click="handleLogout"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          退出登录
        </button>
      </div>

      <!-- Auth Overlay -->
      <AuthOverlay
        v-if="showAuth && !isLoggedIn && hasSupabaseConfig"
        @close="showAuth = false"
      />

      <!-- Main Layout -->
      <slot />

      <!-- Footer -->
      <footer :class="['mt-auto pt-12 pb-6 text-center', isDark ? 'text-gray-500' : 'text-gray-600']">
        <div class="flex flex-col items-center gap-2">
          <div class="flex items-center gap-2">
            <span class="text-lg">📚</span>
            <span class="font-medium">数据来源致谢</span>
          </div>
          <p class="text-sm">
            单词数据来自 
            <a
              href="https://github.com/zhenghaoyang24/english-vocabulary"
              target="_blank"
              rel="noopener"
              class="text-emerald-500 hover:text-emerald-400 underline underline-offset-2"
            >
              zhenghaoyang24/english-vocabulary
            </a> 
            开源项目，感谢作者的辛勤贡献！
          </p>
          <p :class="['text-xs mt-2', isDark ? 'text-gray-600' : 'text-gray-500']">
            Developed by 
            <a
              href="https://github.com/ZJUZhiyuCai"
              target="_blank"
              rel="noopener"
              class="font-medium hover:text-emerald-500 underline underline-offset-2"
            >
              ZJUZhiyuCai
            </a>
            · Powered by Vue 3 + Vite + Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useTheme } from '../composables/useTheme.js'
import { useAuth } from '../composables/useAuth.js'
import { hasSupabaseConfig } from '../utils/supabase.js'
import AuthOverlay from '../components/AuthOverlay.vue'

const { isDark } = useTheme()
const { isLoggedIn, user, logout } = useAuth()

const showAuth = ref(false)
const showUserMenu = ref(false)
const hasUser = computed(() => !!user.value)
const userId = computed(() => user.value?.id || 'offline-user')
const userEmail = computed(() => user.value?.email || 'User')
const userAvatarUrl = computed(() => {
  return user.value?.user_metadata?.avatar_url
    || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId.value}`
})

defineProps({
  currentPage: {
    type: String,
    default: 'today'
  }
})

defineEmits(['navigate', 'open-settings', 'open-vocab-selector'])

function toggleUserMenu() {
  if (!hasUser.value) return
  showUserMenu.value = !showUserMenu.value
}

async function handleLogout() {
  showUserMenu.value = false
  await logout()
}
</script>

<style scoped>
/* Keyframe Animations */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
.animate-float {
  animation: float 12s ease-in-out infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.05); }
}
.animate-pulse-slow {
  animation: pulse-slow 10s ease-in-out infinite;
}

@keyframes slide-down {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-down {
  animation: slide-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
