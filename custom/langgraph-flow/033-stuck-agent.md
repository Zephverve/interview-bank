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

**📖 核心要点**
- 语义查重检测重复动作
- 监控 step 耗时异常
- get_state_history 回滚到安全点

**🗣️ 标准口语答案**

stuck 表现：同一工具同参数反复调、step_count 涨但无进展、单 thread 耗时或 token 异常高。

检测靠三类规则：last_tool_call 重复、N 轮内 state 关键字段不变、超过 SLA 时间。处理上优先条件边引到 fallback；严重情况 interrupt 挂起让人工看 state；LangGraph 支持 get_state_history 回滚到之前 checkpoint 再 resume。

线上用 LangSmith 或自研 trace 看节点级耗时，对 P99 异常的 thread 告警。

