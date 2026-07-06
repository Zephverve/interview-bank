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

#### 🗣️ 先用大白话说

**一句话**：ReAct 就是「想→做→看→再想」的环——agent 节点调 LLM，有 tool_calls 就去 tool 节点执行，执行完回 agent，直到 LLM 不再调工具。

**打个比方**：像侦探破案——推理（Thought）→ 去现场调查（Action）→ 看调查结果（Observation）→ 再推理，直到破案（END）。

#### 📖 面试展开（详细版）

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

#### 💡 核心要点
- 经典三环
- 可插 grade/fallback 节点
- 手写图为精细控制

#### 📝 代码/配置示例

```python
def agent_node(state):
    response = llm.bind_tools(tools).invoke(state["messages"])
    return {"messages": [response]}

def should_continue(state):
    last = state["messages"][-1]
    return "tools" if last.tool_calls else END

builder.add_node("agent", agent_node)
builder.add_node("tools", ToolNode(tools))
builder.add_conditional_edges("agent", should_continue)
builder.add_edge("tools", "agent")  # 回边形成环
```

#### 🔁 追问怎么接

- **「和 create_react_agent 区别？」** → 功能等价，但手写图能插 sanitize/compress/fallback 节点，精细控制每一步；create_react_agent 适合快速原型。
- **「为什么要手写图？」** → 生产环境需要在环里加质量门控（sanitize）、上下文压缩（compress）、失败降级（fallback），开箱即用满足不了；手写证明理解原理。
