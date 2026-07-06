---
title: "LangGraph vs AutoGen vs CrewAI 怎么选？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 基础]
point: "框架选型"
source: 知乎对比文 + 面经
---

**题目**：LangGraph vs AutoGen vs CrewAI 怎么选？

**结论句（15 秒）**：LangGraph 强在可控、可审计、可恢复，适合严肃生产系统；CrewAI 快速原型；AutoGen 多 Agent 协作实验。

**追问方向**：团队没有图编排经验怎么办？ · 长期维护哪个成本低？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- LangGraph：显式状态机，学习曲线陡，链路最稳
- CrewAI：角色+任务快速成型，中等复杂度
- AutoGen：对话式协作表达强，行为更动态难控

**🗣️ 标准口语答案**

这三个框架哲学不同。LangGraph 把 Agent 系统当状态机建，你先定义状态、节点、边、终止条件，可控性和可恢复性最好，适合长链路、要审计、要 HITL 的生产系统，代价是前期设计重。

CrewAI 用角色和任务描述快速搭多 Agent，上手快，适合原型和任务型协作，但精细控制不如 LangGraph。AutoGen 强调 Agent 间对话协作，表达力强，适合研究实验，生产里行为较难约束。

我的决策树：怕失控、要 checkpoint、链路复杂 → LangGraph；今天就要 demo → CrewAI；研究多 Agent 对话 → AutoGen。长期跑的生产系统，LangGraph 优势会随复杂度上升而放大。

