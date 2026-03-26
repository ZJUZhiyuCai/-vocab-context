
<template>
  <PremiumLayout
    :current-page="currentPage"
    @navigate="handleNavigate"
    @open-settings="openSettings"
    @open-vocab-selector="showVocabSelector = true"
  >
    <!-- Onboarding Quiz -->
    <OnboardingQuiz
      v-if="showOnboarding"
      @complete="handleOnboardingComplete"
    />

    <!-- Offline Indicator -->
    <div
      v-if="!isOnline"
      class="fixed top-0 left-0 right-0 bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-center py-2 px-4 z-50 flex items-center justify-center gap-2"
    >
      <span class="text-sm font-medium">离线模式</span>
    </div>

    <!-- Main Content Area -->
    <div v-if="currentPage === 'today'" class="grid lg:grid-cols-12 gap-8 flex-1">
        
        <!-- Word Card (Left/Center) -->
        <template v-if="!isLoading && currentWord">
             <component
               :is="currentWord?.isBundle ? BundleWordCard : PremiumWordCard"
               :word="currentWord"
               :reviewing="false"
               :generating="generatingWordId === currentWord.id"
               :playing-audio="isPlayingWord"
               :loading-english-def="loadingEnglishDefinition === currentWord.id"
               :in-wordbook="isWordbooked(currentWord.id)"
               @play-audio="playWordAudio(currentWord.word)"
               @known="handleKnow"
               @unknown="handleForget"
               @generate-ai="generateExample(currentWord)"
               @fetch-english-def="fetchEnglishDefinition(currentWord)"
               @toggle-wordbook="toggleWordbook(currentWord.id)"
             />
        </template>
        
        <!-- Loading State -->
        <div v-else-if="isLoading" class="lg:col-span-12 text-center text-white pt-20">
            <div class="animate-pulse">Loading vocabulary...</div>
        </div>

        <!-- Empty State / Completed -->
        <div v-else class="lg:col-span-12 flex flex-col items-center justify-center text-white min-h-[50vh]">
            <div class="mb-8 text-emerald-400">
              <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 class="text-4xl font-black mb-4 tracking-tight">All caught up!</h2>
            <p class="text-slate-400 mb-8 text-lg">你已经完成了今日的所有单词。</p>
            <div v-if="todayIeltsRecommendation" :class="['w-full max-w-2xl rounded-3xl border p-6 mb-6 text-left', isDark ? 'bg-slate-800/50 border-white/10' : 'bg-white border-gray-200 shadow-xl']">
              <p class="text-xs uppercase tracking-[0.18em] text-emerald-400 font-semibold">Next Best Step</p>
              <h3 :class="['text-2xl font-bold mt-3', isDark ? 'text-white' : 'text-slate-900']">{{ todayIeltsRecommendation.title }}</h3>
              <p :class="['text-sm mt-3 leading-7', isDark ? 'text-gray-400' : 'text-gray-600']">{{ todayIeltsRecommendation.description }}</p>
              <div class="flex flex-wrap gap-3 mt-5">
                <button @click="followTodayIeltsRecommendation" class="premium-btn px-8 py-3">
                  {{ todayIeltsRecommendation.ctaLabel }}
                </button>
                <button @click="restart" :class="['px-8 py-3 rounded-2xl border font-semibold transition-all', isDark ? 'bg-white/5 border-white/10 text-gray-300 hover:border-gray-400' : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400']">
                  重新开始
                </button>
              </div>
            </div>
            <button v-else @click="restart" class="premium-btn px-10 py-4 text-lg">
                重新开始
            </button>
        </div>

        <!-- Stats Panel (Right) -->
        <PremiumStats
            v-if="!isLoading"
            :today-learned="todayStats.newWords"
            :daily-goal="userSettings.dailyGoal"
            :streak="streakDays" 
            :total-learned="stats.learned"
            :recent-history="recentHistoryList"
            :current-vocab="currentVocab"
            @navigate="handleNavigate"
        />
    </div>

    <!-- Other Pages -->
    <ReviewQueue
      v-else-if="currentPage === 'review'"
      :review-data="reviewQueueData"
      @navigate="handleNavigate"
    />

    <Wordbook
      v-else-if="currentPage === 'wordbook'"
      :words="words"
      :wordbook="wordbook"
      @back="currentPage = 'today'"
      @remove="removeFromWordbook"
      @batchRemove="handleBatchRemoveFromWordbook"
    />

    <Quiz
      v-else-if="currentPage === 'quiz'"
      :words="words"
      :learned="learned"
      :review-states="reviewStates"
      :current-vocab="currentVocab"
      @navigate="handleNavigate"
    />

    <ContextPractice
      v-else-if="currentPage === 'context'"
      :words="words"
      :review-states="reviewStates"
      :current-vocab="currentVocab"
      :available-vocabularies="allVocabularies"
      @navigate="handleNavigate"
      @select-vocabulary="handleVocabularySelect"
    />

    <div v-else-if="currentPage === 'achievements'" class="max-w-4xl mx-auto px-4 py-8 space-y-6 flex-1 overflow-y-auto h-full pb-32">
       <!-- Reusing existing components but wrapped in the dark theme they might look off unless they are transparent. 
            For now, just rendering them. Ideally should refactor them too. -->
      <StudyHeatmap />
      <AchievementsPanel />
    </div>

    <!-- Modals and Overlays -->
    
    <!-- Vocab Selector -->
    <div
      v-if="showVocabSelector"
      class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      :class="isDark ? 'bg-black/80' : 'bg-black/50'"
      @click.self="showVocabSelector = false"
    >
      <div :class="['rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto', isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-gray-200 shadow-2xl']" @click.stop>
        <div class="flex justify-between items-center mb-6">
          <h2 :class="['text-xl font-bold', isDark ? 'text-white' : 'text-gray-800']">选择词库</h2>
          <button @click="showVocabSelector = false" :class="isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'">
            ✕
          </button>
        </div>
        <VocabularySelector @select="handleVocabularySelect" />
      </div>
    </div>

    <!-- Settings Modal (Adapted for Dark Theme) -->
    <div
      v-if="showSettings"
      class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      :class="isDark ? 'bg-black/80' : 'bg-black/50'"
      @click.self="closeSettings"
    >
      <div :class="['rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl', isDark ? 'bg-slate-900 border border-white/10 text-gray-200' : 'bg-white border border-gray-200 text-gray-800']" @click.stop>
        <h2 :class="['text-xl font-bold mb-6', isDark ? 'text-white' : 'text-gray-800']">设置</h2>

        <!-- 学习计划 -->
        <div :class="['mb-6 pb-6 border-b', isDark ? 'border-gray-700' : 'border-gray-200']">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-1 h-4 rounded-full bg-emerald-500"></div>
            <h3 :class="['text-sm font-bold uppercase tracking-wider', isDark ? 'text-gray-400' : 'text-gray-600']">学习计划</h3>
          </div>

          <!-- 每日学习目标 -->
          <div class="mb-4">
            <label :class="['block text-sm font-medium mb-2', isDark ? 'text-gray-400' : 'text-gray-600']">每日学习目标</label>
            <div class="flex items-center gap-3">
              <input
                type="range"
                v-model.number="settingsForm.dailyGoal"
                min="5"
                max="100"
                step="5"
                :class="['flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500', isDark ? 'bg-gray-700' : 'bg-gray-200']"
              >
              <span class="text-sm font-bold text-emerald-400 w-16 text-center">{{ settingsForm.dailyGoal }}个</span>
            </div>
          </div>

          <!-- 学习模式 -->
          <div>
            <label :class="['block text-sm font-medium mb-2', isDark ? 'text-gray-400' : 'text-gray-600']">学习模式</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="settingsForm.studyMode = 'sequence'"
                class="p-3 text-sm rounded-xl border transition-all"
                :class="settingsForm.studyMode === 'sequence' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : isDark ? 'border-gray-700 bg-slate-800 text-gray-400 hover:border-gray-600' : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400'"
              >
                <div class="font-bold mb-1">顺序学习</div>
                <div class="text-xs opacity-75">按顺序逐个学习</div>
              </button>
              <button
                @click="settingsForm.studyMode = 'random'"
                class="p-3 text-sm rounded-xl border transition-all"
                :class="settingsForm.studyMode === 'random' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : isDark ? 'border-gray-700 bg-slate-800 text-gray-400 hover:border-gray-600' : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400'"
              >
                <div class="font-bold mb-1">随机学习</div>
                <div class="text-xs opacity-75">随机抽取单词</div>
              </button>
            </div>
          </div>

          <!-- 学习目的 -->
          <div class="mb-4">
            <label :class="['block text-sm font-medium mb-2', isDark ? 'text-gray-400' : 'text-gray-600']">学习目的</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="settingsForm.purpose = 'exam'"
                class="p-3 text-sm rounded-xl border transition-all"
                :class="settingsForm.purpose === 'exam' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : isDark ? 'border-gray-700 bg-slate-800 text-gray-400 hover:border-gray-600' : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400'"
              >
                <div class="font-bold mb-1">备考</div>
                <div class="text-xs opacity-75">雅思/托福/考研</div>
              </button>
              <button
                @click="settingsForm.purpose = 'work'"
                class="p-3 text-sm rounded-xl border transition-all"
                :class="settingsForm.purpose === 'work' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : isDark ? 'border-gray-700 bg-slate-800 text-gray-400 hover:border-gray-600' : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400'"
              >
                <div class="font-bold mb-1">职场</div>
                <div class="text-xs opacity-75">商务英语</div>
              </button>
              <button
                @click="settingsForm.purpose = 'academic'"
                class="p-3 text-sm rounded-xl border transition-all"
                :class="settingsForm.purpose === 'academic' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : isDark ? 'border-gray-700 bg-slate-800 text-gray-400 hover:border-gray-600' : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400'"
              >
                <div class="font-bold mb-1">学术</div>
                <div class="text-xs opacity-75">论文/研究</div>
              </button>
              <button
                @click="settingsForm.purpose = 'daily'"
                class="p-3 text-sm rounded-xl border transition-all"
                :class="settingsForm.purpose === 'daily' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : isDark ? 'border-gray-700 bg-slate-800 text-gray-400 hover:border-gray-600' : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400'"
              >
                <div class="font-bold mb-1">日常</div>
                <div class="text-xs opacity-75">生活交流</div>
              </button>
            </div>
          </div>
        </div>

        <!-- API Settings (Simplified for brevity in diff, but keeping logic) -->
        <div :class="['mb-6 pb-6 border-b', isDark ? 'border-gray-700' : 'border-gray-200']">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-1 h-4 rounded-full bg-cyan-500"></div>
            <h3 :class="['text-sm font-bold uppercase tracking-wider', isDark ? 'text-gray-400' : 'text-gray-600']">AI功能</h3>
          </div>
          <div class="mb-4">
            <label :class="['block text-sm font-medium mb-2', isDark ? 'text-gray-400' : 'text-gray-600']">{{ AI_PROVIDER_LABEL }} API 密钥</label>
            <input type="password" v-model="settingsForm.apiKey" placeholder="sk-..." :class="['w-full rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none', isDark ? 'bg-slate-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-800 border']">
            <p :class="['mt-2 text-xs leading-6', isDark ? 'text-gray-500' : 'text-gray-500']">{{ aiApiHelperText }}</p>
          </div>
        </div>

        <!-- 主题设置 -->
        <div :class="['mb-6 pb-6 border-b', isDark ? 'border-gray-700' : 'border-gray-200']">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-1 h-4 rounded-full bg-violet-500"></div>
            <h3 :class="['text-sm font-bold uppercase tracking-wider', isDark ? 'text-gray-400' : 'text-gray-600']">外观</h3>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <button
              @click="setTheme(THEMES.LIGHT)"
              class="p-3 text-sm rounded-xl border transition-all"
              :class="theme === THEMES.LIGHT ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : isDark ? 'border-gray-700 bg-slate-800 text-gray-400 hover:border-gray-600' : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400'"
            >
              <div class="font-bold mb-1">☀️ 浅色</div>
            </button>
            <button
              @click="setTheme(THEMES.DARK)"
              class="p-3 text-sm rounded-xl border transition-all"
              :class="theme === THEMES.DARK ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : isDark ? 'border-gray-700 bg-slate-800 text-gray-400 hover:border-gray-600' : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400'"
            >
              <div class="font-bold mb-1">🌙 深色</div>
            </button>
            <button
              @click="setTheme(THEMES.SYSTEM)"
              class="p-3 text-sm rounded-xl border transition-all"
              :class="theme === THEMES.SYSTEM ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : isDark ? 'border-gray-700 bg-slate-800 text-gray-400 hover:border-gray-600' : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400'"
            >
              <div class="font-bold mb-1">🖥️ 系统</div>
            </button>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button @click="saveSettings" class="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all">保存</button>
          <button @click="closeSettings" :class="['flex-1 py-3 rounded-xl font-bold active:scale-95 transition-all', isDark ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">取消</button>
        </div>
      </div>
    </div>

    <!-- Achievement Notification -->
    <AchievementNotification
      v-if="currentAchievementNotification"
      :achievement="currentAchievementNotification"
      @close="onAchievementClose"
    />

    <!-- Card Next Step Toast -->
    <CardNextStepToast
      v-if="cardRecommendation"
      :recommendation="cardRecommendation"
      @action="handleCardRecommendationAction"
      @dismiss="handleCardRecommendationDismiss"
    />
    
    <!-- Vocab Level Test -->
    <div v-if="showVocabTest" class="fixed inset-0 z-50 bg-slate-900">
         <VocabLevelTest @complete="handleVocabTestComplete" />
    </div>

    <!-- Error Toast -->
    <div v-if="error" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500/90 backdrop-blur text-white px-6 py-3 rounded-xl shadow-xl z-50 animate-slide-up border border-red-400/30">
      {{ error }}
    </div>

    <!-- Mobile Tab Bar (Visible on Mobile) -->
    <MobileTabBar
      class="lg:hidden"
      :current-tab="currentPage"
      :review-count="forgotten.size"
      @navigate="handleMobileNavigate"
    />

  </PremiumLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { user } from './utils/authService.js'
import { syncService } from './utils/syncService.js'
import PremiumLayout from './layouts/PremiumLayout.vue'
import BundleWordCard from './components/BundleWordCard.vue'
import PremiumWordCard from './components/PremiumWordCard.vue'
import PremiumStats from './components/PremiumStats.vue'

import { generateAIExample } from './utils/aiService.js'
import { AI_MODEL, AI_PROVIDER_LABEL, AI_ENV_API_KEY_NAME } from './utils/aiClient.js'
import { buildIeltsQuickRecommendation, setPendingIeltsPathTarget } from './utils/ieltsPathEntry.js'
import { shouldShowCardRecommendation, buildCardRecommendation, getRecommendationDelay } from './utils/cardRecommendation.js'
import { getEtymology } from './utils/etymologyService.js'
import { getEnglishDefinition } from './utils/englishDefinitionService.js'
import { loadSettings, saveSettings as saveSettingsToStorage, loadWordbook, saveWordbook, loadUserProfile, saveUserProfile, shouldShowOnboarding } from './utils/storage.js'
import { useConfetti } from './composables/useConfetti.js'
import { useTheme } from './composables/useTheme.js'
import Wordbook from './components/Wordbook.vue'
import ReviewQueue from './components/ReviewQueue.vue'
import MobileTabBar from './components/MobileTabBar.vue'
import VocabularySelector from './components/VocabularySelector.vue'
import Quiz from './components/Quiz.vue'
import ContextPractice from './components/context/ContextPractice.vue'
import OnboardingQuiz from './components/OnboardingQuiz.vue'
import VocabLevelTest from './components/VocabLevelTest.vue'

import {
  getAllVocabularies,
  getCurrentVocabulary,
  loadCurrentVocabulary,
  setCurrentVocabulary,
  getVocabularyProgress,
  saveVocabularyProgress
} from './utils/vocabularyManager.js'
import { getStudyHistory, saveStudyHistory } from './utils/studyHistory.js'
import { getUnlockedAchievements, saveUnlockedAchievements } from './utils/achievements.js'
import { getVocabularyLoader } from './utils/vocabularyLoader.js'
import { getBundleLoader } from './utils/bundleLoader.js'
import {
  createWordReviewState,
  needsReview,
  updateWordLevel,
  calculateNextReview,
  getReviewQueue,
  getTodayReviewStats
} from './utils/spacedRepetition.js'
import { recordTodayStudy, getStreakDays } from './utils/studyHistory.js'
import { checkAchievements } from './utils/achievements.js'
import AchievementsPanel from './components/AchievementsPanel.vue'
import AchievementNotification from './components/AchievementNotification.vue'
import CardNextStepToast from './components/CardNextStepToast.vue'
import StudyHeatmap from './components/StudyHeatmap.vue'
import { getTTS } from './utils/text-to-speech.js'
import { getFreeDictionaryTTS } from './utils/freeDictionaryTTS.js'
import {
  saveGistConfig,
  loadGistConfig,
  syncData,
  testGistConfig,
  getSyncStats
} from './utils/gistSync.js'

// 状态
const words = ref([])
const currentIndex = ref(0)
const learned = ref(new Set())
const forgotten = ref(new Set())
const wordbook = ref(new Set()) // 单词本
const wordCard = ref(null) // 单词卡片引用
const isLoading = ref(true) // 加载状态
const currentVocab = ref(null) // 当前词库
const showVocabSelector = ref(false) // 显示词库选择器

// 复习系统状态
const reviewStates = ref({}) // 单词ID -> 复习状态
const reviewQueue = ref([]) // 复习队列

// 卡片动画状态
const cardAnimation = ref('') // 'slide-left', 'slide-right', ''
const isCardAnimating = ref(false)

// 网络状态
const isOnline = ref(navigator.onLine)

// 触摸手势状态
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const touchEndY = ref(0)
const isSwiping = ref(false)

// AI相关状态
const userSettings = ref({
  apiKey: '',
  interests: [],
  dailyGoal: 20,
  studyMode: 'random',
  githubToken: '',
  purpose: 'exam'
})
const settingsForm = ref({
  apiKey: '',
  interests: [],
  dailyGoal: 20,
  studyMode: 'random',
  githubToken: '',
  purpose: 'exam'
})
const showSettings = ref(false)
const newInterest = ref('')
const generatingWordId = ref(null)
const loadingEtymology = ref(null)
const loadingEnglishDefinition = ref(null)
const error = ref(null)
const aiApiHelperText = `可在这里手动填写 ${AI_PROVIDER_LABEL} 密钥；如果当前环境已在 .env.local 或部署平台中配置 ${AI_ENV_API_KEY_NAME}，应用也会自动使用 ${AI_MODEL}。`

// 同步状态
const syncing = ref(false)
const testingGist = ref(false)
const gistSyncStats = ref({ lastSync: '从未同步', gistId: null, hasConfig: false })

// 用户画像状态
const userProfile = ref({ purpose: '' })
const showOnboarding = ref(false)
const showVocabTest = ref(false)  // 显示词汇测试弹窗

// 成就系统状态
const currentAchievementNotification = ref(null)
const sessionLearnCount = ref(0)  // 本次会话学习数
const learnedCount = ref(0)       // 本次会话"认识"的次数（用于卡片推荐频率）

// 卡片级下一步推荐
const cardRecommendation = ref(null)
let pendingRecommendationTimer = null

// 页面状态
const currentPage = ref('today')
const allVocabularies = getAllVocabularies()

// 彩带动画
const { triggerConfetti } = useConfetti()

// 主题管理
const { theme, isDark, setTheme, THEMES } = useTheme()

// 当前单词
const currentWord = computed(() => {
  return words.value[currentIndex.value] || null;
})

// 进度
const progress = computed(() => ({
  total: words.value.length,
  learned: learned.value.size,
}))

// 统计数据
const stats = computed(() => {
  const total = learned.value.size + forgotten.value.size
  const accuracy = total > 0 ? Math.round((learned.value.size / total) * 100) : 0
  return {
    learned: learned.value.size,
    forgotten: forgotten.value.size,
    accuracy,
  }
})

const todayIeltsRecommendation = computed(() => buildIeltsQuickRecommendation(currentVocab.value))

// 今日统计
const todayStats = computed(() => ({
  newWords: learned.value.size, // 简化：假设所有已学习都是今天（需优化逻辑）
  reviewWords: forgotten.value.size,
  aiExamples: words.value.filter(w => w.aiExample).length,
  duration: formatDuration(totalStudyTime.value + getSessionTime())
}))

// Streak days computed
const streakDays = computed(() => {
    try {
        return getStreakDays() || 0;
    } catch (e) {
        return 0;
    }
})

// Recent History List Computed
const recentHistoryList = computed(() => {
    // Show last 5 learned words (approximation using learned set order if possible, else just first 5 known words)
    // Arrays from Sets preserve insertion order
    const learnedIds = Array.from(learned.value);
    const recentIds = learnedIds.slice(-5).reverse();
    return recentIds.map(id => words.value.find(w => w.id === id)).filter(Boolean);
})

// 学习时长统计
const sessionStartTime = ref(Date.now())
const totalStudyTime = ref(0) // 从localStorage加载的总时长（秒）
const isPageVisible = ref(true)

// TTS 语音朗读
const tts = getTTS()
const freeDictTTS = getFreeDictionaryTTS()
const isPlayingWord = ref(false)

// 朗读单词
async function playWordAudio(word) {
  isPlayingWord.value = true
  try {
    console.log('🔊 尝试 Free Dictionary API:', word)
    const success = await freeDictTTS.play(word)
    if (success) {
      console.log('✅ Free Dictionary 发音成功')
      return
    }
  } catch (error) {
    console.warn('⚠️ Free Dictionary API 失败:', error)
  }
  await fallbackBrowserTTS(word)
  isPlayingWord.value = false
}

async function fallbackBrowserTTS(word) {
  if (!tts.isSupported()) {
    alert('请先配置 API 密钥或使用支持语音的浏览器')
    return
  }
  try {
    await tts.speakWord(word)
  } catch (error) {
    console.error('语音朗读失败:', error)
  }
}

const getSessionTime = () => {
  if (!isPageVisible.value) return 0
  return Math.floor((Date.now() - sessionStartTime.value) / 1000)
}

const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds}秒`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}分钟`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}小时${remainingMinutes}分` : `${hours}小时`
}

const saveStudyTime = () => {
  try {
    const currentSessionTime = getSessionTime()
    const totalTime = totalStudyTime.value + currentSessionTime
    localStorage.setItem('vocabcontext_study_time', totalTime.toString())
    totalStudyTime.value = totalTime
    sessionStartTime.value = Date.now()
  } catch (error) {
    console.error('保存学习时长失败:', error)
  }
}

const loadStudyTime = () => {
  try {
    const saved = localStorage.getItem('vocabcontext_study_time')
    return saved ? parseInt(saved, 10) : 0
  } catch (error) {
    return 0
  }
};

// Handlers
const handleKnow = () => {
  if (currentWord.value && !isCardAnimating.value) {
    if (!reviewStates.value[currentWord.value.id]) {
      reviewStates.value[currentWord.value.id] = createWordReviewState();
    }
    const updated = updateWordLevel(
      reviewStates.value[currentWord.value.id].intervalLevel,
      true,
      reviewStates.value[currentWord.value.id].easeFactor
    );
    reviewStates.value[currentWord.value.id] = {
      ...reviewStates.value[currentWord.value.id],
      ...updated,
      nextReview: calculateNextReview(updated.intervalLevel, updated.easeFactor),
      lastReview: Date.now(),
      reviewCount: (reviewStates.value[currentWord.value.id].reviewCount || 0) + 1,
      correctCount: (reviewStates.value[currentWord.value.id].correctCount || 0) + 1
    };
    learned.value.add(currentWord.value.id);
    saveReviewStates();
    updateReviewQueue();
    recordTodayStudy(1);
    sessionLearnCount.value++;
    learnedCount.value++;
    checkAndUnlockAchievements();

    // 检查是否显示卡片级推荐（使用 snapshot 避免延迟后读取到错误的词）
    const vocabSnapshot = currentVocab.value;
    const wordSnapshot = currentWord.value;
    const reviewSnapshot = reviewStates.value[currentWord.value.id];
    if (shouldShowCardRecommendation(vocabSnapshot, wordSnapshot, reviewSnapshot, learnedCount.value)) {
      // 清理旧的 timer
      if (pendingRecommendationTimer) {
        clearTimeout(pendingRecommendationTimer);
      }
      pendingRecommendationTimer = setTimeout(() => {
        cardRecommendation.value = buildCardRecommendation(vocabSnapshot, wordSnapshot);
        pendingRecommendationTimer = null;
      }, getRecommendationDelay());
    }

    animateCardAndNext('slide-left');
  }
};

const handleForget = () => {
  if (currentWord.value && !isCardAnimating.value) {
    if (!reviewStates.value[currentWord.value.id]) {
      reviewStates.value[currentWord.value.id] = createWordReviewState();
    }
    const updated = updateWordLevel(
      reviewStates.value[currentWord.value.id].intervalLevel,
      false,
      reviewStates.value[currentWord.value.id].easeFactor
    );
    reviewStates.value[currentWord.value.id] = {
      ...reviewStates.value[currentWord.value.id],
      ...updated,
      nextReview: calculateNextReview(updated.intervalLevel, updated.easeFactor),
      lastReview: Date.now(),
      reviewCount: (reviewStates.value[currentWord.value.id].reviewCount || 0) + 1,
      incorrectCount: (reviewStates.value[currentWord.value.id].incorrectCount || 0) + 1
    };
    forgotten.value.add(currentWord.value.id);
    saveReviewStates();
    updateReviewQueue();
    recordTodayStudy(1);
    sessionLearnCount.value++;
    checkAndUnlockAchievements();
    animateCardAndNext('slide-right');
  }
};

const animateCardAndNext = (animationType) => {
  isCardAnimating.value = true;
  cardAnimation.value = animationType;
  setTimeout(() => {
    nextWord();
    cardAnimation.value = '';
    isCardAnimating.value = false;
    saveCurrentProgress();
  }, 300);
};

const nextWord = () => {
  if (currentIndex.value < words.value.length - 1) {
    currentIndex.value++;
  }
};

const previousWord = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const reviewStats = computed(() => {
  return getTodayReviewStats(reviewStates.value);
});

const reviewQueueData = computed(() => {
  return reviewQueue.value.map(item => {
    const word = words.value.find(w => w.id === item.wordId);
    const reviewState = reviewStates.value[item.wordId];
    return {
      word,
      reviewState,
      type: item.type || 'review',
      priority: item.priority || 0
    };
  }).filter(item => item.word);
});

const checkAndUnlockAchievements = () => {
  const hour = new Date().getHours()
  const achievementStats = {
    totalLearned: learned.value.size,
    streakDays: streakDays.value,
    sessionCount: sessionLearnCount.value,
    accuracy: stats.value.accuracy,
    hour,
    vocabProgress: {}
  }
  const vocabularies = ['vocab-a2-basic', 'vocab-b1-intermediate', 'vocab-b2-upper-intermediate', 'vocab-c1-advanced', 'vocab-c2-proficiency']
  vocabularies.forEach(vocabId => {
    try {
      const progress = getVocabularyProgress(vocabId)
      const totalWords = progress.total || 0
      const learnedCount = (progress.learned || []).length
      achievementStats.vocabProgress[vocabId] = totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0
    } catch {
      achievementStats.vocabProgress[vocabId] = 0
    }
  })
  const newAchievements = checkAchievements(achievementStats)
  if (newAchievements.length > 0) {
    newAchievements.forEach((achievement, index) => {
      // 同步成就到云端
      syncService.syncAchievement(achievement.id).catch(() => {});
      
      setTimeout(() => {
        showAchievementNotification(achievement)
        triggerConfetti()
      }, index * 1000)
    })
  }
}

const showAchievementNotification = (achievement) => {
  currentAchievementNotification.value = achievement
}

const onAchievementClose = () => {
  currentAchievementNotification.value = null
}

const isWordbooked = (wordId) => wordbook.value.has(wordId);

const addToWordbook = (wordId) => {
  wordbook.value.add(wordId);
  saveWordbook(wordbook.value);
  
  // 同步到云端
  if (currentVocab.value) {
    syncService.syncWordbook(wordId, currentVocab.value.id, true).catch(err => {
      console.warn('⚠️ 同步到单词本失败:', err);
    });
  }
};
const removeFromWordbook = (wordId) => {
  wordbook.value.delete(wordId);
  saveWordbook(wordbook.value);
  
  // 同步到云端
  if (currentVocab.value) {
    syncService.syncWordbook(wordId, currentVocab.value.id, false).catch(err => {
      console.warn('⚠️ 从云端单词本删除失败:', err);
    });
  }
};
const handleBatchRemoveFromWordbook = (wordIds) => {
  wordIds.forEach(wordId => {
    wordbook.value.delete(wordId);
    if (currentVocab.value) {
      syncService.syncWordbook(wordId, currentVocab.value.id, false).catch(() => {});
    }
  });
  saveWordbook(wordbook.value);
};
const toggleWordbook = (wordId) => {
  if (isWordbooked(wordId)) removeFromWordbook(wordId);
  else addToWordbook(wordId);
};

// 清理 pending 推荐状态
const clearPendingRecommendation = () => {
  if (pendingRecommendationTimer) {
    clearTimeout(pendingRecommendationTimer);
    pendingRecommendationTimer = null;
  }
  cardRecommendation.value = null;
};

const restart = async () => {
  // 清理 pending 推荐
  clearPendingRecommendation();

  currentIndex.value = 0;
  learned.value.clear();
  forgotten.value.clear();
  const key = `vocabcontext_progress_${currentVocab.value.id}`;
  localStorage.removeItem(key);
  const reviewKey = `vocabcontext_review_${currentVocab.value.id}`;
  localStorage.removeItem(reviewKey);
  reviewStates.value = {};
  sessionLearnCount.value = 0;
  learnedCount.value = 0;
  await loadData();
};

const loadData = async () => {
  isLoading.value = true;
  try {
    currentVocab.value = loadCurrentVocabulary();
    const loader = currentVocab.value.isBundle
      ? getBundleLoader(currentVocab.value.file)
      : getVocabularyLoader(currentVocab.value.file);
    const allWords = await loader.getWordsRange(0, await loader.getTotalCount());
    const validWordIds = new Set(allWords.map(word => word.id));
    
    // Load progress
    const progress = sanitizeVocabularyProgress(
      getVocabularyProgress(currentVocab.value.id),
      validWordIds,
      allWords.length
    );
    persistVocabularyProgressLocally(currentVocab.value.id, progress);
    learned.value = new Set(progress.learned || []);
    forgotten.value = new Set(progress.forgotten || []);

    const isRandomMode = userSettings.value.studyMode === 'random';
    if (isRandomMode) {
      words.value = shuffleArray([...allWords]);
    } else {
      words.value = allWords;
    }
    currentIndex.value = clampCurrentIndex(progress.currentIndex, words.value.length);
    loadReviewStates(validWordIds);
    updateReviewQueue();
  } catch (error) {
    console.error('❌ 加载数据失败:', error);
  } finally {
    isLoading.value = false;
  }
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const clampCurrentIndex = (index, total) => {
  if (!Number.isInteger(index) || index < 0 || total <= 0) return 0;
  return Math.min(index, total - 1);
};

const sanitizeVocabularyProgress = (progress, validWordIds, totalWords) => {
  const learnedIds = Array.isArray(progress?.learned)
    ? progress.learned.filter(id => validWordIds.has(id))
    : [];
  const forgottenIds = Array.isArray(progress?.forgotten)
    ? progress.forgotten.filter(id => validWordIds.has(id))
    : [];

  return {
    learned: learnedIds,
    forgotten: forgottenIds,
    currentIndex: clampCurrentIndex(progress?.currentIndex, totalWords)
  };
};

const persistVocabularyProgressLocally = (vocabId, progress) => {
  try {
    const key = `vocabcontext_progress_${vocabId}`;
    localStorage.setItem(key, JSON.stringify(progress));
  } catch (error) {
    console.warn('⚠️ 本地清洗词库进度失败:', error);
  }
};

const sanitizeReviewStates = (states, validWordIds) => {
  if (!states || typeof states !== 'object') return {};

  return Object.fromEntries(
    Object.entries(states).filter(([wordId]) => validWordIds.has(wordId))
  );
};

const loadReviewStates = (validWordIds = new Set()) => {
  try {
    const key = `vocabcontext_review_${currentVocab.value.id}`;
    const saved = localStorage.getItem(key);
    const parsed = saved ? JSON.parse(saved) : {};
    reviewStates.value = sanitizeReviewStates(parsed, validWordIds);
    localStorage.setItem(key, JSON.stringify(reviewStates.value));
  } catch (error) {
    reviewStates.value = {};
  }
};


const saveReviewStates = () => {
  try {
    const key = `vocabcontext_review_${currentVocab.value.id}`;
    localStorage.setItem(key, JSON.stringify(reviewStates.value));
    
    // 同步当前单词的状态到云端
    if (currentWord.value && reviewStates.value[currentWord.value.id]) {
      syncService.syncReviewState(
        currentVocab.value.id, 
        currentWord.value.id, 
        reviewStates.value[currentWord.value.id]
      ).catch(err => console.warn('⚠️ 同步复习状态失败:', err));
    }
  } catch (error) {
    console.error('保存复习状态失败:', error);
  }
};

const updateReviewQueue = () => {
  reviewQueue.value = getReviewQueue(reviewStates.value, forgotten.value, 50);
};

const handleVocabularySelect = async (vocab) => {
  // 切词库时清理 pending 推荐
  clearPendingRecommendation();
  saveCurrentProgress();
  currentVocab.value = setCurrentVocabulary(vocab.id) || vocab;
  await loadData();
  showVocabSelector.value = false;
};

const saveCurrentProgress = () => {
  if (!currentVocab.value) return;
  const progress = {
    learned: Array.from(learned.value),
    forgotten: Array.from(forgotten.value),
    currentIndex: currentIndex.value
  };
  saveVocabularyProgress(currentVocab.value.id, progress);
};

const updateGistSyncStats = () => {
  gistSyncStats.value = getSyncStats()
};

const openSettings = () => {
  settingsForm.value = {
    apiKey: userSettings.value.apiKey,
    interests: [...userSettings.value.interests],
    dailyGoal: userSettings.value.dailyGoal || 20,
    studyMode: userSettings.value.studyMode || 'random',
    purpose: userProfile.value.purpose || 'daily',
    githubToken: ''
  };
  const gistConfig = loadGistConfig()
  if (gistConfig && gistConfig.token) {
    settingsForm.value.githubToken = gistConfig.token
  }
  updateGistSyncStats()
  showSettings.value = true
};

const closeSettings = () => {
  showSettings.value = false;
};

const saveSettings = () => {
  userSettings.value = {
    apiKey: settingsForm.value.apiKey.trim(),
    aiProvider: 'siliconflow',
    interests: [...settingsForm.value.interests],
    dailyGoal: settingsForm.value.dailyGoal,
    studyMode: settingsForm.value.studyMode,
    purpose: settingsForm.value.purpose
  };
  saveSettingsToStorage(userSettings.value);
  if (settingsForm.value.githubToken) {
    const config = loadGistConfig() || {};
    config.token = settingsForm.value.githubToken.trim();
    saveGistConfig(config);
  }
  userProfile.value.purpose = settingsForm.value.purpose;
  saveUserProfile(userProfile.value);
  showSettings.value = false;
  setTimeout(async () => {
    await loadData();
  }, 100);
  updateGistSyncStats();
};

const generateExample = async (word) => {
  generatingWordId.value = word.id;
  error.value = null;
  try {
    const result = await generateAIExample({
      apiKey: userSettings.value.apiKey,
      word: word.word,
      meaning: word.meaning,
      purpose: userProfile.value.purpose || 'daily'
    });
    const wordIndex = words.value.findIndex(w => w.id === word.id);
    if (wordIndex !== -1) {
      words.value[wordIndex].aiExample = {
        sentence: result.sentence,
        translation: result.translation,
        generatedAt: new Date().toISOString(),
        basedOnPurpose: userProfile.value.purpose || 'daily'
      };
    }
    triggerConfetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  } catch (err) {
    error.value = err.message || '生成失败，请重试';
    setTimeout(() => { error.value = null; }, 3000);
  } finally {
    generatingWordId.value = null;
  }
};

const fetchEnglishDefinition = async (word) => {
  loadingEnglishDefinition.value = word.id;
  error.value = null;
  try {
    const definition = await getEnglishDefinition({
      apiKey: userSettings.value.apiKey,
      word: word.word,
      meaning: word.meaning
    });
    const wordIndex = words.value.findIndex(w => w.id === word.id);
    if (wordIndex !== -1) {
      words.value[wordIndex].englishDefinition = definition;
    }
  } catch (err) {
    error.value = err.message || '获取英文释义失败，请重试';
    setTimeout(() => { error.value = null; }, 3000);
  } finally {
    loadingEnglishDefinition.value = null;
  }
};

const handleNavigate = (page) => {
  // 离开 Today 页面时清理 pending 推荐
  if (currentPage.value === 'today' && page !== 'today') {
    clearPendingRecommendation();
  }
  currentPage.value = page;
};

const followTodayIeltsRecommendation = () => {
  if (!todayIeltsRecommendation.value) return;
  setPendingIeltsPathTarget({
    mode: todayIeltsRecommendation.value.mode,
    targetTopic: todayIeltsRecommendation.value.targetTopic
  });
  currentPage.value = 'context';
};

const handleCardRecommendationAction = (recommendation) => {
  if (!recommendation) return;
  setPendingIeltsPathTarget({
    mode: recommendation.mode,
    targetTopic: recommendation.targetTopic
  });
  cardRecommendation.value = null;
  currentPage.value = 'context';
};

const handleCardRecommendationDismiss = () => {
  cardRecommendation.value = null;
};

const handleOnboardingComplete = (profile) => {
  userProfile.value = profile;
  saveUserProfile(profile);
  showOnboarding.value = false;
};

const handleVocabTestComplete = (result) => {
  userProfile.value.vocabTestResult = result.testResult;
  saveUserProfile(userProfile.value);
  if (result.selectedVocab) {
    handleVocabularySelect(result.selectedVocab);
  }
  showVocabTest.value = false;
  error.value = '测试完成！词库已更新';
  setTimeout(() => { error.value = null; }, 3000);
};

const handleMobileNavigate = (page) => {
  // 离开 Today 页面时清理 pending 推荐
  if (currentPage.value === 'today' && page !== 'today' && page !== 'settings' && page !== 'vocab') {
    clearPendingRecommendation();
  }
  if (page === 'settings') openSettings();
  else if (page === 'vocab') showVocabSelector.value = true;
  else currentPage.value = page;
};

const handleKeydown = (event) => {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
  if (showSettings.value) {
    if (event.key === 'Escape') closeSettings();
    return;
  }
  if (currentPage.value !== 'today') return;
  if (!currentWord.value) return;

  switch (event.key) {
    case ' ': case 'Space':
      event.preventDefault(); handleKnow(); break;
    case 'Enter':
      event.preventDefault(); handleForget(); break;
    case 'ArrowLeft':
      event.preventDefault(); previousWord(); break;
    case 'ArrowRight':
      event.preventDefault(); nextWord(); break;
    case 's': case 'S':
      event.preventDefault(); openSettings(); break;
    case 'a': case 'A':
      event.preventDefault();
      generateExample(currentWord.value);
      break;
    case 'e': case 'E':
      event.preventDefault();
      fetchEnglishDefinition(currentWord.value);
      break;
  }
};

onMounted(() => {
  loadData();
  const savedSettings = loadSettings();
  if (savedSettings) userSettings.value = savedSettings;
  const savedProfile = loadUserProfile();
  if (savedProfile) userProfile.value = savedProfile;
  if (shouldShowOnboarding()) showOnboarding.value = true;
  wordbook.value = loadWordbook();
  totalStudyTime.value = loadStudyTime();
  window.addEventListener('keydown', handleKeydown);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', saveStudyTime);
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  updateGistSyncStats();
});

const handleVisibilityChange = () => {
    isPageVisible.value = !document.hidden;
    if (!document.hidden) sessionStartTime.value = Date.now();
    else {
        totalStudyTime.value += getSessionTime();
        sessionStartTime.value = Date.now();
    }
};

const handleOnline = () => {
  isOnline.value = true;
  error.value = '网络已恢复';
  setTimeout(() => { error.value = null; }, 3000);
};

const handleOffline = () => {
  isOnline.value = false;
  error.value = '网络连接已断开，正在使用离线模式';
  setTimeout(() => { error.value = null; }, 3000);
};


onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
  saveStudyTime();

  // 清理 pending 推荐
  clearPendingRecommendation();
});

// 监听登录状态，自动执行全量同步
watch(user, async (newUser, oldUser) => {
  if (newUser && !oldUser) {
    console.log('🔄 检测到用户登录，开始同步云端数据...');
    try {
      const syncResult = await syncService.fullSync();
      if (!syncResult) return;

      const { cloudSettings, cloudProgress, cloudWordbook, cloudSRS, cloudHistory, cloudAchievements } = syncResult;

      // 1. 同步设置
      if (cloudSettings) {
        const mergedSettings = {
          ...userSettings.value,
          dailyGoal: cloudSettings.daily_goal ?? userSettings.value.dailyGoal,
          studyMode: cloudSettings.study_mode ?? userSettings.value.studyMode,
          purpose: cloudSettings.purpose ?? userSettings.value.purpose
        };

        userSettings.value = mergedSettings;
        saveSettingsToStorage(mergedSettings);

        if (cloudSettings.purpose) {
          userProfile.value = {
            ...userProfile.value,
            purpose: cloudSettings.purpose
          };
          saveUserProfile(userProfile.value);
        }
      }

      // 2. 同步词库进度
      if (cloudProgress && cloudProgress.length > 0) {
         // 只加载当前词库的进度
         const currentCloudProgress = cloudProgress.find(p => p.vocab_id === currentVocab.value?.id);
         if (currentCloudProgress) {
           learned.value = new Set(currentCloudProgress.learned_words);
           forgotten.value = new Set(currentCloudProgress.forgotten_words);
           currentIndex.value = currentCloudProgress.current_index;
           saveCurrentProgress();
         }
      }

      // 3. 同步生词本
      if (cloudWordbook && cloudWordbook.length > 0) {
        cloudWordbook.forEach(item => wordbook.value.add(item.word_id));
        saveWordbook(wordbook.value);
      }

      // 4. 同步SRS复习状态
      if (cloudSRS && cloudSRS.length > 0) {
        cloudSRS.forEach(item => {
          if (!reviewStates.value[item.word_id]) {
            reviewStates.value[item.word_id] = {
              intervalLevel: item.interval_level,
              easeFactor: item.ease_factor,
              nextReview: item.next_review ? new Date(item.next_review).getTime() : null,
              lastReview: item.last_review ? new Date(item.last_review).getTime() : null,
              reviewCount: item.review_count,
              correctCount: item.correct_count,
              incorrectCount: item.incorrect_count
            };
          }
        });
        saveReviewStates();
      }

      // 5. 同步学习历史
      if (cloudHistory && cloudHistory.length > 0) {
        const localHistory = getStudyHistory();
        cloudHistory.forEach(item => {
          localHistory[item.date] = Math.max(localHistory[item.date] || 0, item.words_learned);
        });
        saveStudyHistory(localHistory);
      }

      // 6. 同步成就
      if (cloudAchievements && cloudAchievements.length > 0) {
        const localAchievements = getUnlockedAchievements();
        cloudAchievements.forEach(item => {
          localAchievements.add(item.achievement_id);
        });
        saveUnlockedAchievements(localAchievements);
      }

      console.log('✅ 云端数据同步完成');
      error.value = '已恢复云端数据';
      setTimeout(() => { error.value = null; }, 3000);
    } catch (err) {
      console.error('❌ 全量同步失败:', err);
    }
  }
}, { immediate: true });
</script>

<style>
/* Global Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
