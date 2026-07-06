---
title: "LangGraph 是什么？为什么它适合做 Agent？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 基础]
point: "核心定位"
source: CSDN 高频题 + 牛客面经
sourceUrl: https://agent.csdn.net/6a2939e9662f9a54cb7c6edd.html
---

**题目**：LangGraph 是什么？为什么它适合做 Agent？

**结论句（15 秒）**：LangGraph 是 LangChain 生态里的图编排框架，把 Agent 工作流建模成有状态的状态机，原生支持循环、分支、持久化和人机协同，适合需要多步决策和纠错的复杂 Agent。

**追问方向**：和 LangChain 具体差在哪？ · 简单任务会不会过度设计？ · 执行模型是什么？

### 回答

**优先级**：P0 · 6+ 篇面经

**📖 核心要点**
- 本质是状态机引擎：State 共享、Node 转移、Edge 路由
- 相比 DAG Chain，原生支持 Cycles（ReAct 闭环、重试、审批挂起）
- 适合「思考→行动→观察→再思考」的多轮 Agent，不适合一次性问答

**🗣️ 标准口语答案**

LangGraph 是建立在 LangChain 核心之上的一款编排库，专门构建有状态、多参与者的循环计算图。底层可以看成状态机：全局 State 在各 Node 之间流转，Conditional Edge 决定下一步去哪。

它适合做 Agent，因为真实 Agent 任务很少是一次性推断。比如研究型 Agent 要走 ReAct：思考、调工具、看结果、再思考。传统 Chain 是 DAG，中间失败往往直接崩或幻觉；LangGraph 允许重试、换参数再调工具、危险操作前挂起等人确认。

我会强调它不是「更高级的 LangChain」，而是补上了 Chain 缺的循环、显式状态和生产级 checkpoint。简单 RAG 问答仍用 Chain 更合适；一旦流程有环、有审批、有跨请求恢复，LangGraph 的优势才明显。

