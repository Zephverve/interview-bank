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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

这是蚂蚁一面面经的原题，考察的是「路由设计的工程思维」而非单纯 API 调用。路由本质是状态机：定义 AgentState 包含 intent（意图）、docs（检索结果）、answer（最终回答）等字段；intent_node 用 LLM 或分类模型识别用户问题类型，写入 state.intent；add_conditional_edges 按 intent 值路由到不同下游——vector_retrieve（向量检索）、graph_retrieve（GraphRAG 检索）、direct_llm（直接回答）、tool_call（工具调用）等。

为什么用 LangGraph 而不是 if-else 链？三个原因：第一，科研/专业场景需要「检索→评判→不够好改写 query 再检索」的环，if-else 嵌套 try-except 难维护；第二，图编排让每条分支可独立单测——mock state 测 intent_node 输出、测条件边走向，bad case 能定位到哪个 node 而非「不知道哪段 if 出了问题」；第三，checkpoint 让路由决策可追溯——用户投诉「为什么没走 RAG」时可以 replay 看 intent_node 当时的输出。

GraphRAG 作为路由下游之一，适合专业领域关键词隐含关系强的场景（如科研问答、医疗知识），优点是关系推理比纯向量检索准，缺点是离线构图慢、更新成本高——和路由设计是配套的，不是替代关系。评估方面：路由准确率用离线黄金集测 intent 分类；端到端用证据溯源（回答是否有检索支撑）而非单纯 Recall@k。

设计习惯：route_key 字段命名清晰；条件边映射函数是纯函数（只读 state 返回节点名），便于单测；每个路由分支有独立的 fallback 策略。

