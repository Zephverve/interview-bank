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

**🗣️ 标准口语答案**

checkpoint 本质上是图执行到某个 superstep 之后的状态快照，配合 checkpointer（MemorySaver、SQLite、Postgres 等后端）持久化。它解决的问题是：长任务中断后能恢复、支持 Human-in-the-loop 挂起等待、以及多用户 session 隔离。

使用时几个关键点：编译图时传入 checkpointer；调用时传 config 里的 thread_id 标识会话；interrupt 恢复时用 Command 或 stream(None) 继续执行。

防止膨胀是我会主动提的工程点。图里只放当前任务推进必需的东西：最近几轮对话、未完成的工具结果、路由标志位。跨会话的用户偏好、海量历史、可检索知识应该进外部存储，用时检索回填。工程上还可以做 TTL、里程碑裁剪（只保留最近 N 个 checkpoint）、敏感字段脱敏、多租户命名空间。

另外 thread_id 我建议和领域业务主键分开：前者给图编排用，后者放 state 字段里做幂等，避免把领域模型和框架状态糊在一个大 dict 里。

