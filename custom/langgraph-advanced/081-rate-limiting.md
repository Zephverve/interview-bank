---
title: "Agent 执行怎么做限流（Rate Limiting）？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "限流"
source: GitHub 100 Questions
---

**题目**：Agent 执行怎么做限流（Rate Limiting）？

**结论句（15 秒）**：入口 API 限流 + 节点内 token bucket 调 LLM 前等待 + 工具 429 写 state 退避重试。

**追问方向**：多租户公平调度？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- 网关层用户级限流
- LLM 调用前 acquire
- 指数退避写重试节点

**🗣️ 标准口语答案**

三层限流：API 网关按 user/tenant 限 QPS；图入口节点检查 quota_state，超限直接 fallback；LLM 节点内 token bucket，工具 429 捕获后写 retry_after 进 state，条件边到 backoff 节点 sleep 再重试。

多租户用 fair queue 或 tenant 级并发上限，避免一租户占满 worker。

