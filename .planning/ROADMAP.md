# Roadmap — VocabMan 技术债务清理

**Version:** 1.0
**Created:** 2026-03-26

---

## Overview

| Metric | Value |
|--------|-------|
| Total Phases | 6 |
| v1 Requirements | 29 |
| Estimated Effort | Medium |

---

## Phases

### Phase 1: 测试与质量工具配置

**Goal:** 建立测试和代码质量基础设施，为后续重构提供安全网

**Requirements:** TEST-01, TEST-02, TEST-03, TEST-04, QUAL-01, QUAL-02, QUAL-03, QUAL-04

**Success Criteria:**
1. `npm test` 运行 Vitest 并通过所有测试
2. `npm run lint` 检查代码风格
3. 提交时自动运行 lint
4. 至少 5 个核心工具函数有测试

**Key Tasks:**
- 安装 Vitest 和相关依赖
- 配置 vitest.config.js
- 编写首批单元测试
- 配置 ESLint + Prettier
- 配置 lint-staged

---

### Phase 2: App.vue 重构

**Goal:** 将 App.vue 拆分为可维护的 composables 和组件

**Requirements:** REFA-01, REFA-02, REFA-03, REFA-04, REFA-05, REFA-06

**Success Criteria:**
1. App.vue 行数 < 500
2. 3 个新 composables 有测试
3. SettingsModal 可独立工作
4. 现有功能全部正常

**Key Tasks:**
- 创建 useAppState.js
- 创建 useWordOperations.js
- 创建 useReviewSystem.js
- 提取 SettingsModal.vue
- 重构 App.vue 使用新 composables
- 测试重构后功能

---

### Phase 3: ContextPractice.vue 重构

**Goal:** 拆分超大组件，提高可维护性

**Requirements:** CONT-01, CONT-02, CONT-03, CONT-04

**Success Criteria:**
1. ContextPractice.vue 行数 < 800
2. PathCoach 和 TrackSelector 可独立工作
3. 现有功能全部正常

**Key Tasks:**
- 分析 ContextPractice.vue 结构
- 提取 PathCoach.vue
- 提取 TrackSelector.vue
- 重构主组件
- 测试重构后功能

---

### Phase 4: Storage 统一管理

**Goal:** 统一 localStorage key 管理，支持数据迁移

**Requirements:** STOR-01, STOR-02, STOR-03, STOR-04

**Success Criteria:**
1. 所有 key 定义在 storageKeys.js
2. 有统一的 get/set/remote 接口
3. 所有文件使用新 API
4. 支持版本迁移

**Key Tasks:**
- 创建 storageKeys.js
- 创建 storageService.js
- 迁移所有 localStorage 调用
- 添加版本前缀

---

### Phase 5: 日志系统

**Goal:** 建立结构化日志系统，清理生产代码中的 console

**Requirements:** LOG-01, LOG-02, LOG-03

**Success Criteria:**
1. 有 logger.js 提供统一 API
2. 开发环境有详细日志，生产环境无噪音
3. 构建后日志语句被移除

**Key Tasks:**
- 创建 logger.js
- 替换所有 console.log
- 配置 Vite 移除生产日志
- 验证构建结果

---

### Phase 6: 安全加固与错误处理

**Goal:** 修复安全风险，添加错误边界

**Requirements:** SEC-01, SEC-02, ERR-01, ERR-02, ERR-03

**Success Criteria:**
1. v-html 使用安全替代方案
2. 正则转义正确
3. 有错误边界组件
4. TODO 已解决

**Key Tasks:**
- 安装 DOMPurify 或实现安全替代
- 修复 PremiumWordCard.vue
- 创建 ErrorBoundary.vue
- 解决 OnboardingQuiz TODO
- 添加错误边界包装

---

## Requirement Coverage

| Phase | Requirements | Count |
|-------|--------------|-------|
| 1 | TEST-01~04, QUAL-01~04 | 8 |
| 2 | REFA-01~06 | 6 |
| 3 | CONT-01~04 | 4 |
| 4 | STOR-01~04 | 4 |
| 5 | LOG-01~03 | 3 |
| 6 | SEC-01~02, ERR-01~03 | 5 |

**Total: 29 requirements, 100% covered**

---
*Last updated: 2026-03-26*