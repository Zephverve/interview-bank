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

**📖 核心要点**
- 10 行核心骨架
- 加 tool 变 ReAct 环
- 加 MemorySaver 即多轮

**🗣️ 标准口语答案**

白板题骨架：TypedDict messages Annotated[list, add_messages]；llm_node 调 llm.invoke(state["messages"]) 返回 {"messages": [response]}；StateGraph add_node set_entry_point add_edge END compile。

加 tool：加 tool_node 和 should_continue 条件边，tool→llm 回边。加 memory：compile(checkpointer=MemorySaver())，invoke 传 thread_id。

ModelEngine 社区说要点全中：reducer、START/END、返回 dict 合并。面试能脱稿写加分。

