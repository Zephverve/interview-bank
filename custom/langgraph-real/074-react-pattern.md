---
title: "如何用 LangGraph 实现 ReAct 模式？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 面经]
point: "ReAct"
source: CSDN + GitHub
---

**题目**：如何用 LangGraph 实现 ReAct 模式？

**结论句（15 秒）**：agent 节点调 LLM → 条件边看 tool_calls → tool 节点执行 → 回边 agent，直到无 tool_calls 走 END。

**追问方向**：和 create_react_agent 区别？ · 为什么要手写图？

### 回答

**优先级**：P0 · 3+ 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

ReAct 是 LangGraph 最经典的环，**一面 P0 必考**，必须能在 30 秒内画完拓扑。

**三环结构**：
1. **agent_node**：LLM 绑定 tools，输入 messages，输出 AIMessage（可能含 tool_calls）
2. **should_continue**（条件边）：检查最后一条 message 有没有 tool_calls → 有则去 tool_node，没有则 END
3. **tool_node**：执行 tool_calls，返回 ToolMessage，add_edge 回 agent_node

**State**：`messages: Annotated[list, add_messages]`——agent 和 tool 节点都往 messages 追加。

**手写图 vs create_react_agent**：
- `create_react_agent` 是开箱即用，底层仍是图
- **手写图的优势**：可以在环里插节点——tool 后加 sanitize（过滤敏感信息）、agent 前加 compress（压缩历史）、失败走 fallback 节点
- 面试讲手写证明你**理解环怎么运转**，不是只会调 API

**防死循环**：`recursion_limit=25`；条件边里加 iteration 计数器；业务层限制 tool 调用次数。

**面试准备**：白板画三张图——state 字段、三个节点、条件边 + 回边，30 秒完成。

