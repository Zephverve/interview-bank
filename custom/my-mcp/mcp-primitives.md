---
title: MCP 的三种服务端原语是什么？分别由谁控制？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [mcp, 面试]
point: MCP 的三种服务端原语是什么？分别由谁控制？
---

**题目**：MCP 的三种服务端原语是什么？分别由谁控制？

### 回答

| 原语 | 含义 | **控制方** |
|---|---|---|
| **Tools** | 可执行函数（文件操作、API 调用、DB 查询） | **模型控制** —— 模型自主决定调不调 |
| **Resources** | 上下文数据源（文件内容、DB 记录） | **应用控制** —— 由 Host 决定怎么注入上下文 |
| **Prompts** | 可复用交互模板（system prompt、few-shot） | **用户控制** —— 通常由用户显式触发（如斜杠命令） |

- 方法命名规律：发现用 `*/list`（`tools/list`、`resources/list`、`prompts/list`），读取用 `resources/read`，执行用 `tools/call`。**列表是动态的**，可以随时变化。
- **加分细节**：服务端还支持客户端侧能力，即 **Server 反向请求 Client**：
  - **Sampling**：Server 请求 Client 的 LLM 做补全，让 Server 保持模型无关（**注意：这一项在 2026-07-28 版规范中已废弃**，官方建议直接对接 LLM 供应商 API）。
  - **Roots**：Server 查询 Client 允许它操作的 URI / 文件系统边界。
  - **Elicitation**：Server 请求用户补充信息或确认操作。
