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

**📖 核心要点**
- 独立 validate 节点
- schema 与 tool 定义同源
- 校验失败不进真实 tool

**🗣️ 标准口语答案**

LLM 产 tool_calls 后，不必直接执行。加 validate 节点用 Pydantic 或 jsonschema 校验参数类型范围，失败写 validation_error 进 state，条件边回 agent 让它重生成参数，通过才进真实 tool 节点。

schema 和 @tool 装饰器定义同源，避免两套。高危 tool 还可加 policy 节点检查权限。

