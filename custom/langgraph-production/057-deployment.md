---
title: "LangGraph 生产环境怎么部署？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 工程]
point: "部署"
source: GitHub + 工程实践
---

**题目**：LangGraph 生产环境怎么部署？

**结论句（15 秒）**：FastAPI 暴露 invoke/stream；图全局 compile 单例；Postgres checkpointer；worker 队列处理长任务。

**追问方向**：LangGraph Platform 了解吗？ · 多副本 state 怎么存？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：生产部署 = API 层无状态（多副本随便扩）+ checkpointer 有状态（Postgres 共享）+ 图启动时 compile 一次 + 长任务丢队列。

**打个比方**：餐厅前台（API）可以开很多个收银台，但订单记录（checkpoint）存在中央数据库里，哪个收银台都能查到同一桌的点菜历史。

#### 📖 面试展开（详细版）

LangGraph 生产部署的核心架构是「无状态 API + 有状态 checkpointer」，实现水平扩展。

应用层：FastAPI/Flask 暴露 REST 或 WebSocket 接口。应用启动时（lifespan/startup 事件）compile 图存 app.state.graph 全局单例，请求路径只 invoke/astream，绝不 compile。POST /chat 接收 user_message + thread_id，调用 app.astream(input, config) 流式返回；config 带 thread_id 实现会话隔离。

checkpointer 层：开发用 MemorySaver，生产用 PostgresSaver（或 Redis）。多个 API 副本共享同一个 Postgres checkpointer 实例——任何副本都能加载任意 thread_id 的历史 checkpoint，实现无会话粘滞的负载均衡。thread_id 由客户端或 API 层生成，与业务主键分离。

长任务处理：超过 30s 的 Agent 任务不应阻塞 HTTP 连接。模式：API 接收请求后立即返回 task_id，任务丢 Celery/RQ worker 异步执行，结果写 checkpointer；客户端轮询或 WebSocket 推送进度。worker 同样共享 Postgres checkpointer。

其他生产要点：secrets（API key）走环境变量，不进 state（checkpoint 会序列化 state）；stream 用 SSE 或 WebSocket；Guardrails 输入输出安全在部署层（API gateway）和图内节点双层配合；可选 LangGraph Platform 托管，自研方案是 Docker + K8s + 共享 PG + LangSmith trace。

#### 💡 核心要点
- 无状态 API + 有状态 checkpointer
- 水平扩展靠共享 Postgres
- stream 用 SSE/WebSocket

#### 📝 代码/配置示例

```python
# FastAPI 生产部署骨架
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app):
    app.state.graph = builder.compile(checkpointer=PostgresSaver(conn_string))
    yield

@app.post("/chat")
async def chat(req: ChatRequest):
    config = {"configurable": {"thread_id": req.thread_id}}
    async for event in app.state.graph.astream(
        {"messages": [HumanMessage(req.message)]}, config
    ):
        yield sse_event(event)
```

#### 🔁 追问怎么接

- **LangGraph Platform**：官方托管方案，自研是 Docker+K8s+共享 PG
- **多副本 state**：Postgres checkpointer 共享，API 无状态随便扩
- **加分项**：长任务异步队列、secrets 不进 state、Guardrails 双层配合
