---
title: 8. Embedding 模型怎么选？中文场景选什么？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [RAG, 卡码笔记]
point: 8. Embedding 模型怎么选？中文场景选什么？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/rag_interview.html

> 来源文章：RAG大厂面试题汇总：向量检索、混合检索、Rerank、幻觉处理高频问题

---

**题目**：8. Embedding 模型怎么选？中文场景选什么？

**结论句（15 秒）**：面试官会问：&quot;你们用的什么 Embedding 模型

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;你们用的什么 Embedding 模型？为什么选它？和 OpenAI 的 ada-002 对比过吗？&quot;

 

### 选型维度

 选 Embedding 模型看三个维度：语言支持、向量维度、检索效果（MTEB 排名）。

 

### 中文场景主流模型

 模型 维度 特点 bge-large-zh-v1.5 1024 中文效果最好，开源，本地部署 bge-m3 1024 多语言，支持稠密+稀疏+多向量三种检索 text-embedding-3-large (OpenAI) 3072 效果好，但 API 调用有成本，中文不如 bge text-embedding-3-small (OpenAI) 1536 便宜，效果够用，英文场景首选 

### 维度越高越好吗？

 不是。维度高→表达能力强但存储和检索成本也高。1024 维是当前性价比最好的选择，3072 维的检索效果提升有限但存储翻 3 倍。

 面试答法：&quot;中文场景选 bge-large-zh，因为 MTEB 中文榜单排名靠前，而且开源可以本地部署，不用走 API。如果是英文场景或对延迟不敏感，OpenAI 的 embedding 更方便。&quot;