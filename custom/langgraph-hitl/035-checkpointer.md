---
title: "checkpoint / checkpointer 是什么？"
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LangGraph, HITL]
point: "持久化"
source: 百度/高德/GitHub
---

**题目**：checkpoint / checkpointer 是什么？

**结论句（15 秒）**：checkpointer 在每个 super-step 后持久化 state 快照；支持 Memory/SQLite/Postgres，配合 thread_id 实现会话恢复。

**追问方向**：和数据库事务关系？ · 自定义 checkpointer？

### 回答

**优先级**：P0 · 4+ 篇面经

**📖 核心要点**
- checkpoint = 可重放的状态机快照
- compile 时注入 checkpointer
- 生产用 PostgresSaver

**🗣️ 标准口语答案**

checkpoint 是图执行到某 super-step 后的 state 快照，checkpointer 是持久化后端。compile(checkpointer=...) 后，每次 invoke 传 thread_id，框架自动存取。

开发用 MemorySaver，生产用 PostgresSaver 或 Redis。价值：跨请求对话延续、崩溃恢复、HITL 挂起几天后 resume、时间旅行调试。

百度面经强调：checkpoint 不是简单存档，是可重放快照——恢复时要讲清哪些 channel 写入、pending 边是否重跑。

