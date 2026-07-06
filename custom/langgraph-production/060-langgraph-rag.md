---
title: "LangGraph 里怎么集成 RAG？"
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 工程]
point: "RAG 集成"
source: LangGraph 面经整理
---

**题目**：LangGraph 里怎么集成 RAG？

**结论句（15 秒）**：RAG 作为 retrieve/grade/generate 节点嵌入图，质量门控不通过走 rewrite 环，比线性 RAG Chain 更可控。

**追问方向**：CRAG/Self-RAG 怎么画？ · 和科研问答项目怎么讲？

### 回答

**优先级**：P1 · 3+ 篇面经

**📖 核心要点**
- retrieve → grade → 分支
- 不够好 rewrite query 回 retrieve
- cite_check 再环

**🗣️ 标准口语答案**

RAG 不是 LangGraph 外挂，而是图中的节点链：retrieve_node 调向量库写 retrieval_docs；grade_node LLM 评判相关性；条件边不够则 rewrite_query_node 回到 retrieve，够了则 generate_node；可选 cite_check 不通过回 generate。

比线性 Chain 强在：检索失败能改写重试，生成能据引用校验回流。科研问答项目就是这套——意图路由 + 质量门控 + 引用校验环，面试最好画 state 字段和边。

阿里淘天面经捆绑问 RAG 分块、重叠，可接在 retrieve 节点实现细节后讲。

