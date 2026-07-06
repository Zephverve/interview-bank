---
title: "MessageGraph 和 StateGraph 的区别？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 基础]
point: "图类型"
source: GitHub 100 Questions
---

**题目**：MessageGraph 和 StateGraph 的区别？

**结论句（15 秒）**：MessageGraph 是仅管理 messages 列表的特例，预置 add_messages；StateGraph 可定义任意 State 字段，更灵活。

**追问方向**：聊天 Agent 用哪个？ · 多字段 state 何时必须 StateGraph？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- MessageGraph：messages channel + add_messages reducer
- StateGraph：自定义 TypedDict，支持多业务字段
- 复杂 Agent 几乎都用 StateGraph

**🗣️ 标准口语答案**

MessageGraph 可以理解为 StateGraph 的简化版，state 主要就是 messages 列表，内置 add_messages 做消息追加和去重。适合简单聊天 Agent，代码更短。

StateGraph 允许你定义任意字段：current_intent、retrieval_context、tool_results、approval_status 等，每个字段可配不同 reducer。一旦 Agent 不只有对话，还要管检索结果、路由标志、审批状态，就必须用 StateGraph。

面试时可以说：MessageGraph 是快速原型，StateGraph 是生产级定制。

