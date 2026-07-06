---
title: "LangGraph state 如何与外部数据库集成？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "外部集成"
source: GitHub 100 Questions
---

**题目**：LangGraph state 如何与外部数据库集成？

**结论句（15 秒）**：state 存 ID，节点内按需查库；或用 checkpointer 存图状态、业务库存单据，两边用业务键关联。

**追问方向**：双写一致性？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- 引用不嵌套大对象
- 副作用在 tool 节点事务提交
- checkpoint 与业务库分离

**🗣️ 标准口语答案**

别把 DB 连接放 state。模式一：state 存 user_id、order_id，节点内查 PostgreSQL 取详情。模式二：图状态管编排进度，业务表管订单状态，用 order_id 关联。

副作用节点用 DB 事务，成功写 executed 标志进 state 再 commit。checkpoint 和业务库是两套存储，恢复时先查业务幂等再 resume 图。

