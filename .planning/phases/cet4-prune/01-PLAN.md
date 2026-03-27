---
phase: cet4-prune-phase-1
status: completed
created: 2026-03-28
completed: 2026-03-28
---

# Phase 1 完成：规则定义与保护名单

## 最终成果

### 保护名单
- **路径**: `data/protection-list-final.json`
- **总词数**: 1131
- **H1 (强保护)**: 743 (IELTS Foundation + AWL)
- **H2 (主题保护)**: 0 (Topic Pack 被 Foundation 覆盖)
- **SF (Review Floor)**: 388 (AWL-only)

### CET4 结构检查
- **路径**: `data/cet4-structure-report.json`
- **总候选**: 1597 词
- **High confidence delete**: 16 词
- **Medium confidence review**: 1581 词

### 删除理由码
- `named-entity`: 纯人名/地名
- `abbreviation-noise`: 缩写噪音
- `obvious-inflected-form`: 明显屈折形式
- `lexicalized-derived-form`: 已词汇化派生词
- `specialist-domain`: 专业领域词
- `low-ielts-transfer`: 低雅思迁移价值
- `missing-evidence`: 缺例句/IPA

## 验收清单

- [x] 删除标准文档已定义
- [x] 删除理由码已固定
- [x] 保护名单已生成
- [x] CET4 与保护名单重合统计已完成 (295/4500 = 6.6%)
- [x] 结构检查脚本已编写
- [x] 候选池已生成，分层闭合 (16 + 1581 + 0 = 1597)
- [x] Codex 评审通过

---

## 下一步: Phase 2

**目标**: 分批人工审核，生成最终删除清单

**批次建议**:
1. Batch 0: 16 个 high-confidence delete (快速确认)
2. Batch 1-8: 682 个 low-ielts-transfer
3. Batch 9-11: 342 个 lexicalized-derived-form
4. Batch 12-13: 151 个 specialist-domain
5. Batch 14+: 其他数据质量问题