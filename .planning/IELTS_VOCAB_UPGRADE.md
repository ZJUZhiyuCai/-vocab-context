# IELTS 词汇体系升级计划

**日期:** 2026-03-26
**目标:** 针对 IELTS 备考者优化词汇学习体系
**状态:** ✅ Phase 1 & 2 完成

---

## 完成总结

### Phase 1: 词汇难度标签重构 ✅

**变更:**
- 移除 CET 标签，改用 IELTS Band 作为主要标签
- 新增 `ieltsBand` 字段
- 更新推荐算法支持 IELTS Band 匹配

### Phase 2: Topic Pack 扩展 ✅

**词汇量变化:**

| Topic | 之前 | 之后 | 变化 |
|-------|------|------|------|
| IELTS Foundation | 541 | 744 | +203 |
| Work | 32 | 77 | +45 |
| Media | 32 | 77 | +45 |
| Crime | 26 | 76 | +50 |
| Health | 53 | 80 | +27 |
| Technology | 52 | 80 | +28 |
| Environment | 71 | 79 | +8 |
| Education | 124 | 124 | - |
| Government | 108 | 108 | - |

**新增脚本:**
- `scripts/expand-topic-packs-batch2.js` - Work/Media/Crime 扩展
- `scripts/expand-topic-packs-batch3.js` - Health/Technology/Environment 扩展
- `scripts/expand-topic-packs-batch4.js` - 补充扩展
- `scripts/final-expansion.js` - 最终补充

---

## 原始计划

## 一、词汇难度标签重构

### 1.1 问题分析

**当前问题：**
- `vocab-cet4-basic` 声称 4500 词，但不是严格 CET-4 词汇
- `difficulty.cefr` 和 `difficulty.label` 是手动配置
- 词汇数据中 `cefr`、`ielts` 字段不反映真实等级

**影响：**
- 用户无法准确了解自己的词汇水平
- 推荐系统基于不准确数据

### 1.2 解决方案

**方案 A：引用权威词表交叉验证**
- 使用 Oxford 3000/5000 词表
- 使用剑桥词汇表 (Cambridge English Vocabulary Profile)
- 每个词汇标注真实 CEFR 等级

**方案 B：IELTS Band 分组法**
- 移除 CET 标签，改用 IELTS Band
- 按 IELTS 常见分数段分组词汇
- 更直观，用户明确目标

**推荐：方案 B（更实用）**

### 1.3 实施步骤

1. **创建 IELTS Band 词汇等级映射**
   ```
   IELTS 4.0-5.0 → Foundation Words (基础)
   IELTS 5.0-6.0 → Core Words (核心)
   IELTS 6.0-7.0 → Advanced Words (进阶)
   IELTS 7.0-8.0 → Mastery Words (精通)
   IELTS 8.0+   → Expert Words (专家)
   ```

2. **更新 vocabularyManager.js 配置**
   - 移除 CET 相关标签
   - 使用 IELTS Band 作为主要标签
   - 保留 CEFR 作为辅助参考

3. **词汇数据清洗**（可选，长期目标）
   - 交叉验证权威词表
   - 更新每个词的真实 CEFR 等级

---

## 二、IELTS Topic Pack 扩展

### 2.1 当前状态

| Topic | Bundles | 状态 |
|-------|---------|------|
| Education | 124 | ✅ 充足 |
| Government | 108 | ✅ 充足 |
| Environment | 71 | ⚠️ 需扩展 |
| Technology | 52 | ⚠️ 需扩展 |
| Health | 53 | ⚠️ 需扩展 |
| Work | 32 | ❌ 不足 |
| Media | 32 | ❌ 不足 |
| Crime | 26 | ❌ 不足 |

### 2.2 目标

每个 Topic Pack 目标词汇量：**80-150**

### 2.3 实施步骤

1. **扩展现有 Topic Packs**
   - Work: 32 → 80+
   - Media: 32 → 80+
   - Crime: 26 → 80+
   - Technology: 52 → 100+
   - Health: 53 → 100+
   - Environment: 71 → 100+

2. **新增 Topic Packs**
   - Globalization (全球化)
   - Arts & Culture (艺术与文化)

---

## 三、雅思专项功能增强

### 3.1 功能规划

1. **Writing Task 2 词汇搭配训练**
   - 按论点类型分组 (Agree/Disagree, Problem/Solution, etc.)
   - 提供高分搭配模板

2. **Speaking Part 2 话题词群**
   - 一个话题关联 10-15 个高分词汇
   - 提供 Speaking 模板句型

3. **Collocation 专项训练**
   - 高频动词+名词搭配
   - 形容词+名词搭配
   - 副词+动词/形容词搭配

---

## 四、实施优先级

| 阶段 | 任务 | 优先级 | 预计工作量 |
|------|------|--------|-----------|
| Phase 1 | 词汇难度标签重构 | P0 | 中 |
| Phase 2 | Topic Pack 扩展 | P1 | 高 |
| Phase 3 | 专项功能增强 | P2 | 高 |

---

## 五、下一步

1. 确认方案 B（IELTS Band 分组）
2. 开始 Phase 1：更新 vocabularyManager.js
3. 创建 IELTS Band 等级映射配置