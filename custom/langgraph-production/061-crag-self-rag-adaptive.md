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

**📖 核心要点**
- 每种是不同条件边拓扑
- Self-RAG 多 generate+critique 环
- Adaptive 多一路由节点

**🗣️ 标准口语答案**

三种都是图拓扑差异。CRAG：grade 节点判相关低 → 条件边到 web_search 节点补资料 → 再 merge 回 context → generate。Self-RAG：generate 输出含 is_supported 自评，不支持则回 retrieve 或 rewrite。Adaptive：入口 router 根据问题类型选 vector RAG、不用 RAG 直答、或 SQL 路径。

科研问答的 grade_retrieval + rewrite 就是 CRAG 思想。讲清楚「论文里的算法 = 图上的节点和边」，面试官会认为你真做过。

