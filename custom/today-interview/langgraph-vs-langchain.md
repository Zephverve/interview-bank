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

我两个都在项目里用过，体感差异很明显。

**LangChain 是 LLM 应用的乐高箱。** LCEL 用管道把 retriever、prompt、LLM、parser 串成链，适合「上下文塞进去→答案吐出来」的 DAG 任务。一旦要 loop、回退、分支、暂停等人审批，Chain 外面套 while 或靠 LLM 自己决定下一步，测试调试都痛苦。

**LangGraph 解决「不是一条线」的流程。** 任务建模成有向图，node 是步骤，edge 是转移条件，State 显式 schema，每步 checkpoint 可暂停恢复。科研问答典型流程：Retrieve → Grade → 不够好 Rewrite 回 Retrieve → Generate → Citation check → 不通过回 Generate。用 Chain 得嵌套 try-except，用 Graph 画张图就清楚，还能按 node 独立测。

**什么时候用 LangGraph？** 看三个标志：有没有循环依赖；要不要持久化中间状态（用户关了明天继续）；要不要人机协同中断点。三个都没有，单 Agent + while ReAct 够用。比纯 while 好在可恢复、可观测（看 state 快照）、可测试（mock 上游 state 测单个 node）。
