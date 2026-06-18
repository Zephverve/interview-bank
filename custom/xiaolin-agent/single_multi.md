---
title: 说说 Single-Agent 和 Multi-Agent 的设计方案？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 小林笔记]
point: 说说 Single-Agent 和 Multi-Agent 
source: 小林面试笔记
---

**题目**：说说 Single-Agent 和 Multi-Agent 的设计方案？

**结论句（15 秒）**：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景

**追问方向**：结合项目经历举例 · 优缺点与适用场景

### 回答

Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景。

Multi-Agent 架构上主要有两种拓扑：中心化的 Orchestrator 模式，由一个主 Agent 统一调度各个 Worker；去中心化的 Peer-to-Peer 模式，Agent 之间直接通信。

我在工程里用中心化用得更多，因为好控制、好调试，出问题链路清晰。

这道题最容易犯的错误有三个，对应开头对话里踩的三个雷。

第一，选型标准不能只说「任务复杂就用 Multi-Agent」，要说出具体的三类场景：context 要撑爆了、需要不同专业分工、有子任务可以并行，不属于这三类就用 Single-Agent，盲目引入 Multi-Agent 只会增加系统复杂度，带不来对应收益。
