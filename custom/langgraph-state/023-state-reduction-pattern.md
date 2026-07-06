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

**📖 核心要点**
- 每个 channel 可有独立 reducer
- 无 Annotated 时默认 last-write-wins
- 并行 super-step 结束后统一归约

**🗣️ 标准口语答案**

State Reduction 指框架把多个节点返回的 partial update 合并成新 state 的过程。每个 channel 可以绑定不同 reducer：messages 追加、计数器累加、dict 合并、标量覆盖。

理解这个模式才能解释并行执行：同一 super-step 里多个节点跑完，它们的输出按 reducer 归约一次，再进入下一 super-step。这和 Map-Reduce 思想类似——map 阶段并行产出，reduce 阶段合并。

默认 last-write-wins 只适合单写者字段，比如 current_step。任何可能被并行写的字段都必须显式 reducer。

