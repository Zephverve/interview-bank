---
title: CrewAI 和 AutoGen、LangGraph 怎么选？
round: 一面/二面
difficulty: ⭐⭐⭐⭐
tags: [mcp, 面试]
point: CrewAI 和 AutoGen、LangGraph 怎么选
---

**题目**：CrewAI 和 AutoGen、LangGraph 怎么选？

### 回答

**三个框架的核心抽象**：
- **CrewAI**：`Agent`（角色/目标/背景故事）+ `Task`（描述/期望输出/context 依赖）+ `Crew` + `Process`。两种执行策略：
  - **Sequential**：按 task 列表顺序执行，前序输出作为后续 context，任务**预先分配**。
  - **Hierarchical**：模拟企业层级，需要指定 `manager_llm` 或 `manager_agent`，任务**不预分配**，由 manager 规划、委派、审核、判断完成。
- **AutoGen**：经典抽象是 `ConversableAgent` / `AssistantAgent` / `UserProxyAgent` / `GroupChat` + `GroupChatManager`。**v0.4 是彻底重写**，改成三层：`autogen-core`（Actor 模型 + 事件驱动 + 异步消息）/ `autogen-agentchat`（高层任务驱动 API）/ `autogen-ext`（模型客户端、MCP Workbench、Docker 执行器）。`GroupChat` 被 **Teams** 取代（`RoundRobinGroupChat` / `SelectorGroupChat` / `Swarm` / `MagenticOneGroupChat`）。
- **LangGraph**：`State`（共享状态 + Reducer 控制并发合并）+ `Node` + `Edge`（静态边 / 条件边 / `Command` / `Send`）+ `Checkpointer`（按 `thread_id` 持久化，支持崩溃恢复和 time travel）。

**四维对比与选型**：

| 维度 | CrewAI | AutoGen | LangGraph |
|---|---|---|---|
| 控制粒度 | 粗（角色编排） | 中（对话/事件） | **细（图级、状态级）** |
| 上手速度 | **最快** | 快 | 较慢（要理解 graph/state） |
| 可调试性 | 一般 | 中 | **强（可断点、可重放）** |
| 生产适用性 | 中（快速原型、角色型流程） | 中高（分布式、多语言） | **高（持久化、人工介入、可控终止）** |

**选型话术**：
- 角色分工明确的业务流程 → **CrewAI**（抽象最贴近业务语言，上手快）
- 需要多 Agent 对话/辩论、要分布式部署 → **AutoGen**（Actor 模型天然支持跨进程）
- 需要精细控制流、人工介入、可恢复、可观测的生产级复杂工作流 → **LangGraph**

**结合你自己的实践说**："我的 RAG 系统用的是 **LangGraph**，因为它的流程本质就是'节点 + 条件边'的状态机，图的抽象天然贴合，而且 Checkpointer 支持中断恢复。我的 EvoAgent 是手写的，因为需要框架不支持的运行时动态干预（主 Agent 往子 Agent 的 session 里注入指令）。**我没有 CrewAI 和 AutoGen 的生产实践，但如果要我快速交付一个角色分工明确的业务，我会选 CrewAI。**"

**追问预判**：
- 「LangGraph 的中断恢复怎么实现的？」→ 编译时用 `interrupt_before` / `interrupt_after` 指定断点，运行时可以用 `interrupt(value)` 动态中断，恢复用 `Command(resume=value)`。**关键坑：中断恢复会重执行整个节点，所以 interrupt 之前不能有副作用**（比如不能已经调用了外部 API）。
- 「LangGraph 的 State 并发更新怎么办？」→ 用 **Reducer**。默认行为是覆盖，并发更新会丢数据；用 `Annotated[list, operator.add]` 这类 reducer 才能正确合并。
