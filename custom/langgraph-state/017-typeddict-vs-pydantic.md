---
title: "State 用 TypedDict 还是 Pydantic 定义？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 状态]
point: "Schema 定义"
source: 官方文档
---

**题目**：State 用 TypedDict 还是 Pydantic 定义？

**结论句（15 秒）**：两者均可；TypedDict 更轻量常用，Pydantic 提供运行时校验，适合对 state 输入输出要严格验证的场景。

**追问方向**：序列化有什么限制？ · 嵌套对象怎么处理？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- State schema 是所有节点的输入输出契约
- 必须可 JSON 序列化才能 checkpoint
- Pydantic 校验更严，TypedDict 性能更好

**🗣️ 标准口语答案**

LangGraph 的 State 可以是 TypedDict 或 Pydantic BaseModel。工程里 TypedDict 更常见，配合 Annotated 声明 reducer，类型提示够用且轻量。Pydantic 适合需要运行时校验的场景，比如防止节点写入非法枚举值。

无论哪种，checkpoint 要求 state 可序列化——dict、list、str、int 没问题，开着的 DB 连接、socket 不行。嵌套结构用 plain dict 比自定义 class 省事。

选型我会从最小 schema 起步，边跑边加字段，避免一开始过度设计导致后期重构痛苦。

