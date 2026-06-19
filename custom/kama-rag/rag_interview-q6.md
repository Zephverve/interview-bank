---
title: 6. Rerank 是什么？为什么检索之后还要重排序？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [RAG, 卡码笔记]
point: 6. Rerank 是什么？为什么检索之后还要重排序？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/rag_interview.html

> 来源文章：RAG大厂面试题汇总：向量检索、混合检索、Rerank、幻觉处理高频问题

---

**题目**：6. Rerank 是什么？为什么检索之后还要重排序？

**结论句（15 秒）**：面试官会问：&quot;你已经用混合检索了，为什么还要 Rerank

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;你已经用混合检索了，为什么还要 Rerank？检索结果不够好吗？&quot;

 

### 检索和 Rerank 的区别

 检索是粗筛——从百万文档里快速捞出 Top-20，速度快但精度有限。用向量相似度或 BM25 打分，这种打分是近似的，不一定反映真实相关性。

 Rerank 是精排——对 Top-20 重新计算相关性分数，用更精确的模型（通常是 Cross-Encoder）逐个打分，把真正最相关的排到前面。

 

### 为什么检索的打分不够准？

 向量检索用的是 Bi-Encoder：问题和文档分别编码成向量，再算相似度。问题和文档在编码时互不知道对方的存在，所以只能算&quot;大概相关&quot;。

 Rerank 用的是 Cross-Encoder：把问题和文档拼在一起送进模型，模型可以同时看到双方内容，做更精确的相关性判断。代价是慢——Cross-Encoder 不能预计算，每个 (问题, 文档) 对都要过一遍模型，所以只能对少量候选做精排。

 

 

### Rerank 的效果

 实际项目中，Rerank 带来的提升很明显：

 指标 检索后（无 Rerank） Rerank 后 Top-5 召回率 71% 89% Top-3 准确率 65% 84% 

### 常用 Rerank 模型

 模型 特点 BGE-Reranker (bge-reranker-v2-m3) 中文效果好，开源免费 Cohere Rerank API 调用，效果好，英文为主 bce-reranker-base_v1 中文场景，轻量级 面试答法：&quot;检索是粗筛快捞，Rerank 是精排提准。检索用 Bi-Encoder 快但粗，Rerank 用 Cross-Encoder 慢但准。先用检索从百万级捞 Top-20，再用 Rerank 精排取 Top-5，这是生产环境的标配流程。&quot;