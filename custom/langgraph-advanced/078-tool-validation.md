---
title: "如何实现工具参数校验（Tool Validation）？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "工具校验"
source: GitHub 100 Questions
---

**题目**：如何实现工具参数校验（Tool Validation）？

**结论句（15 秒）**：在 tool 节点前加 validate 节点用 Pydantic 校验 LLM 输出参数，不通过写 error 回 agent 重试。

**追问方向**：和 JSON schema 关系？

### 回答

**优先级**：P2 · 1 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

工具参数校验是**生产安全的基础防线**——LLM 生成的 tool_calls 参数可能是错的、越界的、甚至恶意的。

**为什么在 tool 节点前加 validate 节点**：
- LLM 可能 hallucinate 参数（类型错、范围越界、必填缺失）
- 直接执行可能导致：调错 API、写错数据库、安全风险
- validate 节点是**纯函数**，不执行副作用，失败成本为零

**实现方式**：
1. tool 定义时用 Pydantic model 或 @tool 装饰器的 args_schema
2. validate 节点读取 LLM 的 tool_calls，用同一 schema 校验
3. 失败：写 `validation_error` 进 state，条件边回 agent 节点让它重生成
4. 通过：条件边进真实 tool 节点

**schema 同源原则**：@tool 装饰器的 args_schema 和 validate 节点用同一个 Pydantic model，避免两套定义不一致。

**高危 tool 额外加 policy 节点**：检查用户权限（这个 user 能调 delete 吗？）、参数范围（删除数量 < 100？）、操作频率（5 分钟内不超过 3 次？）。

