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

**🗣️ 标准口语答案**

我先说结论，再展开原因。

checkpointer 在每个 super-step 后序列化整个 state 存盘（Memory/SQLite/Postgres）。可序列化：str/int/float/bool/list/dict、LangChain Message 对象、Pydantic model_dump()。不可序列化：DB connection、socket、thread lock、lambda、大型 binary blob。

违反序列化约束会导致 checkpoint 写入失败或恢复崩溃，是生产上线前的硬门槛。也是 checkpoint 膨胀治理的前提。

大对象 → 外部存储 + state 留 ID/URI。敏感信息 → config 或密钥服务，不进 state。图片/PDF → OSS/S3，state 留 doc_id。检索结果 → 摘要 + chunk_id 列表，全文用时再拉。

EvoAgent 检索 50 篇文献，state 只存 top-5 的 chunk_id 和 200 字摘要，全文从向量库按需加载。checkpoint 从 2MB 降到 20KB，恢复时间从秒级到毫秒级。

把 embedding 向量数组全塞 state；API key 进 state 被 checkpoint 持久化；图片 base64 进 state 导致膨胀。

