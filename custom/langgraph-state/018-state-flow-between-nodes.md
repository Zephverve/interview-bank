---
title: "每个节点之间的状态流转是什么样的？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 状态]
point: "状态流转"
source: 牛客 · 阿里淘天
---

**题目**：每个节点之间的状态流转是什么样的？

**结论句（15 秒）**：节点读当前 state → 返回 partial update → reducer 合并 → 条件边决定下一节点；本质是 S_{t+1} = merge(S_t, node_output)。

**追问方向**：怎么保证节点效果？ · 复杂对象怎么传？

### 回答

**优先级**：P0 · 3+ 篇面经

**📖 核心要点**
- 节点不 mutate state，只返回 dict
- 合并后整条 state 传给下一节点
- 条件边读合并后的 state 做路由

**🗣️ 标准口语答案**

阿里淘天一面原题。状态流转是：框架把当前完整 state 传给节点函数，节点返回一个只含变更字段的 dict，框架用 reducer 合并进全局 state，然后根据边定义决定下一个节点。

比如流程是 intent_node → 写 current_intent → 条件边读 intent 路由到 rag_node 或 tool_node → rag_node append retrieval_docs → summarize_node 读 docs 生成答案。每一步下一节点看到的都是合并后的最新 state。

复杂数据表面是 TypedDict 堆字段，实质是状态演化策略——哪些 append、哪些 merge、哪些在路由后清空。讲流转时最好画一张图，标出每个节点读写哪些字段。

