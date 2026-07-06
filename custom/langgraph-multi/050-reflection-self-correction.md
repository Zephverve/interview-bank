---
title: "Reflection / Self-Correction 反思循环怎么实现？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 多Agent]
point: "反思"
source: GitHub Premium Questions
---

**题目**：Reflection / Self-Correction 反思循环怎么实现？

**结论句（15 秒）**：generate 节点产出 → critic 节点评审 → 条件边不满意则回 generate，满意则 END；类似 Reflexion 架构。

**追问方向**：反思会不会无限循环？ · critic 用什么模型？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- generator-critic 回边
- critic 输出 score 或 pass/fail
- 限制 max_reflections

**🗣️ 标准口语答案**

反思环：draft_node 生成答案 → reflect_node 用另一 prompt 或更强模型评审，写 critique 进 state → 条件边看 pass 与否，不通过带 critique 回 draft_node 重写，通过则 END。

控制 max_reflections 防循环。代码生成场景 critic 可跑测试用例，比纯 LLM 评更可靠。

LangGraph 价值是把这种环画清楚，每轮 critique 都进 checkpoint 可追溯。

