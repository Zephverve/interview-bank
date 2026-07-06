---
title: "END 节点为什么重要？"
round: 一面
difficulty: ⭐
tags: [LangGraph, 基础]
point: "图终止"
source: GitHub 100 Questions
---

**题目**：END 节点为什么重要？

**结论句（15 秒）**：END 是显式终止符，条件边必须能路由到 END，否则图可能无限循环或无法判断完成。

**追问方向**：怎么判断 Agent 该结束了？ · 多个出口怎么设计？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- END 标记图执行终止，触发最终 state 返回
- 条件边应包含到 END 的路径
- 结合 recursion_limit 和业务完成标志双重保险

**🗣️ 标准口语答案**

END 是 LangGraph 的虚拟终止节点。条件边路由函数可以返回 END，表示任务完成、不再继续。显式终止很重要，因为 Agent 循环里「什么时候停」是核心问题——不能全靠 recursion_limit 硬砍。

我的做法是条件边同时看两个信号：LLM 是否不再请求工具（任务完成），以及 state 里的 step_count 或业务标志位。路由映射里一定要有到 END 的路径，否则图可能一直在环里转直到抛 GraphRecursionError，用户体验是 500 而不是优雅结束。

