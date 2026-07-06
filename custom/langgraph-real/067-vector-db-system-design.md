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

#### 🗣️ 先用大白话说

**一句话**：把「数据落向量库」建模成一条 ETL 子图，每个步骤是一个 node，失败从 checkpoint 断点续跑，不重复已成功批次。

**打个比方**：像工厂流水线——原料入口分三条线（PDF/网页/结构化），每条线经过切分→向量化→装箱入库，任何一站停电（失败）从上一站成品接着干，不用从头再来。

#### 📖 面试展开（详细版）

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

#### 💡 核心要点
- parse → chunk → embed → upsert 各为 node
- 失败重试不回滚已成功批次
- 元数据过滤与多租户

#### 📝 代码/配置示例

```python
class IngestState(TypedDict):
    source_type: str
    chunks: Annotated[list, operator.add]
    batch_id: str
    progress: int

def route_source(state):
    return {"pdf": "parse_pdf", "web": "parse_web"}[state["source_type"]]

# embed 完 upsert 失败 → checkpoint resume 从 upsert 续
graph = builder.compile(checkpointer=PostgresSaver(...))
```

#### 🔁 追问怎么接

- **「多路召回怎么接？」** → 入库完成后，问答子图 retrieve 节点并行查 vector + keyword + graph，Send API fan-out，reducer 合并多路结果到 `docs[]`。
- **「增量更新？」** → upsert 节点用 doc_id 幂等键；state 记 version，变更文档只 re-embed 变更 chunk，checkpoint 支持单文档断点续跑。
