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

#### 🗣️ 先用大白话说

AgentState 是 LangGraph 里贯穿整个图的数据结构，每个节点读写它，但节点只返回更新片段，由框架按 reducer 合并。不用全局变量有三个硬理由：并发安全（并行节点同时改全局变量结果不可预测）、不可回溯（全局变量改完就丢，State 可进 checkpoint）、无法恢复（执行到一半挂了，全局变量状态没了，AgentState 可从快照原样恢复）。thread_id 是编排会话槽，业务主键如订单号应放 state 字段里。

#### 📖 面试展开（详细版）

**① 是什么**

AgentState 是图级共享状态对象，通常 TypedDict 定义。节点接收完整 state，返回只含变更字段的 dict，框架通过 reducer 合并。每次合并后的 state 可被 checkpointer 序列化。

**② 为什么重要**

某大厂、阿里国际面经 P0 题，区分「写过 demo」和「理解生产需求」。答「用全局 dict 也行」会直接减分。

**③ 怎么用 / 执行流程**

定义 schema → 节点 return {"field": value} → reducer 合并 → 下一节点看到最新 state → checkpoint 可选持久化。多线程部署：每请求独立 thread_id，state 存在 checkpointer 里，不依赖进程内全局变量。

**④ 项目例子**

EvoAgent 用户追问时，同一 thread_id 从 checkpoint 恢复 messages 和 retrieval_docs，继续 generate。若用全局变量，多用户并发请求会互相覆盖，服务重启后状态全丢。

**⑤ 常见坑**

用模块级 global dict 存 state；thread_id 和业务主键混为一谈；state 里放不可序列化对象导致 checkpoint 失败。

#### 💡 核心要点
- 贯穿 graph 的共享对象，节点返回 partial update
- 全局变量并发写不可预测，且无快照
- AgentState 可 checkpoint 恢复，支持条件恢复

#### 📝 代码/配置示例

```python
# 节点只返回 partial update，不 mutate 全局变量
def rag_node(state: AgentState) -> dict:
    docs = retrieve(state["current_intent"])
    return {"retrieval_docs": docs}  # reducer 合并
```

#### 🔁 追问怎么接

- 「多线程部署」：每请求 thread_id 隔离，state 在 checkpointer 不在进程内存
- 「和 session 区别」：thread_id 给图编排用，业务 id 放 state 字段
- 「reducer 配置」：列表用 add_messages，标量默认覆盖
