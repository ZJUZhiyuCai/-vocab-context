<template>
  <div class="context-practice-page animate-slide-right">
    <!-- Output Studio Mode -->
    <OutputStudio
      v-if="currentMode === 'outputStudio'"
      :bundles="eligibleBundles"
      :current-vocab="currentVocab"
      @back="exitOutputStudio"
      @complete="handleOutputStudioComplete"
    />

    <!-- Exam Drills Mode -->
    <ExamDrills
      v-else-if="currentMode === 'examDrills'"
      :bundles="eligibleBundles"
      :current-vocab="currentVocab"
      @back="exitExamDrills"
      @complete="handleExamDrillsComplete"
    />

    <!-- Context Session Mode -->
    <div
      v-else-if="currentMode === 'session'"
      :class="['session-shell', isDark ? 'dark' : 'light']"
    >
      <div :class="['session-shell-header', isDark ? 'dark' : 'light']">
        <div>
          <p :class="['text-xs uppercase tracking-[0.24em]', isDark ? 'text-emerald-400/80' : 'text-emerald-600']">
            Context-first
          </p>
          <h1 :class="['text-2xl font-bold mt-2', isDark ? 'text-white' : 'text-slate-900']">
            语境优先学习
          </h1>
          <p :class="['text-sm mt-2', isDark ? 'text-gray-400' : 'text-gray-600']">
            当前词库：{{ currentVocabName }} · 本次 {{ sessionSize }} 词
          </p>
        </div>
        <button
          @click="exitSession"
          :class="[
            'session-shell-action',
            isDark
              ? 'bg-white/5 border-white/10 text-gray-300 hover:border-emerald-500/30 hover:text-emerald-400'
              : 'bg-gray-100 border-gray-200 text-gray-700 hover:border-emerald-500/30 hover:text-emerald-600'
          ]"
        >
          返回概览
        </button>
      </div>

      <div class="session-shell-body">
        <ContextSession
          :bundles="sessionPool"
          :session-size="sessionSize"
          :current-vocab="currentVocab"
          @complete="handleSessionComplete"
          @exit="exitSession"
        />
      </div>
    </div>

    <div v-else class="space-y-6">
      <section :class="['hero-card', isDark ? 'dark' : 'light']">
        <div class="hero-copy">
          <div class="hero-badges">
            <span :class="['hero-badge', isDark ? 'dark' : 'light']">
              Context-first
            </span>
            <span
              v-if="currentVocabName"
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium border',
                isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'
              ]"
            >
              {{ currentVocabName }}
            </span>
          </div>

          <div class="max-w-3xl">
            <h1 :class="['hero-title', isDark ? 'text-white' : 'text-slate-900']">
              先读语境，再把词真正用出来。
            </h1>
            <p :class="['hero-description', isDark ? 'text-gray-400' : 'text-gray-600']">
              每轮只做四步：读语境、判词义、做改写、写一句。
            </p>
          </div>

          <div v-if="lastSummary" :class="['last-summary', isDark ? 'dark' : 'light']">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/15 text-emerald-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p :class="['text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900']">
                上次完成 {{ lastSummary.totalBundles }} 词 · 正确率 {{ lastSummary.accuracy }}%
              </p>
            </div>
          </div>
        </div>

        <div class="hero-actions">
          <button
            @click="startSession"
            class="btn-primary w-full sm:w-auto"
            :disabled="!hasEligibleBundles"
          >
            开始 5 词
          </button>
          <button
            @click="$emit('navigate', 'today')"
            :class="[
              'btn-secondary w-full sm:w-auto',
              isDark ? 'dark' : 'light'
            ]"
          >
            回到今日学习
          </button>
        </div>
      </section>

      <section v-if="isIeltsTrack" :class="['content-card', isDark ? 'dark' : 'light']">
        <div class="section-heading path-heading">
          <div>
            <h2 class="section-title">IELTS 学习路径</h2>
            <p class="section-description">先基础，再主题，再广度。</p>
          </div>
        </div>

        <div :class="['path-coach', isDark ? 'dark' : 'light']">
          <div class="path-coach-head">
            <div>
              <p :class="['text-xs font-semibold uppercase tracking-[0.18em]', isDark ? 'text-emerald-400/80' : 'text-emerald-700']">
                Path Coach
              </p>
              <h3 :class="['text-lg font-bold mt-2', isDark ? 'text-white' : 'text-slate-900']">
                {{ pathCoach.headline }}
              </h3>
              <p :class="['text-sm mt-2 leading-7', isDark ? 'text-gray-400' : 'text-gray-600']">
                {{ pathCoach.nextStep }}
              </p>
            </div>
            <div :class="['path-coach-badge', isDark ? 'dark' : 'light']">
              {{ pathCoach.stageLabel }}
            </div>
          </div>

          <div class="path-gate-grid">
            <div v-for="gate in pathCoach.gates" :key="gate.key" :class="['path-gate-card', gate.status, isDark ? 'dark' : 'light']">
              <div class="path-gate-top">
                <p :class="['text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900']">{{ gate.title }}</p>
                <span class="path-gate-state">{{ gate.statusLabel }}</span>
              </div>
              <p :class="['text-xs mt-2 leading-6', isDark ? 'text-gray-400' : 'text-gray-600']">{{ gate.detail }}</p>
              <p :class="['text-xs mt-2', isDark ? 'text-gray-500' : 'text-gray-500']">目标：{{ gate.target }}</p>
            </div>
          </div>
        </div>

        <div class="track-stack">
          <div class="track-group">
            <div class="track-group-header">
              <div>
                <h3 :class="['text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900']">Foundation</h3>
                <p :class="['text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-600']">高迁移基础词。</p>
              </div>
            </div>
            <div class="track-grid foundation-grid">
              <article
                v-for="vocab in foundationTracks"
                :key="vocab.id"
                :class="['track-card', isCurrentTrack(vocab) ? 'current' : '', isDark ? 'dark' : 'light']"
              >
                <div class="track-card-top">
                  <span :class="['track-pill', isDark ? 'dark' : 'light']">Foundation</span>
                  <span v-if="isCurrentTrack(vocab)" class="track-current">当前词库</span>
                </div>
                <h4 :class="['track-title', isDark ? 'text-white' : 'text-slate-900']">{{ vocab.name }}</h4>
                <p :class="['track-description', isDark ? 'text-gray-400' : 'text-gray-600']">{{ compactTrackDescription(vocab) }}</p>
                <div class="track-meta">
                  <span>{{ vocab.size }} 词</span>
                  <span>{{ vocab.difficulty?.label }}</span>
                </div>
                <button
                  @click="handleTrackAction(vocab)"
                  :class="[
                    'track-action',
                    isCurrentTrack(vocab) ? 'primary' : 'secondary',
                    isDark ? 'dark' : 'light'
                  ]"
                >
                  {{ trackActionLabel(vocab) }}
                </button>
              </article>
            </div>
          </div>

          <div class="track-group">
            <div class="track-group-header">
              <div>
                <h3 :class="['text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900']">Topic Packs</h3>
                <p :class="['text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-600']">按题材补覆盖。</p>
              </div>
            </div>
            <div class="topic-sections">
              <div class="topic-subgroup">
                <div class="topic-subgroup-header">
                  <span :class="['topic-subgroup-pill', isDark ? 'dark' : 'light']">Core Topics</span>
                  <span :class="['topic-subgroup-copy', isDark ? 'text-gray-400' : 'text-gray-600']">优先补教育、政府、环境、科技。</span>
                </div>
                <div class="track-grid">
                  <article
                    v-for="vocab in coreTopicTracks"
                    :key="vocab.id"
                    :class="['track-card', isCurrentTrack(vocab) ? 'current' : '', isDark ? 'dark' : 'light']"
                  >
                    <div class="track-card-top">
                      <span :class="['track-pill', isDark ? 'dark' : 'light']">{{ topicLabel(vocab.topic) }}</span>
                      <span v-if="isCurrentTrack(vocab)" class="track-current">当前词库</span>
                    </div>
                    <h4 :class="['track-title', isDark ? 'text-white' : 'text-slate-900']">{{ vocab.name }}</h4>
                    <p :class="['track-description', isDark ? 'text-gray-400' : 'text-gray-600']">{{ compactTrackDescription(vocab) }}</p>
                    <div class="track-meta">
                      <span>{{ vocab.size }} 词</span>
                      <span>{{ vocab.difficulty?.label }}</span>
                    </div>
                    <button
                      @click="handleTrackAction(vocab)"
                      :class="[
                        'track-action',
                        isCurrentTrack(vocab) ? 'primary' : 'secondary',
                        isDark ? 'dark' : 'light'
                      ]"
                    >
                      {{ trackActionLabel(vocab) }}
                    </button>
                  </article>
                </div>
              </div>

              <div v-if="extendedTopicTracks.length" class="topic-subgroup">
                <div class="topic-subgroup-header">
                  <span :class="['topic-subgroup-pill', isDark ? 'dark' : 'light']">Extended Topics</span>
                  <span :class="['topic-subgroup-copy', isDark ? 'text-gray-400' : 'text-gray-600']">健康、工作、媒体、犯罪等补充视角。</span>
                </div>
                <div class="track-grid compact">
                  <article
                    v-for="vocab in extendedTopicTracks"
                    :key="vocab.id"
                    :class="['track-card', isCurrentTrack(vocab) ? 'current' : '', isDark ? 'dark' : 'light']"
                  >
                    <div class="track-card-top">
                      <span :class="['track-pill', isDark ? 'dark' : 'light']">{{ topicLabel(vocab.topic) }}</span>
                      <span v-if="isCurrentTrack(vocab)" class="track-current">当前词库</span>
                    </div>
                    <h4 :class="['track-title', isDark ? 'text-white' : 'text-slate-900']">{{ vocab.name }}</h4>
                    <p :class="['track-description', isDark ? 'text-gray-400' : 'text-gray-600']">{{ compactTrackDescription(vocab) }}</p>
                    <div class="track-meta">
                      <span>{{ vocab.size }} 词</span>
                      <span>{{ vocab.difficulty?.label }}</span>
                    </div>
                    <button
                      @click="handleTrackAction(vocab)"
                      :class="[
                        'track-action',
                        isCurrentTrack(vocab) ? 'primary' : 'secondary',
                        isDark ? 'dark' : 'light'
                      ]"
                    >
                      {{ trackActionLabel(vocab) }}
                    </button>
                  </article>
                </div>
              </div>
            </div>
          </div>

          <div class="track-group">
            <div class="track-group-header">
              <div>
                <h3 :class="['text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900']">Legacy Breadth</h3>
                <p :class="['text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-600']">旧版词库补广度。</p>
              </div>
            </div>
            <div class="track-grid compact">
              <article
                v-for="vocab in legacyTracks"
                :key="vocab.id"
                :class="['track-card', isCurrentTrack(vocab) ? 'current' : '', isDark ? 'dark' : 'light']"
              >
                <div class="track-card-top">
                  <span :class="['track-pill', isDark ? 'dark' : 'light']">Legacy</span>
                  <span v-if="isCurrentTrack(vocab)" class="track-current">当前词库</span>
                </div>
                <h4 :class="['track-title', isDark ? 'text-white' : 'text-slate-900']">{{ vocab.name }}</h4>
                <p :class="['track-description', isDark ? 'text-gray-400' : 'text-gray-600']">{{ compactTrackDescription(vocab) }}</p>
                <div class="track-meta">
                  <span>{{ vocab.size }} 词</span>
                  <span>{{ vocab.difficulty?.label }}</span>
                </div>
                <button
                  @click="handleTrackAction(vocab)"
                  :class="[
                    'track-action',
                    isCurrentTrack(vocab) ? 'primary' : 'secondary',
                    isDark ? 'dark' : 'light'
                  ]"
                >
                  {{ trackActionLabel(vocab) }}
                </button>
              </article>
            </div>
          </div>

          <!-- Output Studio Entry -->
          <div class="track-group output-studio-entry">
            <div class="track-group-header">
              <div>
                <h3 :class="['text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900']">Output Studio</h3>
                <p :class="['text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-600']">专注产出练习：写作、口语、改写。</p>
              </div>
            </div>
            <div class="output-studio-card-wrapper">
              <article :class="['track-card output-studio-card', isDark ? 'dark' : 'light']">
                <div class="track-card-top">
                  <span :class="['track-pill track-pill-violet', isDark ? 'dark' : 'light']">Production</span>
                </div>
                <h4 :class="['track-title', isDark ? 'text-white' : 'text-slate-900']">产出工作室</h4>
                <p :class="['track-description', isDark ? 'text-gray-400' : 'text-gray-600']">
                  把词真正用出来：写句子、练口语框架、做改写练习。
                </p>
                <div class="track-meta">
                  <span>5 词/轮</span>
                  <span>Foundation + Topics</span>
                </div>
                <button
                  @click="enterOutputStudio"
                  :class="['track-action track-action-violet', isDark ? 'dark' : 'light']"
                >
                  进入工作室
                </button>
              </article>
            </div>
          </div>

          <!-- Exam Drills Entry -->
          <div class="track-group exam-drills-entry">
            <div class="track-group-header">
              <div>
                <h3 :class="['text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900']">Exam Drills</h3>
                <p :class="['text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-600']">考试模拟：混合题型、实战压力。</p>
              </div>
            </div>
            <div class="exam-drills-card-wrapper">
              <article :class="['track-card exam-drills-card', isDark ? 'dark' : 'light']">
                <div class="track-card-top">
                  <span :class="['track-pill track-pill-rose', isDark ? 'dark' : 'light']">Exam</span>
                </div>
                <h4 :class="['track-title', isDark ? 'text-white' : 'text-slate-900']">考试模拟练习</h4>
                <p :class="['track-description', isDark ? 'text-gray-400' : 'text-gray-600']">
                  阅读改写、听力转述、写作论证、口语框架。在考试压力下运用词汇。
                </p>
                <div class="track-meta">
                  <span>8 题/轮</span>
                  <span>混合题型</span>
                </div>
                <button
                  @click="enterExamDrills"
                  :class="['track-action track-action-rose', isDark ? 'dark' : 'light']"
                >
                  开始模拟
                </button>
              </article>
            </div>
          </div>
        </div>
      </section>

      <div class="stats-grid">
        <div :class="['stat-card', isDark ? 'dark' : 'light']">
          <div class="stat-value text-emerald-500">{{ eligibleBundles.length }}</div>
          <div class="stat-label">可练习</div>
        </div>
        <div :class="['stat-card', isDark ? 'dark' : 'light']">
          <div class="stat-value text-cyan-500">{{ dueBundles.length }}</div>
          <div class="stat-label">到期</div>
        </div>
        <div :class="['stat-card', isDark ? 'dark' : 'light']">
          <div class="stat-value text-violet-500">{{ history.accuracy }}%</div>
          <div class="stat-label">历史正确率</div>
        </div>
        <div :class="['stat-card', isDark ? 'dark' : 'light']">
          <div class="stat-value text-amber-500">{{ history.sessions }}</div>
          <div class="stat-label">累计轮次</div>
        </div>
      </div>

      <div v-if="hasEligibleBundles" class="grid xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)] gap-6">
        <section :class="['content-card', isDark ? 'dark' : 'light']">
          <div class="section-heading">
            <div>
              <h2 class="section-title">本次如何开练</h2>
              <p class="section-description">建议先做 5 词短轮。</p>
            </div>
          </div>

          <div class="session-size-grid">
            <button
              v-for="option in sessionSizeOptions"
              :key="option.value"
              @click="setSessionSize(option.value)"
              :class="[
                'size-card',
                sessionSize === option.value ? 'active' : '',
                isDark ? 'dark' : 'light'
              ]"
            >
              <div class="size-card-head">
                <span class="size-card-value">{{ option.value }}</span>
                <span class="size-card-unit">词</span>
              </div>
              <div class="size-card-label">{{ option.label }}</div>
            </button>
          </div>

          <div :class="['insight-panel', isDark ? 'dark' : 'light']">
            <div class="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p :class="['text-sm font-semibold', isDark ? 'text-white' : 'text-slate-900']">
                  推荐池 {{ sessionPool.length }} 词
                </p>
                <p :class="['text-xs mt-1', isDark ? 'text-gray-400' : 'text-gray-600']">
                  先到期词，再高质量主题词。
                </p>
              </div>
              <button @click="startSession" class="btn-primary">
                立即开始
              </button>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between gap-4 mb-3">
              <h3 :class="['text-sm font-semibold', isDark ? 'text-gray-300' : 'text-gray-700']">
                预览词
              </h3>
              <span :class="['text-xs', isDark ? 'text-gray-500' : 'text-gray-500']">
                展示前 {{ previewWords.length }} 个
              </span>
            </div>

            <div class="preview-grid">
              <div
                v-for="bundle in previewWords"
                :key="bundle.id"
                :class="['preview-pill', isDark ? 'dark' : 'light']"
              >
                <div class="min-w-0">
                  <p :class="['text-sm font-semibold truncate', isDark ? 'text-white' : 'text-slate-900']">
                    {{ bundle.word }}
                  </p>
                  <p :class="['text-xs truncate mt-1', isDark ? 'text-gray-400' : 'text-gray-600']">
                    {{ bundle.meaning }}
                  </p>
                </div>
                <span :class="['preview-topic', isDark ? 'dark' : 'light']">
                  {{ topicLabel(bundle.topic) }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section :class="['content-card', isDark ? 'dark' : 'light']">
          <div class="section-heading">
            <div>
              <h2 class="section-title">学习状态</h2>
              <p class="section-description">轻量看进展。</p>
            </div>
          </div>

          <div :class="['insight-panel', isDark ? 'dark' : 'light']">
            <p :class="['text-sm font-semibold mb-3', isDark ? 'text-white' : 'text-slate-900']">这一轮怎么学</p>
            <div class="principle-row">
              <span :class="['principle-pill', isDark ? 'dark' : 'light']">先语境</span>
              <span :class="['principle-pill', isDark ? 'dark' : 'light']">再改写</span>
              <span :class="['principle-pill', isDark ? 'dark' : 'light']">最后输出</span>
            </div>
          </div>

          <div :class="['insight-panel', isDark ? 'dark' : 'light']">
            <p :class="['text-sm font-semibold mb-3', isDark ? 'text-white' : 'text-slate-900']">
              主题覆盖
            </p>
            <div class="topic-chip-list">
              <span
                v-for="topic in topicSummary"
                :key="topic.key"
                :class="['topic-chip', isDark ? 'dark' : 'light']"
              >
                {{ topicLabel(topic.key) }} · {{ topic.count }}
              </span>
            </div>
          </div>

          <div :class="['insight-panel', isDark ? 'dark' : 'light']">
            <p :class="['text-sm font-semibold mb-2', isDark ? 'text-white' : 'text-slate-900']">
              历史累计
            </p>
            <div class="history-grid">
              <div>
                <p class="history-value">{{ history.totalBundles }}</p>
                <p class="history-label">完成词数</p>
              </div>
              <div>
                <p class="history-value">{{ history.totalCorrect }}</p>
                <p class="history-label">正确动作</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section v-else :class="['empty-card', isDark ? 'dark' : 'light']">
        <div class="empty-icon">
          <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.168.477-4.5 1.253" />
          </svg>
        </div>
        <h2 :class="['text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900']">
          当前词库里还没有足够的语境包
        </h2>
        <p :class="['max-w-2xl text-sm leading-7', isDark ? 'text-gray-400' : 'text-gray-600']">
          可以先去今日学习积累更多词，或者切换到已经完成 Context Bundle 改造的 IELTS Core 词库，再回来进行语境优先训练。
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <button @click="$emit('navigate', 'today')" class="btn-primary">
            去今日学习
          </button>
          <button
            @click="$emit('navigate', 'quiz')"
            :class="[
              'btn-secondary',
              isDark ? 'dark' : 'light'
            ]"
          >
            去测验页看看
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useTheme } from '../../composables/useTheme.js'
import ContextSession from './ContextSession.vue'
import OutputStudio from './OutputStudio.vue'
import ExamDrills from './ExamDrills.vue'
import { getContextSessionHistory } from '../../utils/contextSessionEngine.js'
import { getOutputStudioHistory } from '../../utils/outputStudioEngine.js'
import { getExamDrillHistory } from '../../utils/examDrillEngine.js'
import { consumePendingIeltsPathTarget, setPendingIeltsPathTarget } from '../../utils/ieltsPathEntry.js'

const SESSION_SIZE_STORAGE_KEY = 'vocabman-context-practice-size'
const PRIORITY_TOPICS = ['education', 'environment', 'technology']

const { isDark } = useTheme()

const props = defineProps({
  words: {
    type: Array,
    default: () => []
  },
  reviewStates: {
    type: Object,
    default: () => ({})
  },
  currentVocab: {
    type: Object,
    default: null
  },
  availableVocabularies: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['navigate', 'select-vocabulary'])

const currentMode = ref(null)
const sessionSize = ref(loadSessionSize())
const lastSummary = ref(null)
const history = ref(loadHistory())

const sessionSizeOptions = [
  { value: 5, label: '热身' },
  { value: 8, label: '标准' },
  { value: 12, label: '冲刺' }
]

const isIeltsTrack = computed(() => props.currentVocab?.category === 'IELTS')
const currentVocabName = computed(() => props.currentVocab?.name || '当前词库')
const foundationTracks = computed(() =>
  (props.availableVocabularies || []).filter(vocab => vocab.category === 'IELTS' && vocab.ieltsTrackType === 'foundation')
)
const topicTracks = computed(() =>
  (props.availableVocabularies || []).filter(vocab => vocab.category === 'IELTS' && vocab.ieltsTrackType === 'topic')
)
const coreTopicOrder = ['education', 'government', 'environment', 'technology']
const coreTopicTracks = computed(() =>
  topicTracks.value.filter(vocab => coreTopicOrder.includes(vocab.topic))
)
const extendedTopicTracks = computed(() =>
  topicTracks.value.filter(vocab => !coreTopicOrder.includes(vocab.topic))
)
const legacyTracks = computed(() =>
  (props.availableVocabularies || []).filter(vocab => vocab.category === 'IELTS' && vocab.ieltsTrackType === 'legacy')
)

const eligibleBundles = computed(() => {
  const now = Date.now()

  return props.words
    .map(normalizeBundle)
    .filter(bundle => isEligibleBundle(bundle))
    .sort((left, right) => compareBundles(left, right, props.reviewStates, now))
})

const dueBundles = computed(() => {
  const now = Date.now()

  return eligibleBundles.value.filter(bundle => {
    const state = props.reviewStates?.[bundle.id]
    return state?.nextReview && state.nextReview <= now
  })
})

const sessionPool = computed(() => {
  const targetSize = Math.max(sessionSize.value * 3, 15)
  const pool = new Map()

  for (const bundle of dueBundles.value) {
    pool.set(bundle.id, bundle)
  }

  for (const bundle of eligibleBundles.value) {
    if (pool.size >= targetSize) break
    pool.set(bundle.id, bundle)
  }

  return Array.from(pool.values())
})

const previewWords = computed(() => sessionPool.value.slice(0, Math.min(sessionPool.value.length, 10)))
const hasEligibleBundles = computed(() => eligibleBundles.value.length > 0)

const topicSummary = computed(() => {
  const counts = eligibleBundles.value.reduce((accumulator, bundle) => {
    const key = bundle.topic || 'general'
    accumulator[key] = (accumulator[key] || 0) + 1
    return accumulator
  }, {})

  return Object.entries(counts)
    .map(([key, count]) => ({ key, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 6)
})

const recommendedTopic = computed(() => {
  const firstTopic = topicSummary.value.find(item => item.key !== 'general')
  return firstTopic?.key || 'education'
})

const activeTopicKey = computed(() => props.currentVocab?.topic || recommendedTopic.value || 'general')
const activeTopicLabel = computed(() => topicLabel(activeTopicKey.value))

function safePercent(numerator, denominator) {
  if (!denominator) return 0
  return Math.round((numerator / denominator) * 100)
}

function readTopicProgress(historyBlock, topicKey, type, vocabId = '') {
  const vocabStats = vocabId ? historyBlock?.vocabStats?.[vocabId] : null
  if (vocabStats) {
    if (type === 'context') {
      return {
        sessions: vocabStats.sessions || 0,
        accuracy: safePercent(vocabStats.totalCorrect || 0, (vocabStats.totalBundles || 0) * 2),
        volume: vocabStats.totalBundles || 0
      }
    }

    if (type === 'output') {
      return {
        sessions: vocabStats.sessions || 0,
        accuracy: safePercent(vocabStats.qualityScoreTotal || 0, vocabStats.sessions || 0),
        volume: vocabStats.totalOutputs || 0
      }
    }

    if (type === 'exam') {
      return {
        sessions: vocabStats.sessions || 0,
        accuracy: safePercent(vocabStats.totalCorrect || 0, vocabStats.totalItems || 0),
        volume: vocabStats.totalItems || 0
      }
    }
  }

  const topicStats = historyBlock?.topicStats?.[topicKey]
  if (topicStats) {
    if (type === 'context') {
      return {
        sessions: topicStats.sessions || 0,
        accuracy: safePercent(topicStats.totalCorrect || 0, (topicStats.totalBundles || 0) * 2),
        volume: topicStats.totalBundles || 0
      }
    }

    if (type === 'output') {
      return {
        sessions: topicStats.sessions || 0,
        accuracy: safePercent(topicStats.qualityScoreTotal || 0, topicStats.sessions || 0),
        volume: topicStats.totalOutputs || 0
      }
    }

    if (type === 'exam') {
      return {
        sessions: topicStats.sessions || 0,
        accuracy: safePercent(topicStats.totalCorrect || 0, topicStats.totalItems || 0),
        volume: topicStats.totalItems || 0
      }
    }
  }

  if (type === 'context') {
    return {
      sessions: historyBlock?.sessions || 0,
      accuracy: historyBlock?.accuracy || 0,
      volume: historyBlock?.totalBundles || 0
    }
  }

  if (type === 'output') {
    return {
      sessions: historyBlock?.sessions || 0,
      accuracy: historyBlock?.accuracy || 0,
      volume: historyBlock?.totalOutputs || 0
    }
  }

  return {
    sessions: historyBlock?.sessions || 0,
    accuracy: historyBlock?.accuracy || 0,
    volume: historyBlock?.totalItems || 0
  }
}

const pathCoach = computed(() => {
  const currentVocabId = props.currentVocab?.id || ''
  const contextProgress = readTopicProgress(history.value.context, activeTopicKey.value, 'context', currentVocabId)
  const outputProgress = readTopicProgress(history.value.output, activeTopicKey.value, 'output', currentVocabId)
  const examProgress = readTopicProgress(history.value.exam, activeTopicKey.value, 'exam', currentVocabId)

  const contextReady = contextProgress.sessions >= 3 && contextProgress.accuracy >= 70
  const outputReady = outputProgress.sessions >= 2 && outputProgress.volume >= 4 && outputProgress.accuracy >= 60
  const examReady = examProgress.sessions >= 2 && examProgress.accuracy >= 65

  const gates = [
    {
      key: 'context',
      title: '语境理解',
      status: contextReady ? 'done' : 'active',
      statusLabel: contextReady ? '已达标' : '待提升',
      detail: `${activeTopicLabel.value} · 已完成 ${contextProgress.sessions} 轮，准确率 ${contextProgress.accuracy}%`,
      target: '至少 3 轮，准确率约 70%'
    },
    {
      key: 'output',
      title: '真实输出',
      status: outputReady ? 'done' : (contextReady ? 'active' : 'locked'),
      statusLabel: outputReady ? '已达标' : (contextReady ? '下一步' : '未就绪'),
      detail: `${activeTopicLabel.value} · 已完成 ${outputProgress.sessions} 轮，提交 ${outputProgress.volume} 条输出，平均质量 ${outputProgress.accuracy}%`,
      target: '至少 2 轮，4 条输出，平均质量约 60%'
    },
    {
      key: 'exam',
      title: '考试迁移',
      status: examReady ? 'done' : (outputReady ? 'active' : 'locked'),
      statusLabel: examReady ? '已达标' : (outputReady ? '下一步' : '未就绪'),
      detail: `${activeTopicLabel.value} · 已完成 ${examProgress.sessions} 轮，考试表现 ${examProgress.accuracy}%`,
      target: '至少 2 轮，正确率约 65%'
    }
  ]

  if (!contextReady) {
    return {
      stage: 'foundation',
      stageLabel: '先稳住 Foundation',
      headline: '先把语境理解练稳，再谈输出。',
      nextStep: `建议先在 ${props.currentVocab?.ieltsTrackType === 'topic' ? `${activeTopicLabel.value} Topic` : 'Foundation'} 里完成至少 3 轮 Context-first，先把“看懂 + 改写”做稳定。`,
      gates
    }
  }

  if (props.currentVocab?.ieltsTrackType !== 'topic' && !outputReady) {
    return {
      stage: 'topic',
      stageLabel: '切入 Topic Packs',
      headline: 'Foundation 已够用，下一步该进入主题深练。',
      nextStep: `建议切到 ${activeTopicLabel.value} 相关 Topic Pack，先把主题表达练具体，再进 Output Studio。`,
      gates
    }
  }

  if (!outputReady) {
    return {
      stage: 'output',
      stageLabel: '进入 Output',
      headline: '你已经能看懂词，现在要把词写出来。',
      nextStep: `建议优先在 ${activeTopicLabel.value} 主题里做 Output Studio，把短输出练到“可用”以上，再进入 Exam Drills。`,
      gates
    }
  }

  if (!examReady) {
    return {
      stage: 'exam',
      stageLabel: '进入 Exam',
      headline: '输出开始可用了，现在该转入考试压力场景。',
      nextStep: `建议进入 ${activeTopicLabel.value} 主题的 Exam Drills，验证这些词能不能在阅读、听力、写作、口语表面都用得起来。`,
      gates
    }
  }

  return {
    stage: 'loop',
    stageLabel: '交替循环',
    headline: '你已经进入“主题 + 输出 + 模拟”交替提升阶段。',
    nextStep: `建议保持循环：先做 ${activeTopicLabel.value} 主题补强，再做 Output Studio，最后用 Exam Drills 检查迁移效果。`,
    gates
  }
})

function startSession() {
  if (!hasEligibleBundles.value) return
  currentMode.value = 'session'
}

function isCurrentTrack(vocab) {
  return props.currentVocab?.id === vocab.id
}

function handleTrackAction(vocab) {
  if (isCurrentTrack(vocab)) {
    if (vocab.isBundle && hasEligibleBundles.value) {
      startSession()
      return
    }

    emit('navigate', 'today')
    return
  }

  emit('select-vocabulary', vocab)
}

function trackActionLabel(vocab) {
  if (isCurrentTrack(vocab)) {
    if (vocab.isBundle) {
      return hasEligibleBundles.value ? '开始练习' : '当前层级'
    }

    return '去今日学习'
  }

  return '切换到此层'
}

function compactTrackDescription(vocab) {
  if (vocab.ieltsTrackType === 'foundation') {
    return '先打核心基础，再进入主题练习。'
  }

  if (vocab.ieltsTrackType === 'topic') {
    return `聚焦 ${topicLabel(vocab.topic)} 题材。`
  }

  return '补广度，不替代高质量包。'
}

function exitSession() {
  currentMode.value = null
  history.value = loadHistory()
}

function enterOutputStudio() {
  currentMode.value = 'outputStudio'
}

function exitOutputStudio() {
  currentMode.value = null
  history.value = loadHistory()
}

function handleOutputStudioComplete(summary) {
  console.log('Output Studio 完成:', summary)
  history.value = loadHistory()
}

function enterExamDrills() {
  currentMode.value = 'examDrills'
}

function exitExamDrills() {
  currentMode.value = null
  history.value = loadHistory()
}

function handleExamDrillsComplete(summary) {
  console.log('Exam Drills 完成:', summary)
  history.value = loadHistory()
}

function handleSessionComplete(summary) {
  lastSummary.value = summary
  history.value = loadHistory()
}

function applyPendingPathTarget() {
  const pending = consumePendingIeltsPathTarget()
  if (!pending?.mode || !hasEligibleBundles.value) return

  if (pending.targetTopic && props.currentVocab?.topic !== pending.targetTopic) {
    const targetVocab = (props.availableVocabularies || []).find(vocab =>
      vocab.category === 'IELTS' &&
      vocab.ieltsTrackType === 'topic' &&
      vocab.topic === pending.targetTopic
    )

    if (targetVocab) {
      setPendingIeltsPathTarget(pending)
      emit('select-vocabulary', targetVocab)
      return
    }
  }

  if (pending.mode === 'outputStudio') {
    enterOutputStudio()
    return
  }

  if (pending.mode === 'examDrills') {
    enterExamDrills()
    return
  }

  startSession()
}

function setSessionSize(size) {
  sessionSize.value = size
  saveSessionSize(size)
}

function loadSessionSize() {
  try {
    const saved = Number.parseInt(localStorage.getItem(SESSION_SIZE_STORAGE_KEY) || '', 10)
    return [5, 8, 12].includes(saved) ? saved : 5
  } catch {
    return 5
  }
}

function saveSessionSize(size) {
  try {
    localStorage.setItem(SESSION_SIZE_STORAGE_KEY, String(size))
  } catch {
    // no-op: local storage is optional
  }
}

function loadHistory() {
  const rawHistory = getContextSessionHistory()
  const outputHistory = getOutputStudioHistory()
  const examHistory = getExamDrillHistory()
  const totalAttempts = (rawHistory.totalBundles || 0) * 2
  const outputTotalWords = outputHistory.totalWords || 0
  const examTotalItems = examHistory.totalItems || 0

  return {
    context: {
      ...rawHistory,
      accuracy: totalAttempts > 0 ? Math.round((rawHistory.totalCorrect / totalAttempts) * 100) : 0
    },
    sessions: rawHistory.sessions || 0,
    accuracy: totalAttempts > 0 ? Math.round((rawHistory.totalCorrect / totalAttempts) * 100) : 0,
    output: {
      ...outputHistory,
      accuracy: outputTotalWords > 0 ? Math.round((outputHistory.totalOutputs / outputTotalWords) * 100) : 0
    },
    exam: {
      ...examHistory,
      accuracy: examTotalItems > 0 ? Math.round((examHistory.totalCorrect / examTotalItems) * 100) : 0
    }
  }
}

onMounted(() => {
  applyPendingPathTarget()
})

function normalizeBundle(word) {
  const id = word.id || word.bundleId || word.word
  const contexts = Array.isArray(word.contexts)
    ? word.contexts
        .map((context, index) => ({
          ...context,
          id: context.id || `${id}-context-${index}`,
          text: context.text || context.sentence || '',
          translation: context.translation || '',
          kind: context.kind || context.purpose || 'reading',
          purpose: context.purpose || context.kind || 'reading'
        }))
        .filter(context => context.text)
    : []

  return {
    ...word,
    id,
    bundleId: word.bundleId || id,
    meaning: word.meaning || word.chineseMeaning || '',
    englishDefinition: word.englishDefinition || word.sense || '',
    paraphrases: Array.isArray(word.paraphrases) ? word.paraphrases.filter(Boolean) : [],
    collocations: Array.isArray(word.collocations) ? word.collocations.filter(Boolean) : [],
    contexts,
    topic: word.topic || 'general',
    draft: Boolean(word.draft)
  }
}

function isEligibleBundle(bundle) {
  return Boolean(
    bundle.word &&
      bundle.meaning &&
      bundle.contexts.length > 0 &&
      bundle.paraphrases.length > 0 &&
      !bundle.draft
  )
}

function compareBundles(left, right, reviewStates, now) {
  const leftScore = rankBundle(left, reviewStates, now)
  const rightScore = rankBundle(right, reviewStates, now)

  if (leftScore !== rightScore) {
    return rightScore - leftScore
  }

  return left.word.localeCompare(right.word)
}

function rankBundle(bundle, reviewStates, now) {
  const state = reviewStates?.[bundle.id]
  const isDue = Boolean(state?.nextReview && state.nextReview <= now)
  const topicBonus = PRIORITY_TOPICS.includes(bundle.topic) ? 3 : 0
  const reviewCount = state?.reviewCount || 0
  const contextBonus = Math.min(bundle.contexts.length, 3)
  const paraphraseBonus = Math.min(bundle.paraphrases.length, 2)

  return (
    (isDue ? 100 : 0) +
    topicBonus * 10 +
    contextBonus * 4 +
    paraphraseBonus * 3 +
    reviewCount
  )
}

function topicLabel(topic) {
  const labels = {
    education: '教育',
    environment: '环境',
    technology: '科技',
    government: '政府',
    health: '健康',
    society: '社会',
    economy: '经济',
    work: '工作',
    media: '媒体',
    crime: '犯罪',
    culture: '文化',
    transport: '交通',
    general: '通用'
  }

  return labels[topic] || topic || '通用'
}
</script>

<style scoped>
.context-practice-page {
  @apply max-w-6xl mx-auto px-5 py-6 md:px-8 md:py-8 xl:px-10 xl:py-10;
}

.hero-card,
.content-card,
.empty-card,
.session-shell {
  @apply backdrop-blur-sm rounded-3xl border;
  box-shadow: 0 18px 45px -28px rgba(15, 23, 42, 0.5);
}

.hero-card.dark,
.content-card.dark,
.empty-card.dark,
.session-shell.dark {
  @apply bg-slate-800/50 border-white/10;
}

.hero-card.light,
.content-card.light,
.empty-card.light,
.session-shell.light {
  @apply bg-white border-gray-200;
}

.hero-card {
  @apply p-6 md:p-8 space-y-6;
}

.content-card {
  @apply px-7 py-8 md:px-10 md:py-11 xl:px-14 xl:py-12;
}

.hero-copy {
  @apply space-y-5;
}

.hero-badges {
  @apply flex flex-wrap items-center gap-2;
}

.hero-badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-[0.16em];
}

.hero-badge.dark {
  @apply bg-emerald-500/10 border-emerald-500/20 text-emerald-400;
}

.hero-badge.light {
  @apply bg-emerald-50 border-emerald-200 text-emerald-700;
}

.hero-title {
  @apply text-3xl md:text-4xl font-black tracking-tight leading-[1.15];
}

.hero-description {
  @apply text-sm md:text-base leading-8 max-w-2xl;
}

.hero-actions {
  @apply flex flex-wrap gap-3;
}

.btn-primary {
  @apply px-6 py-3 rounded-2xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all;
}

.btn-primary:hover {
  @apply shadow-emerald-500/40 scale-[1.02];
}

.btn-primary:disabled {
  @apply opacity-50 cursor-not-allowed shadow-none;
  transform: none;
}

.btn-secondary {
  @apply px-6 py-3 rounded-2xl font-semibold border transition-all;
}

.btn-secondary.dark {
  @apply bg-white/5 border-white/10 text-gray-300 hover:border-emerald-500/30 hover:text-emerald-400;
}

.btn-secondary.light {
  @apply bg-gray-100 border-gray-200 text-gray-700 hover:border-emerald-500/30 hover:text-emerald-600;
}

.last-summary {
  @apply flex items-center gap-4 rounded-2xl border p-4;
}

.last-summary.dark {
  @apply bg-emerald-500/5 border-emerald-500/10;
}

.last-summary.light {
  @apply bg-emerald-50 border-emerald-200;
}

.stats-grid {
  @apply grid grid-cols-2 xl:grid-cols-4 gap-4;
}

.track-stack {
  @apply max-w-[1140px] mx-auto space-y-10;
}

.path-coach {
  @apply max-w-[1140px] mx-auto rounded-3xl border p-5 md:p-6 mb-8;
}

.path-coach.dark {
  @apply bg-slate-900/40 border-white/5;
}

.path-coach.light {
  @apply bg-gray-50 border-gray-200;
}

.path-coach-head {
  @apply flex flex-col gap-4 md:flex-row md:items-start md:justify-between;
}

.path-coach-badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap;
}

.path-coach-badge.dark {
  @apply bg-emerald-500/10 border-emerald-500/20 text-emerald-300;
}

.path-coach-badge.light {
  @apply bg-emerald-100 border-emerald-200 text-emerald-700;
}

.path-gate-grid {
  @apply grid gap-4 mt-6 md:grid-cols-3;
}

.path-gate-card {
  @apply rounded-2xl border p-4;
}

.path-gate-card.dark {
  @apply bg-slate-800/60 border-white/5;
}

.path-gate-card.light {
  @apply bg-white border-gray-200;
}

.path-gate-card.done.dark {
  @apply border-emerald-500/20;
}

.path-gate-card.done.light {
  @apply border-emerald-200;
}

.path-gate-card.active.dark {
  @apply border-amber-500/20;
}

.path-gate-card.active.light {
  @apply border-amber-200;
}

.path-gate-top {
  @apply flex items-center justify-between gap-3;
}

.path-gate-state {
  @apply text-xs font-semibold;
}

.track-group {
  @apply space-y-5;
}

.topic-sections {
  @apply space-y-5;
}

.topic-subgroup {
  @apply space-y-4;
}

.topic-subgroup-header {
  @apply flex flex-wrap items-center gap-3;
}

.topic-subgroup-pill {
  @apply inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold border uppercase tracking-[0.08em];
}

.topic-subgroup-pill.dark {
  @apply bg-white/5 border-white/10 text-gray-300;
}

.topic-subgroup-pill.light {
  @apply bg-gray-100 border-gray-200 text-gray-700;
}

.topic-subgroup-copy {
  @apply text-xs leading-6;
}

.track-group-header {
  @apply flex items-start justify-between gap-4 max-w-[980px];
}

.track-grid {
  @apply grid lg:grid-cols-2 xl:grid-cols-3 gap-6;
}

.track-grid.compact {
  @apply xl:grid-cols-3;
}

.foundation-grid {
  @apply grid-cols-1;
  justify-content: center;
}

.foundation-grid .track-card {
  width: min(100%, 32rem);
}

.track-card {
  @apply rounded-2xl border p-5 md:p-6 flex flex-col gap-4 transition-all;
}

.track-card.dark {
  @apply bg-slate-900/40 border-white/5;
}

.track-card.light {
  @apply bg-gray-50 border-gray-200;
}

.track-card.current {
  @apply border-emerald-500/40 shadow-lg shadow-emerald-500/10;
}

.track-card-top {
  @apply flex items-center justify-between gap-3;
}

.track-pill {
  @apply inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold border;
}

.track-pill.dark {
  @apply bg-white/5 border-white/10 text-gray-300;
}

.track-pill.light {
  @apply bg-white border-gray-200 text-gray-700;
}

.track-current {
  @apply text-[11px] font-semibold text-emerald-400;
}

.track-title {
  @apply text-base font-bold;
}

.track-description {
  @apply text-sm leading-7;
  min-height: 3.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.track-meta {
  @apply flex items-center gap-2 flex-wrap text-xs text-gray-500;
}

.track-meta span {
  @apply px-2.5 py-1 rounded-lg border;
}

.track-card.dark .track-meta span {
  @apply border-white/10 bg-white/5;
}

.track-card.light .track-meta span {
  @apply border-gray-200 bg-white;
}

.track-action {
  @apply mt-auto w-full rounded-2xl py-3 font-semibold transition-all border;
}

.track-action.primary.dark,
.track-action.primary.light {
  @apply bg-emerald-600 border-emerald-500 text-white;
}

.track-action.secondary.dark {
  @apply bg-white/5 border-white/10 text-gray-300 hover:border-emerald-500/30 hover:text-emerald-400;
}

.track-action.secondary.light {
  @apply bg-white border-gray-200 text-gray-700 hover:border-emerald-500/30 hover:text-emerald-600;
}

.stat-card {
  @apply rounded-2xl border p-5;
}

.stat-card.dark {
  @apply bg-slate-800/50 border-white/10;
}

.stat-card.light {
  @apply bg-white border-gray-200;
}

.stat-value {
  @apply text-3xl font-bold;
}

.stat-label {
  @apply text-sm mt-2 text-gray-500;
}

.section-heading {
  @apply mb-9;
}

.path-heading {
  @apply max-w-[1140px] mx-auto;
}

.section-title {
  @apply text-xl font-bold;
}

.section-description {
  @apply text-sm text-gray-500 mt-2 leading-7 max-w-2xl;
}

.session-size-grid {
  @apply grid grid-cols-3 gap-3 mb-6;
}

.size-card {
  @apply w-full min-h-[112px] rounded-2xl border px-4 py-5 text-left transition-all flex flex-col justify-between items-start;
}

.size-card.dark {
  @apply bg-slate-900/50 border-white/10 text-gray-300;
}

.size-card.light {
  @apply bg-gray-50 border-gray-200 text-gray-700;
}

.size-card.active {
  @apply border-emerald-500/40 bg-emerald-500/10;
}

.size-card-head {
  @apply flex items-end gap-2 leading-none;
}

.size-card-value {
  @apply text-4xl font-black text-emerald-500;
}

.size-card-unit {
  @apply text-sm font-semibold text-gray-500 mb-1 whitespace-nowrap;
}

.size-card-label {
  @apply text-sm font-medium whitespace-nowrap;
}

.insight-panel {
  @apply rounded-2xl border p-4;
}

.insight-panel.dark {
  @apply bg-slate-900/40 border-white/5;
}

.insight-panel.light {
  @apply bg-gray-50 border-gray-200;
}

.preview-grid {
  @apply grid sm:grid-cols-2 gap-3;
}

.preview-pill {
  @apply flex items-start justify-between gap-3 rounded-2xl border p-4;
}

.preview-pill.dark {
  @apply bg-slate-900/40 border-white/5;
}

.preview-pill.light {
  @apply bg-gray-50 border-gray-200;
}

.preview-topic {
  @apply px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap;
}

.preview-topic.dark {
  @apply bg-emerald-500/10 text-emerald-400;
}

.preview-topic.light {
  @apply bg-emerald-100 text-emerald-700;
}

.insight-list {
  @apply space-y-3 text-sm leading-6;
}

.principle-row {
  @apply flex flex-wrap gap-2;
}

.principle-pill {
  @apply px-3 py-2 rounded-xl text-sm border;
}

.principle-pill.dark {
  @apply bg-slate-900/40 border-white/5 text-gray-300;
}

.principle-pill.light {
  @apply bg-gray-50 border-gray-200 text-gray-700;
}

.history-grid {
  @apply grid grid-cols-2 gap-4;
}

.history-value {
  @apply text-2xl font-bold text-emerald-500;
}

.history-label {
  @apply text-xs mt-1 text-gray-500;
}

.topic-chip-list {
  @apply flex flex-wrap gap-2;
}

.topic-chip {
  @apply px-3 py-1.5 rounded-xl text-sm border;
}

.topic-chip.dark {
  @apply bg-slate-900/40 border-white/5 text-gray-300;
}

.topic-chip.light {
  @apply bg-gray-50 border-gray-200 text-gray-700;
}

.empty-card {
  @apply p-8 md:p-10 text-center space-y-5;
}

.empty-icon {
  @apply mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-emerald-500 bg-emerald-500/10;
}

.session-shell-header {
  @apply flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b px-5 py-5;
}

.session-shell-header.dark {
  @apply border-white/10;
}

.session-shell-header.light {
  @apply border-gray-200;
}

.session-shell-action {
  @apply px-4 py-2 rounded-2xl border font-medium transition-all;
}

.session-shell-body {
  @apply p-4 md:p-6;
}

/* Output Studio Entry */
.output-studio-entry {
  margin-top: 1.5rem;
}

.output-studio-card-wrapper {
  max-width: 400px;
}

.output-studio-card {
  border-color: rgba(139, 92, 246, 0.3);
}

.output-studio-card.dark {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%);
}

.output-studio-card.light {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(168, 85, 247, 0.02) 100%);
}

.track-pill-violet.dark {
  @apply bg-violet-500/10 border-violet-500/20 text-violet-400;
}

.track-pill-violet.light {
  @apply bg-violet-50 border-violet-200 text-violet-700;
}

.track-action-violet.dark {
  @apply bg-violet-600 border-violet-500 text-white hover:bg-violet-500;
}

.track-action-violet.light {
  @apply bg-violet-600 border-violet-500 text-white hover:bg-violet-500;
}

/* Exam Drills Entry */
.exam-drills-entry {
  margin-top: 1rem;
}

.exam-drills-card-wrapper {
  max-width: 400px;
}

.exam-drills-card {
  border-color: rgba(244, 63, 94, 0.3);
}

.exam-drills-card.dark {
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.1) 0%, rgba(251, 113, 133, 0.05) 100%);
}

.exam-drills-card.light {
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.05) 0%, rgba(251, 113, 133, 0.02) 100%);
}

.track-pill-rose.dark {
  @apply bg-rose-500/10 border-rose-500/20 text-rose-400;
}

.track-pill-rose.light {
  @apply bg-rose-50 border-rose-200 text-rose-700;
}

.track-action-rose.dark {
  @apply bg-rose-600 border-rose-500 text-white hover:bg-rose-500;
}

.track-action-rose.light {
  @apply bg-rose-600 border-rose-500 text-white hover:bg-rose-500;
}
</style>
