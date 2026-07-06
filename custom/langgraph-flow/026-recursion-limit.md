---
title: "recursion_limit 是什么？怎么配置？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 控制流]
point: "递归限制"
source: GitHub 100 Questions
---

**题目**：recursion_limit 是什么？怎么配置？

**结论句（15 秒）**：限制图 super-step 最大次数，超限抛 GraphRecursionError；可在 compile 或 invoke 时设置。

**追问方向**：和 step_count 区别？ · 合理值怎么定？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- 默认 1000，生产应显式调小
- invoke 时 config 可覆盖
- 应配合业务 fallback 而非硬砍

**🗣️ 标准口语答案**

recursion_limit 限制图执行的最大 super-step 数，防止 Agent 无限循环。默认很高（1000），实际 invoke 时建议显式传，比如 {"recursion_limit": 25}。

它和 state 里自维护的 step_count 互补：recursion_limit 是框架硬上限，step_count 是业务软路由，可以在到达上限前优雅 fallback。

定值看业务：简单问答 5-10 轮，代码修复循环 15-20 轮。要结合 token 预算和 P99 延迟一起调。

