---
title: "interrupt_before 和 interrupt_after 的区别？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, HITL]
point: "中断点"
source: CSDN 高频题
---

**题目**：interrupt_before 和 interrupt_after 的区别？

**结论句（15 秒）**：before：操作发生前拦截（转账、删库）；after：产出后审阅打回（生成报告、写代码）。

**追问方向**：能否运行时动态设 interrupt？ · 和 breakpoint 废弃 API？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- before = Guardrails
- after = Review
- compile 时或动态配置

**🗣️ 标准口语答案**

interrupt_before=["execute_node"] 在节点执行前暂停，适合高危操作——还没删库、还没转账，人先看 plan。interrupt_after=["draft_node"] 在节点跑完后暂停，适合生成类——报告写完了人改几句再继续。

选点取决于风险在时间线的哪一侧。金融审批、批量邮件用 before；内容创作、方案生成用 after。LangGraph 1.0 用 interrupt() 函数更灵活，可带上下文给审批 UI。

