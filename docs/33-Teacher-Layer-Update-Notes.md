# Teacher Layer 更新说明

## 概述

本次更新改进了 VocabMan 项目的 Teacher Layer（反馈语言层），目标是让反馈更像英语老师的指导，而非机械的评分板。

## 更新背景

原有反馈语言存在的问题：
- 技术化表达如"会用词"、"认得词"、"学习增益"等
- 机械化建议如"下一轮先确保把目标词自然放进句子主干"
- "Learning Coach" 标题偏向系统化，缺乏教学感

## 修改的文件

### 1. `src/utils/learningCoach.js`

**改动一：重写 `pickNextStep()` 函数（第95-144行）**

原代码：
```javascript
function pickNextStep(failedChecks) {
  if (failedChecks.includes('targetWord')) {
    return '下一轮先确保把目标词自然放进句子主干。'
  }
  // ...
}
```

新代码：
```javascript
function pickNextStep(failedChecks, context = {}) {
  const { word, collocations = [] } = context

  const tips = {
    targetWord: {
      tip: `试着把 ${word || '这个词'} 放在句子的关键位置，让它成为表达的核心。`,
      example: `比如："The results were ${word || 'significant'} in several ways."`
    },
    // ... 其他提示
  }
  // 返回更自然的建议
  return selected.tip
}
```

改动原因：让建议更具体、更像老师说的话，并利用上下文信息（word, collocations）生成个性化建议。

**改动二：新增 `pickNextStepDetailed()` 函数（第147-194行）**

新增函数，返回包含 `tip` 和 `example` 的对象，供未来更详细的反馈展示使用。

**改动三：更新 `buildOutputCoach()` 的 headline（第326-334行）**

原代码：
```javascript
const headline = averageScore >= 78
  ? '这轮产出已经接近"会用词"，不只是"认得词"。'
  : averageScore >= 55
    ? '这轮输出已经开始可用，但还没稳定到考试场景。'
    : '这轮更像在试词，还没有把词真正写成自然英语。'
```

新代码：
```javascript
let headline
if (averageScore >= 78) {
  headline = '这轮表现很稳，你已经能把这个词自然地用在雅思级别的句子里了。'
} else if (averageScore >= 55) {
  headline = '这轮表现不错，句子是通顺的，但还有提升空间让表达更地道。'
} else {
  headline = '这轮像是还在找感觉，没关系，多练几次就自然了。'
}
```

改动原因：移除技术化表达，改用更自然的老师式评语。

**改动四：更新 `buildOutputCoach()` 空结果时的 headline（第260行）**

原：`'这一轮还没有足够的英语产出来判断学习质量。'`
新：`'这轮还没提交足够的英语输出，没法判断学习质量。'`

**改动五：更新 `buildExamCoach()` 的 headline 和 nextAction（第363-380行）**

新增 `getSurfaceLabel()` 函数（第386-394行）用于中文题型标签，更新 headline 语言更自然。

**改动六：在 `evaluateProductionAttempt()` 中传递 context 参数（第249行）**

```javascript
nextStep: pickNextStep(failedKeys, { word, collocations })
```

---

### 2. `src/components/context/OutputStudio.vue`

**改动：更新 coach panel 展示（第109-160行）**

1. 标题从 "Learning Coach" 改为 "老师点评"
2. headline 字体从 `text-sm` 改为 `text-base` 更突出
3. 移除 "平均质量分" 显示，保留 nextAction
4. weakWords 建议颜色从 violet 改为 emerald（更正向）

---

### 3. `src/components/context/ExamDrills.vue`

**改动：同步更新 coach panel 展示（第140-194行）**

与 OutputStudio.vue 类似：
1. 标题从 "Learning Coach" 改为 "老师点评"
2. headline 字体增大
3. 移除 "下一步：" 前缀
4. 建议颜色调整为 emerald

---

### 4. `src/utils/supabase.js`（修复问题）

**改动：添加空值检查**

新增 `hasSupabaseConfig` 导出（布尔值），`supabase` 客户端在环境变量缺失时返回 `null` 而非报错，让应用能在没有 Supabase 配置时正常运行。

---

### 5. `src/utils/authService.js`（修复问题）

**改动：添加 supabase 空值检查**

在调用 supabase 方法前检查是否为 null，避免应用崩溃。

---

### 6. `src/utils/syncService.js`（修复问题）

**改动：添加 supabase 空值检查**

所有方法添加 `!supabase` 检查。

---

### 7. `src/layouts/PremiumLayout.vue`（修复问题）

**改动：离线模式下隐藏登录按钮**

当 Supabase 未配置时，隐藏登录按钮和认证弹窗，实现优雅降级。

```javascript
// 新增导入
import { hasSupabaseConfig } from '../utils/supabase.js'

// 登录按钮条件渲染
<button v-if="!isLoggedIn && hasSupabaseConfig" ...>

// AuthOverlay 条件渲染
<AuthOverlay v-if="showAuth && !isLoggedIn && hasSupabaseConfig" ...>
```

改动原因：离线模式下点击登录会报错，应该完全隐藏登录入口。

## Codex 代码审查问题修复

### 问题 P1：pickNextStep() 优先级逻辑

**问题**：原修改将优先级检查改为数组顺序，丢失了按优先级返回最高优先级失败项的逻辑。

**修复**：恢复 `SUGGESTION_PRIORITY` 数组，按优先级顺序检查失败项：
```javascript
const SUGGESTION_PRIORITY = ['targetWord', 'englishOnly', 'minimumLength', 'supportSignal', 'topicSignal', 'sentenceControl']

function pickNextStep(failedChecks, context = {}) {
  // ...
  for (const key of SUGGESTION_PRIORITY) {
    if (failedChecks.includes(key)) {
      return tips[key]
    }
  }
  return '继续保持，试着用更自然的句式和更具体的细节。'
}
```

### 问题 P2：getSurfaceLabel() 缺少 mapping

**问题**：`getSurfaceLabel()` 函数缺少 `reading_paraphrase` 的映射。

**修复**：添加 `reading_paraphrase: '阅读改写'` 到 labels 对象。

### 问题 P2：离线模式登录入口未隐藏

**问题**：离线模式下登录按钮仍可点击，导致稳定报错而非优雅降级。

**修复**：在 PremiumLayout.vue 中添加 `hasSupabaseConfig` 检查。

## 验证方法

### 代码层面验证
```bash
# 检查新文本是否存在
grep -o "这轮表现很稳\|老师点评\|这轮像是还在找感觉" ~/projects/vocab/dist/assets/*.js

# 检查旧文本是否移除
grep -o "Learning Coach\|会用词\|认得词" ~/projects/vocab/dist/assets/*.js
# 应该返回空
```

### 功能测试
1. 启动项目：`npm run dev`
2. 访问 http://localhost:8888
3. 切换到 IELTS Foundation 词库
4. 进入 Context → Output Studio
5. 完成一轮练习
6. 查看 Session Summary 中的"老师点评"

## 预期效果

| 场景 | 原反馈 | 新反馈 |
|------|--------|--------|
| 高分组 headline | "这轮产出已经接近'会用词'，不只是'认得词'。" | "这轮表现很稳，你已经能把这个词自然地用在雅思级别的句子里了。" |
| 中分组 headline | "这轮输出已经开始可用，但还没稳定到考试场景。" | "这轮表现不错，句子是通顺的，但还有提升空间让表达更地道。" |
| 低分组 headline | "这轮更像在试词，还没有把词真正写成自然英语。" | "这轮像是还在找感觉，没关系，多练几次就自然了。" |
| 标题 | "Learning Coach" | "老师点评" |
| nextStep | "下一轮先确保把目标词自然放进句子主干。" | "试着把这个词放在句子的关键位置，让它成为表达的核心。" |

## 注意事项

1. 本次改动**仅涉及文案和展示**，未改变任何评分逻辑
2. `pickNextStep()` 返回类型保持为字符串，向后兼容
3. Supabase 相关改动是修复性质，不影响正常功能

## 文件清单

```
src/utils/learningCoach.js     # 核心反馈逻辑
src/components/context/OutputStudio.vue  # 产出练习组件
src/components/context/ExamDrills.vue    # 考试练习组件
src/utils/supabase.js          # 空值检查修复
src/utils/authService.js       # 空值检查修复
src/utils/syncService.js       # 空值检查修复
src/layouts/PremiumLayout.vue  # 离线模式隐藏登录按钮
```