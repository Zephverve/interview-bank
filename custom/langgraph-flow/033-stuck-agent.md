---
title: "如何处理 stuck agent（卡住的 Agent）？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 控制流]
point: "可靠性"
source: GitHub 100 Questions
---

**题目**：如何处理 stuck agent（卡住的 Agent）？

**结论句（15 秒）**：检测：重复 tool call、step_count 不涨、token 爆；处理：强制路由 fallback、interrupt 人工、或 rollback checkpoint。

**追问方向**：怎么线上发现 stuck？ · 能否自动 rollback？

### 回答

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

**表现**：同一工具同一参数反复调用；step_count 持续增长但 state 关键字段（如 retrieved_docs）不变；单 thread 执行时间或 token 消耗远超 P99 基线。

**检测规则**：语义查重——last_tool_call 连续 N 次相同；进展监控——M 轮内关键字段无变化；SLA 超时——单 thread 执行超过设定阈值（如 120s）。

**处理策略**：轻度 stuck 条件边路由 fallback，返回友好提示。中度 stuck 触发 interrupt 挂起，通知运维或让用户介入。重度 stuck 用 get_state_history 找到最近一个「安全」checkpoint，update_state 回滚后 resume。

**线上发现**：LangSmith 或自研 trace 监控节点级耗时和 thread 总时长；对 P99 异常 thread 告警；dashboard 展示 stuck 触发率和原因分布。

**自动 rollback**：技术上可行——找到出错前的 checkpoint_id，fork 新分支重跑。但生产慎用，因为回滚点之后可能已有不可逆副作用。开发环境可随意实验。

**踩坑**：只设超时没有 stuck 语义检测，误杀慢但正常的任务；rollback 不考虑已发生的副作用。

