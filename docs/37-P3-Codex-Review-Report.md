# P3 First-Week Learning Scaffold - Codex 审查报告

## 改动概述

**目标**：为新 IELTS 用户提供 Day 1-7 的结构化学习脚手架。

**范围**：
- 新增 2 个文件
- 修改 1 个文件
- 新增约 300 行代码

---

## 新增文件

### 1. `src/utils/firstWeekScaffold.js`

**功能**：首周学习任务定义和进度管理

**关键常量和函数**：

```javascript
// 任务定义
export const FIRST_WEEK_TASKS = [
  { day: 1, title: '入门设置', tasks: [...] },
  // ... Day 2-7
]

// 进度存储 key
const PROGRESS_KEY = 'vocabcontext_first_week_progress'

// 主要导出函数
shouldShowFirstWeekPanel(vocab)      // 判断是否显示面板
getFirstWeekProgress()               // 获取进度
getOrCreateFirstWeekProgress()       // 获取或初始化进度
getTodayTask(progress)               // 获取今天的任务
checkTaskCompletion(taskId, context) // 检查任务完成
updateDayProgress(context)           // 更新进度
```

**进度数据结构**：
```javascript
// localStorage: 'vocabcontext_first_week_progress'
{
  startedAt: '2024-01-15',           // 开始日期
  currentDay: 3,                      // 当前第几天（计算得出）
  completedTasks: ['onboarding', ...], // 已完成的任务 ID
  dayCompleted: [1, 2]               // 已完成的天数
}
```

---

### 2. `src/components/FirstWeekPanel.vue`

**功能**：首周进度展示组件

**Props**：
- `currentVocab: Object` - 当前词库
- `learnedCount: Number` - 今日学习数
- `totalLearned: Number` - 累计学习数

**Events**：
- `@navigate` - 跳转到指定页面

**展示内容**：
- 进度百分比
- 7 天进度点
- 今天的任务列表（带完成状态）
- 每日提示语
- 开始任务按钮

---

## 修改文件

### `src/components/PremiumStats.vue`

**改动 1**：导入新模块（第 114-116 行）

```javascript
import { shouldShowFirstWeekPanel, updateDayProgress } from '../utils/firstWeekScaffold.js'
import FirstWeekPanel from './FirstWeekPanel.vue'
```

**改动 2**：添加计算属性和 watch（第 148-166 行）

```javascript
const showFirstWeekPanel = computed(() => shouldShowFirstWeekPanel(props.currentVocab))

// 监听学习进度变化，更新首周进度
watch(
  () => [props.todayLearned, props.totalLearned],
  () => {
    if (showFirstWeekPanel.value) {
      updateDayProgress({
        learnedCount: props.todayLearned,
        totalLearned: props.totalLearned
      })
    }
  },
  { immediate: true }
)
```

**改动 3**：模板中添加组件（第 5-12 行）

```vue
<FirstWeekPanel
  v-if="showFirstWeekPanel"
  :current-vocab="currentVocab"
  :learned-count="todayLearned"
  :total-learned="totalLearned"
  @navigate="$emit('navigate', $event)"
/>
```

---

## 审查要点

### 1. 显示条件是否正确？

当前逻辑：
```javascript
export function shouldShowFirstWeekPanel(currentVocab) {
  if (!currentVocab || currentVocab.category !== 'IELTS') return false
  const progress = getFirstWeekProgress()
  if (!progress) return true  // 新用户
  if (progress.dayCompleted?.length >= 7) return false  // 已完成
  return true
}
```

**检查项**：
- [ ] 非 IELTS 词库是否正确隐藏？
- [ ] 首周完成后是否正确隐藏？
- [ ] localStorage 损坏时是否有优雅降级？

### 2. 任务完成检测是否准确？

当前 `checkTaskCompletion` 函数检查：
- `learn_10` / `learn_20` → `learnedCount >= target`
- `context_session` → `getContextSessionHistory().sessions >= 1`
- `output_studio` → `getOutputStudioHistory().sessions >= 1`
- `exam_drills` → `getExamDrillHistory().sessions >= 1`

**检查项**：
- [ ] 依赖的 history 函数是否稳定返回数据？
- [ ] 当 history 为 null 时是否安全？

### 3. 进度更新时机是否合理？

当前在 PremiumStats.vue 的 watch 中更新：
```javascript
watch(
  () => [props.todayLearned, props.totalLearned],
  () => {
    if (showFirstWeekPanel.value) {
      updateDayProgress({...})
    }
  },
  { immediate: true }
)
```

**检查项**：
- [ ] 是否会过于频繁触发？
- [ ] 是否遗漏了某些完成场景（如 quiz、review）？

### 4. 日期计算是否正确？

```javascript
export function calculateCurrentDay(progress) {
  if (!progress?.startedAt) return 1
  const startDate = new Date(progress.startedAt)
  const today = new Date()
  // ...
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return Math.min(Math.max(diffDays + 1, 1), 7)
}
```

**检查项**：
- [ ] 跨时区是否正确？
- [ ] startedAt 格式异常时是否安全？

### 5. 组件内存泄漏风险

FirstWeekPanel.vue 使用 computed，无定时器或手动事件监听。

**检查项**：
- [ ] 无定时器需要清理
- [ ] 无手动事件监听需要移除

---

## 验证方法

### 代码层面

```bash
# 检查新增文件是否存在
ls -la src/utils/firstWeekScaffold.js
ls -la src/components/FirstWeekPanel.vue

# 检查导入是否存在
grep -n "FirstWeekPanel" src/components/PremiumStats.vue

# 构建验证
npm run build
```

### 功能测试

1. 清除 localStorage：
   ```javascript
   localStorage.clear()
   ```

2. 选择 IELTS Foundation 词库

3. 检查 Today 页面右侧是否显示首周进度面板

4. 学习词汇，检查进度是否更新

5. 切换到非 IELTS 词库，确认面板消失

---

## 潜在问题

### P1 风险

无

### P2 风险

1. **quiz 任务检测缺失**：`checkTaskCompletion('quiz')` 需要 `hasDoneQuiz` 参数，但 PremiumStats 的 watch 没有传入
   - 当前 watch 只传 `learnedCount` 和 `totalLearned`
   - quiz 完成后不会自动更新首周进度

2. **review 任务检测简化**：`checkTaskCompletion('review')` 只检查学习历史是否有记录，不精确

### 低风险

1. **首次渲染闪烁**：`getOrCreateFirstWeekProgress()` 可能导致首次渲染时有轻微延迟

---

## 文件清单

```
新增:
src/utils/firstWeekScaffold.js       # 首周任务逻辑
src/components/FirstWeekPanel.vue    # 进度展示组件

修改:
src/components/PremiumStats.vue      # 集成面板

文档:
docs/36-P3-First-Week-Scaffold-Notes.md
```

---

## 构建状态

```
✓ built in 1.16s
dist/assets/index.CHZw8dDC.js       326.55 kB │ gzip: 90.47 kB
```