# Requirements — VocabMan 技术债务清理

**Version:** v1.0
**Status:** Active

---

## v1 Requirements

### 测试基础设施 (TEST)

- [ ] **TEST-01**: Vitest 测试框架配置完成
- [ ] **TEST-02**: 核心工具函数有单元测试（spacedRepetition.js, vocabularyManager.js）
- [ ] **TEST-03**: composables 有测试（创建后）
- [ ] **TEST-04**: 测试脚本可在 CI 中运行

### 代码质量工具 (QUAL)

- [ ] **QUAL-01**: ESLint 配置完成，包含 Vue 规则
- [ ] **QUAL-02**: Prettier 配置完成
- [ ] **QUAL-03**: lint-staged 配置，提交前自动检查
- [ ] **QUAL-04**: 现有代码通过 lint 检查

### App.vue 重构 (REFA)

- [ ] **REFA-01**: 提取 useAppState composable（状态管理）
- [ ] **REFA-02**: 提取 useWordOperations composable（单词操作）
- [ ] **REFA-03**: 提取 useReviewSystem composable（复习逻辑）
- [ ] **REFA-04**: 提取 SettingsModal 组件
- [ ] **REFA-05**: App.vue 行数减少到 < 500 行
- [ ] **REFA-06**: 重构后功能与原有一致

### ContextPractice.vue 重构 (CONT)

- [ ] **CONT-01**: 提取 PathCoach 组件
- [ ] **CONT-02**: 提取 TrackSelector 组件
- [ ] **CONT-03**: ContextPractice.vue 行数减少到 < 800 行
- [ ] **CONT-04**: 重构后功能与原有一致

### Storage 统一管理 (STOR)

- [ ] **STOR-01**: 创建 storageKeys.js 统一管理所有 key
- [ ] **STOR-02**: 创建 storageService.js 抽象层
- [ ] **STOR-03**: 迁移所有散落的 localStorage 调用
- [ ] **STOR-04**: 添加版本前缀支持迁移

### 日志系统 (LOG)

- [ ] **LOG-01**: 创建 logger.js 环境感知日志
- [ ] **LOG-02**: 替换所有 console.log 为结构化日志
- [ ] **LOG-03**: 生产构建移除日志语句

### 安全加固 (SEC)

- [ ] **SEC-01**: 修复 v-html XSS 风险（使用 DOMPurify 或替代方案）
- [ ] **SEC-02**: 正则表达式特殊字符转义

### 错误处理 (ERR)

- [ ] **ERR-01**: 创建 ErrorBoundary 组件
- [ ] **ERR-02**: 在关键位置添加错误边界
- [ ] **ERR-03**: 解决 OnboardingQuiz.vue TODO

---

## v2 Requirements (Deferred)

- Tailwind 4 迁移
- Vite 8 升级
- 多 AI provider 支持

---

## Out of Scope

- 新功能开发
- UI/UX 改动
- 性能优化
- 国际化改进
- 文档补充

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| TEST-01 | Phase 1 | pending |
| TEST-02 | Phase 1 | pending |
| TEST-03 | Phase 1 | pending |
| TEST-04 | Phase 1 | pending |
| QUAL-01 | Phase 1 | pending |
| QUAL-02 | Phase 1 | pending |
| QUAL-03 | Phase 1 | pending |
| QUAL-04 | Phase 1 | pending |
| REFA-01 | Phase 2 | pending |
| REFA-02 | Phase 2 | pending |
| REFA-03 | Phase 2 | pending |
| REFA-04 | Phase 2 | pending |
| REFA-05 | Phase 2 | pending |
| REFA-06 | Phase 2 | pending |
| CONT-01 | Phase 3 | pending |
| CONT-02 | Phase 3 | pending |
| CONT-03 | Phase 3 | pending |
| CONT-04 | Phase 3 | pending |
| STOR-01 | Phase 4 | pending |
| STOR-02 | Phase 4 | pending |
| STOR-03 | Phase 4 | pending |
| STOR-04 | Phase 4 | pending |
| LOG-01 | Phase 5 | pending |
| LOG-02 | Phase 5 | pending |
| LOG-03 | Phase 5 | pending |
| SEC-01 | Phase 6 | pending |
| SEC-02 | Phase 6 | pending |
| ERR-01 | Phase 6 | pending |
| ERR-02 | Phase 6 | pending |
| ERR-03 | Phase 6 | pending |

---
*Last updated: 2026-03-26*