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

#### 🗣️ 先用大白话说

**一句话**：Skill 化不是把 prompt 存成 markdown 文件，而是把「一类任务的完整打法」变成可版本、可组合、可回归测试的工程资产。

**打个比方**：没有 Skill 化时，每个需求都是厨师临场发挥；Skill 化后，高频菜有标准菜谱（流程）、固定厨具（工具子集）、品控表（回归用例），新厨师照做也能出稳定品质。

#### 📖 面试展开（详细版）

Skill 化的核心是**把 tacit knowledge（隐性经验）变成 explicit asset（显式资产）**，在 LangGraph 语境下具体落地为三层：

① **入口收敛**——把几十个零散 tool 收敛成 3-5 个稳定入口（如 `search_docs`、`submit_ticket`、`generate_report`），LLM 只在稳定接口上选择，减少 hallucinate tool name 的概率。② **流程边界写清楚**——每个 skill 对应图里的一条子路径或子图，明确输入 state 字段、输出字段、失败 fallback，配 10-20 条回归用例。③ **版本化与组合**——skill v1.2 改了 retrieve 策略不影响 generate skill，可以 A/B。

演进价值必须**量化**，否则是空话：新数据源接入改几处代码？（理想：只改 adapter 节点）线上 bad case 有没有自动入库 + 每周复盘？新人接手要不要读 5000 行 prompt？（理想：读 skill 文档 + 跑回归集即可）。

和 MCP 的关系：MCP 是**工具接入协议**（怎么连外部服务），Skill 是**任务编排资产**（怎么组合工具完成一类任务），两者正交——MCP 提供 tool，Skill 定义图路径。字节 skill 分层可接：静态库 + 动态匹配 + 沉淀机制，LangGraph 里用路由节点选 skill 子集。

#### 💡 核心要点
- 入口收敛稳定工具
- 流程边界+回归用例
- 新数据源改几处可量化

#### 📝 代码/配置示例

```python
# Skill 化：路由节点选 tool 子集 + 子图
SKILL_REGISTRY = {
    "research": {"tools": [search_paper, fetch_citation], "subgraph": research_graph},
    "ticket":   {"tools": [create_ticket, query_status],   "subgraph": ticket_graph},
}

def route_skill(state):
    skill = classify_intent(state["query"])
    return skill  # 条件边 → 对应子图入口
```

#### 🔁 追问怎么接

- **「和 MCP 关系？」** → MCP 管工具怎么连（协议层），Skill 管任务怎么打（编排层）；一个 MCP server 可以被多个 skill 复用。
- **「字节 skill 分层怎么答？」** → 静态 skill 库（版本化 prompt+tool 子集）+ 动态匹配（路由节点按 intent 选 skill）+ 沉淀机制（bad case 触发 skill 迭代）；LangGraph 里每个 skill 可以是 compile 好的子图。
