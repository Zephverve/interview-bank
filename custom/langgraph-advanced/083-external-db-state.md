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

#### 🗣️ 先用大白话说

**一句话**：state 里存 ID 不存大对象，节点内按需查库；图状态管编排进度，业务库管业务数据，用业务键关联。

**打个比方**：state 像工作台的便签纸（只写订单号），详细信息去档案柜（数据库）查；便签纸轻方便携，档案柜存完整记录。

#### 📖 面试展开（详细版）

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

#### 💡 核心要点
- 引用不嵌套大对象
- 副作用在 tool 节点事务提交
- checkpoint 与业务库分离

#### 📝 代码/配置示例

```python
class AgentState(TypedDict):
    order_id: str
    user_id: str
    payment_executed: bool  # 幂等标志

async def payment_node(state):
    if state.get("payment_executed"):
        return {}  # 已执行，跳过（幂等）
    async with db.transaction():
        await charge(state["user_id"], state["order_id"])
    return {"payment_executed": True}
```

#### 🔁 追问怎么接

- **「双写一致性？」** → checkpoint 和业务库是两套存储，不追求强一致；用业务键关联 + 幂等标志（executed=True）；resume 前先查业务库确认副作用是否已发生，已发生则跳过。
