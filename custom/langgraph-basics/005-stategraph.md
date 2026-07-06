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

**📖 核心要点**
- StateGraph(AgentState) 初始化，State 是全部节点的输入输出 schema
- add_node / add_edge / add_conditional_edges 组装图
- compile(checkpointer=...) 固化图并注入持久化

**🗣️ 标准口语答案**

StateGraph 是 LangGraph 里定义图的核心类。你先用 TypedDict 或 Pydantic 定义 AgentState，告诉框架有哪些 channel、哪些字段用什么 reducer 合并。然后通过 add_node 注册计算单元，add_edge 和 add_conditional_edges 连边，set_entry_point 或 add_edge(START, ...) 定入口。

最后 compile 把图编译成可执行对象。编译会做结构检查，比如有没有孤立节点，同时在这里注入 checkpointer、interrupt 配置。编译后的 app 支持 invoke、stream、get_state 等 API。

和 MessageGraph 比，StateGraph 更通用——State 可以是任意 TypedDict；MessageGraph 是 messages 列表的特例，底层仍基于 StateGraph，只是帮你预置了 add_messages reducer。

