---
title: MCP 是什么？解决什么问题？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [mcp, 面试]
point: MCP 是什么？解决什么问题？
---

**题目**：MCP 是什么？解决什么问题？

### 回答

- **出处与定位**：Anthropic 于 2024 年 11 月发布的开放标准（2025 年 12 月捐给 Linux Foundation 下的 Agentic AI Foundation）。设计明确借鉴了 **LSP（Language Server Protocol）** 的思路 —— 让编辑器和语言解耦。MCP 让 AI 应用和工具/数据源解耦。
- **核心问题：N×M 集成爆炸**。M 个 AI 应用 × N 个工具，原本要写 M×N 套定制连接器；MCP 降到 **M+N** —— 每个应用实现一次 client，每个工具实现一次 server。
- **一句话**："MCP 是 AI 领域的 USB-C" —— 这个类比面试时可以拿来用，直觉且准确。

**追问预判**：
- 「它和 LangChain 的 Tool 抽象有什么区别？」→ 层次不同。LangChain 的 Tool 是**库内的编程抽象**，只在你自己的进程里有效；MCP 是**跨进程、跨厂商的通信协议**，工具可以独立部署、独立升级、多应用共享。
