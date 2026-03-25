# P2 Today 卡片级导流 - 实现说明

## 概述

本次更新实现了 P2 功能：在 Today 页面，用户完成一个 bundle 词后，系统会根据学习进度推荐下一步该去哪层练习。

## 功能设计

### 触发条件

卡片级推荐会在以下条件同时满足时显示：

1. 当前词库是 IELTS 类型
2. 当前词是 bundle 词（有完整语境数据）
3. 用户刚认识这个词（intervalLevel >= 1）
4. 本次会话学习数是 3 的倍数（避免过于频繁）

### 推荐逻辑

根据用户在各层练习的历史数据推荐：

| 条件 | 推荐内容 |
|------|----------|
| Context-first 练习 < 2 次 | "去语境里见见这个词" → Context-first |
| Output Studio 练习 < 2 次 | "试着用这个词造句" → Output Studio |
| Exam Drills 练习 < 1 次 | "检验一下考试迁移" → Exam Drills |
| 已有较多练习 | "继续保持，多练几次就稳了" |

### 展示方式

- 底部浮现的 Toast 提示条
- 6 秒后自动消失（带进度条）
- 用户可点击"稍后"关闭，或点击 CTA 按钮跳转

## 新增文件

```
src/utils/cardRecommendation.js       # 推荐逻辑
src/components/CardNextStepToast.vue  # Toast 展示组件
```

## 修改文件

```
src/App.vue                           # 集成推荐逻辑
```

## 验证方法

1. 启动项目：`npm run dev`
2. 切换到 IELTS Foundation 词库
3. 在 Today 页面学习 bundle 词
4. 连续"认识" 3 个词后，观察是否出现推荐提示

## 预期效果

| 场景 | 行为 |
|------|------|
| 学习第 3 个 bundle 词 | 显示推荐 Toast |
| 点击 CTA 按钮 | 跳转到 Context 页面 |
| 点击"稍后" | 关闭 Toast |
| 6 秒无操作 | 自动关闭 Toast |

## 后续优化方向

1. 根据用户反馈调整显示频率
2. 更精细的推荐算法（考虑词的 topic、难度等）
3. 记录用户忽略推荐的次数，调整推荐策略