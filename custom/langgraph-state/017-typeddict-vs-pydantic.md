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

#### 🗣️ 先用大白话说

LangGraph 的 State 可以用 TypedDict 或 Pydantic BaseModel 定义。工程里 TypedDict 更常见，配合 Annotated 声明 reducer，类型提示够用且轻量。Pydantic 适合需要运行时校验的场景，比如防止节点写入非法枚举值。无论哪种，checkpoint 要求 state 可序列化——dict、list、str 没问题，开着的数据库连接、socket 不行。选型建议从最小 schema 起步，边跑边加字段。

#### 📖 面试展开（详细版）

**① 是什么**

TypedDict：静态类型提示 + Annotated reducer，无运行时校验，性能更好。Pydantic BaseModel：运行时校验字段类型和约束，可自动转 dict 序列化，开销略高。

**② 为什么重要**

Schema 是所有节点的契约，选型影响开发体验和 checkpoint 兼容性。面试考的是「知道两种都行，能说出取舍」。

**③ 怎么用 / 选型**

默认 TypedDict + Annotated。需要严格校验（枚举、范围、嵌套模型）时用 Pydantic。嵌套结构优先 plain dict 而非自定义 class，便于 JSON 序列化。

**④ 项目例子**

EvoAgent 用 TypedDict 起步，citation_status 后来需要严格枚举校验（pending/approved/rejected），该字段改用 Pydantic 子模型或 Literal 类型约束。

**⑤ 常见坑**

Pydantic 模型嵌套不可序列化字段；TypedDict 无运行时校验导致节点写入脏数据；一开始 schema 过大后期难 refactor。

#### 💡 核心要点
- State schema 是所有节点的输入输出契约
- 必须可 JSON 序列化才能 checkpoint
- Pydantic 校验更严，TypedDict 性能更好

#### 📝 代码/配置示例

```python
# TypedDict：轻量常用
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    status: str

# Pydantic：运行时校验
class AgentState(BaseModel):
    messages: list = []
    status: Literal["pending", "done"]
```

#### 🔁 追问怎么接

- 「序列化限制」：必须 JSON/msgpack 可序列化，连接/模型实例不行
- 「嵌套对象」：plain dict 或 Pydantic model.model_dump()
- 「选型」：默认 TypedDict，要严格校验再上 Pydantic
