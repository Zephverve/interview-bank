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

#### 🗣️ 先用大白话说

牛客高频题，建议按三层答。Node 层用 try-catch 区分可重试/不可重试错误，可重试走回边。Tool 层设超时和 max_retries，有副作用的操作必须配幂等键。RAG 链层检索为空不走幻觉，而是走 query_rewrite 换关键词重检。全局加连续失败熔断，超阈值转人工，每层记录 attempt 次数进 trace。

#### 📖 面试展开（详细版）

**Node 层**：每个节点外包 try-catch，将错误分类。可重试错误（网络超时、429 限流、临时 5xx）通过条件边路由到 retry 节点或回上一节点；不可重试错误（参数非法、401 鉴权失败）直接走 fallback。节点内维护 retry_count 字段。

**Tool 层**：工具调用设超时（如 30s）和 max_retries（如 3 次），指数退避。失败结果写入 state（tool_error、last_tool_call），让 agent 节点读错误决定换参数还是放弃。涉及外部副作用（发邮件、扣款、下单）必须用 idempotency_key，重试不会 duplicate 操作。

**RAG 链层**：检索为空或 grade 分数低，不走 LLM 硬编答案，而是路由到 rewrite_query 节点改写查询后回到 retrieve，形成环。rewrite 次数有上限，超过走 fallback 坦诚告知。

**全局熔断**：state 维护 consecutive_failures 计数，超过 N 次转人工 interrupt 或 fallback。防止单 thread 无限消耗资源。

**监控**：每层记录 attempt 次数、错误类型、最终状态进 LangSmith/自研 trace。按节点统计失败率，指导优化。

**踩坑**：重试副作用操作导致重复扣款；不区分可重试/不可重试浪费配额；RAG 检索失败让 LLM 幻觉回答。

#### 💡 核心要点
- 可重试 vs 不可重试错误分类
- 外部副作用配幂等键
- 全局熔断：连续失败转人工

#### 📝 代码/配置示例

```python
def retrieve_node(state):
    try:
        docs = retriever.invoke(state["query"])
        if not docs:
            return {"retrieval_ok": False, "retry_count": state.get("retry_count", 0) + 1}
        return {"docs": docs, "retrieval_ok": True}
    except TimeoutError:
        return {"last_error": "timeout", "retry_count": state.get("retry_count", 0) + 1}

def route_after_retrieve(state):
    if state.get("retrieval_ok"):
        return "generate"
    if state.get("retry_count", 0) < 2:
        return "rewrite_query"
    return "fallback"
```

#### 🔁 追问怎么接

**「副作用怎么幂等？」**——工具层 idempotency_key = 业务主键；state 维护 executed_actions 列表；恢复前先查外部系统状态。

**「重试监控看什么？」**——每节点 attempt 分布、失败类型 TopN、retry 后成功率、熔断触发次数。
