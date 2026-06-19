---
title: 5. MCP 是什么协议？解决什么问题？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 5. MCP 是什么协议？解决什么问题？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_interview.html

> 来源文章：Agent大厂面试题汇总：ReAct、Function Calling、MCP、RAG高频问题

---

**题目**：5. MCP 是什么协议？解决什么问题？

**结论句（15 秒）**：面试官会问：&quot;MCP 和 Function Call 有什么本质区别

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;MCP 和 Function Call 有什么本质区别？&quot;以及&quot;如果你要给团队接入 10 个外部工具，你会用 MCP 还是直接写 Function Call？为什么？&quot;

 

### MCP 解决的根本问题：N × M 爆炸

 没有 MCP 之前，每个 AI 应用要跟每个外部服务单独写一套集成代码。3 个应用 × 3 个工具 = 9 套代码，10 个应用 × 20 个工具 = 200 套代码，维护成本爆炸。

 MCP 把这个问题变成了 N + M：每个应用只需接入 MCP 协议，每个工具只需实现一个 MCP Server，总共 3 + 3 = 6 套代码。

 

 

### MCP 架构详解

 MCP 由三个角色组成：

 - MCP Host：你使用的 AI 应用（Claude Desktop / Cursor / 你自己的 Agent）
 - MCP Client：住在 Host 里，负责和 Server 通信的&quot;翻译官&quot;
 - MCP Server：对外暴露具体工具能力的服务端，每个第三方服务各自实现一个
 

### MCP 提供了哪些能力？

 MCP Server 可以暴露三类资源：

 类型 说明 Tools 可执行的操作（如：发消息、查数据、写文件） Resources 可读的数据源（如：文档、代码库、数据库） Prompts 预设提示词模板（如：代码审查模板） 

### MCP 的工具发现机制

 这是 MCP 最强大的特性之一：Agent 启动时，扫描配置的 MCP Server 列表，向每个 Server 发送 tools/list 请求，接收工具列表和描述，将所有工具注入 LLM 的上下文。运行时，用户说&quot;帮我在 GitHub 创建一个 Issue&quot;，LLM 发现有 github_create_issue 工具，通过 MCP Client 发送调用请求到 GitHub MCP Server，Server 调用 GitHub API 返回结果。

 这意味着 Agent 可以在运行时动态发现新能力，不需要重新部署代码。 今天加一个 Slack MCP Server，明天 Agent 就能用 Slack 的能力了。

 

### MCP 安全性设计

 三层安全机制：

 第一层——能力声明：Server 明确声明自己提供哪些工具，Agent 只能调用声明的工具，无法越权。

 第二层——授权控制：敏感操作可以要求人工确认，MCP Host 负责管理 Server 的授权范围。

 第三层——审计追踪：所有工具调用都有日志，可追溯每次 Agent 行为。

 

### MCP 底层协议

 面试可能会追问 MCP 基于什么协议实现的：

 - 本地通信：stdio（标准输入输出，最简单）
 - 远程通信：HTTP + SSE（Server-Sent Events，支持流式）
 - 消息格式：基于 JSON-RPC 2.0 规范