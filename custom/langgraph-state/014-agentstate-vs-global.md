---
title: "AgentState 的作用是什么？为什么不用全局变量？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 状态]
point: "AgentState"
source: 牛客 · 某大厂/阿里国际
---

**题目**：AgentState 的作用是什么？为什么不用全局变量？

**结论句（15 秒）**：AgentState 是图级共享状态，支持 reducer 合并和 checkpoint 序列化；全局变量并发不安全、无历史、无法断点恢复。

**追问方向**：多线程部署怎么办？ · state 和 session 区别？

### 回答

**优先级**：P0 · 4+ 篇面经

**🗣️ 标准口语答案**

AgentState 是 LangGraph 里贯穿整个图执行的共享数据结构，通常用 TypedDict 或 Pydantic 定义，每个节点接收当前 state 并返回 partial update，框架通过 reducer 合并到全局状态里。

不用全局变量有三个原因。第一，并发安全——LangGraph 的节点可能并行执行，两个节点同时改同一个全局变量，结果不可预测，而 State 通过 reducer 明确定义了合并语义。第二，不可回溯——全局变量改完就改完了，没有历史，但 AgentState 每次更新都可以被 checkpoint 保存，方便调试和重放。第三，无法恢复——图执行到一半挂了，全局变量的状态已经丢失，但 AgentState 可以从 checkpoint 里原样恢复，这是生产级 Agent 的刚需。

实际设计时我会把 state 字段分三类：append-only 的（如 messages）、覆盖更新的（如 current_step）、以及路由后需要清空的临时字段。【替换点：列出你项目里的具体字段】

