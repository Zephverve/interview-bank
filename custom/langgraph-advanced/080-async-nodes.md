---
title: "异步节点（Async Nodes）有什么要注意的？"
round: 二面
difficulty: ⭐⭐
tags: [LangGraph, 进阶]
point: "异步"
source: GitHub 100 Questions
---

**题目**：异步节点（Async Nodes）有什么要注意的？

**结论句（15 秒）**：节点定义 async def，图用 ainvoke/astream；避免在 async 节点里调阻塞 IO。

**追问方向**：和线程池关系？

### 回答

**优先级**：P2 · 1 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

异步节点是 LangGraph **高并发场景的基础**，考察对 Python async 的理解。

**基本用法**：
- 节点定义 `async def node_fn(state, config)`
- compile 后图支持 `ainvoke` 和 `astream`
- 适合 IO 密集场景：并发调多个 LLM、并行 HTTP tool 调用

**关键注意事项**：
1. **async 节点 + ainvoke 配对**——定义 async 节点但用 sync invoke 也能跑，但发挥不出并发优势
2. **别在 async 节点里调阻塞 IO**——`requests.get`、`time.sleep` 会阻塞 event loop，拖慢所有并发请求
3. **正确做法**：HTTP 用 `httpx.AsyncClient`；阻塞库用 `asyncio.to_thread()`；sleep 用 `asyncio.sleep()`

**FastAPI 集成**：路由里 `await graph.ainvoke(...)` 不阻塞 worker 线程，一个 worker 可以同时处理多个请求的等待阶段。

**同步/异步混用**：LangGraph 支持 sync 和 async 节点混在同一图里，框架自动调度。但建议 IO 密集的全用 async，CPU 密集的可保持 sync。

**和线程池关系**：`asyncio.to_thread` 把阻塞调用放到线程池，不阻塞 event loop；适合必须用的同步库（如某些 DB driver）。

