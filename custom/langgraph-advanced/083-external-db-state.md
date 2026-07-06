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

**🗣️ 标准口语答案**

我先说结论，再展开原因。

外部数据库集成考察**图状态与业务数据的划界**，是系统设计高频题。

**原则：别把 DB 连接/大对象放 state**
- state 要序列化进 checkpoint，DB connection 不能序列化
- 大对象（完整用户 profile、1000 条历史）会让 checkpoint 膨胀

**模式一：state 存 ID，节点内按需查库**
```
state = {"user_id": "u123", "order_id": "o456"}
→ node 内: user = db.query(User, user_id)
```
- 适合：节点需要最新数据（用户余额可能变了）
- 注意：查询结果不写回 state（除非必要），避免 checkpoint 膨胀

**模式二：双存储，业务键关联**
- checkpointer 存图编排状态（current_step、messages、retry_count）
- 业务 DB 存业务数据（订单状态、支付记录）
- 用 `order_id` 关联：state 里有 order_id，业务表也有 order_id

**副作用节点的 DB 事务**：
1. 开始 DB 事务
2. 执行业务操作（扣款、发邮件）
3. 成功 → 写 `executed=True` 进 state → commit
4. 失败 → rollback → 写 error 进 state

**恢复时的幂等**：resume 图之前，先查业务 DB「这个 order_id 的操作是否已执行」，已执行则跳过副作用节点。

