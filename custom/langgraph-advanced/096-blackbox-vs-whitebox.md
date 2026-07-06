---
title: "LangGraph 和早期 LangChain Agent 黑盒白盒区别？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "范式对比"
source: Agent 架构 15 问
---

**题目**：LangGraph 和早期 LangChain Agent 黑盒白盒区别？

**结论句（15 秒）**：早期 Agent 是黑盒自主循环；LangGraph 是白盒显式图，每步可测可审计，工程可控性根本提升。

**追问方向**：白盒代价是什么？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：早期 Agent 是黑盒（给工具和目标，内部怎么跑看不清）；LangGraph 是白盒（每个节点、每条边都显式），可测可审计。

**打个比方**：黑盒像自动售货机（投币出饮料，不知道内部机制）；白盒像开放式厨房（每道工序看得见），出问题能定位到哪一步。

#### 📖 面试展开（详细版）

黑盒 vs 白盒是**理解 LangGraph 价值的根本问题**。

**早期 LangChain Agent（黑盒）**：
- 给 LLM 一组 tools 和一个 goal
- LLM 自主决定：调哪个 tool → 看什么结果 → 下一步做什么
- 内部循环：while not done → llm.think() → tool.execute() → llm.think()
- **问题**：看不清中间步骤、难 debug、难审计、行为不可预测

**LangGraph（白盒）**：
- 每个步骤是显式 node：retrieve、grade、generate、cite_check
- 每条跳转是显式 edge：grade 不过 → rewrite，cite 不过 → generate
- trace 逐步对齐图结构：LangSmith 里看到「走了哪些节点、每个节点输入输出」
- **优势**：可测（单节点单测）、可审计（每步有记录）、可控（条件边是确定性规则）

**白盒的代价**：
- **设计成本**：你得先画流程图再写代码，不能全扔给 LLM 自主
- **灵活性降低**：LLM 不能随意跳步，必须走你定义的边
- **前期投入大**：State schema、reducer 约定、节点契约都要先设计

**为什么生产选白盒**：审计（金融/医疗必须知道 AI 做了什么）、合规（每步可追溯）、排障（bad case 定位到具体 node）、评测（节点级回归）。这就是 LangGraph 取代黑盒 Agent 的根本原因。

#### 💡 核心要点
- 黑盒：工具+目标全自动
- 白盒：节点边显式
- 可控性换设计成本

#### 🔁 追问怎么接

- **「白盒代价是什么？」** → 设计成本（先画流程再写代码）、灵活性降低（LLM 不能随意跳步）、前期投入大（State/reducer/节点契约）；但生产环境的审计/合规/排障需求使白盒成为必选项。
