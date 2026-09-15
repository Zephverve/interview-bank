---
title: A2A 协议是什么？和 MCP 什么关系？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [mcp, 面试]
point: A2A 协议是什么？和 MCP 什么关系？
---

**题目**：A2A 协议是什么？和 MCP 什么关系？

### 回答

- **A2A（Agent2Agent）**：Google 主导的开放 **Agent 之间通信**标准。核心概念：**Agent Card**（能力与端点发现）、**Task**（长任务）、**Message**、**Artifact**。基于 HTTP + JSON-RPC + SSE。
- **和 MCP 的关系（必答的对比点）**：
  - **MCP 解决 Agent ↔ 工具/数据**：工具通常无状态、功能预定义。
  - **A2A 解决 Agent ↔ Agent**：Agent 之间自主协商、多轮推理与委派，**不应该被当成工具来包装**。
- **整个 Agent 技术栈的分层**（这个框架性回答很加分）：
  ```
  模型（Models）        ← 推理内核
  Agent 框架（LangGraph / CrewAI / ADK） ← 构建 Agent 的工具箱
  MCP                   ← 连接数据与外部资源（Agent ↔ 工具）
  A2A                   ← Agent 之间的通信（Agent ↔ Agent）
  ```
- 一句话："**MCP 让 Agent 会用工具，A2A 让 Agent 会找人。**"
