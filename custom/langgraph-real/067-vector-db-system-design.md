---
title: "系统设计：数据怎么落到向量数据库？（LangGraph 方案）"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 面经]
point: "系统设计"
source: 编程导航 · AI Agent 面经
sourceUrl: https://www.codefather.cn/post/2067118684236795905
---

**题目**：系统设计：数据怎么落到向量数据库？（LangGraph 方案）

**结论句（15 秒）**：ETL 节点→embedding 节点→写入节点串成子图，条件边处理格式分支，checkpoint 支持断点重试，Guardrails 校验入库数据。

**追问方向**：多路召回怎么接？ · 增量更新？

### 回答

**优先级**：P0 · 2 篇面经

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

这是二面系统设计题，考察**能否把 ETL 流程用图编排讲清楚**，而不是背 Qdrant API。

**State 设计**：`source_type`、`raw_content`、`chunks[]`、`embeddings[]`、`batch_id`、`progress`（已处理条数）、`errors[]`。

**节点拓扑**：
1. **router 节点**——识别 PDF/网页/CSV，条件边分流到不同 parse 节点
2. **parse 节点**——输出统一格式的 text + metadata
3. **chunk 节点**——写 `chunks` 列表，记录 chunk_id 和 offset
4. **embed 节点**——批量调 embedding API，可用 Send API 并行 fan-out
5. **upsert 节点**——写 Qdrant，更新 `progress`
6. **guardrails 节点**——校验 PII、文件大小、格式，不通过走 reject 分支

**断点重试**：compile 时绑 PostgresSaver；embed 完成但 upsert 失败时，checkpoint 里已有 embeddings，resume 直接从 upsert 续，不重复调 embedding（省钱省时间）。

**与 RAG 解耦**：入库子图和问答子图分开——入库图产出索引，问答图走 retrieve→grade→generate，共享 vector store 但不共享 state。

**增量更新**：state 里记 `doc_version`，upsert 用 doc_id 做幂等键，新版本走 update 节点而非全量重跑。

