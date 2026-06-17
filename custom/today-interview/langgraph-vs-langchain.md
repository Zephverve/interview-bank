---
title: LangGraph 和 LangChain 有什么区别
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, LangChain, 编排]
point: 框架选型
---

**题目**：LangGraph 和 LangChain 有什么区别？

**结论句（15 秒）**：LangChain 是组件库+链式调用；LangGraph 是有状态图编排，适合 Agent 循环、分支、人机协同。

**追问方向**：什么场景必须用 LangGraph？ · 和纯 ReAct while 循环比？

### 回答

"**LangChain** 早期是'把 LLM、Prompt、Retriever、Tool 串成 Chain'，偏**线性 DAG**；LCEL 后表达式组合更灵活，但复杂 Agent 循环、状态持久化仍别扭。

**LangGraph** 是**基于图的状态机**：
- **节点** = 函数（retrieve、generate、validate…）
- **边** = 固定或条件路由
- **State** = 跨节点共享、可 checkpoint、可 human-in-the-loop interrupt

**关键差异**：

| | LangChain Chain | LangGraph |
|--|----------------|-----------|
| 控制流 |  mostly 线性 | 循环、分支、并行 |
| 状态 | 隐式传参 | 显式 State schema |
| 持久化 | 需自己搞 | 内置 checkpoint |
| 适用 | 简单 RAG 一条链 | 多步 Agent、审批、Retry |

我科研问答里用 LangGraph：查询改写 → 检索 → 重排 → 生成 → **引用校验** → 不通过则回退改写，这种'带环'的流程 Chain 很难写清楚，Graph 一眼能看懂、好测。

**理解**：LangChain 是**零件**，LangGraph 是**产线控制**；可以只用 LangGraph + 少量 langchain_core 组件。"
