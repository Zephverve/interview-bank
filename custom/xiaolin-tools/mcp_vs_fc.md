---
title: MCP 和 Function Calling 有什么区别？有没有实际跑过 MCP…
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [工具调用, MCP, 小林笔记]
point: MCP 和 Function Calling 有什么区别？有
source: 小林面试笔记
---

**题目**：MCP 和 Function Calling 有什么区别？有没有实际跑过 MCP？

**结论句（15 秒）**：我理解这两者不是竞争关系，解决的不是同一层面的问题

**追问方向**：结合项目经历举例 · 优缺点与适用场景

### 回答

我理解这两者不是竞争关系，解决的不是同一层面的问题。

Function Calling 是「调用语言」，定义的是模型怎么表达「我要调哪个函数、参数是什么」；MCP 是「工具生态协议」，定义的是工具怎么标准化打包、注册和被 AI 客户端发现。

MCP 底层其实还是用 Function Calling 来触发工具调用，只是在它之上加了一套工具管理框架，让工具实现一次、到处复用。

打个比方：Function Calling 像 HTTP 请求格式，MCP 像 REST API 的设计规范加服务注册发现机制，两者是不同层次的东西。

关于实际跑过的经验，我用 Claude Desktop 配过文件系统和 GitHub 的 MCP Server，在配置文件里加几行就能用，Claude 会自动发现工具，完全不用写对接代码。
