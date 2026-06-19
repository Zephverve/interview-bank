---
title: 8. A2A 协议是什么？和 MCP 的关系？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 8. A2A 协议是什么？和 MCP 的关系？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_interview.html

> 来源文章：Agent大厂面试题汇总：ReAct、Function Calling、MCP、RAG高频问题

---

**题目**：8. A2A 协议是什么？和 MCP 的关系？

**结论句（15 秒）**：面试官会问：&quot;MCP 和 A2A 都是协议，它们有什么区别

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;MCP 和 A2A 都是协议，它们有什么区别？为什么 MCP 解决不了 A2A 要解决的问题？&quot;

 

### 为什么需要 A2A？

 MCP 解决了 Agent ↔ 工具的连接，但没有解决 Agent ↔ Agent 的连接。

 Agent A 想请求 Agent B 帮忙完成一个子任务，面临的问题：不知道 Agent B 有什么能力、不知道怎么给 Agent B 发任务、不知道 Agent B 完成没有、Agent B 是 LangGraph 做的而我是 CrewAI 做的，怎么通信？

 这些问题 MCP 没有设计解决，因为 MCP 的设计目标是工具，不是 Agent。

 

 

### A2A 核心概念

 ① Agent Card（智能体名片）——每个 Agent 发布一个 JSON 描述文件，包含名称、能力描述、端点地址、认证方式等。其他 Agent 读取名片，决定要不要委托任务。

 ② Task（任务）——标准化的任务对象，有完整生命周期：CREATED → PROCESSING → COMPLETED / FAILED。

 ③ Message &amp; Artifact——过程中沟通用 Message，最终成果用 Artifact（可以是文档/代码/数据）。

 

### A2A 通信流程

 编排 Agent 收到&quot;写一份关于 AI Agent 技术的竞品分析报告&quot;的需求后：

 - 查询 Agent Registry，找到 Research Agent 和 Writer Agent
 - 读取各 Agent 的 Agent Card，了解能力
 - 通过 A2A 委托 Research Agent：Task{搜集主流 Agent 框架信息}，Research Agent 内部用 MCP 调工具完成，返回 Artifact（调研报告）
 - 通过 A2A 委托 Writer Agent：Task{基于调研报告写分析报告}，Writer Agent 生成最终报告
 

### MCP vs A2A：互补而非替代

 - MCP 解决纵向问题：Agent ↔ 工具（一个 Agent 连接多个外部服务）
 - A2A 解决横向问题：Agent ↔ Agent（多个 Agent 之间协作）
 两者互补，不互相替代。Agent 内部用 MCP 调工具，Agent 之间用 A2A 协作。

 

### A2A 生态现状（2026年）

 - MCP：已成事实标准，生态丰富
 - A2A：早期阶段，快速发展中，推动者 Google + 50+ 合作伙伴（Salesforce/SAP/Atlassian...）
 - 技术基础：HTTP + JSON + SSE，基于现有 Web 标准，无需新基础设施