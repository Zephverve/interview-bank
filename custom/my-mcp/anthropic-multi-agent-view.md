---
title: Anthropic 说"不要过早引入 Multi-Agent"，你怎么看？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [mcp, 面试]
point: Anthropic 说"不要过早引入 Multi-Agent
---

**题目**：Anthropic 说"不要过早引入 Multi-Agent"，你怎么看？

### 回答

面试官在测你是不是"技术堆砌型"候选人。

- **先复述核心观点**（Anthropic《Building effective agents》）：
  - **Workflow 和 Agent 的本质区别不是规模，是控制流归属**。Workflow = LLM 与工具走代码写死的路径；Agent = 模型自主决定下一步。
  - **核心建议：优先用能通过评估的最简方案**，往往就是一个带工具的 LLM 调用。
  - Agent 是用**灵活性换可预测性**，每个额外自主轮次都在增加延迟、Token 成本和**错误累积**风险。
  - **只有当"路径无法硬编码、但能用工具反馈验证进展"时才用 Agent**（典型如带测试的编码 Agent）。
  - 还有一条很反直觉但重要的：**优化工具（agent-computer interface）比优化提示词更重要**。
- **我的立场（必须表态，且要和你的项目自洽）**：
  - 我认同"能用简单方案就别上多 Agent"。我自己的 RAG 系统就是**单 Agent + 图编排**，只有在对比类问题才启用多跳分解 —— **不是所有请求都走重链路**。
  - EvoAgent 用了多 Agent，但不是因为"多 Agent 先进"，而是因为有具体理由：**主 Agent 上下文要保持干净**（繁重操作委托出去）、**验证需要信息隔离**（独立 SubAgent 才有对抗性）。如果没有这两个理由，我会写成单 Agent。
  - 一句话："**多 Agent 的成本是通信开销 + 幻觉放大 + 调试复杂度。如果这些代价换不来'上下文隔离'或'独立视角'这两个收益，就不该用。**"
