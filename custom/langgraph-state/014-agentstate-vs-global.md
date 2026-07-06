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

**📖 核心要点**
- 贯穿 graph 的共享对象，节点返回 partial update
- 全局变量并发写不可预测，且无快照
- AgentState 可 checkpoint 恢复，支持条件恢复

**🗣️ 标准口语答案**

AgentState 是 LangGraph 里贯穿整个图的数据结构，每个节点读写它，但节点只返回更新片段，由框架按 reducer 合并。

不用全局变量原因很实在。第一，并发安全——节点可能并行执行，两个节点同时改全局变量，结果不可预测；State 的 reducer 定义了合并语义。第二，不可回溯——全局变量改完就丢了，State 每次更新可进 checkpoint，方便 debug 和重放。第三，无法恢复——图执行到一半挂了，全局变量状态没了，AgentState 可从序列化快照原样恢复。

这和「session」也不同：thread_id 是编排会话槽，业务主键如订单号应放 state 字段里，恢复时用业务键做幂等，别把领域模型和框架状态糊在一个大 dict。

