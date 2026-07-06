---
title: "长时间运行任务怎么处理？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, HITL]
point: "长任务"
source: GitHub 100 Questions
---

**题目**：长时间运行任务怎么处理？

**结论句（15 秒）**：checkpoint 分段持久化 + 异步节点 + 后台 worker 轮询 thread 状态，避免 HTTP 长连接超时。

**追问方向**：任务跑几天怎么设计？ · 进度怎么给前端？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- 每 super-step checkpoint
- 异步 ainvoke + 任务队列
- stream 或 webhook 推进度

**🗣️ 标准口语答案**

长任务不能指望一次 HTTP 跑完。模式是：启动时 invoke 传 thread_id，图按节点 checkpoint；HTTP 立即返回 task_id；客户端轮询 get_state 或订阅 stream 看进度。

更重任务放 Celery/ARQ worker 里 ainvoke，每步 checkpoint 后释放 worker。失败从最后 checkpoint 续跑，不从头来。几天级任务还要考虑 checkpoint TTL 和状态压缩。

LangGraph 1.0 的 durable execution 就是面向这个场景。

