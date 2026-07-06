---
title: "Plan-and-Execute 模式怎么用 LangGraph 实现？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 多Agent]
point: "规划执行"
source: GitHub 100 Questions
---

**题目**：Plan-and-Execute 模式怎么用 LangGraph 实现？

**结论句（15 秒）**：planner 节点生成步骤列表，executor 逐步执行，replanner 根据结果动态调整计划，条件边控制循环。

**追问方向**：和 ReAct 区别？ · 计划存在哪？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- plan 存 state.steps
- executor 每次消费一步
- 失败时 replanner 改计划

**🗣️ 标准口语答案**

Plan-and-Execute 分三节点：planner 根据目标生成 structured plan 写入 state.steps；executor 取当前 step 执行工具；执行完条件边判断——还有步骤则继续 executor，失败则 replanner 改 plan，全完成则 END。

和 ReAct 区别：ReAct 每步现想，Plan-and-Execute 先列清单再执行，适合步骤清晰的长任务，但计划可能跟不上变化所以要 replanner。

计划用 list[dict] 存 state，每步标 status: pending/done/failed。

