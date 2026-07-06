---
title: "如何处理并发节点写同一 state 字段？"
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 状态]
point: "并发冲突"
source: 阿里国际面经
---

**题目**：如何处理并发节点写同一 state 字段？

**结论句（15 秒）**：为字段配置 reducer 做合并写；或拆 channel 避免并行写同一 key；绝不做无保护的覆盖写。

**追问方向**：怎么发现覆盖问题？ · Send 并行后怎么 reduce？

### 回答

**优先级**：P0 · 4+ 篇面经

**🗣️ 标准口语答案**

我先说结论，再展开原因。

同一 super-step 内多个节点就绪并行执行，各自返回 partial update。写同一 channel 且无 reducer 时，last-write-wins，先写数据丢失。

阿里国际面经原题，区分「跑通 demo」和「理解并行语义」。Send API 普及后这题频率还在上升。

解法一：Annotated + reducer（列表 append、dict merge、计数累加）。解法二：并行分支写不同 key（docs_source_a、docs_source_b），下游 aggregate_node 合并。解法三：Send fan-out + reducer 聚合 Map-Reduce 结果。

EvoAgent 多源检索：PubMed 和 arXiv 并行 retrieve，各写 retrieval_docs（operator.add 合并）。若写同一 current_source 标量无 reducer，后完成的源覆盖先完成的，路由逻辑出错。

运行时检测「字段是否被改过」而非设计消除；dict reducer 浅合并；Send 结果未配 reducer。

