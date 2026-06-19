---
title: 5. 纯向量检索有什么问题？为什么需要混合检索？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [RAG, 卡码笔记]
point: 5. 纯向量检索有什么问题？为什么需要混合检索？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/rag_interview.html

> 来源文章：RAG大厂面试题汇总：向量检索、混合检索、Rerank、幻觉处理高频问题

---

**题目**：5. 纯向量检索有什么问题？为什么需要混合检索？

**结论句（15 秒）**：面试官会问：&quot;你们项目用的纯向量检索还是混合检索

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;你们项目用的纯向量检索还是混合检索？为什么？&quot;这是 RAG 面试的高频考点。

 

### 纯向量检索的三个致命问题

 ① 精确匹配不行——用户搜&quot;RFC 7231&quot;，向量检索可能返回&quot;HTTP 协议规范&quot;这种语义相关但没提到 RFC 7231 的文档。因为它靠语义相似度，不是精确匹配。

 ② 专业术语召回差——&quot;K8s 的 HPA 怎么配置&quot;，向量检索可能找的是&quot;Kubernetes 自动扩缩容&quot;，而真正包含 HPA 配置细节的文档反而排不上。专业术语的向量表示和口语描述的向量表示距离可能很远。

 ③ 专有名词遗漏——产品名、人名、缩写这些，向量检索容易丢失。

 

### 混合检索 = 向量检索 + 关键词检索

 混合检索同时跑两路：

 - 向量检索：抓语义相关的文档（&quot;数据库优化&quot;和&quot;SQL 调优&quot;能匹配上）
 - 关键词检索（BM25）：抓精确匹配的文档（&quot;RFC 7231&quot;能精确命中）
 两路结果合并，取长补短。

 

 

### 合并策略：RRF（Reciprocal Rank Fusion）

 最常用的合并方法，公式很简单：

 RRF_score(d) = Σ 1 / (k + rank_i(d))
 1
k 通常设 60，rank_i(d) 是文档 d 在第 i 路检索中的排名。排名越靠前，贡献分数越高。

 def rrf_merge(vector_results, bm25_results, k=60):
    scores = {}
    for rank, doc in enumerate(vector_results):
        scores[doc.id] = scores.get(doc.id, 0) + 1 / (k + rank + 1)
    for rank, doc in enumerate(bm25_results):
        scores[doc.id] = scores.get(doc.id, 0) + 1 / (k + rank + 1)
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)
 1
2
3
4
5
6
7
面试核心点：能说清楚纯向量检索的三个问题，以及混合检索为什么能解决，合并策略用 RRF。这就是面试官想听的深度。