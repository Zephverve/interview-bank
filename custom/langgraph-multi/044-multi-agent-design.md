---
title: "如何用 LangGraph 实现多 Agent 系统？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 多Agent]
point: "多 Agent"
source: GitHub + 字节面经
---

**题目**：如何用 LangGraph 实现多 Agent 系统？

**结论句（15 秒）**：常见模式：Supervisor 路由、层级子图、Handoff；共享 state 或隔离 state 取决于协作紧密度。

**追问方向**：所有 agent 共享工具吗？ · 和单 Agent 多 tool 区别？

### 回答

**优先级**：P1 · 3+ 篇

**🗣️ 标准口语答案**

多 Agent 编排我最常见的是 Supervisor 模式，复杂场景再拆子图。

LangGraph 实现多 Agent 的核心思路是：把「不同角色的智能体」建模成图上的不同节点，而不是启动多个独立进程各自为政。最常见的是 Supervisor 模式——中央调度节点读当前 state，用 LLM 决定下一棒交给 researcher、coder 还是 writer，worker 执行完写回 state，再通过固定边回到 supervisor，直到任务完成或达到步数上限。

第二种是子图模式：每个 agent 自己是一张完整的 StateGraph，compile 之后作为父图的一个节点嵌入。父节点函数负责 state 字段映射——把父图的 query 传给子图，把子图的 retrieval_result 写回父图。这种方式适合大型系统模块化维护，RAG 流水线、代码审查环各自独立演进。

第三种是 Handoff（交接）模式：当前 agent 判断「这题该别人管」，写 state.handoff_to 和 context_summary，条件边路由到下一个 agent。这是去中心化调度，适合客服转技能组等场景。

和「单 Agent 多 tool」的本质区别：多 Agent 是不同 prompt、不同模型、不同权限的角色分工，每个 agent 有自己的「人格」和职责边界；单 Agent 多 tool 是一个大脑调不同 API，适合任务阶段差异不大、只是工具种类多的场景。字节面经爱追问「子 agent 能否共享工具」——标准答法是：工具 schema 可以共享只读定义，但调用权限按角色授权，state 命名空间尽量隔离。

工程上还要注意：并行 agent 写同一 state 字段必须配 reducer；supervisor 本身也可能成为瓶颈，需要 step_count 上限和「完成则 FINISH」的 prompt 约束；嵌套层级建议不超过 2-3 层，否则 debug 困难。

