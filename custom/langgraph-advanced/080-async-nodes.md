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

**📖 核心要点**
- async 节点 + ainvoke 配对
- 阻塞调用用 asyncio.to_thread
- FastAPI 原生 async

**🗣️ 标准口语答案**

节点可以是 async def，compile 后图支持 ainvoke 和 astream，适合并发调多个 LLM 或 HTTP tool。别在 async 节点里直接 requests.get 阻塞，用 httpx async 或 asyncio.to_thread。

FastAPI 路由里 await graph.ainvoke 不堵 worker 线程。同步节点和异步节点可混用，框架会调度。

