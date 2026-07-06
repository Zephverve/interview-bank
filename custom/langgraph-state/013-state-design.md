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

**📖 核心要点**
- 只放跨节点共享的数据，工具局部变量不进 state
- messages 用 add_messages append-only
- 临时字段在特定边之后清空，防 checkpoint 膨胀

**🗣️ 标准口语答案**

State 设计我习惯四步。先画业务流程，标出决策点和回退路径。再定义 TypedDict，给每个字段注明更新策略：messages 是 append-only，current_intent 覆盖写，temp_search_results 在汇总后清空。

原则有三：只放跨节点共享的，不要把数据库连接、HTTP client 这类不可序列化对象塞进去；列表类字段必须配 reducer，否则并发节点会覆盖；图里只留当前任务推进必需的，跨会话历史和知识库走外置存储。

阿里面经爱问「节点间状态流转」——本质就是这份 schema 约定。团队里没人写 reducer 语义，半年后图会变成谁也不敢动的黑箱，所以我会把 state 演化策略写进 README 或代码注释。

