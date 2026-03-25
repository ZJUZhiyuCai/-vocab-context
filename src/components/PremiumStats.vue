<template>
  <div class="lg:col-span-5 flex flex-col gap-5 animate-slide-left delay-100">
    
    <!-- Daily Goal Card -->
    <div :class="['backdrop-blur-sm border rounded-3xl p-6 shadow-lg hover:shadow-xl hover:border-emerald-500/20 transition-all', isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-gray-200']">
       <div class="flex justify-between items-start mb-5">
          <div>
             <h3 class="text-gray-500 text-sm font-medium mb-1">今日目标</h3>
             <div :class="['text-4xl font-bold', isDark ? 'text-white' : 'text-slate-900']">{{ todayLearned }}<span class="text-gray-500 text-xl font-normal">/{{ dailyGoal }}</span></div>
          </div>
          <div class="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/30">
             {{ Math.min(Math.round((todayLearned / dailyGoal) * 100), 100) }}%
          </div>
       </div>
       <div :class="['w-full rounded-full h-3 overflow-hidden', isDark ? 'bg-slate-700/50' : 'bg-gray-200']">
          <div 
            class="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-1000"
            :style="{ width: Math.min((todayLearned / dailyGoal) * 100, 100) + '%' }"
          ></div>
       </div>
       <p class="text-sm text-gray-500 mt-3" v-if="todayLearned < dailyGoal">
         还差 <span class="text-emerald-400 font-semibold">{{ dailyGoal - todayLearned }}</span> 个单词完成今日目标 🎯
       </p>
       <p class="text-sm text-gray-500 mt-3" v-else>
         🎉 今日目标已完成！
       </p>
    </div>

    <!-- Streak & Total Grid -->
     <div class="grid grid-cols-2 gap-5">
        <div :class="['backdrop-blur-sm border rounded-3xl p-6 shadow-lg hover:shadow-xl hover:border-orange-500/20 hover:-translate-y-1 transition-all group', isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-gray-200']">
           <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span class="text-2xl">🔥</span>
           </div>
           <div :class="['text-3xl font-bold', isDark ? 'text-white' : 'text-slate-900']">{{ streak }}</div>
           <div class="text-sm text-gray-500 font-medium">天连续学习</div>
        </div>
        
        <div :class="['backdrop-blur-sm border rounded-3xl p-6 shadow-lg hover:shadow-xl hover:border-emerald-500/20 hover:-translate-y-1 transition-all group', isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-gray-200']">
           <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform', isDark ? 'bg-violet-500/20 border border-violet-500/20' : 'bg-emerald-500/20 border border-emerald-500/20']">
              <span class="text-2xl">📚</span>
           </div>
           <div :class="['text-3xl font-bold', isDark ? 'text-white' : 'text-slate-900']">{{ totalLearned }}</div>
           <div class="text-sm text-gray-500 font-medium">已掌握单词</div>
        </div>
     </div>

     <div
      v-if="ieltsRecommendation"
      :class="['backdrop-blur-sm border rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all', isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-gray-200']"
     >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.18em] text-emerald-400 font-semibold">Next Best Step</p>
            <h3 :class="['text-lg font-bold mt-2', isDark ? 'text-white' : 'text-slate-900']">{{ ieltsRecommendation.title }}</h3>
            <p class="text-sm text-gray-500 mt-2 leading-7">{{ ieltsRecommendation.description }}</p>
          </div>
          <button
            @click="followIeltsRecommendation"
            class="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all"
          >
            {{ ieltsRecommendation.ctaLabel }}
          </button>
        </div>
     </div>

     <!-- Recent History -->
     <div :class="['backdrop-blur-sm border rounded-3xl p-6 shadow-lg flex-1 min-h-[200px]', isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-gray-200']">
        <div class="flex items-center justify-between mb-5">
          <h3 :class="['font-semibold', isDark ? 'text-gray-200' : 'text-gray-800']">最近掌握</h3>
          <button class="text-sm text-emerald-400 hover:text-emerald-300 font-medium">查看全部 →</button>
        </div>
        <div class="space-y-3">
           <div 
            v-for="word in recentHistory.slice(0, 3)"
            :key="word.id"
            :class="['flex items-center justify-between p-4 rounded-2xl border hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all cursor-pointer group', isDark ? 'bg-slate-900/50 border-white/5' : 'bg-gray-50 border-gray-200']"
           >
              <div class="flex items-center gap-4">
                 <div class="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                   {{ word.word ? word.word[0].toUpperCase() : '?' }}
                 </div>
                 <div>
                   <div :class="['font-semibold group-hover:text-emerald-400 transition-colors', isDark ? 'text-gray-200' : 'text-gray-800']">{{ word.word }}</div>
                   <div class="text-xs text-gray-500 max-w-[150px] truncate">{{ word.meaning }}</div>
                 </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-2 py-1 rounded-lg">已掌握</span>
              </div>
           </div>
           
           <div v-if="recentHistory.length === 0" class="text-center text-gray-500 py-4">
             暂无学习记录
           </div>
        </div>
     </div>

  </div>
</template>

<script setup>
import { useTheme } from '../composables/useTheme.js'
import { computed } from 'vue'
import { buildIeltsQuickRecommendation, setPendingIeltsPathTarget } from '../utils/ieltsPathEntry.js'

const { isDark } = useTheme()

const props = defineProps({
  todayLearned: {
    type: Number,
    default: 0
  },
  dailyGoal: {
    type: Number,
    default: 20
  },
  streak: {
    type: Number,
    default: 0
  },
  totalLearned: {
    type: Number,
    default: 0
  },
  recentHistory: {
    type: Array,
    default: () => []
  },
  currentVocab: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['navigate'])

const ieltsRecommendation = computed(() => buildIeltsQuickRecommendation(props.currentVocab))

function followIeltsRecommendation() {
  if (!ieltsRecommendation.value) return
  setPendingIeltsPathTarget({ mode: ieltsRecommendation.value.mode })
  emit('navigate', 'context')
}
</script>

<style scoped>
@keyframes slide-left {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-slide-left {
  animation: slide-left 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
  opacity: 0;
}
</style>
