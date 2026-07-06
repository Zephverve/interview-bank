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

**🗣️ 标准口语答案**

循环在 LangGraph 里靠回边实现，防死循环要设好几道保险。

**是什么**：recursion_limit 限制图执行的最大 super-step 数。一个 super-step 可能包含一个或多个并行节点的执行。超过限制，框架抛出 GraphRecursionError 终止执行。

**为什么需要**：Agent 天然有循环，没有上限就像 while True 没有 break。这是框架级安全网，防止 bug 或模型异常导致无限消耗。

**怎么配置**：invoke/ainvoke 时传 config={"recursion_limit": 25}；也可以在 compile 时设默认值。建议按业务场景显式配置，不要依赖默认 1000。

**和 step_count 区别**：recursion_limit 是框架硬限制，触顶直接抛异常；step_count 是业务字段，在条件边里判断后路由到 fallback，用户体验更好。两者应配合使用。

**合理值怎么定**：简单问答 5-10 轮；标准 ReAct 10-15 轮；代码生成-运行-修复循环 15-20 轮。要结合 token 预算、单次 LLM 延迟和 P99 SLA 一起调，上线后根据监控数据迭代。

**踩坑**：只设 recursion_limit 不设 fallback，用户看到裸异常；设太小导致正常复杂任务被误杀；不同业务场景共用一个值，要么浪费要么不够。

