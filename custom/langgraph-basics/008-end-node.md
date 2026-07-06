---
title: "END 节点为什么重要？"
round: 一面
difficulty: ⭐
tags: [LangGraph, 基础]
point: "图终止"
source: GitHub 100 Questions
---

**题目**：END 节点为什么重要？

**结论句（15 秒）**：END 是显式终止符，条件边必须能路由到 END，否则图可能无限循环或无法判断完成。

**追问方向**：怎么判断 Agent 该结束了？ · 多个出口怎么设计？

### 回答

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

END 是 LangGraph 的虚拟终止节点。条件边路由函数可以返回 END，表示任务完成、不再继续。显式终止很重要，因为 Agent 循环里「什么时候停」是核心难题——不能全靠 recursion_limit 硬砍，否则用户看到的是 500 错误而不是优雅结束。好的做法是条件边同时看：LLM 是否不再请求工具，以及 step_count 或业务标志位是否达标。

#### 📖 面试展开（详细版）

**① 是什么**

END 是 LangGraph 内置的特殊节点，路由到 END 表示图执行终止，返回最终 state。从 START 到 END 是一条合法执行路径。

**② 为什么重要**

ReAct Agent 若无明确 END 路径，会在 agent↔tools 环里转直到 GraphRecursionError。用户体验差，且浪费 token 和 API 费用。

**③ 怎么用 / 执行流程**

条件边 path_map 必须包含到 END 的映射，如 {"end": END, "tools": "tools"}。路由函数判断：无 tool_calls → "end"；或 step_count >= max → "end"；或业务标志 task_done → "end"。recursion_limit 作为最后防线。

**④ 项目例子**

科研 Agent 在 generate 后 citation_check 通过 → END；不通过且 retry_count < 3 → 回 generate；retry 耗尽 → fallback_node → END。

**⑤ 常见坑**

路由 map 无 END 路径；只靠 recursion_limit 不设业务终止条件；多个出口未区分「成功 END」和「失败 END」（应用不同 fallback 节点再 END）。

#### 💡 核心要点
- END 标记图执行终止，触发最终 state 返回
- 条件边应包含到 END 的路径
- 结合 recursion_limit 和业务完成标志双重保险

#### 📝 代码/配置示例

```python
from langgraph.graph import END

def should_continue(state):
    if state.get("step_count", 0) >= 10:
        return "end"
    if not state["messages"][-1].tool_calls:
        return "end"
    return "tools"

graph.add_conditional_edges("agent", should_continue, {"tools": "tools", "end": END})
```

#### 🔁 追问怎么接

- 「怎么判断该结束」：无 tool_calls + 业务标志 + step 上限三重
- 「多个出口」：成功 END vs fallback→END，state 里记录 exit_reason
- 「和 recursion_limit」：END 是优雅终止，recursion_limit 是硬兜底
