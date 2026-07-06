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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

LangGraph 是 LangChain 生态里的图编排框架，底层把 Agent 工作流建模成「有状态的状态机」：全局 State 在各 Node 之间流转，Edge 决定跳转方向，Conditional Edge 还能根据当前状态动态选路。它不是 LLM 本身，而是 Agent 的「运行时引擎」——负责循环、分支、持久化和人机协同。

真实 Agent 任务很少「一次推断就结束」。科研 RAG Agent 典型流程是：检索 → 评估相关性 → 不够就改写 query 再检索 → 生成答案 → 检查引用是否靠谱，任何一步失败都可能要回退重试。用普通 Chain 写这种带环流程，逻辑会散落在嵌套 try-except 里，难以测试和观测。LangGraph 把控制流显式化，每个节点可单独单测，整条链路可 trace。

典型用法：定义 AgentState（TypedDict）→ 用 StateGraph 注册节点和边 → compile 注入 checkpointer → invoke/stream 执行。每个 super-step 里，所有就绪节点并行跑，跑完通过 reducer 合并 state，再进入下一步。ReAct 闭环就是 agent 节点和 tool 节点之间加回边，条件边判断「继续调工具」还是 END。

在 EvoAgent 科研问答场景里，用户问「某论文的方法论缺陷是什么」，图可能是：intent_node 识别需要深度检索 → rag_node 拉取相关段落 → grade_node 评估检索质量 → 不合格走 rewrite_node 改 query 回 rag_node → generate_node 生成带引用的回答 → citation_check_node 校验引用，不通过回 generate_node。这种多轮纠错用 LangGraph 一张图讲清楚，还能在 citation_check 前 interrupt 等人确认敏感结论。

简单 RAG 问答（检索→生成→结束）硬上 LangGraph 是过度设计；每请求重复 compile 图会拖慢延迟；没配 reducer 的列表字段在并发节点下会被覆盖；没设 recursion_limit 的 ReAct 环可能死循环。

