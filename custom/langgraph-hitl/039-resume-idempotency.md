---
title: "中断恢复时如何保证幂等？外部副作用怎么处理？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, HITL]
point: "幂等"
source: 牛客 · 百度
---

**题目**：中断恢复时如何保证幂等？外部副作用怎么处理？

**结论句（15 秒）**：恢复前检查副作用是否已执行；工具层幂等键；区分已提交 state 和 pending 边；resume 可能重跑节点需防护。

**追问方向**：pending 边会不会重跑？ · thread 恢复和业务恢复区别？

### 回答

**优先级**：P0 · 2+ 篇面经

**📖 核心要点**
- 外部操作配 idempotency_key
- 记录 executed_actions 进 state
- resume 前查业务主键状态

**🗣️ 标准口语答案**

百度面经深挖题。interrupt 恢复时要交代：哪些 channel 已写入 checkpoint、哪些外部副作用已发生、pending 边 resume 时是否重跑节点。

工具调用涉及发邮件、下单、扣款，必须幂等键——用业务 id 做 dedup，恢复时先查是否已成功。state 里可维护 executed_actions 列表，副作用节点先查再执行。

thread_id 恢复是编排层；业务恢复是领域层——两者都要答才完整。

