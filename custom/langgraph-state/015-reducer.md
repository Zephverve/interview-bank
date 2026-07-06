---
title: "reducer 是什么？为什么并行节点更新状态时需要 reducer？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 状态]
point: "Reducer"
source: LangGraph 面经整理
---

**题目**：reducer 是什么？为什么并行节点更新状态时需要 reducer？

**结论句（15 秒）**：reducer 定义多节点写同一 channel 时的合并语义；无 reducer 则后写覆盖先写，并发时会丢数据。

**追问方向**：add_messages 特别在哪？ · 自定义 reducer 怎么写？

### 回答

**优先级**：P0 · 4+ 篇面经

**📖 核心要点**
- Annotated[List, add] 表示追加而非覆盖
- 并行分支写同一 key 必须声明合并逻辑
- operator.add / 自定义 merge 函数均可

**🗣️ 标准口语答案**

reducer 是挂在 state 字段上的合并函数。节点返回 partial update 时，如果多个节点在同一 super-step 写同一字段，框架用 reducer 决定怎么合——默认是覆盖，最后写的赢。

并行节点场景下，如果没 reducer，两个节点同时改 messages 或 tool_results，后执行的直接覆盖先执行的，完全没有警告。这是阿里国际面经里最高频的踩坑之一。

常见写法：messages 用 Annotated[list, add_messages]，工具结果用自定义 merge dict。面试要说清 reducer 不是语法糖，是在约束「并发写同一字段时语义是什么」——团队得写这份约定，否则图不可维护。

