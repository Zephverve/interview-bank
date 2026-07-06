---
title: "事件驱动 Agent（Event-Driven）怎么用 LangGraph？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "事件驱动"
source: GitHub 100 Questions
---

**题目**：事件驱动 Agent（Event-Driven）怎么用 LangGraph？

**结论句（15 秒）**：外部事件触发 invoke 带初始 state；图固定 enrich→decide→act→persist；每事件新 thread 或续 thread。

**追问方向**：和 cron 结合？

### 回答

**优先级**：P2 · 1 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

事件驱动 Agent 考察**图编排与非交互式场景的结合**。

**架构模式**：
1. **事件源**：Kafka/RabbitMQ/Webhook/SQS
2. **Worker**：消费事件 → 构造初始 state → invoke 图
3. **图拓扑**（固定）：enrich（补充上下文）→ decide（LLM 决策）→ act（调 tool）→ persist（写结果）
4. **每事件一次 invoke**，state 隔离

**初始 state 设计**：
```python
initial_state = {
    "event_id": "evt_123",       # 幂等键
    "event_type": "order_created",
    "event_payload": {...},      # 原始事件数据
    "enriched_context": None,    # enrich 节点填充
}
```

**幂等设计**：
- `event_id` 作为 thread_id 或幂等键
- 重复消费同一 event_id → 查 checkpoint 发现已处理 → 跳过
- 或：业务 DB 记录 `processed_events` 表

**和 cron 结合**：
- 定时器（每 5 分钟）触发 batch 子图
- 批量处理积压事件：query 未处理事件 → Send API fan-out → 每个事件一个 worker
- 适合：非实时、允许延迟的场景

**关键原则**：图 compile 一次（应用启动时），每事件一次 invoke，不 per-event compile。

