---
title: MCP 和 Agent Skill 的区别是什么？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [工具调用, MCP, 小林笔记]
point: MCP 和 Agent Skill 的区别是什么？
source: 小林面试笔记
---

**题目**：MCP 和 Agent Skill 的区别是什么？

**结论句（15 秒）**：MCP 和 Agent Skill 不是同类概念，不是竞争关系，而是互补的

**追问方向**：结合项目经历举例 · 优缺点与适用场景

### 回答

MCP 和 Agent Skill 不是同类概念，不是竞争关系，而是互补的。

MCP 解决的是「Agent 怎么获得外部能力」，它把数据库、API、文件系统这些外部工具标准化封装成服务，Agent 通过 MCP 就能查数据、调接口、读写文件。

Skill 解决的是「Agent 拿到这些能力之后，该按什么步骤、什么标准来完成任务」，它把完成某类工作的知识和流程打包成可复用的模块。

简单记：MCP 是给 Agent 配的电脑和软件，Skill 是给 Agent 发的操作手册和 SOP。在实际系统里，两者经常同时工作，Skill 定义流程，流程中调用 MCP 提供的工具。
