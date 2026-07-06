---
title: "Node、Edge、Conditional Edge 分别是什么？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 基础]
point: "图三要素"
source: CSDN + 官方文档
---

**题目**：Node、Edge、Conditional Edge 分别是什么？

**结论句（15 秒）**：Node 是处理 state 的函数；Edge 是固定跳转；Conditional Edge 用路由函数根据 state 动态选择下一节点。

**追问方向**：Node 能放什么逻辑？ · 条件边不稳定怎么办？

### 回答

**优先级**：P0 · 4+ 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

Node：(state) -> partial_update dict，不应直接 mutate state。Edge：固定跳转 add_edge("A", "B")。Conditional Edge：add_conditional_edges("A", route_fn, path_map)，route_fn 是纯函数，只读 state 返回 key。

三要素是构图的基本词汇，阿里淘天一面爱结合「状态流转」考。条件边是 ReAct Agent「继续调工具 vs 结束」的核心机制。

ReAct 典型：agent_node 调 LLM → 条件边看 response 有没有 tool_calls → 有则去 tools_node → 普通边回 agent_node → 循环直到条件边路由到 END。

科研 Agent 的 grade_node 后条件边：quality_score >= 0.7 → generate，否则 → rewrite。路由函数只读 retrieval_docs 和 score，便于单测。

节点内直接改 state 而非返回 update；条件边路由函数不稳定（LLM 输出飘）；路由 map 漏 key 导致 KeyError；节点里做不可重试的副作用（发邮件）无幂等。

