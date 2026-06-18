---
title: ReAct、Plan-and-Execute、Reflection 三种范式有什…
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 小林笔记]
point: ReAct、Plan-and-Execute、Reflect
source: 小林面试笔记
---

**题目**：ReAct、Plan-and-Execute、Reflection 三种范式有什么核心区别？实际项目中该如何选型？

**结论句（15 秒）**：我理解这三者是 Agent 开发里最主流的三种设计范式，核心区别在于「决策和执行的关系」

**追问方向**：结合项目经历举例 · 优缺点与适用场景

### 回答

我理解这三者是 Agent 开发里最主流的三种设计范式，核心区别在于「决策和执行的关系」。

ReAct 是边想边干，走一步看一步，单步迭代实时调整，灵活度最高；Plan-and-Execute 是先想全再干，先定完整计划再分步执行，适合长流程复杂任务，不容易跑偏；Reflection 不是独立的完整流程，而是给前两者加的「检查修正 buff」，用来提升输出质量。

实际选型就看三个维度：任务复杂度、流程确定性、输出质量要求，新手入门首选 ReAct，复杂任务用 Plan-and-Execute，高要求场景再加 Reflection。

回答这道题最关键的一步，是先把 Reflection 的定位说清楚：它不是一套独立流程，而是可以叠加在 ReAct 或 Plan-and-Execute 之上的「质量增强 buff」，这一点很多人会搞错。

说完定位，再按维度对比三者的核心区别：ReAct 边想边干、灵活度最高但长任务容易跑偏；Plan-and-Execute 先规划再执行、结构清晰但灵活度不足；Reflection 专门解决输出质量问题，代价是增加 token 消耗和延迟。
