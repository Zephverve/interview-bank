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

**📖 核心要点**
- 无状态 API + 有状态 checkpointer
- 水平扩展靠共享 Postgres
- stream 用 SSE/WebSocket

**🗣️ 标准口语答案**

部署模式：应用启动 compile 图存全局；FastAPI 路由 POST /chat 调 ainvoke 或 astream，config 带 thread_id；checkpointer 用 Postgres 多副本共享；长任务丢 Celery worker。

别把图编译进 serverless 冷启动——太慢。secrets 走环境变量不进 state。可选 LangGraph Platform 托管，自研就是 Docker + K8s + 共享 PG。

高德/编程导航面经强调 Guardrails 输入输出安全要部署层配合，不只是图内节点。

