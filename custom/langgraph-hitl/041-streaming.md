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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

**是什么**：LangGraph 的 stream API 在执行图时逐步 yield 事件，而不是等全部跑完才返回。支持同步 stream() 和异步 astream()。

**stream_mode 选择**："updates"——每节点执行后的 state 增量更新，适合展示进度（「检索完成，正在生成」）。"messages"——LLM 的 token 级流式输出，适合打字机效果。"values"——每步完整 state，适合开发调试。"debug"——更详细的执行信息。

**生产实现**：FastAPI 用 StreamingResponse 包 SSE：async for event in graph.astream(...) yield f"data: {json.dumps(event)}\n\n"。前端 EventSource 或 WebSocket 接收。

**多 thread 并发**：每个 stream 绑定不同 thread_id 的 config，各自独立，互不干扰。注意 checkpointer 后端的并发读写性能。

**和 LangChain callback 关系**：LangGraph 的 messages 模式底层走 LangChain 的 streaming callback 机制；节点级 updates 是 LangGraph 独有的图级事件。

**踩坑**：stream 没处理异常导致前端一直等；混用多种 stream_mode 不清楚各自用途；生产没用 SSE 缓冲导致事件丢失。

