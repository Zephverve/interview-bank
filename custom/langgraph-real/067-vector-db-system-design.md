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

**📖 核心要点**
- parse → chunk → embed → upsert 各为 node
- 失败重试不回滚已成功批次
- 元数据过滤与多租户

**🗣️ 标准口语答案**

编程导航二面场景题，我答 LangGraph + 条件边：入口 router 识别 PDF/网页/结构化数据走路不同 parse 节点；chunk_node 写 chunk 列表；embed_node 批量调 embedding；upsert_node 写 Qdrant，state 记 batch_id 和进度。

断点重试靠 checkpoint——embed 完 upsert 失败从 upsert 续，不重复 embed。多路调用可 Send 并行 embed。Guardrails 节点校验 PII、文件大小、格式。

接 RAG 检索时另一子图 retrieve→grade，入库和问答解耦。讲的时候边画 state 字段边讲条件边，比只背向量库 API 强。

