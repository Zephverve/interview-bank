---
title: 4. 向量数据库怎么选？Milvus、FAISS、Qdrant 各自适合什么场景？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [RAG, 卡码笔记]
point: 4. 向量数据库怎么选？Milvus、FAISS、Qdr
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/rag_interview.html

> 来源文章：RAG大厂面试题汇总：向量检索、混合检索、Rerank、幻觉处理高频问题

---

**题目**：4. 向量数据库怎么选？Milvus、FAISS、Qdrant 各自适合什么场景？

**结论句（15 秒）**：面试官会问：&quot;你们项目用的什么向量数据库

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;你们项目用的什么向量数据库？为什么选它？&quot;

 

### 三者对比

  FAISS Milvus Qdrant 类型 库（Library） 数据库（Database） 数据库（Database） 部署方式 嵌入应用进程 独立服务，支持分布式 独立服务，轻量级 持久化 需自己实现 原生支持 原生支持 适合规模 百万级以下 亿级 千万级 运维成本 低（无额外服务） 中（需部署集群） 低（单节点起步） 生产环境 适合原型验证 适合大规模生产 适合中小规模生产 面试答法：先说你的选型理由，再提你知道其他方案的优缺点。比如：&quot;我们选 Milvus，因为生产环境需要多副本部署和持久化，FAISS 不支持分布式，Qdrant 当时生态还不够成熟。如果是做 Demo 我会用 FAISS，快。&quot;