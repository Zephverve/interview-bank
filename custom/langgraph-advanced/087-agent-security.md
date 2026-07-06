---
title: "LangGraph Agent 安全怎么保障？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "安全"
source: GitHub 100 Questions
---

**题目**：LangGraph Agent 安全怎么保障？

**结论句（15 秒）**：输入 Guardrails 节点、工具权限白名单、HITL 高危操作、输出过滤、secret 不进 state。

**追问方向**：提示注入怎么防？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- 入口 sanitize 节点
- tool 按角色授权
- interrupt 敏感写操作

**🗣️ 标准口语答案**

安全分层：输入节点检测注入和 PII；工具层白名单+参数校验；高危写操作 interrupt 审批；输出节点内容策略过滤；API key 走 config/secrets 不进 checkpoint。

提示注入靠 system 边界+检索内容隔离+不要 tool 结果直接当 system。和百度 Guardrails 输入输出可一起讲。

