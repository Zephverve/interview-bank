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

**📖 核心要点**
- 结构化 ToolMessage error
- 可重试错误分类
- 敏感错误信息脱敏

**🗣️ 标准口语答案**

tool 节点捕获异常，返回 ToolMessage(content="Error: timeout", status="error") 进 messages，不抛到图外。agent 节点看到 error 决定换参数重试或走 fallback。

可重试：网络超时、429；不可重试：401、参数校验失败。给 LLM 的错误信息要结构化但脱敏，别把 stack trace 全塞进去。

结合 retry 机制：tool 层 max_retries，图层条件边，两层别重复重试浪费 token。

