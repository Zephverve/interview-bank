---
title: MCP 由哪几部分组成？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [工具调用, MCP, 小林笔记]
point: MCP 由哪几部分组成？
source: 小林面试笔记
---

**题目**：MCP 由哪几部分组成？

**结论句（15 秒）**：MCP 由三层组成，可以从角色、能力、协议三个维度来理解

**追问方向**：结合项目经历举例 · 优缺点与适用场景

### 回答

MCP 由三层组成，可以从角色、能力、协议三个维度来理解。

角色层有三个：Host 是 AI 应用本身（比如 Claude Desktop），Client 是 Host 里负责和 Server 通信的模块，Server 是工具提供方实现的独立进程，一个 Host 可以同时连多个 Server。

能力层定义了 Server 能暴露三类东西：Tools 是有副作用的操作（比如创建文件、调 API），Resources 是只读数据（比如读取文档内容），Prompts 是预定义的提示词模板。

协议层是底层通信：消息格式统一用 JSON-RPC 2.0，传输方式支持 stdio（本地子进程通信）和 Streamable HTTP（远程 HTTP 连接）两种，早期的 HTTP+SSE 双端点方案在 2025 年 3 月的规范更新里被标记为 deprecated。

这三层合在一起，就是 MCP 的完整组成。
