---
title: "END 节点为什么重要？"
round: 一面
difficulty: ⭐
tags: [LangGraph, 基础]
point: "图终止"
source: GitHub 100 Questions
---

**题目**：END 节点为什么重要？

**结论句（15 秒）**：END 是显式终止符，条件边必须能路由到 END，否则图可能无限循环或无法判断完成。

**追问方向**：怎么判断 Agent 该结束了？ · 多个出口怎么设计？

### 回答

**优先级**：P2 · 1 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

END 是 LangGraph 内置的特殊节点，路由到 END 表示图执行终止，返回最终 state。从 START 到 END 是一条合法执行路径。

ReAct Agent 若无明确 END 路径，会在 agent↔tools 环里转直到 GraphRecursionError。用户体验差，且浪费 token 和 API 费用。

条件边 path_map 必须包含到 END 的映射，如 {"end": END, "tools": "tools"}。路由函数判断：无 tool_calls → "end"；或 step_count >= max → "end"；或业务标志 task_done → "end"。recursion_limit 作为最后防线。

科研 Agent 在 generate 后 citation_check 通过 → END；不通过且 retry_count < 3 → 回 generate；retry 耗尽 → fallback_node → END。

路由 map 无 END 路径；只靠 recursion_limit 不设业务终止条件；多个出口未区分「成功 END」和「失败 END」（应用不同 fallback 节点再 END）。

