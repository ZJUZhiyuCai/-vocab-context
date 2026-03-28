---
phase: cet4-prune-phase-2
status: in_progress
created: 2026-03-28
---

# Phase 2：分批人工审核

## 目标

将 1597 个候选词通过人工审核收敛成最终删除清单。

## 审核原则

1. **保守原则**：不确定的词先进 `review`，不强制删除
2. **理由码必须**：每个删除决策必须有明确的理由码
3. **保护优先**：H1 保护词不删除（除非 wrong-sense）
4. **分批处理**：每批 150-200 词，完成后回调规则

## 审核批次

### Batch 0：High Confidence Delete (16词)

**目标**：快速确认，排除误判

| 类型 | 数量 | 样本 |
|------|------|------|
| named-entity | 5 | george, lucy, jane, michael, richard |
| abbreviation-noise | 8 | mm, dr, mrs, ms, ok, tmo, tv, ... |
| obvious-inflected-form | 3 | fled, dropped, cried |

**审核方式**：快速扫描，标记 `keep`/`delete`/`review`

### Batch 1-4：Low IELTS Transfer (682词)

**类型**：低频 + 不在保护名单 + 无主题关联

**审核方式**：
- 检查是否有遗漏的主题关联
- 检查例句质量
- 标记 `keep`/`review`/`delete`

### Batch 5-7：Lexicalized Derived Form (342词)

**类型**：已词汇化的派生形式

**审核方式**：
- 检查是否有独立词义
- 检查是否与基础词重复
- 标记 `keep`/`review`/`delete`

### Batch 8：Specialist Domain (151词)

**类型**：专业领域词

**审核方式**：
- 检查是否与雅思主题相关
- 标记 `keep`/`review`/`delete`

### Batch 9+：其他数据质量问题

**类型**：缺例句、缺 IPA 等

**审核方式**：
- 检查数据质量是否影响使用
- 标记 `keep`/`review`/`delete`

## 审核记录格式

```json
{
  "batchId": "batch-0",
  "reviewedAt": "2026-03-28",
  "words": [
    {
      "word": "george",
      "decision": "delete",
      "reasonCodes": ["named-entity"],
      "notes": "纯人名，无独立词义"
    }
  ]
}
```

## 退出条件

1. 所有候选词已审核
2. 最终删除数量接近目标区间（700-1150）
3. 抽样复核无明显系统性误删

---

## 当前进度

- [x] Batch 0：High Confidence Delete (16词) → 全部删除
- [x] Batch 1-4：Low IELTS Transfer (682词) → Codex 审核完成
- [x] 最终删除清单生成完成

**最终结果：删除 443 词**

| 类别 | 数量 |
|------|------|
| specialist-domain | 252 |
| low-ielts-transfer | 63 |
| archaic-slang | 32 |
| proper-noun | 26 |
| medical-term | 20 |
| military-term | 13 |
| abbreviation-noise | 13 |
| named-entity | 10 |
| religious-term | 10 |
| inflected-form | 4 |

**输出文件：**
- `data/final-delete-list.json` - 完整删除清单
- `data/final-delete-summary.json` - 类别统计

**状态：Phase 2 审核 完成，待进入 Phase 4 生成精简版词库**