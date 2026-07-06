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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

**是什么**：Dynamic Breakpoints 指在节点执行过程中，根据运行时 state 条件动态决定是否 interrupt 挂起，而非编译时固定 interrupt 列表。

**实现**：在节点函数内调用 interrupt(payload)，如果执行到这行，框架挂起并将 payload 返回给应用层。条件判断在 interrupt 之前：if amount > threshold: interrupt({...})。

**payload 作用**：传给审批 UI 的上下文——金额、收款人、操作类型等，让人做 informed decision，而不是看空白审批页。

**和静态 interrupt 列表取舍**：静态 interrupt_before/after 适合「这几个节点永远要审」的固定合规要求；动态 interrupt 适合「视内容决定」的场景，如金额阈值、敏感词检测、风险评分。

**恢复**：应用层收到 payload 展示审批界面；用户操作后 Command(resume=...) 继续；resume 值传回 interrupt 调用处作为返回值。

**LangGraph 1.0**：interrupt/Command 是一等公民 API，替代旧 breakpoint。面试主动提到说明技术跟进及时。

**踩坑**：interrupt 条件写错导致该审的不审；payload 信息不足审批人无法判断；动态和静态 interrupt 混用逻辑混乱。

