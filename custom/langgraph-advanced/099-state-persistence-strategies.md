---
title: "State 持久化策略有哪些？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "持久化策略"
source: GitHub Premium Questions
---

**题目**：State 持久化策略有哪些？

**结论句（15 秒）**：Memory 开发；SQLite 单机；Postgres 生产；Redis 高速；按 checkpoint 频率和查询需求选。

**追问方向**：自定义 Redis checkpointer 要点？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- checkpointer 可插拔
- Postgres 支持查询 thread 列表
- TTL 策略各后端不同

**🗣️ 标准口语答案**

持久化策略分层：开发 MemorySaver 零配置；单机演示 SQLiteSaver；生产 PostgresSaver 支持并发和查询；要极速 Redis，注意序列化大小。

选型看 checkpoint 频率、保留多久、要不要 SQL 查询 thread 状态。v4 checkpointer keep_latest TTL 自动裁剪旧快照，生产要配。

