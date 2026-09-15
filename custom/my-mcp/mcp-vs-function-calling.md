---
title: MCP 和 Function Calling 的本质区别？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [mcp, 面试]
point: MCP 和 Function Calling 的本质区别？
---

**题目**：MCP 和 Function Calling 的本质区别？

### 回答

很多人会答成"替代关系"，这是错的。

- **不是替代，是不同层次**。
  - **Function Calling 是模型/API 供应商层面的能力**：模型输出结构化 JSON 表达"我要调某个函数"。它解决的是 **"模型如何表达调用意图"**。
  - **MCP 是集成协议层面的标准**：规定工具**如何被描述、发现、调用、鉴权**的互操作规范。它解决的是 **"工具如何被复用接入"**。
- **两者是串联的**：MCP Server 暴露的 Tools，在 Client 侧最终**仍然以 Function Calling（或等价的结构化输出）形式喂给模型**。MCP 是"工具接入"的标准，Function Calling 是"工具调用表达"的机制。
- **类比**：Function Calling ≈ 函数签名；MCP ≈ 让所有厂商共用同一套"外设接口"。
- **没有 MCP 的痛**：每个应用要为每个工具手写 function schema，同一个工具在 5 个应用里要写 5 遍。
