---
title: "整体失败重试机制怎么设计（node、RAG 链、tools）？"
round: 一面/二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 控制流]
point: "重试分层"
source: 牛客 · 某大厂/阿里国际
---

**题目**：整体失败重试机制怎么设计（node、RAG 链、tools）？

**结论句（15 秒）**：分三层：node 内 try-catch + 回边；tool 层超时重试 + 幂等；RAG 链层检索失败走 query rewrite 环。

**追问方向**：副作用怎么幂等？ · 重试监控看什么？

### 回答

**优先级**：P0 · 3+ 篇面经

**🗣️ 标准口语答案**

我按三层设计重试。节点层：每个 node 外包 try-except，可重试错误（网络超时、限流）走回边重试，不可重试错误（参数非法）路由到 fallback。工具层：工具调用设超时和最大重试次数，失败结果写入 state 让 agent 节点决定换参数还是放弃。RAG 链层：检索为空时触发 query rewrite 节点，而不是直接让 LLM 幻觉回答。

全局还有 recursion_limit 防止图级死循环，以及熔断策略——连续失败 N 次转人工。监控上每个节点记录 attempt 次数和最终状态，方便排查哪个环节最容易失败。

