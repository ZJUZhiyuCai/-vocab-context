# State — VocabMan 词汇质量提升

**Project:** VocabMan 词汇质量提升
**Started:** 2026-03-27
**Mode:** Collaborative (Claude 设计 + Codex 执行)

---

## Current Position

**Phase:** 0 - 需求分析
**Status:** 讨论中
**Last Action:** 用户反馈非雅思词汇质量不如雅思词库

---

## Problem Statement

用户发现：**非雅思词汇（CET4/6、CEFR A2-C2）的质量比不过雅思词库的质量**

**背景：**
- 雅思词库（ielts-foundation, ielts-topic-*）经过精心设计，包含：
  - 语境例句
  - 词群关联
  - IELTS Band 标签
  - 高质量释义
- 非雅思词库（CET4/6、CEFR）可能缺少这些优质属性

---

## Current Vocabulary Status

### IELTS 词汇（高质量）
| 文件 | 状态 | 特点 |
|------|------|------|
| ielts-foundation.json | ✅ 743词 | 语境优先、高质量例句 |
| ielts-topic-*.json | ✅ 8个主题包 | 话题词群、76-124词/包 |
| ielts-core-500.json | ✅ 500词 | 核心词汇 |

### 非IELTS 词汇（质量待提升）
| 文件 | 状态 | 问题 |
|------|------|------|
| vocab-cet4*.json | ⚠️ 质量待评估 | 缺少语境例句？ |
| vocab-cet6*.json | ⚠️ 质量待评估 | 缺少语境例句？ |
| vocab-a2-basic.json | ⚠️ 质量待评估 | 缺少语境例句？ |
| vocab-b1-intermediate.json | ⚠️ 质量待评估 | 缺少语境例句？ |
| vocab-b2-upper-intermediate.json | ⚠️ 质量待评估 | 缺少语境例句？ |
| vocab-c1-advanced.json | ⚠️ 质量待评估 | 缺少语境例句？ |
| vocab-c2-proficiency.json | ⚠️ 质量待评估 | 缺少语境例句？ |

---

## Key Questions

1. 非雅思词汇的具体质量问题是什么？
   - 缺少语境例句？
   - 缺少词群关联？
   - 释义质量不够？
   - 缺少发音/IPA？

2. 用户想要什么样的优质词汇？
   - 类似雅思词库的语境例句？
   - 特定考试（四六级）的高频词？
   - 学术英语词汇？

3. 优先级如何排序？
   - 先处理哪些词库？
   - 目标词汇量是多少？

---

## Next Actions

- [ ] 与 Codex 讨论词汇质量问题
- [ ] 分析现有非雅思词库的数据结构
- [ ] 确定质量提升方案
- [ ] 更新 ROADMAP

---
*Last updated: 2026-03-27 20:00*