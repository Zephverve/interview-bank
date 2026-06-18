---
title: LangGraph 和 LangChain 有什么区别
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, LangChain, 编排]
point: 框架选型
---

**题目**：LangGraph 和 LangChain 有什么区别？

**结论句（15 秒）**：LangChain 是组件库加链式拼接，适合一条线走到底的 RAG；LangGraph 是有状态图执行引擎，适合带循环、分支、人工审批点的 Agent 流程。

**追问方向**：什么场景必须用 LangGraph？ · 和纯 while 循环比优势在哪？ · LangGraph 的坑有哪些？

### 回答

"我两个都在项目里用过，体感差异特别明显。

**LangChain 本质上是一个「LLM 应用的乐高箱」。** 它给你 LCEL（LangChain Expression Language）用 `|` 管道把 retriever、prompt、LLM、output parser 串成一条链，代码写起来确实比裸调 API 干净很多。适合的需求是「上下文塞进去 → 答案吐出来」这种 DAG 型任务。

问题出在一旦你的流程不是一条直线——你要 loop、回退、分支、暂停等人审批——用 Chain 写就开始绕。要么在 Chain 外面套 while 循环，要么在 prompt 里靠 LLM 自己决定下一步，这两种方式测试和调试都痛苦。

**LangGraph 解决的就是「不是一条线」的流程。** 它把任务建模成有向图：每个 node 是一个步骤，edge 是转移条件（可以是 LLM 判断、规则、甚至函数返回值）。State 是显式的 schema，每一步都能 checkpoint 到外部存储，所以你可以随时暂停、恢复、回退。我的科研问答里有一个典型的 Graph 流程：Retrieve → Grade documents → 不够好就 Rewrite query 回到 Retrieve → 够了就 Generate → Citation check → 不通过就回到 Generate。这种带环的流程用 Chain 得写一堆 try-except 嵌套，用 Graph 画张图就讲清楚了，测试也可以按 node 独立测。

**什么时候必须用 LangGraph？** 我的判断不是「流程复杂就上」，而是看三个标志：
- 有没有**循环依赖**？Retrieve → Judge → Rewrite → Retrieve 这种。
- 要不要**持久化中间状态**？任务跑了 5 步用户关了，明天打开能继续而不是从头来过。
- 要不要**人机协同中断点**？某个关键步骤执行前挂起等人审批，人点了「继续」再往下走。

三个都没有——一个单 Agent 加 while ReAct 循环就够了，上 LangGraph 反而增加学习成本。但凡沾一个，LangGraph 的优势就很明显。

**和纯 while 循环比，LangGraph 好在三个工程维度：**
- **可恢复性**：while 循环崩了就没了，LangGraph 每一步有 checkpoint，崩溃后可以从最后一个完成的 node 重放。
- **可观测性**：node 之间显式传 state，debug 时直接看 state 快照，不用在 while 循环里打 log 猜走到哪了。
- **可测试性**：每个 node 是独立函数，mock 上游 state 直接测，不依赖整个链条跑通。

**LangGraph 的坑我也分享一下，别让面试官觉得你盲目吹：**
- State schema 设计一开始容易太粗或太细，重构成本高。建议从最小 schema 起步，边用边加字段。
- Node 粒度要平衡——太细了 overhead 大（每个 node 都是一次 LLM call），太粗了失去可见性。
- 条件路由的 prompt 容易不 stable，导致流程走错分支。要加 fallback 和超时兜底。

**我的实际用法是组合——** 编排用 LangGraph，底层组件用 langchain_core 的 retriever、message 类型、prompt template 这些，不绑死 `langchain` 全家桶。工具装饰器用 function calling 原生的，不额外套一层 LangChain tool abstraction。这样既享受了图编排的灵活性，又没被框架绑架。"
