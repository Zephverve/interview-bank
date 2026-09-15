---
title: MCP 的传输方式有哪几种？
round: 一面/二面
difficulty: ⭐⭐
tags: [mcp, 面试]
point: MCP 的传输方式有哪几种？
---

**题目**：MCP 的传输方式有哪几种？

### 回答

| 维度 | stdio | Streamable HTTP |
|---|---|---|
| 机制 | 标准输入输出流 | HTTP POST（C→S）+ 可选 SSE 流式 |
| 场景 | 同机本地进程，零网络开销，**通常单 Client** | 远程，**支持多 Client** |
| 认证 | 依赖本地进程边界 | Bearer Token / API Key / 自定义 Header，**推荐 OAuth** |

- 底层统一是 **JSON-RPC 2.0**，消息含 `jsonrpc` / `id` / `method` / `params`；无需响应的场景用 **Notification**。**传输层对协议层透明**，同一套消息格式跨传输通用。
