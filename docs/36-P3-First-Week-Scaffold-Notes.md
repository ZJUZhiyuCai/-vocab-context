# P3 First-Week Learning Scaffold - 实现说明

## 概述

本次更新实现了 P3 功能：为新 IELTS 用户提供 Day 1-7 的结构化学习脚手架，让新用户打开 App 就知道"今天该干什么"。

## 新增文件

### 1. `src/utils/firstWeekScaffold.js`

**功能**：首周学习任务定义和进度管理

**核心数据结构**：

```javascript
// 任务定义
const FIRST_WEEK_TASKS = [
  { day: 1, title: '入门设置', tasks: [...] },
  { day: 2, title: '词汇积累', tasks: [...] },
  // ... Day 3-7
]

// 进度存储 (localStorage)
// key: 'vocabcontext_first_week_progress'
// {
//   startedAt: '2024-01-15',
//   currentDay: 3,
//   completedTasks: ['onboarding', 'learn_10'],
//   dayCompleted: [1, 2]
// }
```

**主要函数**：

| 函数 | 功能 |
|------|------|
| `shouldShowFirstWeekPanel(vocab)` | 判断是否显示首周面板 |
| `getFirstWeekProgress()` | 获取首周进度 |
| `getOrCreateFirstWeekProgress()` | 获取或初始化进度 |
| `getTodayTask(progress)` | 获取今天的任务 |
| `checkTaskCompletion(taskId, context)` | 检查任务是否完成 |
| `updateDayProgress(context)` | 更新当天进度 |

### 2. `src/components/FirstWeekPanel.vue`

**功能**：首周进度展示组件

**展示内容**：
- 进度百分比 (Day X/7)
- 7 天进度点
- 今天的任务列表
- 每日提示语
- 开始任务按钮

**展示位置**：PremiumStats.vue 顶部

## 修改文件

### `src/components/PremiumStats.vue`

**改动**：
1. 导入 FirstWeekPanel 组件
2. 添加 showFirstWeekPanel 计算属性
3. 添加 watch 监听学习进度变化
4. 在模板顶部条件渲染 FirstWeekPanel

## 任务设计

| Day | 标题 | 任务 |
|-----|------|------|
| 1 | 入门设置 | 完成入门引导、学习前 10 个词 |
| 2 | 词汇积累 | 学习 20 个词、尝试一次测验 |
| 3 | 语境练习 | 完成一次 Context-first |
| 4 | 输出训练 | 完成一次 Output Studio、累计学习 30 个词 |
| 5 | 考试迁移 | 完成一次 Exam Drills |
| 6 | 复习巩固 | 复习薄弱词、学习更多新词 |
| 7 | 完整循环 | 完成一轮完整练习 |

## 验证方法

### 代码验证

```bash
npm run build
```

### 功能测试

1. 清除 localStorage：`localStorage.clear()`
2. 选择 IELTS Foundation 词库
3. 检查 Today 页面右侧是否显示首周进度面板
4. 学习词汇，检查进度是否实时更新
5. 完成当天所有任务，检查是否显示"今日任务已完成"

### 验证点

- [ ] 新用户看到首周进度面板
- [ ] 非 IELTS 词库不显示面板
- [ ] 学习词汇后进度更新
- [ ] 完成当天任务后显示完成状态
- [ ] 第 7 天完成后面板消失

## 注意事项

1. 进度更新通过 PremiumStats 的 watch 触发，不需要修改 App.vue 核心逻辑
2. 任务完成状态是实时计算的，不依赖 completedTasks 数组的完整记录
3. 第 7 天完成后，shouldShowFirstWeekPanel 返回 false，面板自动隐藏