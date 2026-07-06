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

**🗣️ 标准口语答案**

我先说结论，再展开原因。

add_messages(old_messages, new_messages) 是对话专用 reducer：追加新消息、按 id 去重、支持 RemoveMessage 删除指定消息。MessagesState 是 LangGraph 预置的 TypedDict，仅含 messages 字段且已绑定 add_messages。

对话 Agent 的 messages 是最常被并行写的 channel，也是 checkpoint 膨胀的主要来源。用对 reducer 是对话轨迹正确性的基础。

节点返回 {"messages": [AIMessage(...)]} 或 {"messages": [RemoveMessage(id=...)]}。框架自动合并。消息过多时在 LLM 调用前加 trim_node，保留最近 N 条或摘要 older messages。

EvoAgent 人工审核 interrupt 后，用户修改 AI 草稿：返回 RemoveMessage 删掉旧 AIMessage，再 append 新版。add_messages 正确处理，简单 append 会留下两条矛盾回答。

无限堆 messages 不裁剪；用 operator.add 代替 add_messages 导致重复消息；RemoveMessage 的 id 不对导致删不掉。

