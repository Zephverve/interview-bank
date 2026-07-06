---
title: "Dynamic Breakpoints 动态断点怎么用？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, HITL]
point: "断点"
source: GitHub Interview Questions
---

**题目**：Dynamic Breakpoints 动态断点怎么用？

**结论句（15 秒）**：节点内 interrupt() 可按运行时条件动态挂起，比编译时固定 interrupt_before 更灵活。

**追问方向**：和静态 interrupt 列表取舍？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- interrupt() 带上下文给审批 UI
- 条件满足才暂停
- LangGraph 1.0 推荐方式

**🗣️ 标准口语答案**

动态断点用节点内 interrupt(payload) 实现——比如金额超过阈值才 interrupt，小额直接过。比 compile 时写死 interrupt_before 更灵活，审批 UI 能拿到 payload 里的详情。

静态列表适合「这几个节点永远要审」；动态适合「视 state 内容决定要不要人看」。1.0 后 interrupt/Command 是一等公民，面试提到说明跟过新版本。

