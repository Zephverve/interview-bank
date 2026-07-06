---
title: "层级多 Agent 团队（Hierarchical）怎么设计？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 多Agent]
point: "层级架构"
source: GitHub 100 Questions
---

**题目**：层级多 Agent 团队（Hierarchical）怎么设计？

**结论句（15 秒）**：顶层 supervisor 分大任务，中层组长管专业组，底层 worker 执行；用嵌套子图表达层级。

**追问方向**：和扁平 Supervisor 取舍？ · 通信开销？

### 回答

**优先级**：P2 · 1 篇

**🗣️ 标准口语答案**

多 Agent 编排我最常见的是 Supervisor 模式，复杂场景再拆子图。

层级多 Agent（Hierarchical）模式适合「任务自然分层」的大型协作场景，与扁平 Supervisor 形成对比。典型三层结构：顶层 supervisor（CEO/总控）拆战略任务给中层 supervisor（部门组长/专业组），中层再路由给底层 worker（研究员/工程师/执行者）。

LangGraph 实现用嵌套子图：顶层是一张 StateGraph，其中「部门节点」本身是 compile 后的子图 supervisor；子图内部再有自己的 worker 节点和条件边。父节点函数 invoke 子图时做 state 映射——顶层 task 分解为子任务传给中层，中层执行结果汇总回顶层 state。

state 逐级汇总：顶层 state 只保留 task_brief 和各部门汇总结果；中层 state 保留部门任务和 worker 产出；底层 worker 有自己的 scratchpad。避免所有信息都堆在顶层 state 导致 checkpoint 膨胀和 prompt 过长。

和扁平 Supervisor 的取舍：层级模式降低顶层 prompt 复杂度（CEO 不需要了解每个工程师的细节），适合企业流程仿真、大型调研项目等多层级决策场景。但增加延迟（多一层 LLM 调用）和 state 传递损耗（映射可能丢信息）。扁平 Supervisor 适合角色清晰的三人小团队（researcher/coder/writer），软件开发场景通常扁平就够。

嵌套建议不超过 2-3 层，每层子图有清晰 IO 契约。通信开销通过 context_summary 而非全量 messages 传递来控制。

