---
title: 向量数据库选型与实践
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [向量数据库, RAG, 架构选型]
point: 存储选型
---

**题目**：向量数据库怎么选？FAISS、Milvus、Pinecone、pgvector 有什么区别？

**结论句（15 秒）**：看阶段和数据量——原型用 FAISS 零运维；中小规模加 pgvector 存量复用；上了百万向量上 Milvus；受不了运维买 Pinecone——没有银弹，看团队的 infra 能力和延迟要求。

**追问方向**：什么时候不用向量数据库？ · 索引类型怎么选？ · 精度和速度的取舍？

### 回答

我帮面试官画一条决策树：规模决定架构，不是功能列表决定。

**原型/小规模（<10 万向量）→ FAISS 或 Chroma。** 本地库零运维，延迟微秒级，缺点单机、增量写入要重建索引。适合验证和个人项目。

**中小规模（10 万–100 万）+ 已有 PG → pgvector。** 向量和业务 metadata 同一事务，一个 SQL 搞定向量检索 + 过滤 + JOIN。百万以内还行，过了延迟和召回率开始吃紧。

**大规模（>100 万）→ Milvus / Qdrant / Weaviate。** 分布式 ANN，IVF+PQ 十亿向量毫秒级返回。精度要求高用 HNSW 或 FLAT，省内存用 IVF_PQ。Milvus 部署重，Qdrant 单机开箱但分布式不如 Milvus 成熟。

**不想管运维 → Pinecone / Zilliz Cloud。** 全托管但贵，适合 infra 弱但要快速上线。
