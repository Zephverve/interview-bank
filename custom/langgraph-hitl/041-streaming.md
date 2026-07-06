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

**📖 核心要点**
- stream_mode 选 values 看完整 state
- messages 模式推 token
- 生产用 WebSocket/SSE

**🗣️ 标准口语答案**

用 app.stream(input, config, stream_mode="updates") 拿每节点 state 更新；stream_mode="messages" 推 LLM token；values 看每步完整 state，调试好用。

生产 FastAPI 包 SSE：async for event in graph.astream(...) yield。多 thread 靠不同 thread_id 隔离，各 stream 独立。

面试可提 node 级流式让用户看到「正在检索」「正在生成」，比干等最终答案体验好。

