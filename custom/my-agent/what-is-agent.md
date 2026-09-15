---
title: 什么是 AI Agent？它和 Chatbot、Workflow 的本质区别是什么？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [agent, 面试]
point: 什么是 AI Agent？它和 Chatbot、Workfl
---

**题目**：什么是 AI Agent？它和 Chatbot、Workflow 的本质区别是什么？

### 回答

你是在用框架还是在理解范式。

- 本质区别在**控制流的归属**。Chatbot 是「一问一答」，控制流由用户驱动；Workflow 是「预先编排的有向图」，控制流由开发者写死；Agent 是「LLM 在循环中自主决定下一步」，控制流由模型在运行时决定。
- 三个要素缺一不可：**目标驱动的循环（Loop）+ 工具使用（Tool Use）+ 基于观察的反思（Reflection）**。
- 补一句工程判断：**能用 Workflow 解决的不要用 Agent**。确定性任务用 Agent 是拿成本和稳定性换灵活性，不划算。

**追问预判**：
- 「那 ReAct 是 Agent 吗？」→ 是，ReAct 是最小可用的 Agent 范式：Thought → Action → Observation 循环。
- 「你的 EvoAgent 里哪些是 Workflow，哪些是 Agent？」→ 四阶段 SOP 的**阶段切换是 Workflow**（确定性），**每个阶段内部怎么做是 Agent**（自主）。这个回答会直接加分，因为它证明你分得清。
