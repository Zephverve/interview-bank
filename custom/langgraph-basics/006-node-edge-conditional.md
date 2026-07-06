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

**📖 核心要点**
- Node：同步/异步 Python 函数，返回 partial state dict
- 普通 Edge：A 执行完必定去 B
- Conditional Edge：path_function(state) 返回 key，映射到目标节点

**🗣️ 标准口语答案**

Node 是图里的工作单元，本质就是 Python 函数，接收当前 state，返回要合并的更新字典。可以是 LLM 调用、工具执行、规则判断，任何逻辑都行。注意节点不应直接 mutate state，只返回 update。

Edge 分两种。普通边 add_edge("A", "B") 表示 A 跑完一定去 B。条件边 add_conditional_edges("A", route_fn, {"tools": "tools", "end": END}) 表示 A 跑完后调用 route_fn 读 state，返回值查表决定下一跳。这是 Agent 动态决策的关键——比如看最后一条 message 有没有 tool_calls。

START 和 END 是虚拟节点，标记入口和终止。条件路由不稳定是常见坑，我会加 fallback 边和超时计数，避免 LLM 路由飘到错误分支。

