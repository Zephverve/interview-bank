---
title: Function Calling 也属于工具调用，请问什么场景下使用 Funct…
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [工具调用, MCP, 小林笔记]
point: Function Calling 也属于工具调用，请问什么场
source: 小林面试笔记
---

**题目**：Function Calling 也属于工具调用，请问什么场景下使用 Function Calling，什么场景下使用 MCP？

**结论句（15 秒）**：如果只是给单个应用接一两个工具、场景临时、不需要复用，Function Calling 就够了，简单直接，不需要引入额外的进程和配置

**追问方向**：结合项目经历举例 · 优缺点与适用场景

### 回答

如果只是给单个应用接一两个工具、场景临时、不需要复用，Function Calling 就够了，简单直接，不需要引入额外的进程和配置。

但只要工具需要跨项目或跨团队复用、或者数量多了管理麻烦、或者社区已经有现成的 MCP Server 可以直接配置，MCP 就值得上了。

判断的核心问题只有一个：这个工具会不会在这个应用之外被用到？会的话，把它封装成 MCP Server 是更长远的选择。

此外，做 Agent 系统的话更应该选 MCP，工具来源多、数量大，手写 Function Calling 的维护成本会让代码变得难以管理。
