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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

**是什么**：语义路由根据用户输入的语义（而非关键词规则）决定后续走哪条分支。可以用 LLM 分类、embedding 相似度匹配、或专用 fine-tuned 小模型。

**为什么需要**：客服、助手类产品里「查订单」和「投诉退款」需要完全不同的工具集和子流程，入口路由决定了整个图的执行路径。

**实现方式**：专用 router 节点读取 messages，调用分类器，输出 state.route_key（如 "order_query"、"complaint"、"general_qa"）。后续条件边读 route_key 映射到不同子图或工具集。复杂场景可以用子图（Subgraph）封装各分支。

**路由不准怎么办**：低置信度时走澄清节点（interrupt 问用户确认意图）；设置默认安全路径（general_qa）；收集 bad case 回流微调分类器；A/B 测试不同路由策略。

**和 intent node 区别**：intent node 是实现手段，语义路由是设计模式。intent node 输出意图标签，条件边/子图完成实际路由。

**踩坑**：路由节点用 GPT-4 太贵；分类类别过多导致准确率下降；没有低置信兜底导致错误路由连锁失败。

