---
title: "LangGraph 怎么实现循环？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 控制流]
point: "循环"
source: CSDN 高频题
---

**题目**：LangGraph 怎么实现循环？

**结论句（15 秒）**：通过回边 add_edge("tool", "agent") 形成 ReAct 闭环，条件边 should_continue 决定是否继续或 END。

**追问方向**：和 while True 区别？ · 多出口循环怎么画？

### 回答

**优先级**：P0 · 3+ 篇

**📖 核心要点**
- tool_node 执行完回到 agent_node
- 条件边判断有无 tool_calls
- 业务完成标志 + recursion_limit 双保险

**🗣️ 标准口语答案**

循环靠回边实现。经典 ReAct：agent_node 调 LLM，条件边 should_continue 检查最后 message 有没有 tool_calls——有则去 tool_node，没有则 END。tool_node 执行完 add_edge 回到 agent_node，形成环。

这和外面套 while 的区别是：循环边界显式画在图上，每轮 state 可 checkpoint，任意轮可 interrupt。多出口循环可以条件边返回不同下一跳，比如重试回 tool、失败走 fallback、成功 END。

面试要能手写 should_continue 伪代码，并说明为什么需要 step_count 或 recursion_limit 防止无限转。

