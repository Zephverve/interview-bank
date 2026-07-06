---
title: "Agent Handoff（交接）怎么实现？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 多Agent]
point: "Handoff"
source: GitHub Interview Questions
---

**题目**：Agent Handoff（交接）怎么实现？

**结论句（15 秒）**：一个 agent 节点结束时写 state.handoff_to，条件边路由到下一 agent，并传递上下文摘要。

**追问方向**：和 Supervisor 区别？ · 上下文怎么精简传递？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：Handoff 是 agent 自己决定「这题不归我管，转给同事」——写清楚交给谁、附带摘要，条件边自动路由过去。

**打个比方**：前台客服接到技术问题，不会等经理派活，直接说「我帮您转技术组」，同时写一张交接便签给技术员，不用把整通电话录音拷过去。

#### 📖 面试展开（详细版）

Agent Handoff（交接）是一种去中心化的多 Agent 协作模式。与 Supervisor 的中央调度不同，Handoff 让当前 agent 自己判断「这个问题该谁处理」，然后在 state 里写 handoff_to 字段（目标 agent 名）和 context_summary（结构化摘要），条件边根据 handoff_to 路由到下一个 agent 的入口节点。

实现步骤：在 State schema 里定义 handoff_to: str 和 context_summary: dict；当前 agent 节点在判断需要转交时，返回 {"handoff_to": "billing_agent", "context_summary": {"issue": "...", "user_id": "..."}}；add_conditional_edges 从当前 agent 按 handoff_to 映射到各 agent 或继续自身处理；接收方 agent 从 context_summary 起步，不必重读发送方的全量 messages。

上下文传递是 Handoff 的核心工程挑战。错误做法是把整个 messages 列表拷贝给下一个 agent——token 爆炸、噪音多、关键信息淹没。正确做法是发送方生成结构化 summary：问题类型、已尝试方案、关键实体、用户诉求。接收方 agent 的 prompt 以 summary 为起点，必要时再按需检索补充信息。

和 Supervisor 的选型：Handoff 适合一线 agent 最清楚该转谁的场景（客服转技能组、编码 agent 转测试 agent）；Supervisor 适合需要全局视角协调多个专家的复杂任务。OpenAI Swarm 框架的 handoff 思想与此同源。

#### 💡 核心要点
- 显式 handoff 字段
- 传递 summary 而非全量 messages
- OpenAI Swarm 同类思想

#### 📝 代码/配置示例

```python
class HandoffState(TypedDict):
    messages: list
    handoff_to: str
    context_summary: dict

def triage_agent(state: HandoffState) -> dict:
    # 判断需要转交
    return {
        "handoff_to": "billing_agent",
        "context_summary": {"issue": "退款", "order_id": "123"},
    }

builder.add_conditional_edges("triage", lambda s: s["handoff_to"], {
    "billing_agent": "billing_agent",
    "tech_agent": "tech_agent",
    "none": END,
})
```

#### 🔁 追问怎么接

- **和 Supervisor 区别**：Handoff 去中心化（agent 自决转交），Supervisor 中央调度（包工头派活）
- **上下文精简**：传 structured summary，不传全量 messages；控制 token 预算
- **加分项**：提到 OpenAI Swarm 同类思想、客服转技能组场景
