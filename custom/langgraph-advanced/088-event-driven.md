---
title: "事件驱动 Agent（Event-Driven）怎么用 LangGraph？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "事件驱动"
source: GitHub 100 Questions
---

**题目**：事件驱动 Agent（Event-Driven）怎么用 LangGraph？

**结论句（15 秒）**：外部事件触发 invoke 带初始 state；图固定 enrich→decide→act→persist；每事件新 thread 或续 thread。

**追问方向**：和 cron 结合？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- 消息队列消费触发
- 图一次编译反复 invoke
- 事件 id 作幂等键

**🗣️ 标准口语答案**

事件驱动场景：Kafka 消息到达，worker invoke 图，初始 state 含 event_payload，固定拓扑 enrich→decide→act→emit。每事件 event_id 作 thread 或幂等键，防重复消费。

和 cron 结合：定时器触发 batch 子图处理积压。图编译一次，每事件一次 invoke，state 隔离。

