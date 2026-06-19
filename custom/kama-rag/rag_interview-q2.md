---
title: 2. RAG 的完整链路是怎样的？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [RAG, 卡码笔记]
point: 2. RAG 的完整链路是怎样的？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/rag_interview.html

> 来源文章：RAG大厂面试题汇总：向量检索、混合检索、Rerank、幻觉处理高频问题

---

**题目**：2. RAG 的完整链路是怎样的？

**结论句（15 秒）**：面试官会问：&quot;你说你做过 RAG 项目，能完整讲一下从用户提问到最终回答的链路吗

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;你说你做过 RAG 项目，能完整讲一下从用户提问到最终回答的链路吗？&quot;

 这是基础中的基础，但很多人讲不清楚。

 

### RAG 七步链路

 

 Query → 文档处理 → Chunking → Embedding → 检索 → Rerank → 生成

 每一步做什么：

 步骤 做什么 关键决策 文档处理 解析 PDF/Word/Markdown，提取文本 PDF 表格怎么处理？OCR 要不要？ Chunking 把长文档切成小块 切多大？overlap 多少？按语义切还是固定长度？ Embedding 把文本块转成向量 用什么模型？维度多少？中文还是英文？ 检索 根据用户问题检索最相关的文本块 纯向量还是混合检索？Top-K 设多少？ Rerank 对检索结果重排序 用什么 Rerank 模型？重排后再取 Top-N 生成 把检索结果 + 问题喂给 LLM 生成回答 Prompt 怎么写？幻觉怎么约束？ 面试答法：不要只背这七个步骤，要说清楚每一步的关键决策点。面试官想听的不是&quot;我用了 Milvus&quot;，而是&quot;我为什么选 Milvus 不选 FAISS，检索延迟要求多少，为什么 Top-K 设 5 不是 10&quot;。