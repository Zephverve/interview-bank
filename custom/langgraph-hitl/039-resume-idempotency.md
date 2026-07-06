---
title: "中断恢复时如何保证幂等？外部副作用怎么处理？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, HITL]
point: "幂等"
source: 牛客 · 百度
---

**题目**：中断恢复时如何保证幂等？外部副作用怎么处理？

**结论句（15 秒）**：恢复前检查副作用是否已执行；工具层幂等键；区分已提交 state 和 pending 边；resume 可能重跑节点需防护。

**追问方向**：pending 边会不会重跑？ · thread 恢复和业务恢复区别？

### 回答

**优先级**：P0 · 2+ 篇面经

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

**核心问题**：interrupt 恢复后，框架可能重跑 pending 边的节点。如果该节点有外部副作用（发邮件、扣款、写数据库），重跑就会导致重复执行。

**幂等三层防护**：第一，工具层 idempotency_key——用业务主键（order_id）做 dedup key，外部 API 保证同一 key 只执行一次。第二，state 层 executed_actions 列表——副作用节点执行前查列表，已存在则跳过。第三，恢复前查外部系统——resume 之前查「这笔订单是否已扣款」，已扣则跳过。

**pending 边是否重跑**：resume 时，被 interrupt 暂停的节点可能重新执行（取决于 interrupt 位置和 LangGraph 版本行为）。工程上假设「可能重跑」，所有副作用节点都做幂等防护。

**thread 恢复 vs 业务恢复**：thread_id 恢复是编排层——加载 checkpoint 继续图执行；业务恢复是领域层——用 order_id 等查外部系统判断副作用状态。两者正交，都要做。

**已提交 state vs pending 边**：checkpoint 里已提交的 channel 值不会丢；但 pending 边指向的节点 resume 时可能再跑。副作用节点应放在 interrupt 之后且做好幂等，或放在 interrupt 之前确保已审才执行。

**踩坑**：假设 resume 不会重跑节点导致重复扣款；只用 thread_id 不做业务层检查；executed_actions 没持久化到 checkpoint。

