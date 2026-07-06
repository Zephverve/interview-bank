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

**📖 核心要点**
- Workflow：无状态、线性、难中断
- LangGraph：可循环、可回溯、可人工介入
- 固定三步任务 Workflow 20 行搞定，不必上图

**🗣️ 标准口语答案**

普通 Workflow 或 LCEL Chain 是线性的：检索、生成、格式化三步走完。中间某步失败，通常只能整链重试，没有「回到某步换策略」的能力，也没有跨请求的 state 持久化。

LangGraph 把流程变成有向图，每个节点是一个 step，边可以是条件跳转。价值体现在三方面：执行方式从线性变成可循环可跳转；状态管理有 State 对象跨节点共享；人工介入可以在任意节点 interrupt 等人审批。

我同意高德面经里的观点：先用 Workflow 跑通功能，真正遇到循环/回溯痛点再迁 LangGraph。比如保存草稿这种固定三步，Workflow 够用；代码生成→运行→改错循环才需要图。

