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

**🗣️ 标准口语答案**

我先说结论，再展开原因。

StateGraph 是 LangGraph 的图构建器（Builder），不是运行时本身。它接收 State schema，提供 add_node、add_edge、add_conditional_edges 等 API 组装图，compile 后产出 LangChain Runnable。

这是写 LangGraph 的第一步，面试常结合「State 怎么设计」一起考。理解 StateGraph 等于理解「声明式构图 + 编译执行」的两阶段模型。

1. 定义 AgentState（TypedDict + Annotated reducer）
2. graph = StateGraph(AgentState)
3. graph.add_node("name", fn) 注册节点
4. graph.add_edge(START, "first") / add_conditional_edges 连边
5. app = graph.compile(checkpointer=...) 编译
6. app.invoke(initial_state, config={"configurable": {"thread_id": "..."}})

EvoAgent 里 StateGraph 注册 intent、rag、grade、rewrite、generate、citation_check 六个节点，条件边连接，compile 时注入 PostgresSaver 和 interrupt_before=["citation_check"]。

每请求 compile 一次（应启动时全局单例）；State schema 和节点返回字段不一致；忘记 set_entry_point 或 START 边。

