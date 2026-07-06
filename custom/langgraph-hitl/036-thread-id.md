---
title: "thread_id 怎么设计？和业务主键什么关系？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, HITL]
point: "会话隔离"
source: 牛客 · 百度
---

**题目**：thread_id 怎么设计？和业务主键什么关系？

**结论句（15 秒）**：thread_id 是编排会话槽，用于 checkpoint 隔离；业务主键（订单号等）放 state 字段，恢复时用业务键做幂等。

**追问方向**：多租户怎么隔离？ · 一个用户多个 thread？

### 回答

**优先级**：P0 · 3+ 篇面经

#### 🗣️ 先用大白话说

thread_id 是 LangGraph 的「会话槽」，传在 invoke config 里，同一 thread_id 会加载历史 checkpoint 实现多轮延续。百度面经建议它和业务主键分开：thread_id 给框架编排用，订单号/任务 id 放 state 字段。恢复时用业务键检查外部副作用是否已执行。多租户可在 thread_id 加 tenant 前缀，一个用户也可以有多个 thread 对应不同任务。

#### 📖 面试展开（详细版）

**是什么**：thread_id 是 checkpointer 用来隔离不同会话的标识符，传在 config.configurable.thread_id 里。同一 thread_id 的多次 invoke 会加载/追加同一串 checkpoint。

**为什么和业务主键分开**：thread_id 是编排层的会话概念，可能因用户「新建对话」而变；业务主键（订单号、支付 id）是领域层的唯一标识，生命周期更长、语义不同。混在一起会导致恢复时无法正确判断外部副作用是否已执行。

**设计实践**：thread_id 格式如 "{tenant_id}:{user_id}:{session_uuid}"；业务主键放 state.order_id、state.task_id 等字段；副作用操作以业务主键做幂等键。

**多租户隔离**：thread_id 加 tenant 前缀；checkpointer 表按 tenant 分区或加索引；不同租户绝不共享 thread_id。

**一用户多 thread**：完全合理。用户可能同时有「写报告」和「查订单」两个独立任务，各用不同 thread_id，互不干扰。

**恢复时的双重检查**：编排层用 thread_id 加载 checkpoint 继续执行；领域层用业务主键查外部系统（「这笔订单是否已扣款」）决定副作用是否跳过。

**踩坑**：用订单号当 thread_id 导致会话无法「新建对话」；多租户 thread_id 碰撞；恢复只看 thread_id 不查业务状态导致重复副作用。

#### 💡 核心要点
- config.configurable.thread_id
- 编排 id ≠ 领域 id
- 恢复时业务幂等键独立管理

#### 📝 代码/配置示例

```python
config = {
    "configurable": {
        "thread_id": f"{tenant_id}:{user_id}:{session_uuid}",
    }
}

# state 里放业务主键
def start_node(state):
    return {
        "order_id": state.get("order_id") or generate_order_id(),
        "task_status": "started",
    }

# 恢复时双重检查
def execute_payment(state):
    if payment_already_done(state["order_id"]):
        return {"payment_status": "already_done"}
    return charge(state["order_id"])
```

#### 🔁 追问怎么接

**「多租户怎么隔离？」**——thread_id 加 tenant 前缀 + checkpointer 表分区 + 访问鉴权。绝不跨租户共享 thread。

**「一个用户多个 thread？」**——完全可以，每个独立任务一个 thread。举例「写报告」和「查订单」分开。
