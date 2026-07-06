---
title: "上下文感知记忆压缩（Context-Aware Memory Compression）？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "记忆压缩"
source: GitHub 100 Questions
---

**题目**：上下文感知记忆压缩（Context-Aware Memory Compression）？

**结论句（15 秒）**：按当前任务意图选择性保留相关历史，无关轮次压缩进 summary 或归档外置记忆。

**追问方向**：和字节动态长期记忆？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- intent 变化触发重摘要
- 相关轮次保留
- 外置 mem0/向量存长期

**🗣️ 标准口语答案**

不是无脑砍旧消息，而是根据当前 intent 选保留哪些轮次——聊订单就保留订单相关轮，闲聊轮压缩。compress 节点读 current_intent，挑相关 messages 留，其余 summarize。

长期记忆外置 mem0/Postgres，retrieve 节点按意图回填。字节面经长期记忆召回可接这个答法。

