---
title: "如何处理并发节点写同一 state 字段？"
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 状态]
point: "并发冲突"
source: 阿里国际面经
---

**题目**：如何处理并发节点写同一 state 字段？

**结论句（15 秒）**：为字段配置 reducer 做合并写；或拆 channel 避免并行写同一 key；绝不做无保护的覆盖写。

**追问方向**：怎么发现覆盖问题？ · Send 并行后怎么 reduce？

### 回答

**优先级**：P0 · 4+ 篇面经

**📖 核心要点**
- 列表用 add / add_messages 追加
- 字典用自定义 merge
- 并行分支写不同 key 再汇总节点合并

**🗣️ 标准口语答案**

这是 LangGraph 最高频踩坑。两个并行节点写同一字段，默认后者覆盖前者。解法优先级：第一，给字段配 reducer，改成合并写；第二，重构图让并行分支写不同 key，在下游汇总节点一次性 merge；第三，如果业务允许，用 Send API fan-out 后由 reducer 聚合结果。

阿里国际面经的原话是「判断字段是否已被别的节点改过」——工程上更靠谱的是从设计上消灭并发写同一无 reducer 字段，而不是运行时检测。

发现这类问题靠 stream 观察每步 state 变化，或 LangSmith trace 看并行 super-step 的写入顺序。

