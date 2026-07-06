---
title: "Corrective RAG / Self-RAG / Adaptive RAG 怎么用 Lan…"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 工程]
point: "高级 RAG"
source: GitHub 100 Questions
---

**题目**：Corrective RAG / Self-RAG / Adaptive RAG 怎么用 LangGraph 实现？

**结论句（15 秒）**：CRAG：grade 后不好则 web_search 补检索；Self-RAG：生成带自评 token 条件回流；Adaptive：入口 router 选 RAG 策略。

**追问方向**：和科研问答 grade_retrieval 关系？

### 回答

**优先级**：P2 · 1 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

这三种高级 RAG 变体在 LangGraph 里的实现差异，本质上是「图拓扑不同」——论文里的算法 = 图上的节点和条件边。面试讲清楚这一点，比背论文公式更有说服力。

Corrective RAG (CRAG)：在标准 RAG 的 grade 节点之后，如果相关度低，条件边不是简单 rewrite query，而是路由到 web_search 节点补充外部资料，再通过 merge_context 节点把 web 结果和原有 retrieval_docs 合并，然后 generate。拓扑：retrieve → grade → [低分] → web_search → merge → generate。科研问答项目的 grade_retrieval + rewrite 就是 CRAG 的简化版。

Self-RAG：generate 节点输出 answer 的同时输出自评 token（is_supported、is_relevant 等），critique 节点解析自评结果，条件边——不支持则回 retrieve 或 rewrite；支持但不够相关则回 generate 重写；全通过则 END。比 CRAG 多了「生成后自评」的环节，形成 generate → critique → [不通过] → retrieve/rewrite 的内环。

Adaptive RAG：入口多一个 router 节点，根据问题类型（事实问答/推理/闲聊/结构化查询）选择不同 RAG 策略——vector RAG 路径、GraphRAG 路径、直答（不用 RAG）、SQL 查询路径。每种策略是图上的一个分支，router 是入口条件边。适合问题类型差异大的综合问答系统。

三种模式可以组合：Adaptive 选策略 → CRAG 质量门控 → Self-RAG 生成自评。

