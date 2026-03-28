# State — VocabMan CET4 词汇精简

**Project:** VocabMan CET4 词汇精简
**Started:** 2026-03-27
**Completed:** 2026-03-28
**Mode:** Collaborative (Claude 设计 + Codex 执行)

---

## Current Position

**Phase:** 4 - 生成精简版与验证 ✅
**Status:** 已完成
**Last Action:** 生成 vocab-cet4-basic-pruned.json 并推送

---

## Final Results

| 指标 | 值 |
|------|------|
| 原始词数 | 4500 |
| 删除词数 | 443 |
| 精简后词数 | 4057 |
| 删除比例 | 9.8% |

### 删除分布

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

---

## Completed Phases

### Phase 1: 规则定义与保护名单 ✅
- 生成保护名单 (1131 词: H1=743, H2=0, SF=388)
- 定义删除理由码 (10个)
- CET4 与保护名单重叠统计 (295词, 6.6%)
- Commit: `5122915`

### Phase 2: 自动筛选与候选池生成 ✅
- 生成候选池 (1597 词)
- Codex 独立审核
- 最终删除清单 (443 词)
- Commit: `f09a74d`

### Phase 4: 生成精简版 ✅
- 生成 vocab-cet4-basic-pruned.json (4057 词)
- 生成差异报告
- Commit: `143c111`

---

## Output Files

| 文件 | 说明 |
|------|------|
| `public/data/vocab-cet4-basic-pruned.json` | 精简版词库 |
| `data/protection-list-final.json` | 保护名单 |
| `data/final-delete-list.json` | 删除清单 |
| `data/cet4-structure-report.json` | 结构检查报告 |
| `data/prune-diff-report.json` | 差异报告 |

---

## Remaining Work

- [ ] 可选：继续审核剩余候选，扩展删除到 ~700 词
- [ ] 可选：前端集成精简版词库
- [ ] 可选：发布新版本

---

## Key Decisions

1. 采用"质量驱动"而非"固定删除数"策略
2. 保护 AWL + IELTS Foundation/Core/Topic 词汇
3. 删除专业术语、古词、缩写噪音、纯人名等
4. 保留高迁移价值边界词 (sincerity, premature 等)

---

*Last updated: 2026-03-28*