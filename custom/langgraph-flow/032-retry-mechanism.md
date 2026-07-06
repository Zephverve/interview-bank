---
title: "整体失败重试机制怎么设计（node、RAG 链、tools）？"
round: 一面/二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 控制流]
point: "重试分层"
source: 牛客 · 某大厂/阿里国际
---

**题目**：整体失败重试机制怎么设计（node、RAG 链、tools）？

**结论句（15 秒）**：分三层：node 内 try-catch + 回边；tool 层超时重试 + 幂等；RAG 层检索失败走 query rewrite 环。

**追问方向**：副作用怎么幂等？ · 重试监控看什么？

### 回答

**优先级**：P0 · 3+ 篇面经

**📖 核心要点**
- 可重试 vs 不可重试错误分类
- 外部副作用配幂等键
- 全局熔断：连续失败转人工

**🗣️ 标准口语答案**

牛客原题，我按三层答。Node 层：每个节点外包 try-catch，网络超时、限流等可重试错误走条件边回上一节点或专用 retry 节点；参数非法直接 fallback。

Tool 层：设超时和 max_retries，失败结果写入 state 让 agent 决定换参还是放弃；扣款、发邮件类副作用必须幂等键，重试不能 duplicate。

RAG 链层：检索为空或 grade 不通过，走 rewrite_query 节点回到 retrieve，而不是让 LLM 硬编。全局加连续失败计数，超阈值熔断转人工。每层记录 attempt 和最终状态进 trace。

