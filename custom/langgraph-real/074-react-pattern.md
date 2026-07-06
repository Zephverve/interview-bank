---
title: "如何用 LangGraph 实现 ReAct 模式？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 面经]
point: "ReAct"
source: CSDN + GitHub
---

**题目**：如何用 LangGraph 实现 ReAct 模式？

**结论句（15 秒）**：agent 节点调 LLM → 条件边看 tool_calls → tool 节点执行 → 回边 agent，直到无 tool_calls 走 END。

**追问方向**：和 create_react_agent 区别？ · 为什么要手写图？

### 回答

**优先级**：P0 · 3+ 篇

**📖 核心要点**
- 经典三环
- 可插 grade/fallback 节点
- 手写图为精细控制

**🗣️ 标准口语答案**

ReAct 是 LangGraph 最经典环：agent_node LLM 带 tools 绑定；should_continue 有 tool_calls 去 tool_node，没有 END；tool_node 执行完 add_edge 回 agent_node。

手写图比 create_react_agent 好处是能插节点——tool 后加 sanitize、agent 前加 compress、失败走 fallback。LangChain 1.0 create_agent 底层仍是图，但面试讲手写证明你理解环怎么运转。

准备画三张图：state 字段、节点、条件边，30 秒画完 ReAct 环。

