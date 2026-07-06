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

#### 🗣️ 先用大白话说

MessageGraph 是 StateGraph 的简化版，state 主要就是 messages 列表，内置 add_messages 做消息追加和去重，适合快速搭简单聊天 Agent。StateGraph 允许定义任意字段：current_intent、retrieval_context、approval_status 等，每个字段可配不同 reducer。一旦 Agent 不只有对话，还要管检索结果、路由标志、审批状态，就必须用 StateGraph。

#### 📖 面试展开（详细版）

**① 是什么**

MessageGraph：预置 messages channel + add_messages reducer，API 更短。StateGraph：通用构建器，State 可以是任意 TypedDict，支持多 channel 和多 reducer。

**② 为什么重要**

选型影响后续扩展成本。从 MessageGraph 迁到 StateGraph 要改 schema 和所有节点签名，早选型省重构。

**③ 怎么用 / 执行流程**

简单聊天：MessageGraph() → add_node → compile，节点只读写 messages。复杂 Agent：StateGraph(AgentState) 定义多字段，节点按需更新不同 channel。

**④ 项目例子**

EvoAgent 最初用 MessageGraph 原型，加 retrieval_docs、quality_score、citation_status 后迁 StateGraph，否则这些字段无处安放。

**⑤ 常见坑**

复杂 Agent 仍用 MessageGraph 把业务字段塞进 message content；迁移时 checkpoint 旧 schema 不兼容。

#### 💡 核心要点
- MessageGraph：messages channel + add_messages reducer
- StateGraph：自定义 TypedDict，支持多业务字段
- 复杂 Agent 几乎都用 StateGraph

#### 📝 代码/配置示例

```python
# MessageGraph：仅 messages
from langgraph.graph import MessageGraph
mg = MessageGraph()
mg.add_node("chat", call_model)

# StateGraph：多字段
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    retrieval_docs: Annotated[list, operator.add]
    current_intent: str
```

#### 🔁 追问怎么接

- 「聊天 Agent 用哪个」：纯聊天 MessageGraph 够；要带 RAG/工具状态用 StateGraph
- 「何时必须 StateGraph」：除 messages 外有任何跨节点共享字段
- 「迁移成本」：schema 变更 + 节点改造 + checkpoint 兼容
