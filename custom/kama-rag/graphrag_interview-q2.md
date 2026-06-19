---
title: 2. RAG 的演进：从"找文本"到"找关系"
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [RAG, 卡码笔记]
point: 2. RAG 的演进：从"找文本"到"找关系"
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/graphrag_interview.html

> 来源文章：GraphRAG与LightRAG大厂面试题汇总：从RAG到知识图谱检索

---

**题目**：2. RAG 的演进：从"找文本"到"找关系"

**结论句（15 秒）**：面试官会问：&quot;GraphRAG 和传统 RAG 本质区别是什么

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;GraphRAG 和传统 RAG 本质区别是什么？RAG 这条线是怎么演进过来的？&quot;

 

### 三代 RAG 的演进路线

 要理解 GraphRAG 为什么出现，得先看 RAG 这条线是怎么一步步走过来的。

 Naive RAG——最原始的 RAG：文档切块 → 向量化 → 检索 → 塞给 LLM 生成。问题很多：检索不准、幻觉严重、没有 Rerank。讲透RAG讲的很多优化手段，在 Naive RAG 里都没有。

 Advanced RAG——在讲透RAG里详细讲过的那些优化：混合检索补上关键词匹配的短板、Rerank 做精排提准、Query 改写对付模糊问题、Parent-Child 检索兼顾精度和上下文。这些优化确实把&quot;找文本块&quot;这件事做到了极致。

 GraphRAG——换了一条路：不再只找文本块，而是先建一个知识图谱，把实体和关系都结构化地存下来，检索时走图谱找关系。从&quot;找文本&quot;变成了&quot;找关系&quot;。

 演进逻辑特别清晰：Naive RAG 的问题是&quot;找不准&quot;→ Advanced RAG 把检索策略调到最好 → 但有些问题不是找文本块能解决的 → GraphRAG 换了检索范式。

 

 

### 一句话定位 GraphRAG

 给 RAG 装上知识图谱，让检索从&quot;找文本块&quot;变成&quot;找实体和关系&quot;。

 传统 RAG 检索的是&quot;和问题相似的文本&quot;，GraphRAG 检索的是&quot;和问题相关的实体、关系、社区&quot;。前者是局部匹配，后者是结构化理解。