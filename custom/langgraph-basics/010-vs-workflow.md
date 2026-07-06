---
title: "LangGraph 相比普通 Workflow 的最大价值是什么？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 基础]
point: "Workflow 对比"
source: 高德 AI 应用面经
sourceUrl: https://blog.csdn.net/weixin_43726381/article/details/161294938
---

**题目**：LangGraph 相比普通 Workflow 的最大价值是什么？

**结论句（15 秒）**：Workflow 线性 A→B→C，卡住只能整体重试；LangGraph 有环、有共享 State、有 checkpoint 和 HITL，适合多轮决策任务。

**追问方向**：什么时候不必用 LangGraph？ · 迁移成本多大？

### 回答

**优先级**：P0 · 3+ 篇

**🗣️ 标准口语答案**

必须用 LangGraph 的三种情况：需要循环（代码生成-运行-修复）、需要人工介入（生成方案-用户确认）、多 Agent 协作有依赖关系。

不必用的场景：固定三步流程，比如检索→生成→格式化，普通 Workflow 或 LCEL 二十行搞定，上 LangGraph 反而增加复杂度。我的经验是先 Workflow 跑通功能，遇到循环或回溯痛点再迁移，不要为了炫技提前上图编排。

