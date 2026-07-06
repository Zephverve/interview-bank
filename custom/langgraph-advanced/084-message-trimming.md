---
title: "对话历史在图里怎么做裁剪（Message Trimming）？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "消息裁剪"
source: GitHub 100 Questions
---

**题目**：对话历史在图里怎么做裁剪（Message Trimming）？

**结论句（15 秒）**：专用 trim 节点在进 LLM 前按 token 预算保留 system+最近 k 轮+可选 summary。

**追问方向**：和 checkpoint 冲突吗？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- trim 作为独立节点
- RemoveMessage 删旧消息
- 摘要进 state.summary 字段

**🗣️ 标准口语答案**

在 agent 节点前加 trim 节点：估算 messages token，超预算则保留 system、最近 k 轮，旧的 summarize 到 state.summary 或用 RemoveMessage 删掉。

裁剪后 checkpoint 存的是裁剪后 state，有意控制体积。和压缩节点可串联：先 summarize 再 trim。

