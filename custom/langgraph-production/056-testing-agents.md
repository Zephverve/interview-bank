---
title: "怎么测试 LangGraph Agent？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 工程]
point: "测试"
source: GitHub 100 Questions
---

**题目**：怎么测试 LangGraph Agent？

**结论句（15 秒）**：三层：节点单测 mock state；子图集成测；端到端黄金集 + mock LLM/tool 固定输出。

**追问方向**：怎么 mock 非确定性 LLM？ · CI 怎么跑？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- 节点函数纯函数化最好测
- mock tools 固定返回
- snapshot 测 state 演化

**🗣️ 标准口语答案**

测试策略分层。单元：每个 node 函数传 mock state，断言返回的 partial update。集成：compile 图但 mock LLM 和 tools 固定响应，测条件边走向是否符合预期。E2E：黄金问题集，记录 state 轨迹 snapshot 对比。

非确定性 LLM 用 recorded responses 或 contract test——只断言结构不断言原文。CI 跑单元+集成，E2E 夜间跑省成本。

