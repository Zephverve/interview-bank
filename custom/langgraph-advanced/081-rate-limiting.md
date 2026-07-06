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

#### 🗣️ 先用大白话说

**一句话**：限流分三层——API 网关限用户 QPS、图入口检查 quota、LLM 节点内 token bucket；429 错误走退避重试而不是硬怼。

**打个比方**：像高速公路收费站——入口限流（网关）、路段限速（节点内）、堵车了绕道（429 fallback），不能一辆车堵死整条路。

#### 📖 面试展开（详细版）

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

#### 💡 核心要点
- 网关层用户级限流
- LLM 调用前 acquire
- 指数退避写重试节点

#### 📝 代码/配置示例

```python
async def llm_node(state, config):
    await token_bucket.acquire()  # Layer 3
    try:
        return {"messages": [await llm.ainvoke(state["messages"])]}
    except RateLimitError as e:
        return {"retry_after": e.retry_after}

def route_after_llm(state):
    if "retry_after" in state:
        return "backoff"
    return "next_node"
```

#### 🔁 追问怎么接

- **「多租户公平调度？」** → fair queue 保证每 tenant 最小配额；tenant 级并发上限；监控每 tenant 的 QPS/token 消耗，异常 tenant 自动降级。
