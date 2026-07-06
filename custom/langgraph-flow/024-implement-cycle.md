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

**🗣️ 标准口语答案**

循环靠回边实现：tool_node 执行完后 add_edge 回到 agent_node，形成 ReAct 闭环。条件边 should_continue 判断是继续调工具还是 END。

防死循环三道防线：recursion_limit 设置最大 superstep 数；条件边里加 iteration 计数器，超过阈值走 fallback；业务层限制工具调用次数和 token 预算。开发时用 stream_mode='values' 观察每步 state 变化，LangSmith 追踪完整轨迹。

