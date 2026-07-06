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

**🗣️ 标准口语答案**

我会从 checkpoint 解决什么问题讲起。

State 持久化策略考察**生产选型的工程判断**。

**四种 checkpointer 对比**：

| Checkpointer | 场景 | 优势 | 劣势 |
|---|---|---|---|
| MemorySaver | 开发/测试 | 零配置、最快 | 进程重启丢失 |
| SQLiteSaver | 单机演示 | 持久化、轻量 | 不支持高并发 |
| PostgresSaver | 生产 | 并发、SQL 查询 thread | 需要 PG 实例 |
| Redis | 高速场景 | 极快读写 | 序列化大小限制、TTL 需自管 |

**选型三问**：
1. **checkpoint 频率**：每 step 都存 vs 里程碑存 → 高频用 Redis，低频用 Postgres
2. **保留多久**：7 天 vs 90 天 → 影响存储成本，需 TTL 策略
3. **要不要 SQL 查询**：「列出用户所有 thread」「查某 thread 最后状态」→ 必须 Postgres

**Postgres 生产配置**：
```python
from langgraph.checkpoint.postgres import PostgresSaver
checkpointer = PostgresSaver.from_conn_string("postgresql://...")
graph = builder.compile(checkpointer=checkpointer)
```

**TTL 策略**（v0.4+ keep_latest）：
- 自动裁剪旧 checkpoint，只保留最新 N 个
- 生产必须配 TTL，否则 checkpoint 表无限膨胀

**自定义 Redis checkpointer 要点**：
- 序列化：state 可能很大，考虑压缩（gzip）
- TTL：每个 checkpoint 设 expire
- 命名空间：thread_id 作 key prefix

