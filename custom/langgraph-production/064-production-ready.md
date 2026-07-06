---
title: "如何构建生产级（Production-Ready）LangGraph Agent？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 工程]
point: "生产级"
source: GitHub Production Guide
---

**题目**：如何构建生产级（Production-Ready）LangGraph Agent？

**结论句（15 秒）**：清单：全局 compile、Postgres checkpoint、HITL 高危操作、分层重试、节点监控、评测集、限流熔断、schema 版本化。

**追问方向**：和生产 demo 最大差别？ · 第一优先级做什么？

### 回答

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

上线 Agent 图时，我会把可观测性和失败路径放在和主流程同一优先级。

GitHub Production Guide 和多家面经（百度、阿里、编程导航）共同指向的生产级 checklist，按优先级排列：

第一优先级——可恢复：应用启动时 compile 图全局单例；Postgres checkpointer 多副本共享；thread_id 会话隔离；recursion_limit + fallback 防死循环；state schema 版本管理 + 图迁移策略。这是「崩溃后不能丢状态」的底线。

第二优先级——可观测：LangSmith 或 OpenTelemetry 节点级 trace；按 node 聚合成功率、P99 延迟、token 消耗；告警阈值（失败率环比、延迟突增）；trace_id 贯穿。这是「出问题能定位」的能力。

第三优先级——可评测：离线黄金集定期回归；线上 bad case 自动入库；prompt 版本化 A/B 对比；节点级离线评测（不只端到端）。这是「持续改进」的闭环。

第四优先级——安全与韧性：高危操作（发邮件、扣款、删数据）interrupt 人工审批；tool 调用幂等键；输入输出 Guardrails（部署层 + 图内双层）；限流熔断（连续失败 N 次转人工）；secrets 不进 state。

GitMMQ 生产指南核心观点：LangGraph 价值是把黑盒循环变成可审计状态机。推荐路径：先用简单 Workflow/Chain 验证业务需求，遇到状态管理/循环/审批痛点再迁 LangGraph——不要为了炫技提前上图编排。

和 demo 的最大差别：demo 是 invoke 能跑通；生产级考虑了崩溃恢复、幂等、监控、bad case 闭环、schema 版本化。面试按「可恢复 > 可观测 > 可评测 > 安全韧性」顺序讲，体现工程优先级感。

