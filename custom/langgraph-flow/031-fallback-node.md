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

**📖 核心要点**
- 触发：重试耗尽、检索为空、recursion 达阈值
- 输出结构化降级响应
- 记录原因进 state 供监控

**🗣️ 标准口语答案**

某大厂面经原题「fallback 怎么做」。fallback 是条件边的一个出口，触发条件包括：工具重试耗尽、检索质量门控不通过、step_count 超限、LLM 输出解析失败。

fallback 节点不继续折腾，而是返回用户可理解的响应——「暂时无法完成，建议简化问题」或「已转人工客服」，同时把 failure_reason 写入 state 供监控和 bad case 入库。

和 retry 边界：可重试错误先回环，不可重试或超过 N 次才 fallback。别让 fallback 变成万能垃圾桶，要分类统计触发原因。

