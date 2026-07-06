---
title: "LangGraph 如何实现 Human-in-the-loop？"
round: 一面/二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, HITL]
point: "HITL"
source: CSDN + 百度 + GitHub
---

**题目**：LangGraph 如何实现 Human-in-the-loop？

**结论句（15 秒）**：checkpointer + interrupt_before/after 或 interrupt() 挂起，人工审批后 Command/stream(None) 恢复，可用 update_state 纠偏。

**追问方向**：审批拒绝怎么走？ · 外部副作用幂等？

### 回答

**优先级**：P0 · 3+ 篇面经

#### 🗣️ 先用大白话说

HITL 靠两件事：checkpointer 存快照 + interrupt 挂起执行。编译时设 interrupt_before=["execute"] 或在节点内调 interrupt()，执行到这儿就暂停，把控制权还给应用层，前端展示中间结果等人操作。人批准后 stream(None) 或 Command(resume=...) 继续；也可以 update_state 改错的数据再恢复。这是区分「调过 demo」和「上过线」的分水岭——百度面经会深挖恢复时 pending 边是否重跑、副作用有没有幂等键。

#### 📖 面试展开（详细版）

**是什么**：Human-in-the-loop（HITL）让人类在 Agent 执行过程中介入审批、修改或终止。LangGraph 通过 interrupt 机制原生支持，不需要自己写轮询或状态机。

**核心依赖**：必须有 checkpointer——interrupt 时框架把当前 state 存入 checkpoint 并挂起；没有 checkpointer，interrupt 无法跨请求持久化。

**实现方式**：编译时 interrupt_before=["node_name"] 在节点执行前暂停；interrupt_after=["node_name"] 在节点执行后暂停；节点内 interrupt(payload) 动态按条件暂停（LangGraph 1.0 推荐）。

**恢复流程**：应用层展示 interrupt 时的 state/payload；用户操作后调用 app.stream(None, config) 或 Command(resume=user_input) 继续。也可用 update_state 修改 checkpoint 里的 state 后恢复。

**工程要点**：挂起时交代清楚哪些副作用已发生、哪些还没；恢复时 pending 边是否重跑要有明确策略；审批涉及的外部操作（发邮件、扣款）必须配幂等键。

**项目例子**：生成 SQL 后 interrupt 让人审核，人改了几处再用 Command(resume=modified_sql) 继续执行；金额超阈值 interrupt 展示详情给审批人。

**踩坑**：没配 checkpointer 导致 interrupt 无法跨请求；恢复后副作用重复执行；审批拒绝没有设计正常路由当异常处理。

#### 💡 核心要点
- interrupt 是生产级 Agent 分水岭
- interrupt_before 防高危操作
- update_state 可改 state 或强制跳转

#### 📝 代码/配置示例

```python
from langgraph.types import interrupt, Command

def draft_plan(state):
    plan = llm_generate_plan(state)
    return {"plan": plan}

def execute_plan(state):
    # 动态 interrupt：金额超阈值才暂停
    if state["plan"]["amount"] > 10000:
        approval = interrupt({"plan": state["plan"], "reason": "high_amount"})
        if not approval.get("approved"):
            return Command(goto="apology")
    return run_plan(state["plan"])

app = graph.compile(
    checkpointer=PostgresSaver.from_conn_string(DB_URL),
    interrupt_before=["execute_plan"],
)
```

#### 🔁 追问怎么接

**「审批拒绝怎么走？」**——Command(resume={"approved": False}) 或 Command(goto="apology")，条件边读标志位路由。拒绝是正常业务路径。

**「外部副作用幂等？」**——idempotency_key + executed_actions 列表 + 恢复前查外部系统状态。
