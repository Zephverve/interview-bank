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

**📖 核心要点**
- checkpoint 需要序列化整个 state
- 放 ID/URI 代替大 blob
- 敏感字段要脱敏或加密

**🗣️ 标准口语答案**

State 只能放 checkpointer 能序列化的东西：基本类型、dict、list、Pydantic 可转 dict 的模型。不能放数据库连接、已加载的 ML 模型、lambda 这类不可 pickle 的对象——否则 checkpoint 会炸。

工程实践：PDF 内容、图片放对象存储，state 里只留 doc_id 或 chunk_id；检索结果放摘要而非全文，全文用时再拉。敏感信息如 API key 绝不进 state，走 config 或密钥服务。

这也是 checkpoint 膨胀治理的一部分——state 越小，恢复越快，存储越便宜。

