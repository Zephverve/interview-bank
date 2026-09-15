---
title: MCP 的架构是什么？Host / Client / Server 各是什么角色？
round: 一面/二面
difficulty: ⭐⭐
tags: [mcp, 面试]
point: MCP 的架构是什么？Host / Client / Ser
---

**题目**：MCP 的架构是什么？Host / Client / Server 各是什么角色？

### 回答

- **Host**：发起连接的 AI 应用（如 Claude Desktop、IDE、你的 Agent 运行时）。负责管理模型上下文、决定何时调用什么能力。
- **Client**：Host 内部的连接器。**关键点：每个 Server 对应一个 Client，一一对应、独立连接**。Host 连 3 个 Server 就实例化 3 个 Client。
- **Server**：提供上下文与能力的程序，可以本地（stdio）也可以远程（HTTP）运行。
- **协议分两层**：
  - **Data layer**：JSON-RPC 2.0，负责能力/版本发现 + 三种原语。
  - **Transport layer**：连接建立、消息帧化、授权。
