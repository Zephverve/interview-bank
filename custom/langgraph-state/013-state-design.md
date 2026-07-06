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

**🗣️ 标准口语答案**

我先说结论，再展开原因。

State 通常用 TypedDict 或 Pydantic 定义，是图内所有节点的输入输出契约。每个字段可绑定 reducer 声明合并语义。节点只返回 partial update，框架合并成完整 state。

阿里淘天一面原题「节点间状态流转」本质就是 State schema 设计。设计不好，半年后图变成谁也不敢改的黑箱；设计好，新人看 schema 就懂数据怎么流。

第一步，画业务流程，标决策点和回退路径。第二步，定义 TypedDict，每字段注明 append/merge/覆盖/清空策略。第三步，节点写成纯函数，只返回 update。第四步，在特定边之后清空临时字段，防 checkpoint 膨胀。

EvoAgent State 示例：messages（add_messages append-only）、retrieval_docs（append，汇总后清空）、current_intent（覆盖）、quality_score（覆盖）、retry_count（累加）、citation_status（覆盖，审核后清空）。跨会话用户偏好放 PostgreSQL，不进 state。

字段爆炸成 giant dict；不可序列化对象进 state；列表无 reducer 被并发覆盖；什么都塞 state 导致 checkpoint 膨胀。

