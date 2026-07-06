---
title: "LangGraph / LangChain / LlamaIndex / CrewAI 选型决策…"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "框架决策树"
source: Agent 架构 15 问
---

**题目**：LangGraph / LangChain / LlamaIndex / CrewAI 选型决策树？

**结论句（15 秒）**：LlamaIndex 偏数据索引；LangChain 偏组件链；CrewAI 快速多角色；LangGraph 复杂可控流程；可组合使用。

**追问方向**：能说出 trade-off 吗？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- 数据-heavy 先 LlamaIndex
- 原型 CrewAI
- 生产复杂 Agent LangGraph

**🗣️ 标准口语答案**

决策树：主要是 RAG 数据接入和索引——LlamaIndex；简单线性 LLM 链——LangChain LCEL；快速多角色原型——CrewAI；要循环、checkpoint、HITL、细控制流——LangGraph。

Trade-off：CrewAI 快但控不住；LangGraph 稳但重；LlamaIndex 检索强但不包全流程。实际项目常 LlamaIndex 检索 + LangGraph 编排。面试说 trade-off 比背名字强。

