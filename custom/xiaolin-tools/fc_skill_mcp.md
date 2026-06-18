---
title: Function Calling、Skill、MCP 这三个有什么区别？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [工具调用, MCP, 小林笔记]
point: Function Calling、Skill、MCP 这三个
source: 小林面试笔记
---

**题目**：Function Calling、Skill、MCP 这三个有什么区别？

**结论句（15 秒）**：这三个概念在不同层次工作，不是竞争关系

**追问方向**：结合项目经历举例 · 优缺点与适用场景

### 回答

这三个概念在不同层次工作，不是竞争关系。

Function Calling 是最底层的调用协议，解决的是「模型怎么调函数」，模型输出结构化 JSON 告诉程序该调哪个函数、传什么参数。

MCP 在 Function Calling 之上做工具标准化，解决的是「工具怎么暴露给模型」，把数据库、API 这些外部能力封装成标准化服务，一次实现到处复用。

Agent Skill 在最上层做知识和流程的封装，解决的是「拿到工具之后按什么流程完成任务」，把执行步骤、标准、脚本、模板打包成可复用模块。

简单记就是：Function Calling 是语言，MCP 是工具箱，Skill 是操作手册。
