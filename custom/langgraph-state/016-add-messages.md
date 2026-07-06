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

#### 🗣️ 先用大白话说

add_messages 是 LangGraph 为对话场景定制的 reducer。相比简单 list append，它能按 message id 智能合并、去重，还支持 RemoveMessage 在图执行中撤回或替换某条消息——适合「人类修改草稿后继续」的场景。MessagesState 是预置 TypedDict，只有 messages 且已配好 add_messages，快速搭聊天 Agent 很省事。生产里消息会膨胀，要在图里加 trim 或 summarization 节点裁剪历史。

#### 📖 面试展开（详细版）

**① 是什么**

add_messages(old_messages, new_messages) 是对话专用 reducer：追加新消息、按 id 去重、支持 RemoveMessage 删除指定消息。MessagesState 是 LangGraph 预置的 TypedDict，仅含 messages 字段且已绑定 add_messages。

**② 为什么重要**

对话 Agent 的 messages 是最常被并行写的 channel，也是 checkpoint 膨胀的主要来源。用对 reducer 是对话轨迹正确性的基础。

**③ 怎么用 / 执行流程**

节点返回 {"messages": [AIMessage(...)]} 或 {"messages": [RemoveMessage(id=...)]}。框架自动合并。消息过多时在 LLM 调用前加 trim_node，保留最近 N 条或摘要 older messages。

**④ 项目例子**

EvoAgent 人工审核 interrupt 后，用户修改 AI 草稿：返回 RemoveMessage 删掉旧 AIMessage，再 append 新版。add_messages 正确处理，简单 append 会留下两条矛盾回答。

**⑤ 常见坑**

无限堆 messages 不裁剪；用 operator.add 代替 add_messages 导致重复消息；RemoveMessage 的 id 不对导致删不掉。

#### 💡 核心要点
- 内置 reducer，按 message id 去重合并
- 支持 RemoveMessage 做撤回/修订
- MessagesState 是预置的 messages-only schema

#### 📝 代码/配置示例

```python
from langgraph.graph.message import add_messages, RemoveMessage
from langchain_core.messages import AIMessage

def revise_draft(state):
    old_id = state["messages"][-1].id
    return {
        "messages": [
            RemoveMessage(id=old_id),
            AIMessage(content="修订后的回答", id="new-1"),
        ]
    }
```

#### 🔁 追问怎么接

- 「消息太多」：trim 节点保留最近 N 条；summarization 压缩 older
- 「和 buffer 关系」：buffer 是概念，add_messages 是 LangGraph 实现
- 「MessagesState 何时够」：纯聊天无其他 state 字段时
