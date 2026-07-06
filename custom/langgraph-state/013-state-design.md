---
title: "LangGraph 里的状态 State 怎么设计？"
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 状态]
point: "State 设计"
source: 牛客 · 阿里淘天
---

**题目**：LangGraph 里的状态 State 怎么设计？

**结论句（15 秒）**：从业务流程出发定义 TypedDict，标注每字段更新策略（append/merge/覆盖/清空），图内只放当前任务必需数据。

**追问方向**：字段太多怎么办？ · 重构 state 成本高吗？

### 回答

**优先级**：P0 · 4+ 篇面经

#### 🗣️ 先用大白话说

State 是 LangGraph 里所有节点共享的「公共笔记本」。设计时要先画业务流程，再决定哪些信息需要跨步骤传递。每条字段都要注明更新方式：messages 只追加不覆盖，current_intent 直接覆盖，临时检索结果用完就清空。原则很简单：只放跨节点共享的数据，不要把数据库连接塞进去；列表字段必须配 reducer；图里只留当前任务需要的，历史和大文档走外部存储。

#### 📖 面试展开（详细版）

**① 是什么**

State 通常用 TypedDict 或 Pydantic 定义，是图内所有节点的输入输出契约。每个字段可绑定 reducer 声明合并语义。节点只返回 partial update，框架合并成完整 state。

**② 为什么重要**

阿里淘天一面原题「节点间状态流转」本质就是 State schema 设计。设计不好，半年后图变成谁也不敢改的黑箱；设计好，新人看 schema 就懂数据怎么流。

**③ 怎么用 / 四步设计法**

第一步，画业务流程，标决策点和回退路径。第二步，定义 TypedDict，每字段注明 append/merge/覆盖/清空策略。第三步，节点写成纯函数，只返回 update。第四步，在特定边之后清空临时字段，防 checkpoint 膨胀。

**④ 项目例子（科研 RAG Agent）**

EvoAgent State 示例：messages（add_messages append-only）、retrieval_docs（append，汇总后清空）、current_intent（覆盖）、quality_score（覆盖）、retry_count（累加）、citation_status（覆盖，审核后清空）。跨会话用户偏好放 PostgreSQL，不进 state。

**⑤ 常见坑**

字段爆炸成 giant dict；不可序列化对象进 state；列表无 reducer 被并发覆盖；什么都塞 state 导致 checkpoint 膨胀。

#### 💡 核心要点
- 只放跨节点共享的数据，工具局部变量不进 state
- messages 用 add_messages append-only
- 临时字段在特定边之后清空，防 checkpoint 膨胀

#### 📝 代码/配置示例

```python
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    retrieval_docs: Annotated[list, operator.add]
    current_intent: str  # 默认覆盖
    retry_count: Annotated[int, lambda a, b: a + b]
```

#### 🔁 追问怎么接

- 「字段太多」：拆子图独立 state；编排 state 和领域 state 分离
- 「重构成本」：新增字段向后兼容；删字段要迁移脚本
- 「团队规范」：每字段写清谁写、谁读、reducer、何时清空
