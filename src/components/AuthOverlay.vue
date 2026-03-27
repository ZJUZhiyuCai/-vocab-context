
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      @click="$emit('close')"
    />

    <!-- Modal -->
    <div class="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl animate-scale-in">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-4">
          <svg
            class="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 class="text-2xl font-black text-white mb-2">
          欢迎回来
        </h2>
        <p class="text-slate-400">
          登录以同步你的学习进度到云端
        </p>
      </div>

      <!-- Success Message for Magic Link -->
      <div
        v-if="magicLinkSent"
        class="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center animate-scale-in"
      >
        <div class="text-emerald-500 text-4xl mb-4">
          📧
        </div>
        <h3 class="text-emerald-500 font-bold mb-2">
          邮件已发送！
        </h3>
        <p class="text-slate-400 text-sm">
          请检查你的收件箱并点击链接进行登录。
        </p>
        <button 
          class="mt-4 text-xs text-slate-500 hover:text-slate-300 underline"
          @click="magicLinkSent = false"
        >
          返回登录
        </button>
      </div>

      <div
        v-else
        class="space-y-6"
      >
        <!-- Email Login Form -->
        <div class="space-y-3">
          <div class="relative">
            <input 
              v-model="email"
              type="email" 
              placeholder="输入邮箱地址..."
              class="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
              @keyup.enter="handleMagicLinkLogin"
            >
          </div>
          <button
            :disabled="loading || !email"
            class="w-full py-4 rounded-2xl bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
            @click="handleMagicLinkLogin"
          >
            {{ loading ? '发送中...' : '发送登录链接' }}
          </button>
        </div>

        <div class="relative flex items-center justify-center py-2">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/5" />
          </div>
          <span class="relative bg-slate-900 px-4 text-[10px] text-slate-500 font-bold tracking-widest uppercase">或使用第三方登录</span>
        </div>

        <!-- GitHub Login -->
        <button
          :disabled="loading"
          class="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all active:scale-[0.98] disabled:opacity-50 border border-white/5"
          @click="handleGithubLogin"
        >
          <svg
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          使用 GitHub 账号登录
        </button>
      </div>

      <button
        class="w-full mt-8 py-3 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        @click="$emit('close')"
      >
        稍后再说，先本地学习
      </button>

      <p class="mt-6 text-[10px] text-center text-slate-600 leading-relaxed uppercase tracking-widest">
        Powered by Supabase • Private & Secure
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const emit = defineEmits(['close'])
const { loginWithGithub, loginWithMagicLink } = useAuth()
const loading = ref(false)
const email = ref('')
const magicLinkSent = ref(false)

async function handleMagicLinkLogin() {
  if (!email.value) return
  loading.value = true
  try {
    const { error } = await loginWithMagicLink(email.value)
    if (error) throw error
    magicLinkSent.value = true
  } catch (err) {
    alert('发送验证邮件失败: ' + err.message)
  } finally {
    loading.value = false
  }
}

async function handleGithubLogin() {
  loading.value = true
  try {
    const { error } = await loginWithGithub()
    if (error) throw error
  } catch (err) {
    alert('GitHub 登录失败: ' + err.message)
    loading.value = false
  }
}
</script>

<style scoped>
.animate-scale-in {
  animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
