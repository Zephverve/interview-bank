---
title: "LangGraph 踩过什么坑？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 工程]
point: "踩坑"
source: 牛客 · 某大厂/阿里国际
---

**题目**：LangGraph 踩过什么坑？

**结论句（15 秒）**：高频坑：并发覆盖 state、没配 reducer、死循环、每请求 compile、checkpoint 膨胀、条件路由不稳定。

**追问方向**：怎么监控发现？ · 哪个坑印象最深？

### 回答

**优先级**：P0 · 4+ 篇面经

**📖 核心要点**
- 状态覆盖最常见
- recursion_limit 要配业务 fallback
- 生产禁止重复 compile

**🗣️ 标准口语答案**

牛客原题。我踩过：第一，并行节点覆盖同一 state 字段，后写吞前写，配 reducer 才解；第二，ReAct 无限重试，加 step_count 和重复 tool call 检测；第三，每 HTTP 请求 compile 图导致延迟高，改全局单例；第四，什么都塞 state 导致 checkpoint 巨大，划界外置记忆；第五，LLM 条件路由飘，加规则 fallback。

每个坑我会说怎么发现——stream 看 state、LangSmith trace、监控 P99 延迟。面试官要的是真实工程感，不是背概念。

