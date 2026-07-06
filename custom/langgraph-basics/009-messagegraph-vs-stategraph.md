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

**🗣️ 标准口语答案**

我会先把定位说清楚：

MessageGraph：预置 messages channel + add_messages reducer，API 更短。StateGraph：通用构建器，State 可以是任意 TypedDict，支持多 channel 和多 reducer。

选型影响后续扩展成本。从 MessageGraph 迁到 StateGraph 要改 schema 和所有节点签名，早选型省重构。

简单聊天：MessageGraph() → add_node → compile，节点只读写 messages。复杂 Agent：StateGraph(AgentState) 定义多字段，节点按需更新不同 channel。

EvoAgent 最初用 MessageGraph 原型，加 retrieval_docs、quality_score、citation_status 后迁 StateGraph，否则这些字段无处安放。

复杂 Agent 仍用 MessageGraph 把业务字段塞进 message content；迁移时 checkpoint 旧 schema 不兼容。

