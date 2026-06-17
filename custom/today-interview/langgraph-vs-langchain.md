---
title: LangGraph 和 LangChain 有什么区别
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, LangChain, 编排]
point: 框架选型
---

**题目**：LangGraph 和 LangChain 有什么区别？

**结论句（15 秒）**：LangChain 偏组件和链式拼接；LangGraph 是有状态图，适合带环路的 Agent 和多步审批。

**追问方向**：什么场景必须用 LangGraph？ · 和纯 while 循环比？

### 回答

"我两个都用过，体感上 **LangChain 更像零件库**，LCEL 把 retriever、prompt、LLM、tool 串起来，适合'一条线走到底'的 RAG；一旦你要**循环、回退、分支**，用 Chain 写就开始绕。

**LangGraph** 是有状态的图：每个节点是一个步骤，边可以是条件路由，状态 schema 显式定义，还能 checkpoint、interrupt 让人审批。我科研问答里检索不对就回退改写、生成完还要引用校验，不通过再重生成——这种**带环**的流程，用 Graph 一眼能看懂，测试也好拆。

打个比方：LangChain 像把工序排成流水线；LangGraph 像车间调度系统，哪步不合格可以退回上一工位。

是不是必须用 LangGraph？我的标准是：有没有**循环依赖**、要不要**持久化中间状态**、要不要**人机协同**。都没有的话，一个 while ReAct 循环加好工具也能跑。都有的话，我会选 LangGraph，维护成本更低。

现在我的习惯是 LangGraph 做编排，底层组件用 langchain_core 的 retriever、message 这些，不绑死全家桶。"
