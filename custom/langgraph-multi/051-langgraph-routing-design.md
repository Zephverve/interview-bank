---
title: "LangGraph 路由是如何设计的？为什么要用它？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 多Agent]
point: "路由设计"
source: 牛客 · 蚂蚁
---

**题目**：LangGraph 路由是如何设计的？为什么要用它？

**结论句（15 秒）**：本质是状态机：全局 state + intent 节点 + 条件边到 RAG/工具/直接回答；用图是为显式分支和可测试路由。

**追问方向**：GraphRAG 为什么用？ · 评估怎么做？

### 回答

**优先级**：P0 · 2 篇面经

**📖 核心要点**
- 意图识别写 route_key
- 条件边映射多下游
- 比 if-else 链可观测

**🗣️ 标准口语答案**

蚂蚁面经原题。我答：路由本质是状态机——定义 AgentState 含 intent、docs、answer；intent_node 分类用户问题；条件边按 intent 到 vector_retrieve、graph_retrieve 或 direct_llm。

为什么用 LangGraph：科研场景需要「检索→评判→不够好改写 query 再检索」的环，if-else 难维护；图编排让每条分支可单测，bad case 能定位到哪个 node。

追问 GraphRAG 时答：专业领域关键词隐含关系场景效果好，缺点是离线构图慢——和路由设计是配套的。

