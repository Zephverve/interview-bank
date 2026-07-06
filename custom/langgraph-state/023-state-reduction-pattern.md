---
title: "State Reduction（状态归约）模式怎么理解？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 状态]
point: "归约模式"
source: GitHub Interview Questions
---

**题目**：State Reduction（状态归约）模式怎么理解？

**结论句（15 秒）**：多个节点 partial update 通过 reducer 归约为新 state；是 LangGraph 并行一致性的核心机制。

**追问方向**：和 Map-Reduce 关系？ · 默认覆盖行为何时够用？

### 回答

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

我先说结论，再展开原因。

State Reduction = 在一个 super-step 结束时，将该 step 内所有节点 partial update 按各 channel 的 reducer 合并，得到 S_{t+1}。是 BSP（Bulk Synchronous Parallel）模型的归约阶段。

理解 Reduction 才能解释并行执行的一致性保证，也是 Send API / Map-Reduce 模式的基础概念。

super-step 开始 → 就绪节点并行执行 → 各返回 partial update → 按 channel reducer 归约 → super-step 结束 → 下一 super-step。每个 channel 独立 reducer，互不影响。

map：Send API 向 10 篇 paper 各发 Send("analyze", {"paper_id": id})。reduce：analyze 节点返回 {"findings": [summary]}，findings channel 用 operator.add 归约成完整列表，再进 synthesize_node。

以为归约是全局一个函数（实际 per-channel）；忽略归约顺序对非交换 reducer 的影响；默认覆盖用于多写者字段。

