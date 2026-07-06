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

**🗣️ 标准口语答案**

我会先把定位说清楚：

LangGraph：显式状态机编排，LangChain 生态。CrewAI：角色（Role）+ 任务（Task）+ Crew 抽象，YAML 式配置多 Agent。AutoGen：对话式多 Agent，GroupChat 驱动协作。

字节、独角兽面经爱问框架对比，考察广度与深度。不必装全用过，但要讲清哲学差异和选型依据。

生产长链路 + checkpoint + HITL → LangGraph。快速多 Agent 原型 → CrewAI。研究/实验性对话协作 → AutoGen。团队无图编排经验：先用 CrewAI 验证需求，复杂度上来再迁 LangGraph。

EvoAgent 选 LangGraph 因为 citation 校验失败要回环、敏感结论要 interrupt，需要可审计的节点级 trace。同团队另一个内部提效 demo 用 CrewAI 三天出原型。

生产系统用 AutoGen 难控行为；复杂链路用 CrewAI 后期难维护；选 LangGraph 但团队无人懂 reducer/checkpoint。

