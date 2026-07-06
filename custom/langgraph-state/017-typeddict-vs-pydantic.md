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

**🗣️ 标准口语答案**

我先说结论，再展开原因。

TypedDict：静态类型提示 + Annotated reducer，无运行时校验，性能更好。Pydantic BaseModel：运行时校验字段类型和约束，可自动转 dict 序列化，开销略高。

Schema 是所有节点的契约，选型影响开发体验和 checkpoint 兼容性。面试考的是「知道两种都行，能说出取舍」。

默认 TypedDict + Annotated。需要严格校验（枚举、范围、嵌套模型）时用 Pydantic。嵌套结构优先 plain dict 而非自定义 class，便于 JSON 序列化。

EvoAgent 用 TypedDict 起步，citation_status 后来需要严格枚举校验（pending/approved/rejected），该字段改用 Pydantic 子模型或 Literal 类型约束。

Pydantic 模型嵌套不可序列化字段；TypedDict 无运行时校验导致节点写入脏数据；一开始 schema 过大后期难 refactor。

