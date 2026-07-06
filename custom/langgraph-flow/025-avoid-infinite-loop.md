---
title: "LangGraph 怎么避免死循环？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 控制流]
point: "死循环"
source: CSDN + 牛客
---

**题目**：LangGraph 怎么避免死循环？

**结论句（15 秒）**：recursion_limit + state 内 step_count + 语义级查重（如重复 tool call）+ 平滑 fallback 而非抛 500。

**追问方向**：工具一直返回空怎么办？ · 人类如何介入终止？

### 回答

**优先级**：P0 · 3+ 篇

**📖 核心要点**
- 框架 recursion_limit 默认 1000，应调低
- state 维护 step_count 路由到 fallback
- 比对 last_tool_call 阻断重复撞墙

**🗣️ 标准口语答案**

防死循环我设三道防线。第一，recursion_limit 按业务调，比如 ReAct 最多 15 轮，超限抛 GraphRecursionError——但生产别让用户看 500，要在条件边里用 step_count 平滑路由到 fallback 节点。

第二，语义查重：维护 last_tool_call，如果 LLM 用一模一样参数再调失败工具，直接阻断转人工。第三，工具返回空或错误时，限制同一工具连续调用次数，超过走 query_rewrite 或 END。

CSDN 高频题强调：单纯依赖 recursion_limit 用户体验差；在 smart_router 里引到 human_fallback，用户看到的是「这个问题较难，正在转人工」。

