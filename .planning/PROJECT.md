---
generated: 2026-03-26
type: brownfield
---

# VocabMan 技术债务清理

## What This Is

**项目：** VocabMan - 面向雅思学习者的语境优先词汇学习应用
**目标：** 系统性清理技术债务，提升代码质量和可维护性

**技术栈：** Vue 3 + Vite + Tailwind CSS + Supabase + SiliconFlow AI

## Core Value

**代码质量是功能迭代的基石。** 清理技术债务后，后续开发将更安全、更快速。

## Context

### 当前状态
- 版本：1.7.0
- 24 个 Vue 组件，28 个工具文件
- 无测试覆盖
- 无代码质量工具
- 主要组件过于庞大（App.vue 1304行，ContextPractice.vue 1682行）

### 技术债务清单

#### HIGH 严重度
| 问题 | 影响 | 文件 |
|------|------|------|
| 无测试基础设施 | 重构风险高，回归问题无法检测 | 全部代码 |
| App.vue 过大 (1304行) | 难以维护、测试和理解 | src/App.vue |
| 无 ESLint/Prettier | 代码风格不一致 | 项目配置 |

#### MEDIUM 严重度
| 问题 | 影响 | 文件 |
|------|------|------|
| ContextPractice.vue 过大 (1682行) | 认知负担高 | src/components/context/ContextPractice.vue |
| localStorage key 散落各处 | 难以迁移和管理 | 多个文件 |
| 生产代码有 console.log | 控制台噪音 | 多个文件 |
| v-html 无消毒 | XSS 风险 | PremiumWordCard.vue |
| 依赖版本过时 | 缺少改进和修复 | package.json |

#### LOW 严重度
| 问题 | 影响 | 文件 |
|------|------|------|
| 未完成的 TODO | 功能不确定 | OnboardingQuiz.vue |
| 无错误边界 | 用户体验差 | App.vue |
| 硬编码配置 | 难以切换 | aiClient.js |

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 使用 Vitest | 与 Vite 生态一致，配置简单 | — Pending |
| 拆分 App.vue 为 composables | Vue 3 最佳实践，提高可测试性 | — Pending |
| 统一 storage key 管理 | 集中管理，支持迁移 | — Pending |

## Constraints

- 不改变现有功能行为
- 保持向后兼容（localStorage 数据格式）
- 优先处理 HIGH 严重度问题

## Out of Scope

- 新功能开发
- UI/UX 改动
- 性能优化（除非是重构的副作用）
- Tailwind 4 迁移（破坏性变更，风险高）

---
*Last updated: 2026-03-26 after initialization*