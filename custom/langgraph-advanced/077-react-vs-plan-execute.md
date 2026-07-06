---
title: "ReAct 和 Plan-and-Execute 在 LangGraph 里怎么选？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "模式选型"
source: Agent 架构 15 问
---

**题目**：ReAct 和 Plan-and-Execute 在 LangGraph 里怎么选？

**结论句（15 秒）**：步骤清晰可预知用 Plan-and-Execute；环境反馈不确定、需频繁调工具用 ReAct；可混合 planner+react 子图。

**追问方向**：能画两种拓扑吗？

### 回答

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

Agent 架构模式选型题，考察**能否根据任务结构选模式**，而不是背定义。

**Plan-and-Execute 适用场景**：
- 步骤可预先列清单：写研报、数据处理流水线、多章节文档生成
- 拓扑：planner 节点输出 `steps[]` → executor 节点逐步消费 → 某步失败 → replanner 修改剩余计划
- 优势：token 效率高（plan 一次，execute 多次）；轨迹可预测
- 劣势：计划可能过时（环境变化后原计划不适用）

**ReAct 适用场景**：
- 环境反馈不确定：开放式研究、代码 debug、工具链不确定
- 拓扑：agent → tool → agent 环，每轮 LLM 看 tool 结果再决定下一步
- 优势：灵活适应；劣势：token 消耗高、可能死循环

**混合模式**（生产常见）：planner 出粗粒度里程碑（3-5 步）→ 每个 milestone 内嵌 ReAct 子图做细粒度执行。例如「写研报」plan 出「收集数据→分析→撰写→审核」，「收集数据」这一步内部用 ReAct 调多个搜索 tool。

**面试技巧**：画两张拓扑图——Plan 是 DAG+replanner 回边；ReAct 是 agent↔tool 环——比背定义强十倍。

