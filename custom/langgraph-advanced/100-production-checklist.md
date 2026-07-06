---
title: "LangGraph 生产上线 Checklist 有哪些？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 进阶]
point: "上线清单"
source: GitHub Production Guide + 面经汇总
---

**题目**：LangGraph 生产上线 Checklist 有哪些？

**结论句（15 秒）**：编译单例、PG checkpoint、幂等、HITL、限流、监控、评测集、降级、schema 版本、secrets 管理、文档化 state 约定。

**追问方向**：上线前最后一项检查什么？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- 12 项 checklist
- 先跑 shadow traffic
- state 约定写进 wiki

**🗣️ 标准口语答案**

上线 checklist 我背十二项：图全局 compile；Postgres checkpointer；thread 租户隔离；tool 幂等；高危 interrupt；recursion+fallback；节点 trace；黄金集回归；输入输出 Guardrails；API 限流；降级链；graph/schema 版本。

上线前最后一项：用生产流量 shadow 跑 v2 对比 trace，看节点失败率和 token。state reducer 约定写进 wiki，oncall 能看懂。

这道题把分散工程点串起来，二面收尾常考。

