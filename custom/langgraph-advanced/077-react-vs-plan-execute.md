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

**📖 核心要点**
- Plan 适合报告生成、流程固定
- ReAct 适合探索、工具链不确定
- 混合：plan 粗粒度 react 细执行

**🗣️ 标准口语答案**

选型看任务结构。步骤能预先列清单的——写研报、数据处理流水线——用 Plan-and-Execute，planner 节点出 steps，executor 逐步消费，失败 replanner 改计划。

环境反馈不确定、工具该调啥得边做边想——用 ReAct 环。实际常混合：plan 出粗粒度里程碑，每个 milestone 内嵌 ReAct 子图做细执行。

面试画两张拓扑图比背定义强。

