---
title: "thread_id 怎么设计？和业务主键什么关系？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, HITL]
point: "会话隔离"
source: 牛客 · 百度
---

**题目**：thread_id 怎么设计？和业务主键什么关系？

**结论句（15 秒）**：thread_id 是编排会话槽，用于 checkpoint 隔离；业务主键（订单号等）放 state 字段，恢复时用业务键做幂等。

**追问方向**：多租户怎么隔离？ · 一个用户多个 thread？

### 回答

**优先级**：P0 · 3+ 篇面经

**📖 核心要点**
- config.configurable.thread_id
- 编排 id ≠ 领域 id
- 恢复时业务幂等键独立管理

**🗣️ 标准口语答案**

thread_id 在 invoke config 里传：{"configurable": {"thread_id": "user-123-session-456"}}。同一 thread_id 的调用会加载历史 checkpoint，实现多轮延续。

百度面经建议分开：thread_id 给 LangGraph 编排用；订单号、任务 id 放 state 业务字段。恢复时用业务键检查外部副作用是否已执行，避免和框架状态糊在一起。

多租户可在 thread_id 加 tenant 前缀，checkpointer 表按 tenant 分区。一个用户可有多 thread 对应不同任务。

