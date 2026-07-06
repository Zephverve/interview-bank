---
title: "LangGraph 和 Agent 的关系是什么？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 基础]
point: "概念关系"
source: 高德面经
---

**题目**：LangGraph 和 Agent 的关系是什么？

**结论句（15 秒）**：Agent 是「能感知、决策、行动」的系统；LangGraph 是编排 Agent 循环、工具调用和分支的引擎，不是 Agent 本身。

**追问方向**：能否用 LangGraph 实现确定性 Workflow？ · 黑盒 Agent 和白盒图区别？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- Agent = LLM + 工具 + 记忆 + 规划循环
- LangGraph 提供循环、路由、状态持久化的运行时
- 可用 LangGraph 实现 Workflow（固定边）或 Agent（条件边）

**🗣️ 标准口语答案**

Agent 是系统能力：能根据目标自主调用工具、多轮推理、处理反馈。LangGraph 不负责「让 LLM 变聪明」，它负责把 Agent 的执行流程搭成可观测、可恢复的状态机。

关系上 LangGraph 解决 Agent 落地里的工程问题：循环怎么写、状态怎么传、失败了从哪重试、什么时候等人审批。早期 LangChain Agent 是黑盒——给工具和目标它自己跑，中间步骤难控；LangGraph 是白盒——每个节点、每条边你都显式定义。

两者都可以做：固定边就是 Workflow，LLM 决策的条件边就是 Agent。这也是 LangGraph 比早期 Agent 抽象更受欢迎的原因——控制权在你手里。

