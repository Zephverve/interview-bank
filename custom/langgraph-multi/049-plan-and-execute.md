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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

Plan-and-Execute 是 LangGraph 中适合「步骤清晰的长任务」的编排模式，与 ReAct 的「每步现想」形成对比。实现需要三个核心节点：planner、executor、replanner。

planner 节点：读用户目标和当前 state，用 LLM 生成 structured plan——一个步骤列表，每步包含 description、tool、status（pending/done/failed）。写入 state.steps。prompt 要求输出结构化 JSON，便于后续解析。

executor 节点：从 state.steps 取第一个 status=pending 的步骤，调用对应工具执行，执行完更新该步 status 为 done 或 failed，结果写入 state.step_results。条件边判断：还有 pending 步骤则继续 executor；有 failed 步骤则路由到 replanner；全部 done 则 END。

replanner 节点：读 failed 步骤和已有结果，重新生成或调整 state.steps——可能跳过失败步骤、换工具、拆分子步骤。这是 Plan-and-Execute 相比固定 Workflow 的灵活之处。

和 ReAct 的核心区别：ReAct 每轮「思考→行动→观察→再思考」，没有全局计划，适合探索性任务；Plan-and-Execute 先全局规划再逐步执行，适合步骤可预期但可能中途调整的长任务（写报告、做调研、多步数据处理）。计划存在 state.steps 里，每步带 status 字段，checkpoint 可恢复中断的计划执行。

