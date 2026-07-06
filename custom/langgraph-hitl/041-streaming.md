---
title: "LangGraph 流式输出怎么实现？"
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LangGraph, HITL]
point: "流式"
source: GitHub + 官方文档
---

**题目**：LangGraph 流式输出怎么实现？

**结论句（15 秒）**：graph.stream() 支持 values/updates/messages 等 mode，可 SSE 推节点级或 token 级事件给前端。

**追问方向**：多 thread 并发 stream？ · 和 LangChain callback 关系？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

用 app.stream(input, config, stream_mode=...) 可以流式拿到执行过程。stream_mode="updates" 看每节点 state 更新；"messages" 推 LLM token 级输出；"values" 看每步完整 state 适合调试。生产环境用 FastAPI 包 SSE 或 WebSocket 推给前端，让用户看到「正在检索」「正在生成」比干等体验好很多。

#### 📖 面试展开（详细版）

**是什么**：LangGraph 的 stream API 在执行图时逐步 yield 事件，而不是等全部跑完才返回。支持同步 stream() 和异步 astream()。

**stream_mode 选择**："updates"——每节点执行后的 state 增量更新，适合展示进度（「检索完成，正在生成」）。"messages"——LLM 的 token 级流式输出，适合打字机效果。"values"——每步完整 state，适合开发调试。"debug"——更详细的执行信息。

**生产实现**：FastAPI 用 StreamingResponse 包 SSE：async for event in graph.astream(...) yield f"data: {json.dumps(event)}\n\n"。前端 EventSource 或 WebSocket 接收。

**多 thread 并发**：每个 stream 绑定不同 thread_id 的 config，各自独立，互不干扰。注意 checkpointer 后端的并发读写性能。

**和 LangChain callback 关系**：LangGraph 的 messages 模式底层走 LangChain 的 streaming callback 机制；节点级 updates 是 LangGraph 独有的图级事件。

**踩坑**：stream 没处理异常导致前端一直等；混用多种 stream_mode 不清楚各自用途；生产没用 SSE 缓冲导致事件丢失。

#### 💡 核心要点
- stream_mode 选 values 看完整 state
- messages 模式推 token
- 生产用 WebSocket/SSE

#### 📝 代码/配置示例

```python
from fastapi.responses import StreamingResponse

async def stream_agent(query: str, thread_id: str):
    config = {"configurable": {"thread_id": thread_id}}
    async for event in app.astream(
        {"messages": [HumanMessage(query)]},
        config,
        stream_mode=["updates", "messages"],
    ):
        yield f"data: {json.dumps(event, default=str)}\n\n"

@app.get("/chat/stream")
async def chat_stream(q: str, thread_id: str):
    return StreamingResponse(stream_agent(q, thread_id), media_type="text/event-stream")
```

#### 🔁 追问怎么接

**「多 thread 并发 stream？」**——各 stream 独立 config/thread_id，checkpointer 后端注意并发性能。

**「和 LangChain callback 关系？」**——messages 模式走 LC callback；updates 是 LangGraph 图级事件。两者可组合。
