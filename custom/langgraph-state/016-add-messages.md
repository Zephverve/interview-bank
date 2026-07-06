---
title: "add_messages 和 MessagesState 有什么特别之处？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 状态]
point: "消息通道"
source: ModelEngine 社区
---

**题目**：add_messages 和 MessagesState 有什么特别之处？

**结论句（15 秒）**：add_messages 智能合并消息列表，支持去重和 RemoveMessage 撤回，比 operator.add 更适合对话轨迹。

**追问方向**：消息太多怎么裁剪？ · 和 conversation buffer 关系？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- 内置 reducer，按 message id 去重合并
- 支持 RemoveMessage 做撤回/修订
- MessagesState 是预置的 messages-only schema

**🗣️ 标准口语答案**

add_messages 是 LangGraph 为对话场景定制的 reducer。相比简单 list append，它能按 message id 智能合并、去重，还支持 RemoveMessage 在图执行中撤回或替换某条消息，适合「人类修改草稿后继续」这类场景。

MessagesState 则是预置的 TypedDict，只有 messages 一个 channel 且已配好 add_messages，快速搭聊天 Agent 很省事。

生产里消息会膨胀，所以要在图里加 trim 节点或 summarization 节点，在进 LLM 前裁剪历史，而不是无限往 state 里堆。这和 checkpoint 膨胀是同一类问题。

