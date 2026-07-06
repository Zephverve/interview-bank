---
title: "工具链能不能 Skill 化？项目有没有演进价值？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 面经]
point: "Skill 化"
source: 牛客 · 百度
---

**题目**：工具链能不能 Skill 化？项目有没有演进价值？

**结论句（15 秒）**：Skill 化是把高频任务打法变成可版本、可组合、可测的资产，不是 markdown 换名；演进价值用接入成本、bad case 闭环、新人上手成本量化。

**追问方向**：和 MCP 关系？ · 字节 skill 分层怎么答？

### 回答

**优先级**：P2 · 1 篇面经

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

Skill 化的核心是**把 tacit knowledge（隐性经验）变成 explicit asset（显式资产）**，在 LangGraph 语境下具体落地为三层：

① **入口收敛**——把几十个零散 tool 收敛成 3-5 个稳定入口（如 `search_docs`、`submit_ticket`、`generate_report`），LLM 只在稳定接口上选择，减少 hallucinate tool name 的概率。② **流程边界写清楚**——每个 skill 对应图里的一条子路径或子图，明确输入 state 字段、输出字段、失败 fallback，配 10-20 条回归用例。③ **版本化与组合**——skill v1.2 改了 retrieve 策略不影响 generate skill，可以 A/B。

演进价值必须**量化**，否则是空话：新数据源接入改几处代码？（理想：只改 adapter 节点）线上 bad case 有没有自动入库 + 每周复盘？新人接手要不要读 5000 行 prompt？（理想：读 skill 文档 + 跑回归集即可）。

和 MCP 的关系：MCP 是**工具接入协议**（怎么连外部服务），Skill 是**任务编排资产**（怎么组合工具完成一类任务），两者正交——MCP 提供 tool，Skill 定义图路径。字节 skill 分层可接：静态库 + 动态匹配 + 沉淀机制，LangGraph 里用路由节点选 skill 子集。

