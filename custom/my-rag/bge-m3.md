---
title: Embedding 模型的结构是什么？BGE-M3 有什么特别？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [rag, 面试]
point: Embedding 模型的结构是什么？BGE-M3 有什么特
---

**题目**：Embedding 模型的结构是什么？BGE-M3 有什么特别？

### 回答

- 通用结构：**Encoder-only Transformer**（BERT 架构）+ **池化层**（CLS 或 mean pooling）→ 得到定长向量。
- **BGE-M3 的三个 M**：**Multi-Linguality**（多语言，支持 100+ 语种）、**Multi-Functionality**（同时输出 dense / sparse / multi-vector 三种表示）、**Multi-Granularity**（支持从短句到 8192 token 的长文档）。
- **为什么选它**：一个模型同时给 Dense 和 Sparse 两路表示，正好契合我的三路召回架构，省掉单独维护一个稀疏模型的开销。
- 维度：BGE-M3 dense 是 **1024 维**（这个数字要背下来，面试官爱追问）。

**追问预判**：
- 「为什么不用 OpenAI 的 embedding？」→ 数据隐私（科研论文不能外传）+ 成本 + 可离线部署。
- 「1024 维会不会太占存储？」→ 100 万条 chunk × 1024 × 4 字节 ≈ 4GB 原始向量，对单机 Qdrant 完全可以承受；真正占内存的是 HNSW 的图结构索引。
