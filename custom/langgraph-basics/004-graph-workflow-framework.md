---
title: "为什么 LangGraph 被称为图状工作流框架？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 基础]
point: "图编排本质"
source: CSDN 高频题
---

**题目**：为什么 LangGraph 被称为图状工作流框架？

**结论句（15 秒）**：因为它用 Node+Edge+State 显式建模控制流，支持条件分支、并行、循环，比隐式 Chain 更可审计、可测试。

**追问方向**：和普通 Workflow 引擎差在哪？ · 图灵完备意味着什么？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- 有向图：节点是计算单元，边是路由逻辑
- 条件边让 LLM/规则动态决定下一步
- 编译期检查孤立节点，运行期 super-step 同步状态

**🗣️ 标准口语答案**

被称为图状工作流，是因为它不把 Agent 当成黑盒循环，而是把执行流程建模成有向图。State 是共享数据结构，Node 是读 state、写 partial update 的函数，Edge 定义逻辑流向——普通边固定跳转，条件边根据 state 动态路由。

这和传统 Workflow 的差别在于：第一，原生支持环，ReAct、重试、反思都是回边；第二，状态在节点间自动合并，有 reducer 语义；第三，compile 时可注入 checkpointer，整个图变成可暂停、可恢复的状态机。

面试加分点是能说出 super-step 执行模型：每个 super-step 里所有就绪节点并行跑，跑完同步 state，再进入下一步。类似 Pregel，所以能处理并行分支又保证一致性。

