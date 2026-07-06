---
title: "成本感知路由（Cost-Aware Routing）怎么实现？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "成本"
source: GitHub 100 Questions
---

**题目**：成本感知路由（Cost-Aware Routing）怎么实现？

**结论句（15 秒）**：router 节点根据任务复杂度选模型：简单走 mini，复杂走 4o；state 累计 token 超预算降级。

**追问方向**：字节问百万 token 成本怎么答？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- intent+长度估计复杂度
- configurable 模型名
- token_budget 写 state

**🗣️ 标准口语答案**

入口 router 判断简单问答/复杂推理，条件边到不同 LLM 节点绑不同 model。state 维护 token_spent，超 budget 后续节点强制 mini 或模板。

字节面经成本题：估 thousand-line code token 数×单价，说优化方向是压缩、缓存、小模型路由。成本感知是 router 节点的业务规则。

