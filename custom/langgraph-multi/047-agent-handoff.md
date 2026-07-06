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

**📖 核心要点**
- 显式 handoff 字段
- 传递 summary 而非全量 messages
- OpenAI Swarm 同类思想

**🗣️ 标准口语答案**

Handoff 是 agent A 认为「这题该 B 管」时，写 state.handoff_to="billing_agent" 并附 context_summary，条件边路由到 B 的入口节点。B 从 summary 起步，不必重读 A 的全量历史。

和 Supervisor 区别：Handoff 是去中心化，A 自己决定交给谁；Supervisor 是中央调度。上下文传递用结构化 summary 控 token，别把整个 messages 拷过去。

适合客服转技能组、编码 agent 转测试 agent 等场景。

