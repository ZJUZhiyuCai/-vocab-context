<template>
  <div
    class="onboarding-modal"
    :class="isDark ? 'dark' : 'light'"
  >
    <div class="modal-content">
      <!-- 进度指示 -->
      <div class="progress-bar">
        <div
          v-for="i in totalSteps"
          :key="i"
          class="progress-dot"
          :class="{ 'active': i <= currentStep, 'completed': i < currentStep }"
        />
      </div>

      <!-- 问题区域 -->
      <div class="question-area">
        <transition
          name="fade"
          mode="out-in"
        >
          <div :key="currentStep">
            <!-- Step 1: 欢迎 -->
            <div
              v-if="currentStep === 0"
              class="step-content"
            >
              <div class="flex justify-center mb-6 text-emerald-400">
                <svg
                  class="w-20 h-20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                    stroke="currentColor"
                  />
                </svg>
              </div>
              <h2 class="step-title">
                欢迎使用 VocabMan
              </h2>
              <p class="step-desc">
                为了给你提供更个性化的学习体验，请回答几个简单问题
              </p>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs mt-4">
                <svg
                  class="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                /></svg>
                只需30秒
              </div>
            </div>

            <!-- Step 2: 词汇水平测试 -->
            <div
              v-if="currentStep === 1"
              class="step-content"
            >
              <div class="flex justify-center mb-6 text-cyan-400">
                <svg
                  class="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v12"
                  />
                </svg>
              </div>
              <h2 class="step-title">
                词汇量水平测试
              </h2>
              <p class="step-desc">
                了解你的词汇量，为你推荐合适的词库
              </p>

              <div class="test-info-box">
                <div class="test-info-item">
                  <div class="test-info-icon">
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    ><path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M5 13l4 4L19 7"
                    /></svg>
                  </div>
                  <div class="test-info-text">
                    共 50 道题，约 5-8 分钟
                  </div>
                </div>
                <div class="test-info-item">
                  <div class="test-info-icon">
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    ><path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M5 13l4 4L19 7"
                    /></svg>
                  </div>
                  <div class="test-info-text">
                    自适应测试，题目难度动态调整
                  </div>
                </div>
                <div class="test-info-item">
                  <div class="test-info-icon">
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    ><path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M5 13l4 4L19 7"
                    /></svg>
                  </div>
                  <div class="test-info-text">
                    完成后推荐合适的学习词库
                  </div>
                </div>
              </div>

              <button
                class="premium-btn w-full py-4 text-lg mb-4"
                @click="startVocabTest"
              >
                🚀 开始测试
              </button>

              <button
                class="text-slate-500 text-sm font-medium hover:text-emerald-400 transition-colors"
                @click="skipTest"
              >
                跳过测试，稍后再测
              </button>
            </div>

            <!-- Step 3: 学习目的 -->
            <div
              v-if="currentStep === 2"
              class="step-content"
            >
              <h2 class="step-title">
                你学习英语的目的是什么？
              </h2>
              <p class="step-desc">
                选择与你目标最匹配的选项
              </p>

              <div class="options-grid">
                <button
                  v-for="option in displayPurposeOptions"
                  :key="option.value"
                  class="option-card"
                  :class="{ 'selected': userProfile.purpose === option.value }"
                  @click="selectPurpose(option.value)"
                >
                  <div class="option-icon">
                    {{ option.icon }}
                  </div>
                  <div class="option-title">
                    {{ option.title }}
                  </div>
                  <div class="option-desc">
                    {{ option.desc }}
                  </div>
                </button>
              </div>
            </div>

            <!-- Step 4: 确认 -->
            <div
              v-if="currentStep === 3"
              class="step-content"
            >
              <div class="flex justify-center mb-6 text-emerald-400">
                <svg
                  class="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 class="step-title">
                设置完成
              </h2>
              <p class="step-desc">
                我们已根据你的情况优化学习体验
              </p>

              <div class="summary-box">
                <div class="summary-item">
                  <span class="summary-label text-slate-500">词汇量</span>
                  <span class="summary-value text-slate-200">{{ vocabTestResult ? vocabTestResult.estimatedVocab : '未测试' }}</span>
                </div>
                <div
                  v-if="vocabTestResult"
                  class="summary-item"
                >
                  <span class="summary-label text-slate-500">等级</span>
                  <span class="summary-value text-slate-200">{{ vocabTestResult.cefrLevel }} ({{ vocabTestResult.ieltsLevel }})</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label text-slate-500">学习目的</span>
                  <span class="summary-value text-slate-200">{{ getPurposeLabel(userProfile.purpose) }}</span>
                </div>
              </div>

              <p class="text-xs text-slate-500 mt-4">
                你随时可以在设置页面修改这些偏好
              </p>
            </div>
          </div>
        </transition>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button
          v-if="currentStep === 2"
          class="btn-secondary"
          @click="previousStep"
        >
          上一步
        </button>
        <button
          v-if="currentStep === 0"
          class="premium-btn px-8"
          @click="nextStep"
        >
          开始
        </button>
        <button
          v-if="currentStep === 2"
          class="premium-btn px-8"
          :disabled="!userProfile.purpose"
          @click="nextStep"
        >
          下一步
        </button>
        <button
          v-if="currentStep === 3"
          class="premium-btn px-8"
          @click="completeOnboarding"
        >
          🚀 开始学习
        </button>
      </div>
    </div>

    <!-- 词汇测试弹窗 -->
    <VocabLevelTest
      v-if="showVocabTest"
      @complete="handleVocabTestComplete"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VocabLevelTest from './VocabLevelTest.vue'
import { useTheme } from '../composables/useTheme.js'
import { markTaskCompleted } from '../utils/firstWeekScaffold.js'

const { isDark } = useTheme()
const emit = defineEmits(['complete'])

const currentStep = ref(0)
const totalSteps = 4  // 增加到4步，添加词汇测试

const userProfile = ref({
  purpose: ''
})

// 词汇测试结果
const vocabTestResult = ref(null)
const showVocabTest = ref(false)

const purposeOptions = [
  {
    value: 'exam',
    icon: '📚',
    title: '备考',
    desc: '雅思、托福、GRE、四六级、考研'
  },
  {
    value: 'work',
    icon: '💼',
    title: '职场提升',
    desc: '商务英语、技术英语、专业英语'
  },
  {
    value: 'academic',
    icon: '🎨',
    title: '兴趣爱好',
    desc: '阅读、影视、旅行、文化交流'
  },
  {
    value: 'daily',
    icon: '💬',
    title: '日常交流',
    desc: '日常生活、社交对话、购物饮食'
  }
]

const displayPurposeOptions = purposeOptions.map(option => {
  if (option.value === 'academic') {
    return {
      ...option,
      icon: '🎓',
      title: '学术研究',
      desc: '论文阅读、课题研究、学术写作、课堂汇报'
    }
  }

  return option
})

const selectPurpose = (value) => {
  userProfile.value.purpose = value
}

const getPurposeLabel = (value) => {
  const option = displayPurposeOptions.find(o => o.value === value)
  return option ? option.title : ''
}

const nextStep = () => {
  if (currentStep.value < totalSteps - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 词汇测试相关函数
const startVocabTest = () => {
  showVocabTest.value = true
}

const skipTest = () => {
  // 跳过测试，直接进入下一步
  vocabTestResult.value = null
  nextStep()
}

const handleVocabTestComplete = (result) => {
  vocabTestResult.value = result.testResult
  showVocabTest.value = false

  // 测试完成后进入下一步
  nextStep()
}

const completeOnboarding = () => {
  // 标记首周 onboarding 任务完成
  markTaskCompleted('onboarding')

  emit('complete', {
    ...userProfile.value,
    vocabTestResult: vocabTestResult.value
  })
}
</script>

<style scoped>
.onboarding-modal {
  @apply fixed inset-0 flex items-center justify-center z-50 p-4;
  backdrop-filter: blur(12px);
}

.dark.onboarding-modal {
  @apply bg-slate-950/90;
}

.light.onboarding-modal {
  @apply bg-black/50;
}

.modal-content {
  @apply rounded-[2.5rem] shadow-2xl max-w-lg w-full p-10;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.dark .modal-content {
  @apply bg-slate-900;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.light .modal-content {
  @apply bg-white;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* 进度条 */
.progress-bar {
  @apply flex justify-center gap-2 mb-8;
}

.progress-dot {
  @apply w-1.5 h-1.5 rounded-full bg-white/10 transition-all duration-500;
}

.progress-dot.active {
  @apply bg-emerald-400 w-8;
  box-shadow: 0 0 12px rgba(52, 211, 153, 0.4);
}

.progress-dot.completed {
  @apply bg-emerald-500/40;
}

/* 问题区域 */
.question-area {
  @apply flex items-center justify-center py-4 overflow-y-auto;
  flex: 1;
  min-height: 200px;
  max-height: calc(90vh - 200px);
}

.step-content {
  @apply text-center w-full;
}

.welcome-icon,
.summary-icon,
.test-intro-icon {
  @apply text-5xl mb-4;
}

.step-title {
  @apply text-3xl font-bold mb-4 tracking-tight;
}

.dark .step-title {
  @apply text-white;
}

.light .step-title {
  @apply text-gray-800;
}

.step-desc {
  @apply mb-8 text-lg leading-relaxed;
}

.dark .step-desc {
  @apply text-slate-400;
}

.light .step-desc {
  @apply text-gray-600;
}

/* 测试信息框 */
.test-info-box {
  @apply rounded-2xl p-6 mt-2 mb-8;
}

.dark .test-info-box {
  @apply bg-white/5 border border-white/5;
}

.light .test-info-box {
  @apply bg-gray-50 border border-gray-200;
}

.test-info-item {
  @apply flex items-center gap-4 mb-4 last:mb-0;
}

.test-info-icon {
  @apply w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0;
}

.test-info-text {
  @apply text-left font-medium;
}

.dark .test-info-text {
  @apply text-slate-300;
}

.light .test-info-text {
  @apply text-gray-600;
}

/* 选项卡片 */
.options-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6;
}

.option-card {
  @apply p-6 rounded-2xl border-2 cursor-pointer;
  @apply transition-all duration-300;
  @apply text-center;
  @apply relative overflow-hidden;
}

.dark .option-card {
  @apply border-white/5 bg-slate-800/50;
}

.light .option-card {
  @apply border-gray-200 bg-gray-50;
}

.dark .option-card:hover {
  @apply border-emerald-500/30 bg-slate-800 -translate-y-1;
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.5);
}

.light .option-card:hover {
  @apply border-emerald-400 bg-white -translate-y-1;
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.1);
}

.option-card.selected {
  @apply border-emerald-500/50 bg-emerald-500/5;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
}

.option-icon {
  @apply text-4xl mb-2;
}

.option-title {
  @apply font-bold mb-1.5 text-lg;
}

.dark .option-title {
  @apply text-slate-200;
}

.light .option-title {
  @apply text-gray-800;
}

.option-desc {
  @apply text-sm leading-snug;
}

.dark .option-desc {
  @apply text-slate-500;
}

.light .option-desc {
  @apply text-gray-500;
}

/* 总结区域 */
.summary-box {
  @apply rounded-2xl p-6 mt-8 mb-4 text-left;
}

.dark .summary-box {
  @apply bg-white/5 border border-white/5;
}

.light .summary-box {
  @apply bg-gray-50 border border-gray-200;
}

.summary-item {
  @apply flex justify-between items-center py-3 last:pb-0;
}

.dark .summary-item {
  @apply border-b border-white/5 last:border-0;
}

.light .summary-item {
  @apply border-b border-gray-200 last:border-0;
}

.summary-label {
  @apply text-slate-400 font-medium;
}

.summary-value {
  @apply font-bold text-emerald-400;
}

.btn-secondary {
  @apply px-8 py-3 rounded-xl font-bold border;
  @apply transition-all duration-300;
}

.dark .btn-secondary {
  @apply border-white/10 bg-white/5 text-slate-400;
}

.light .btn-secondary {
  @apply border-gray-300 bg-gray-100 text-gray-600;
}

.dark .btn-secondary:hover {
  @apply border-white/20 text-slate-200 bg-white/10;
}

.light .btn-secondary:hover {
  @apply border-gray-400 text-gray-800 bg-gray-200;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  @apply transition-all duration-300 ease-out;
}

.fade-enter-from {
  @apply opacity-0 translate-y-4;
}

.fade-leave-to {
  @apply opacity-0 -translate-y-4;
}

/* 移动端优化 */
@media (max-width: 640px) {
  .modal-content {
    @apply p-5;
    max-height: 85vh;
  }

  .question-area {
    @apply py-2;
    min-height: auto;
  }

  .step-title {
    @apply text-xl mb-2;
  }

  .step-desc {
    @apply text-sm mb-2;
  }

  .options-grid {
    @apply grid-cols-1 gap-2;
  }

  .option-card {
    @apply p-4;
  }

  .option-icon {
    @apply text-3xl mb-1;
  }

  .option-title {
    @apply text-base mb-1;
  }

  .option-desc {
    @apply text-xs;
  }

  .action-buttons {
    @apply mt-4 pt-4 gap-2;
  }

  .btn-primary,
  .btn-secondary {
    @apply px-5 py-2.5 text-sm;
  }

  .welcome-icon,
  .summary-icon,
  .test-intro-icon {
    @apply text-4xl mb-3;
  }
}
</style>
