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

#### 🗣️ 先用大白话说

checkpoint 是图执行到某一步之后的「状态快照」，checkpointer 是存这些快照的后端（内存、SQLite、Postgres 都行）。compile 时注入 checkpointer，invoke 时传 thread_id，框架自动存取。它的价值不只是断点续聊，更是崩溃恢复、HITL 挂起几天后 resume、以及开发时的时间旅行调试。百度面经强调：checkpoint 不是简单存档，是可重放的状态机快照。

#### 📖 面试展开（详细版）

**是什么**：checkpoint 是图执行完一个 super-step 后整个 state 的序列化快照，包含各 channel 的值和执行指针（pending 边等）。checkpointer 是持久化这些快照的存储后端。

**为什么不是简单存档**：普通存档只保存结果；checkpoint 保存的是状态机的完整上下文，恢复时可以精确继续执行、fork 新分支、或回滚到历史点。这是 LangGraph 做生产级 Agent 的核心能力。

**怎么用**：graph.compile(checkpointer=MemorySaver()) 编译时注入；invoke 时传 config={"configurable": {"thread_id": "xxx"}} 标识会话。开发用 MemorySaver，生产用 PostgresSaver 或 Redis 等持久化后端。

**核心场景**：跨请求多轮对话延续；进程崩溃后从最后 checkpoint 恢复；HITL interrupt 挂起数小时/数天后 resume；开发调试时 get_state_history 查看历史。

**防止膨胀**：图内 state 只放当前任务必需数据（最近几轮对话、路由标志位）；跨会话历史、海量检索结果走外置存储；设 TTL 和里程碑裁剪（只保留最近 N 个 checkpoint）。

**踩坑**：什么都往 state 里塞导致 checkpoint 体积膨胀；thread_id 和业务主键混用；恢复时不考虑 pending 边是否重跑。

#### 💡 核心要点
- checkpoint = 可重放的状态机快照
- compile 时注入 checkpointer
- 生产用 PostgresSaver

#### 📝 代码/配置示例

```python
from langgraph.checkpoint.memory import MemorySaver
from langgraph.checkpoint.postgres import PostgresSaver

# 开发
memory = MemorySaver()
app = graph.compile(checkpointer=memory)

# 生产
# saver = PostgresSaver.from_conn_string(DB_URL)
# app = graph.compile(checkpointer=saver)

config = {"configurable": {"thread_id": "user-123-session-1"}}
result = app.invoke({"messages": [HumanMessage("你好")]}, config)
```

#### 🔁 追问怎么接

**「和数据库事务关系？」**——checkpoint 是应用层状态快照，不是 DB 事务；但 checkpointer 后端可以用 Postgres，两者正交。副作用操作仍需业务层幂等。

**「自定义 checkpointer？」**——实现 BaseCheckpointSaver 接口，对接公司内部 KV/对象存储。强调序列化格式和 TTL 策略。
