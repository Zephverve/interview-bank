---
title: "Dynamic Breakpoints 动态断点怎么用？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, HITL]
point: "断点"
source: GitHub Interview Questions
---

**题目**：Dynamic Breakpoints 动态断点怎么用？

**结论句（15 秒）**：节点内 interrupt() 可按运行时条件动态挂起，比编译时固定 interrupt_before 更灵活。

**追问方向**：和静态 interrupt 列表取舍？

### 回答

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

动态断点用节点内 interrupt(payload) 实现——比如金额超过阈值才 interrupt，小额直接过。比 compile 时写死 interrupt_before 列表灵活得多，审批 UI 还能拿到 payload 里的详情（金额、收款人等）。静态列表适合「这几个节点永远要审」；动态适合「视 state 内容决定要不要人看」。1.0 后 interrupt/Command 是一等公民，面试提到说明跟过新版本。

#### 📖 面试展开（详细版）

**是什么**：Dynamic Breakpoints 指在节点执行过程中，根据运行时 state 条件动态决定是否 interrupt 挂起，而非编译时固定 interrupt 列表。

**实现**：在节点函数内调用 interrupt(payload)，如果执行到这行，框架挂起并将 payload 返回给应用层。条件判断在 interrupt 之前：if amount > threshold: interrupt({...})。

**payload 作用**：传给审批 UI 的上下文——金额、收款人、操作类型等，让人做 informed decision，而不是看空白审批页。

**和静态 interrupt 列表取舍**：静态 interrupt_before/after 适合「这几个节点永远要审」的固定合规要求；动态 interrupt 适合「视内容决定」的场景，如金额阈值、敏感词检测、风险评分。

**恢复**：应用层收到 payload 展示审批界面；用户操作后 Command(resume=...) 继续；resume 值传回 interrupt 调用处作为返回值。

**LangGraph 1.0**：interrupt/Command 是一等公民 API，替代旧 breakpoint。面试主动提到说明技术跟进及时。

**踩坑**：interrupt 条件写错导致该审的不审；payload 信息不足审批人无法判断；动态和静态 interrupt 混用逻辑混乱。

#### 💡 核心要点
- interrupt() 带上下文给审批 UI
- 条件满足才暂停
- LangGraph 1.0 推荐方式

#### 📝 代码/配置示例

```python
from langgraph.types import interrupt

def transfer_node(state):
    amount = state["amount"]
    recipient = state["recipient"]

    # 动态：仅大额需要审批
    if amount > 10000:
        approval = interrupt({
            "action": "transfer",
            "amount": amount,
            "recipient": recipient,
            "risk_score": calc_risk(state),
        })
        if not approval.get("approved"):
            return {"status": "rejected"}
        amount = approval.get("modified_amount", amount)

    return execute_transfer(amount, recipient)
```

#### 🔁 追问怎么接

**「和静态 interrupt 列表取舍？」**——静态适合固定合规（永远要审的节点）；动态适合条件触发（金额阈值、风险评分）。可以组合使用。

**补充**：提到 1.0 interrupt/Command 替代旧 breakpoint，说明跟进新版本。
