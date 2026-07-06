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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

**问题**：Agent 任务可能跑几分钟到几小时（批量处理、多轮 ReAct、大文档分析），HTTP 长连接会超时，进程崩溃会丢失进度。

**分段 checkpoint**：图每经过一个节点自动 checkpoint，任意时刻崩溃都能从最后保存点恢复，不需要从头跑。

**异步架构**：API 层收到请求后，往 Celery/ARQ 队列丢任务，worker 里 ainvoke 执行图，HTTP 立即返回 task_id + thread_id。客户端用 task_id 轮询状态。

**进度推送**：app.get_state(config) 返回当前 state 和 next 节点，前端展示「正在检索」「正在生成」。更好的体验用 app.stream() 或 WebSocket 实时推送节点级事件。

**几天级任务**：checkpoint TTL 避免存储爆炸；state 压缩（消息 summarization）；考虑把重计算步骤拆成独立子图，每步完成释放资源。

**LangGraph 1.0 durable execution**：面向长任务的持久执行能力，节点失败自动从 checkpoint 重试，适合生产级长任务。

**踩坑**：HTTP 同步等待长任务超时；没 checkpoint 崩溃后从头跑；进度不推送用户以为卡死。

