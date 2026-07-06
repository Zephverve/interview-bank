---
title: "State 里能放什么？有哪些序列化限制？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 状态]
point: "序列化"
source: CSDN + 工程实践
---

**题目**：State 里能放什么？有哪些序列化限制？

**结论句（15 秒）**：只放可 JSON/msgpack 序列化的数据；不可放 DB 连接、模型实例；大对象放引用 ID，用时再取。

**追问方向**：图片二进制怎么处理？ · checkpoint 存多大合适？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

State 只能放 checkpointer 能序列化的东西：基本类型、dict、list、Pydantic 可转 dict 的模型。不能放数据库连接、已加载的 ML 模型、lambda 等不可 pickle 的对象，否则 checkpoint 会炸。工程实践：PDF 和图片放对象存储，state 里只留 doc_id；检索结果放摘要而非全文；API key 绝不进 state，走 config 或密钥服务。state 越小，恢复越快，存储越便宜。

#### 📖 面试展开（详细版）

**① 是什么**

checkpointer 在每个 super-step 后序列化整个 state 存盘（Memory/SQLite/Postgres）。可序列化：str/int/float/bool/list/dict、LangChain Message 对象、Pydantic model_dump()。不可序列化：DB connection、socket、thread lock、lambda、大型 binary blob。

**② 为什么重要**

违反序列化约束会导致 checkpoint 写入失败或恢复崩溃，是生产上线前的硬门槛。也是 checkpoint 膨胀治理的前提。

**③ 怎么用 / 最佳实践**

大对象 → 外部存储 + state 留 ID/URI。敏感信息 → config 或密钥服务，不进 state。图片/PDF → OSS/S3，state 留 doc_id。检索结果 → 摘要 + chunk_id 列表，全文用时再拉。

**④ 项目例子**

EvoAgent 检索 50 篇文献，state 只存 top-5 的 chunk_id 和 200 字摘要，全文从向量库按需加载。checkpoint 从 2MB 降到 20KB，恢复时间从秒级到毫秒级。

**⑤ 常见坑**

把 embedding 向量数组全塞 state；API key 进 state 被 checkpoint 持久化；图片 base64 进 state 导致膨胀。

#### 💡 核心要点
- checkpoint 需要序列化整个 state
- 放 ID/URI 代替大 blob
- 敏感字段要脱敏或加密

#### 📝 代码/配置示例

```python
# 好：只存引用
def rag_node(state) -> dict:
    docs = retriever.invoke(state["query"])
    return {"doc_ids": [d.id for d in docs], "summaries": [d.summary for d in docs]}

# 坏：塞全文和连接
# return {"full_pdfs": [open(f).read()], "db": db_connection}
```

#### 🔁 追问怎么接

- 「图片二进制」：放 OSS，state 留 url 或 doc_id
- 「checkpoint 多大合适」：单 snapshot < 100KB 理想，> 1MB 要治理
- 「敏感字段」：脱敏或根本不进 state
