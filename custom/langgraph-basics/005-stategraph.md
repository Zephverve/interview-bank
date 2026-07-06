---
title: "StateGraph 是什么？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 基础]
point: "核心 API"
source: GitHub Interview Questions
---

**题目**：StateGraph 是什么？

**结论句（15 秒）**：StateGraph 是 LangGraph 的图构建器，规定 State schema，注册 Node 和 Edge，compile 后变成可执行的 Runnable。

**追问方向**：compile 做什么检查？ · StateGraph 和 MessageGraph 区别？

### 回答

**优先级**：P0 · 4+ 篇

#### 🗣️ 先用大白话说

StateGraph 是 LangGraph 里「搭图」的核心类。你先用 TypedDict 定义 AgentState，告诉框架有哪些字段、哪些用 reducer 合并。然后 add_node 注册步骤，add_edge 连边，set_entry_point 定入口。最后 compile 把图变成可执行对象，会做结构检查并注入 checkpointer、interrupt 等配置。编译后的 app 支持 invoke、stream、get_state。

#### 📖 面试展开（详细版）

**① 是什么**

StateGraph 是 LangGraph 的图构建器（Builder），不是运行时本身。它接收 State schema，提供 add_node、add_edge、add_conditional_edges 等 API 组装图，compile 后产出 LangChain Runnable。

**② 为什么重要**

这是写 LangGraph 的第一步，面试常结合「State 怎么设计」一起考。理解 StateGraph 等于理解「声明式构图 + 编译执行」的两阶段模型。

**③ 怎么用 / 执行流程**

1. 定义 AgentState（TypedDict + Annotated reducer）
2. graph = StateGraph(AgentState)
3. graph.add_node("name", fn) 注册节点
4. graph.add_edge(START, "first") / add_conditional_edges 连边
5. app = graph.compile(checkpointer=...) 编译
6. app.invoke(initial_state, config={"configurable": {"thread_id": "..."}})

**④ 项目例子**

EvoAgent 里 StateGraph 注册 intent、rag、grade、rewrite、generate、citation_check 六个节点，条件边连接，compile 时注入 PostgresSaver 和 interrupt_before=["citation_check"]。

**⑤ 常见坑**

每请求 compile 一次（应启动时全局单例）；State schema 和节点返回字段不一致；忘记 set_entry_point 或 START 边。

#### 💡 核心要点
- StateGraph(AgentState) 初始化，State 是全部节点的输入输出 schema
- add_node / add_edge / add_conditional_edges 组装图
- compile(checkpointer=...) 固化图并注入持久化

#### 📝 代码/配置示例

```python
from langgraph.graph import StateGraph, START

graph = StateGraph(AgentState)
graph.add_node("retrieve", retrieve_node)
graph.add_edge(START, "retrieve")
graph.add_conditional_edges("retrieve", route_fn, path_map)
app = graph.compile(checkpointer=memory)
```

#### 🔁 追问怎么接

- 「compile 检查什么」：孤立节点、入口/出口可达性
- 「和 MessageGraph」：MessageGraph 是 messages-only 特例
- 「compile 后能否改图」：不能，改定义需重新 compile
