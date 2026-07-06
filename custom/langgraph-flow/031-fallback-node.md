---
title: "fallback 节点怎么设计和实现？"
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 控制流]
point: "降级"
source: 牛客 · 某大厂
---

**题目**：fallback 节点怎么设计和实现？

**结论句（15 秒）**：条件边在失败/超限/低置信时路由到 fallback，返回友好提示或转人工，避免抛裸异常。

**追问方向**：fallback 和 retry 边界？ · 用户看到什么？

### 回答

**优先级**：P1 · 3+ 篇面经

**🗣️ 标准口语答案**

我一般会按分层来设计重试，而不是在一个 try-except 里兜一切。

**是什么**：fallback 是图中的一个专用节点，负责在无法正常完成任务时返回降级响应，是条件边的一个出口而非全局异常捕获。

**触发条件**：工具重试耗尽、RAG 检索为空或 grade 不通过、step_count/recursion_limit 接近上限、LLM 输出解析失败、路由低置信度。

**输出设计**：返回结构化降级响应，包含 user_message（用户可见）、failure_reason（内部原因）、suggested_action（简化问题/转人工/稍后重试）。不要暴露技术栈错误信息。

**和 retry 边界**：可重试错误（网络超时、限流）先走回边或 retry 节点；不可重试错误（参数非法）或超过 max_retries 才走 fallback。分类统计各触发原因，别让 fallback 变成万能垃圾桶。

**监控**：failure_reason 写入 state 并上报 trace，回流 bad case 到评测集。按原因分桶统计，指导优化方向。

**踩坑**：fallback 消息太技术化吓用户；所有错误都走 fallback 导致 retry 形同虚设；没记录原因无法做归因分析。

