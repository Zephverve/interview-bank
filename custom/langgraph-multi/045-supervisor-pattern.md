---
title: "Supervisor 模式怎么实现？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 多Agent]
point: "Supervisor"
source: GitHub Premium Questions
---

**题目**：Supervisor 模式怎么实现？

**结论句（15 秒）**：中央 supervisor 节点用 LLM 选下一 worker，条件边路由，worker 完成后回 supervisor 形成星型拓扑。

**追问方向**：supervisor 本身会不会成为瓶颈？ · 死循环怎么防？

### 回答

**优先级**：P1 · 3+ 篇

**🗣️ 标准口语答案**

Supervisor 模式是最常见的：一个 supervisor 节点读 state，用 LLM 决定下一个干活的 worker（researcher/coder/writer），条件边路由到对应节点，worker 完成后回到 supervisor，直到任务完成。

复杂场景用子图（Subgraph）：每个子图是一个独立 StateGraph，编译后作为父图的一个节点，方便模块化维护。字节面经里还追问了：子 agent 是否共享工具——我的做法是可共享只读工具定义，但每个 agent 的 state 命名空间隔离，避免互相污染。

