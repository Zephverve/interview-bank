---
title: "图中工具执行出错怎么处理？"
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 面经]
point: "工具错误"
source: GitHub Premium Questions
---

**题目**：图中工具执行出错怎么处理？

**结论句（15 秒）**：tool 节点 try-catch 写 error 进 state，agent 节点读 error 决定重试/换参/fallback，绝不让异常穿透崩图。

**追问方向**：超时和限流区别？ · 错误信息给 LLM 看什么？

### 回答

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

工具错误处理是**生产级 Agent 的刚需**，考察你有没有线上思维。

**核心原则：绝不让异常穿透崩图**。tool 节点内部 try-catch，失败时返回结构化 ToolMessage 进 messages/state，而不是 raise Exception。

**错误分类**：
- **可重试**：网络超时、429 限流、503 服务不可用 → agent 节点决定换参数重试或等 backoff
- **不可重试**：401 鉴权失败、400 参数校验失败、404 资源不存在 → 直接走 fallback，不浪费 token

**给 LLM 的错误信息**：
- 结构化：`{"error": "timeout", "tool": "search_api", "retry_after": 5}`
- **脱敏**：不要塞完整 stack trace 或内部 URL，LLM 不需要也不该看到

**两层 retry 别重复**：
- tool 层：`max_retries=3`（网络层重试）
- 图层：条件边判断 error 类型决定是否回 agent 重试（业务层决策）
- 两层协调，避免 3×3=9 次无效重试浪费 token

**fallback 设计**：连续 tool 失败 N 次 → 路由到 fallback 节点 → 返回「暂时无法查询，请稍后重试」+ 人工入口。

