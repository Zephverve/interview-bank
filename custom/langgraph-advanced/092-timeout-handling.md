---
title: "超时处理（Timeout Handling）怎么做？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "超时"
source: GitHub 100 Questions
---

**题目**：超时处理（Timeout Handling）怎么做？

**结论句（15 秒）**：asyncio.wait_for 包节点调用；超时写 state 走 fallback；端到端 SLA 在 API 层 cancel task。

**追问方向**：cancel 后 checkpoint 状态？

### 回答

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：超时处理分两层——节点级用 asyncio.wait_for 限时，超时走 fallback；图级 API 设总 SLA，超时 cancel 任务。

**打个比方**：像外卖配送——每道工序有截止时间（节点级），整个订单有总时限（图级 SLA），超时不取消订单而是告知用户「还在做，可继续等或换简餐」。

#### 📖 面试展开（详细版）

超时处理是**用户体验的关键**，考察节点级和图级两层超时设计。

**Layer 1：节点级超时**
```python
async def llm_node(state):
    try:
        result = await asyncio.wait_for(
            llm.ainvoke(state["messages"]),
            timeout=30.0  # 单节点 30 秒
        )
        return {"messages": [result]}
    except asyncio.TimeoutError:
        return {"llm_timeout": True}
```
- 超时 → 写 `timeout_error` 进 state → 条件边走 fallback/degraded 路径
- 不同节点可设不同 timeout（LLM 30s，tool 10s，retrieve 5s）

**Layer 2：图级 SLA**
- API 层设总 SLA（如 60 秒）
- 超时 → cancel asyncio task
- checkpoint 保留最后完成的 step → 可 resume

**cancel 后 checkpoint 状态**：
- 被取消的 step **不会写入** checkpoint
- checkpoint 里是 cancel 前最后成功完成的 state
- resume 时从那个 state 继续，被取消的 step 重跑

**用户体验**：
- 不要返回裸 504 → 返回「处理超时，您可以选择继续等待或简化问题」
- 提供「继续等待」（resume）和「简化问题」（走 degraded 路径）两个选项

**监控**：超时率按节点统计，P99 延迟超 SLA 比例进 alert。

#### 💡 核心要点
- 节点级超时
- 图级 SLA watchdog
- 超时后 checkpoint 可恢复

#### 📝 代码/配置示例

```python
async def llm_node(state):
    try:
        result = await asyncio.wait_for(llm.ainvoke(state["messages"]), timeout=30)
        return {"messages": [result]}
    except asyncio.TimeoutError:
        return {"llm_timeout": True}

def route_after_llm(state):
    return "fallback" if state.get("llm_timeout") else "next"
```

#### 🔁 追问怎么接

- **「cancel 后 checkpoint 状态？」** → 被取消的 step 不写入 checkpoint；checkpoint 保留 cancel 前最后成功的 state；resume 从那个 state 继续，被取消的 step 重跑；不会丢数据也不会重复执行已完成的 step。
