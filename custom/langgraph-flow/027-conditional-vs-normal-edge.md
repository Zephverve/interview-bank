---
title: "条件边和普通边的区别？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 控制流]
point: "边类型"
source: GitHub + CSDN
---

**题目**：条件边和普通边的区别？

**结论句（15 秒）**：普通边固定跳转；条件边每次执行路由函数，根据 state 动态选下一节点，是 Agent 决策核心。

**追问方向**：路由函数能调 LLM 吗？ · 多条件映射怎么写？

### 回答

**优先级**：P0 · 3+ 篇

**📖 核心要点**
- add_edge 确定性
- add_conditional_edges 动态
- 路由函数应纯、可单测

**🗣️ 标准口语答案**

普通边是确定性跳转，A 完一定去 B，适合固定流水线。条件边是动态路由，add_conditional_edges(source, path_fn, mapping) 里 path_fn 读 state 返回字符串 key，查 mapping 找下一节点。

Agent 的核心决策都在条件边——有没有 tool_calls、检索质量够不够、要不要人工审批。路由函数可以是规则，也可以内部调 LLM 做分类，但最好保持可单测，复杂逻辑拆成独立节点。

多个出口就在 mapping 里多几个 key，比如 "retry"、"fallback"、"end"。

