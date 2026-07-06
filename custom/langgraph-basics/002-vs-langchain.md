---
title: "LangChain 和 LangGraph 有什么区别？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 基础]
point: "框架对比"
source: 牛客 · 阿里淘天/某大厂
sourceUrl: https://www.nowcoder.com/feed/main/detail/edbf58731d884f8f9e094a9b2eda0cf9
---

**题目**：LangChain 和 LangGraph 有什么区别？

**结论句（15 秒）**：LangChain 是线性 DAG 流水线，适合固定步骤 RAG；LangGraph 是图状态机，支持循环、条件分支、显式 State 和 checkpoint，适合复杂 Agent。

**追问方向**：什么场景必须用 LangGraph？ · 和纯 while 循环比优势？ · 能否混用？

### 回答

**优先级**：P0 · 6+ 篇面经

**📖 核心要点**
- LangChain：无状态/外部管记忆，A→B→C 单向
- LangGraph：显式 State + reducer，可回边形成循环
- LangGraph 独有：interrupt、checkpointer、thread_id 会话隔离

**🗣️ 标准口语答案**

LangChain 核心是 Chain 和 LCEL，用管道把 retriever、prompt、LLM 串起来，适合标准化 RAG 和单次问答。它的控制流基本是静态的，一旦你要 loop、回退、等人审批，外面得套 while 或把逻辑塞进 prompt。

LangGraph 把流程建成有向图：Node 是步骤，Edge 是跳转，State 是显式 schema，每步可 checkpoint。我的科研问答就是典型 Graph：Retrieve → Grade → 不够就 Rewrite 回 Retrieve → Generate → Citation check，不通过再回 Generate。这种带环流程用 Chain 要写大量嵌套 try-except，用 Graph 一张图讲清楚，还能按 node 单测。

选型上：固定三四步用 Chain；有循环依赖、要持久化中间状态、要人机协同中断点，三个占一个就该上 LangGraph。工程上我常混用——编排用 LangGraph，底层组件用 langchain_core 的 message、retriever。

