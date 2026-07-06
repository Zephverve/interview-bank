---
title: "如何实现语义路由（Semantic Routing）？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 控制流]
point: "路由"
source: GitHub 100 Questions
---

**题目**：如何实现语义路由（Semantic Routing）？

**结论句（15 秒）**：用 LLM 或 embedding 分类器在条件边/路由节点判断意图，映射到不同子图或工具集。

**追问方向**：路由不准怎么办？ · 和 intent node 区别？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- 专用 router 节点输出 next_route
- 可小模型分类降本
- 低置信走澄清或默认路径

**🗣️ 标准口语答案**

语义路由是在图入口或中间用 LLM/embedding 分类用户意图，条件边根据分类结果跳到不同分支——客服里「查订单」和「投诉」走不同子流程。

实现上单独 router 节点，输入 messages，输出 state 里的 route_key；条件边读 route_key 映射。为省 token 可用小模型或 embedding+阈值。

路由不稳时加澄清节点 interrupt 问用户，或低置信走安全默认路径。蚂蚁面经里 LangGraph 路由设计是同类题。

