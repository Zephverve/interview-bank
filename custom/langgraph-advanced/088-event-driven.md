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

#### 🗣️ 先用大白话说

**一句话**：事件驱动 = 外部事件（Kafka/Webhook）触发 invoke 图，每事件一个新 thread，event_id 做幂等键防重复。

**打个比方**：像外卖订单系统——每来一个订单（事件）触发一次处理流程（invoke 图），订单号（event_id）防重复下单。

#### 📖 面试展开（详细版）

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

#### 💡 核心要点
- 消息队列消费触发
- 图一次编译反复 invoke
- 事件 id 作幂等键

#### 📝 代码/配置示例

```python
# Worker 消费 Kafka 事件
async def handle_event(event):
    initial_state = {
        "event_id": event.id,
        "event_payload": event.data,
    }
    config = {"configurable": {"thread_id": event.id}}
    result = await graph.ainvoke(initial_state, config)

# 幂等：event_id 作 thread_id
# 重复消费 → checkpoint 已存在 → 跳过
```

#### 🔁 追问怎么接

- **「和 cron 结合？」** → 定时器触发 batch 子图：query 积压事件 → Send API fan-out 并行处理；适合非实时场景；cron 负责「什么时候跑」，图负责「怎么跑」。
