# VocabMan 技术债务清理报告

**日期:** 2026-03-26
**状态:** 进行中

---

## 执行摘要

本项目旨在系统性清理 VocabMan 代码库的技术债务，提升代码质量和可维护性。

---

## Phase 1: 测试与质量工具配置 ✅ 完成

### 完成项
| 项目 | 状态 | 详情 |
|------|------|------|
| Vitest 配置 | ✅ | happy-dom 环境，覆盖率报告 |
| 单元测试 | ✅ | 50 个测试全部通过 |
| ESLint 配置 | ✅ | Vue 3 推荐规则 |
| Prettier 配置 | ✅ | 统一代码风格 |
| lint-staged | ✅ | 提交前自动检查 |

### 文件变更
- `vitest.config.js` - 新建
- `eslint.config.js` - 新建
- `.prettierrc` - 新建
- `src/utils/__tests__/spacedRepetition.test.js` - 新建 (32 tests)
- `src/utils/__tests__/vocabularyManager.test.js` - 新建 (18 tests)

### 提交
```
45780ee feat(test): add Vitest testing framework and ESLint/Prettier
```

---

## Phase 2: App.vue 重构 🔄 进行中

**目标:** 1304行 → <500行

### 计划提取
- `useAppState.js` - 状态管理
- `useWordOperations.js` - 单词操作
- `useReviewSystem.js` - 复习逻辑
- `SettingsModal.vue` - 设置组件

---

## Phase 3: ContextPractice.vue 重构 ⏳ 待执行

**目标:** 1682行 → <800行

### 计划提取
- `PathCoach.vue` - IELTS 路径教练
- `TrackSelector.vue` - 轨道选择器

---

## Phase 4: Storage 统一管理 ⏳ 待执行

### 计划文件
- `storageKeys.js` - 统一 key 常量
- `storageService.js` - 抽象层

---

## Phase 5: 日志系统 ⏳ 待执行

### 计划文件
- `logger.js` - 环境感知日志
- Vite 插件移除生产日志

---

## Phase 6: 安全加固与错误处理 ⏳ 待执行

### 修复项
- v-html XSS 风险
- ErrorBoundary 组件
- TODO 解决

---

## 指标追踪

| 指标 | 开始 | 目标 | 当前 |
|------|------|------|------|
| 测试数量 | 0 | 50+ | 50 ✅ |
| App.vue 行数 | 1304 | <500 | - |
| ContextPractice.vue 行数 | 1682 | <800 | - |
| ESLint 错误 | - | 0 | - |
| 覆盖率 | 0% | >50% | - |

---

## Git 提交历史

```
45780ee feat(test): add Vitest testing framework and ESLint/Prettier
e331efc docs: initialize tech debt cleanup project
78a6c84 docs: add codebase analysis with tech debt inventory
```

---

## 验证命令

```bash
# 运行测试
npm test

# 代码检查
npm run lint

# 构建验证
npm run build
```

---

*报告最后更新: 进行中...*