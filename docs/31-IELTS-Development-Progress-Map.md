# IELTS Development Progress Map

## 1. 我们现在在哪里

当前项目已经明显超过“只有页面、没有学习闭环”的早期 MVP。

它已经具备：

- Foundation 与 Topic Packs 的正式数据层
- Context-first / Output Studio / Exam Drills 三条主练习流
- 弱项补救与继续修剩余词
- IELTS Path Coach
- Today / Quiz / Context 三层入口导流

但它还没有完全到“客户能持续学到真英语”的成熟状态。

当前更准确的位置是：

- `MVP+ / Alpha Learning System`
- 不是“功能缺失型 MVP”
- 而是“学习效果还需继续强化的可运行产品”

## 2. 可视化总览

```mermaid
flowchart LR
    A["Legacy Breadth"] --> B["Foundation"]
    B --> C["Topic Packs"]
    C --> D["Context-first"]
    D --> E["Output Studio"]
    E --> F["Exam Drills"]
    F --> G["Remediation Loop"]
    G --> H["Path Guidance"]
    H --> I["Teacher Layer"]
    I --> J["Learning OS"]

    classDef done fill:#0f766e,color:#ffffff,stroke:#0f766e,stroke-width:2px;
    classDef active fill:#ca8a04,color:#111827,stroke:#ca8a04,stroke-width:2px;
    classDef next fill:#2563eb,color:#ffffff,stroke:#2563eb,stroke-width:2px;
    classDef later fill:#475569,color:#ffffff,stroke:#475569,stroke-width:2px;

    class A,B,C,D,E,F,G,H done;
    class I active;
    class J next;
```

解读：

- `done`
  当前已经做出来、并且开始形成闭环
- `active`
  当前最值得继续打磨的层
- `next`
  下一阶段的产品目标

## 3. 模块进度条

| 模块 | 当前状态 | 体感进度 | 说明 |
| --- | --- | --- | --- |
| Foundation 数据层 | 已完成 | 90% | 词库重构、QA、正式文件已成型 |
| Topic Packs | 已完成 | 85% | 核心主题已覆盖，但仍可继续补强 |
| Context-first Session | 已完成 | 80% | 已有总结与补救，但老师感反馈还可继续打磨 |
| Output Studio | 已完成 | 78% | 已有质量反馈与重练闭环 |
| Exam Drills | 已完成 | 75% | 已有表面训练与补救闭环 |
| Remediation Loop | 已完成 | 72% | 三条主路径都已具备补救和过关条件 |
| Path Guidance | 已完成 | 68% | 已能按词库和 topic 给建议，但还不够“像真人老师” |
| Today / Quiz 导流 | 已完成 | 65% | 已接入推荐入口，但还可以更强地嵌入卡片流程 |
| Teacher Layer | 进行中 | 35% | 反馈语言与教学感仍偏“系统提示” |
| Learning OS | 下一阶段 | 20% | 尚未形成完整的首周学习脚手架与成长系统 |

## 4. 当前开发重点

当前最值得投时间的不是再加新的练习模式，而是把下面三件事做深：

### A. Teacher Layer

目标：

- 让反馈更像英语老师，而不是评分板
- 让用户知道“为什么错、怎么改、下次怎么说得更自然”

状态：

- `进行中`

### B. Progression Logic

目标：

- 不只是告诉用户“去某个页面”
- 而是明确“你现在在这一步，下一步该去哪，为什么”

状态：

- `已起步`

### C. Daily Learning OS

目标：

- 让 Today 不只是发卡
- 而是成为整套 IELTS 学习系统的总入口

状态：

- `刚接入导流，仍待深化`

## 5. 当前瓶颈

### 瓶颈 1：反馈还不够“教学化”

已经有：

- 质量评分
- 弱词补救
- 过关条件

还缺：

- 更自然的老师式反馈语言
- 更具体的改写示范
- 更像真实教学的“下一句怎么说”

### 瓶颈 2：路径已经会导流，但还不够强

已经有：

- Today / Quiz / Context 入口导流
- Path Coach
- Topic-aware recommendation

还缺：

- 更明确的“该切哪个 Topic Pack”
- 更强的卡片后手势导流
- 更清晰的首周学习脚手架

### 瓶颈 3：缺少“结果导向”的学习目标

已经有：

- 练习轮次
- 质量反馈
- 补救闭环

还缺：

- 首周成长目标
- 周度路径目标
- “已从识别进入输出”的阶段性标记

## 6. 下一步开发顺序

### P1

- Teacher-style feedback rewrite
- 让反馈更像老师批改，而不是系统面板

### P2

- Today 卡片级导流
- 用户完成某个词后，就知道下一步该去哪层练

### P3

- First-week IELTS learning scaffold
- 让新用户进入产品后，不需要自己判断路径

## 7. 一句话总结

当前项目已经不是“功能 MVP”，而是已经进入“学习效果强化期”。

最重要的开发方向不再是继续加模式，而是：

- 提升教学感
- 强化路径推进
- 让用户更稳定地学到可用英语
