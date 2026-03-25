# P2 Today 卡片级导流 - Codex 审查报告

## 改动概述

**目标**：在 Today 页面，用户完成 bundle 词后，根据学习进度推荐下一步该去哪层练习。

**范围**：
- 新增 2 个文件
- 修改 1 个文件
- 新增约 180 行代码

---

## 新增文件

### 1. `src/utils/cardRecommendation.js`

**功能**：卡片级推荐逻辑

**关键函数**：

```javascript
// 判断是否应该显示推荐
shouldShowCardRecommendation(vocab, word, reviewState, sessionLearnCount)

// 构建推荐内容
buildCardRecommendation(vocab, word)

// 获取推荐显示延迟
getRecommendationDelay()
```

**触发条件**（全部满足才显示）：
1. `vocab.category === 'IELTS'`
2. `word.isBundle === true`
3. `reviewState.intervalLevel >= 1`
4. `sessionLearnCount % 3 === 0`

---

### 2. `src/components/CardNextStepToast.vue`

**功能**：底部浮现的推荐 Toast 组件

**Props**：
- `recommendation: Object` - 推荐内容 { stage, title, ctaLabel, mode, targetTopic }
- `duration: Number` - 自动关闭时间（默认 6000ms）

**Events**：
- `@action` - 用户点击 CTA 按钮
- `@dismiss` - 用户点击"稍后"

---

## 修改文件

### `src/App.vue`

**改动 1**：导入新模块（第 338-339 行）

```javascript
import { shouldShowCardRecommendation, buildCardRecommendation, getRecommendationDelay } from './utils/cardRecommendation.js'
```

**改动 2**：导入 Toast 组件（第 377 行）

```javascript
import CardNextStepToast from './components/CardNextStepToast.vue'
```

**改动 3**：新增状态变量（第 455 行）

```javascript
const cardRecommendation = ref(null)
```

**改动 4**：在 `handleKnow()` 中触发推荐（第 614-618 行）

```javascript
// 检查是否显示卡片级推荐
if (shouldShowCardRecommendation(currentVocab.value, currentWord.value, reviewStates.value[currentWord.value.id], sessionLearnCount.value)) {
  setTimeout(() => {
    cardRecommendation.value = buildCardRecommendation(currentVocab.value, currentWord.value);
  }, getRecommendationDelay());
}
```

**改动 5**：新增事件处理函数（第 1029-1040 行）

```javascript
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
```

**改动 6**：在模板中添加组件（第 303-308 行）

```vue
<CardNextStepToast
  v-if="cardRecommendation"
  :recommendation="cardRecommendation"
  @action="handleCardRecommendationAction"
  @dismiss="handleCardRecommendationDismiss"
/>
```

---

## 审查要点

### 1. 触发频率是否合理？

当前设置：每学习 3 个词显示一次（`sessionLearnCount % 3 === 0`）

**检查项**：
- [ ] 是否过于频繁打扰用户？
- [ ] 是否应该增加冷却时间？

### 2. 推荐逻辑是否正确？

`buildCardRecommendation()` 根据练习次数推荐：

| contextSessions < 2 | 推荐 Context-first |
|---------------------|-------------------|
| outputSessions < 2 | 推荐 Output Studio |
| examSessions < 1 | 推荐 Exam Drills |
| 其他 | 推荐"继续练习" |

**检查项**：
- [ ] 推荐顺序是否合理？
- [ ] 阈值是否合适？

### 3. 内存泄漏风险

`CardNextStepToast.vue` 使用了 `setInterval` 和 `setTimeout`：

**检查项**：
- [ ] `onUnmounted` 是否正确清理定时器？
- [ ] 组件销毁时是否有残留定时器？

### 4. 边界情况

**检查项**：
- [ ] `vocab` 为 null 时是否崩溃？
- [ ] `word` 为 null 时是否崩溃？
- [ ] `reviewState` 为 undefined 时是否崩溃？
- [ ] 推荐数据为空时 Toast 是否正常处理？

### 5. 状态清理

**检查项**：
- [ ] 用户点击 CTA 后 `cardRecommendation` 是否正确清空？
- [ ] 用户点击"稍后"后状态是否正确？
- [ ] 自动关闭后状态是否正确？

---

## 验证方法

### 代码层面

```bash
# 检查新增文件是否存在
ls -la src/utils/cardRecommendation.js
ls -la src/components/CardNextStepToast.vue

# 检查导入是否存在
grep -n "cardRecommendation" src/App.vue

# 构建验证
npm run build
```

### 功能测试

1. 启动项目：`npm run dev`
2. 切换到 IELTS Foundation 词库
3. 在 Today 页面学习 bundle 词
4. 连续"认识" 3 个词，观察是否出现推荐 Toast
5. 点击 CTA，验证是否跳转到 Context 页面

---

## 潜在问题

### P1 风险

无

### P2 风险

1. **Toast z-index**：当前设置 `z-40`，可能与 MobileTabBar（底部）重叠
   - 建议：测试移动端显示效果

2. **recommendation 对象结构**：如果 `buildCardRecommendation` 返回 null，Toast 的 `v-if` 不会渲染，这是预期行为
   - 但如果返回不完整对象（缺少 title 或 ctaLabel），可能导致显示异常

### 低风险

1. **getRecommendationDelay()** 返回 500-800ms 的随机值，实际意义不大，可以考虑移除或固定值

---

## 文件清单

```
新增:
src/utils/cardRecommendation.js       # 推荐逻辑
src/components/CardNextStepToast.vue  # Toast 组件

修改:
src/App.vue                           # 集成入口

文档:
docs/34-P2-Card-Level-Handoff-Notes.md
```

---

## 构建状态

```
✓ built in 1.05s
dist/assets/index.BRfhmeBm.js       318.13 kB │ gzip: 88.03 kB
```