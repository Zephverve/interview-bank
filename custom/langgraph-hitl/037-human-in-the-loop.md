---
title: "LangGraph 如何实现 Human-in-the-loop？"
round: 一面/二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, HITL]
point: "HITL"
source: CSDN + 百度 + GitHub
---

**题目**：LangGraph 如何实现 Human-in-the-loop？

**结论句（15 秒）**：checkpointer + interrupt_before/after 或 interrupt() 挂起，人工审批后 Command/stream(None) 恢复，可用 update_state 纠偏。

**追问方向**：审批拒绝怎么走？ · 外部副作用幂等？

### 回答

**优先级**：P0 · 3+ 篇面经

**🗣️ 标准口语答案**

Human-in-the-loop 在 LangGraph 里通过 interrupt 机制实现。编译图时可以设 interrupt_before 或 interrupt_after 指定在哪些节点暂停。执行到该节点时，框架把当前 state 存入 checkpoint 并挂起。前端展示中间结果，用户审批后，用 Command(resume=...) 或 stream(None, config) 恢复执行。

关键工程点：挂起时要交代清楚哪些副作用已发生、哪些还没发生；恢复时 pending 边是否重跑要有明确策略；需要审批的操作（发邮件、下单）必须配幂等键。我们【替换点：具体场景】就是在生成方案后 interrupt，等用户确认才继续执行。

