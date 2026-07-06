---
title: "fallback 节点怎么设计和实现？"
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 控制流]
point: "降级"
source: 牛客 · 某大厂
---

**题目**：fallback 节点怎么设计和实现？

**结论句（15 秒）**：条件边在失败/超限/低置信时路由到 fallback，返回友好提示或转人工，避免抛裸异常。

**追问方向**：fallback 和 retry 边界？ · 用户看到什么？

### 回答

**优先级**：P1 · 3+ 篇面经

#### 🗣️ 先用大白话说

fallback 不是 catch-all 异常处理，而是图里一个正经的「降级出口」节点。当重试耗尽、检索质量不达标、step_count 超限等条件满足时，条件边路由到 fallback，返回用户能看懂的话——「建议简化问题」或「已转人工」——同时把 failure_reason 写进 state 供监控。和 retry 的边界是：可重试的先回环，确认没救了才 fallback。

#### 📖 面试展开（详细版）

**是什么**：fallback 是图中的一个专用节点，负责在无法正常完成任务时返回降级响应，是条件边的一个出口而非全局异常捕获。

**触发条件**：工具重试耗尽、RAG 检索为空或 grade 不通过、step_count/recursion_limit 接近上限、LLM 输出解析失败、路由低置信度。

**输出设计**：返回结构化降级响应，包含 user_message（用户可见）、failure_reason（内部原因）、suggested_action（简化问题/转人工/稍后重试）。不要暴露技术栈错误信息。

**和 retry 边界**：可重试错误（网络超时、限流）先走回边或 retry 节点；不可重试错误（参数非法）或超过 max_retries 才走 fallback。分类统计各触发原因，别让 fallback 变成万能垃圾桶。

**监控**：failure_reason 写入 state 并上报 trace，回流 bad case 到评测集。按原因分桶统计，指导优化方向。

**踩坑**：fallback 消息太技术化吓用户；所有错误都走 fallback 导致 retry 形同虚设；没记录原因无法做归因分析。

#### 💡 核心要点
- 触发：重试耗尽、检索为空、recursion 达阈值
- 输出结构化降级响应
- 记录原因进 state 供监控

#### 📝 代码/配置示例

```python
def route_on_error(state):
    if state.get("retry_count", 0) < 3 and state.get("last_error") == "timeout":
        return "retry"
    return "fallback"

def fallback_node(state):
    reason = state.get("failure_reason", "unknown")
    messages = {
        "retrieval_empty": "未找到相关资料，建议换个问法或补充关键词。",
        "step_limit": "这个问题比较复杂，已为您转接人工客服。",
    }
    return {
        "messages": [AIMessage(messages.get(reason, "暂时无法完成，请稍后重试。"))],
        "status": "degraded",
    }
```

#### 🔁 追问怎么接

**「fallback 和 retry 边界？」**——可重试（超时/限流）先 retry；不可重试（参数非法）或次数耗尽才 fallback。给具体分类表。

**「用户看到什么？」**——友好中文提示 + 建议动作，绝不暴露 stack trace。举例两种场景的文案。
