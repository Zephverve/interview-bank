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

**🗣️ 标准口语答案**

我先说结论，再展开原因。

reducer 通过 Annotated[Type, reducer_fn] 绑定到 state 字段。节点返回 partial update 时，同一 super-step 内多个写同一 channel 的值，由 reducer_fn(old, new) 合并成最终值。无 Annotated 时默认 last-write-wins。

LangGraph 支持并行 super-step（Send API、多分支），reducer 是并行一致性的核心。不理解 reducer 就无法解释「为什么我的 messages 少了一半」。

定义：messages: Annotated[list, add_messages]。运行时：node_A 返回 {"messages": [msg1]}，node_B 返回 {"messages": [msg2]}，super-step 结束后 reducer 合并为 [..., msg1, msg2] 而非只留 msg2。

EvoAgent 多源并行检索：两个 retrieve 节点同时返回 retrieval_docs，用 operator.add 追加合并。若默认覆盖，先完成的检索结果被后完成的吃掉，答案缺文献。

列表字段无 reducer；自定义 reducer 非交换律导致合并顺序影响结果；dict 合并浅拷贝丢嵌套数据。

