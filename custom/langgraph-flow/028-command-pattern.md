---
title: "Command 模式是什么？resume 怎么用？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 控制流]
point: "Command"
source: GitHub + LangGraph 1.0
---

**题目**：Command 模式是什么？resume 怎么用？

**结论句（15 秒）**：Command 用于 interrupt 后恢复执行，可携带人工输入或强制跳转节点，替代旧 breakpoint API。

**追问方向**：和 update_state 区别？ · 拒绝审批后走哪？

### 回答

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

**是什么**：Command 是 LangGraph 1.0 引入的执行控制原语，用于表达「从 interrupt 点如何继续」的意图。可以携带 resume 值（人工输入）、指定 goto 目标节点、或组合使用。

**为什么取代 breakpoint**：旧 breakpoint API 语义不够清晰，Command 把「恢复」「跳转」「更新」统一成一等公民，和 interrupt() 函数配合更自然。

**resume 怎么用**：图在 interrupt 点挂起后，checkpoint 已保存当前 state。应用层展示中间结果，用户操作后调用 app.stream(Command(resume=user_input), config) 或 astream 继续执行。resume 的值会传回 interrupt 调用处。

**和 update_state 区别**：update_state 只改 checkpoint 里的 state 快照，不表达执行意图；Command 同时表达「从哪继续、往哪走、带什么输入」。审批拒绝场景可以 Command(resume={"approved": False}) 让条件边路由到 apology 节点。

**项目例子**：生成 SQL 后 interrupt 让人审核，人改了 SQL 用 Command(resume=modified_sql) 继续；人拒绝用 Command(goto="apology") 直接跳转。

**踩坑**：resume 后 pending 边可能重跑节点，涉及副作用要幂等；混淆 Command 和 update_state 导致状态改了但执行流不对。

