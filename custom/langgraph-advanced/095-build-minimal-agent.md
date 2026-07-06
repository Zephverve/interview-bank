---
title: "面试常考：手写最小可用 LangGraph 聊天 Agent"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "手写代码"
source: ModelEngine + GitHub
---

**题目**：面试常考：手写最小可用 LangGraph 聊天 Agent

**结论句（15 秒）**：MessagesState + llm_node + START→LLM→END；messages 用 add_messages；返回 dict 自动合并。

**追问方向**：加 tool 怎么改？ · 加 memory 怎么改？

### 回答

**优先级**：P0 · 3+ 篇

#### 🗣️ 先用大白话说

**一句话**：最小 Agent 就 10 行——MessagesState + llm_node + START→LLM→END；加 tool 变 ReAct 环，加 MemorySaver 变多轮。

**打个比方**：最小 Agent 像「Hello World」——证明你理解核心概念；加 tool 是「Hello World with input」，加 memory 是「Hello World with persistence」。

#### 📖 面试展开（详细版）

手写最小 Agent 是**一面 P0 白板题**，必须能脱稿写。

**10 行核心骨架**：
```python
from langgraph.graph import StateGraph, START, END, MessagesState

def llm_node(state):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

builder = StateGraph(MessagesState)
builder.add_node("llm", llm_node)
builder.add_edge(START, "llm")
builder.add_edge("llm", END)
graph = builder.compile()
```

**关键概念**：
- `MessagesState`：内置 state，messages 字段已配 add_messages reducer
- 节点返回 `{"messages": [response]}`：partial update，框架自动 merge
- `START` / `END`：图的入口和出口

**加 tool → ReAct 环**：
```python
builder.add_node("tools", ToolNode(tools))
builder.add_conditional_edges("llm", should_continue)  # 有 tool_calls → tools
builder.add_edge("tools", "llm")  # 回边
```

**加 memory → 多轮对话**：
```python
graph = builder.compile(checkpointer=MemorySaver())
graph.invoke(input, config={"configurable": {"thread_id": "session_1"}})
```

**ModelEngine 社区要点**：reducer（add_messages）、START/END、返回 dict 自动合并——全中。面试能脱稿写加分，加讲每步含义更加分。

#### 💡 核心要点
- 10 行核心骨架
- 加 tool 变 ReAct 环
- 加 MemorySaver 即多轮

#### 📝 代码/配置示例

```python
from langgraph.graph import StateGraph, START, END, MessagesState
from langgraph.prebuilt import ToolNode

def llm_node(state):
    return {"messages": [llm.invoke(state["messages"])]}

builder = StateGraph(MessagesState)
builder.add_node("llm", llm_node)
builder.add_edge(START, "llm")
builder.add_edge("llm", END)
graph = builder.compile()
```

#### 🔁 追问怎么接

- **「加 tool 怎么改？」** → 加 ToolNode + should_continue 条件边（有 tool_calls → tools，没有 → END）+ tools→llm 回边，变成 ReAct 环。
- **「加 memory 怎么改？」** → compile 时传 checkpointer=MemorySaver()，invoke 时 config 传 thread_id，同 thread_id 自动加载历史 messages。
