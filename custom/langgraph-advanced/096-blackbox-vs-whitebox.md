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

**📖 核心要点**
- 黑盒：工具+目标全自动
- 白盒：节点边显式
- 可控性换设计成本

**🗣️ 标准口语答案**

早期 LangChain Agent 给工具和目标，内部怎么一步步走你看不清，难 debug 难审计。LangGraph 白盒：每个节点做什么、每条边什么条件，全显式，trace 逐步对齐图结构。

代价是设计成本——你得自己画流程，不能全扔给 LLM 自主。生产环境要审计、合规、排障，白盒是必须的，这就是 LangGraph 取代黑盒 Agent 的原因。

