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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

限流是**生产级 Agent 的必答题**，考察多层防御思维。

**三层限流架构**：

**Layer 1：API 网关**
- 按 user/tenant 限 QPS（如每用户 10 req/min）
- 超限直接返回 429，不进图
- 工具：Nginx limit_req、Kong rate limiting、自研 middleware

**Layer 2：图入口节点**
- 检查 `quota_state`（用户今日剩余额度）
- 超限走 fallback 节点（「今日额度已用完，请明天再试」）
- 适合按 token 计费的场景

**Layer 3：LLM/Tool 节点内**
- LLM 调用前 token bucket acquire（控制并发请求数）
- tool 返回 429 时：捕获 → 写 `retry_after` 进 state → 条件边到 backoff 节点 → sleep → 重试
- 指数退避：1s → 2s → 4s → 8s，最多 3 次

**多租户公平调度**：
- fair queue：多租户请求排队，每个 tenant 保证最小配额
- tenant 级并发上限：tenant A 最多 5 并发，tenant B 最多 3 并发
- 避免「一个大租户占满所有 worker」

**监控**：限流触发次数、429 比例、backoff 重试成功率——这些指标进 dashboard。

