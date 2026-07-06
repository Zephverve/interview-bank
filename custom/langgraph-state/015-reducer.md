---
title: "reducer 是什么？为什么并行节点更新状态时需要 reducer？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 状态]
point: "Reducer"
source: 阿里国际面经
---

**题目**：reducer 是什么？为什么并行节点更新状态时需要 reducer？

**结论句（15 秒）**：reducer 定义多节点写同一 channel 时的合并语义；无 reducer 则后写覆盖先写，并发时会丢数据。

**追问方向**：add_messages 特别在哪？ · 自定义 reducer 怎么写？

### 回答

**优先级**：P0 · 4+ 篇面经

#### 🗣️ 先用大白话说

reducer 是挂在 state 字段上的「合并函数」。多个节点在同一 super-step 写同一字段时，框架用 reducer 决定怎么合——默认是覆盖，最后写的赢。并行节点没配 reducer，两个节点同时改 messages 或 tool_results，后执行的直接覆盖先执行的，完全没有警告。这是阿里国际面经最高频踩坑之一。常见写法：messages 用 add_messages，计数器用 lambda a,b: a+b。

#### 📖 面试展开（详细版）

**① 是什么**

reducer 通过 Annotated[Type, reducer_fn] 绑定到 state 字段。节点返回 partial update 时，同一 super-step 内多个写同一 channel 的值，由 reducer_fn(old, new) 合并成最终值。无 Annotated 时默认 last-write-wins。

**② 为什么重要**

LangGraph 支持并行 super-step（Send API、多分支），reducer 是并行一致性的核心。不理解 reducer 就无法解释「为什么我的 messages 少了一半」。

**③ 怎么用 / 执行流程**

定义：messages: Annotated[list, add_messages]。运行时：node_A 返回 {"messages": [msg1]}，node_B 返回 {"messages": [msg2]}，super-step 结束后 reducer 合并为 [..., msg1, msg2] 而非只留 msg2。

**④ 项目例子**

EvoAgent 多源并行检索：两个 retrieve 节点同时返回 retrieval_docs，用 operator.add 追加合并。若默认覆盖，先完成的检索结果被后完成的吃掉，答案缺文献。

**⑤ 常见坑**

列表字段无 reducer；自定义 reducer 非交换律导致合并顺序影响结果；dict 合并浅拷贝丢嵌套数据。

#### 💡 核心要点
- Annotated[List, add] 表示追加而非覆盖
- 并行分支写同一 key 必须声明合并逻辑
- operator.add / 自定义 merge 函数均可

#### 📝 代码/配置示例

```python
import operator
from typing import Annotated
from langgraph.graph.message import add_messages

class State(TypedDict):
    messages: Annotated[list, add_messages]
    docs: Annotated[list, operator.add]
    count: Annotated[int, lambda old, new: old + new]
```

#### 🔁 追问怎么接

- 「add_messages 特别在哪」：按 id 去重、支持 RemoveMessage
- 「自定义 reducer」：签名 (old, new) -> merged，要可交换或明确顺序
- 「默认覆盖何时够用」：单写者标量字段如 current_step
