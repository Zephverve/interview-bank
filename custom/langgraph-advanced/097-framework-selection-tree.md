---
title: "LangGraph / LangChain / LlamaIndex / CrewAI 选型决策…"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "框架决策树"
source: Agent 架构 15 问
---

**题目**：LangGraph / LangChain / LlamaIndex / CrewAI 选型决策树？

**结论句（15 秒）**：LlamaIndex 偏数据索引；LangChain 偏组件链；CrewAI 快速多角色；LangGraph 复杂可控流程；可组合使用。

**追问方向**：能说出 trade-off 吗？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：选型看核心需求——数据索引用 LlamaIndex，简单链用 LangChain，快速原型用 CrewAI，复杂可控流程用 LangGraph；可以组合使用。

**打个比方**：像选交通工具——运货用卡车（LlamaIndex），短途用自行车（LangChain），团建包车用巴士（CrewAI），复杂物流调度用调度系统（LangGraph）。

#### 📖 面试展开（详细版）

框架选型决策树是**二面 P1 题**，考察全局视野而非只会一个框架。

**决策树**：

```
核心需求是什么？
├── 数据接入/索引/检索 → LlamaIndex
│   └── 100+ 数据源 connector、高级索引策略
├── 简单线性 LLM 链 → LangChain LCEL
│   └── retriever → prompt → LLM → parser，20 行搞定
├── 快速多角色原型 → CrewAI
│   └── 定义 role + goal + backstory，自动协作
└── 复杂可控 Agent 流程 → LangGraph
    └── 循环、checkpoint、HITL、条件分支、子图
```

**Trade-off 对比**：

| 框架 | 优势 | 劣势 | 适合 |
|---|---|---|---|
| LlamaIndex | 检索强、数据 connector 多 | 不包全流程编排 | RAG-heavy 项目 |
| LangChain | 生态大、组件全 | 复杂流程难表达 | 简单链、原型 |
| CrewAI | 快速、多角色开箱即用 | 控制流黑盒、难定制 | 快速验证想法 |
| LangGraph | 可控、可测、生产特性全 | 学习曲线陡、前期设计成本高 | 生产 Agent |

**组合使用**（实际项目最常见）：
- LlamaIndex 做检索 + LangGraph 做编排
- LangChain 组件（message、retriever、tool）+ LangGraph 图
- CrewAI 快速验证 → 生产迁移到 LangGraph

**面试技巧**：说 trade-off 比背名字强——「CrewAI 适合快速验证，但如果要 HITL 和 checkpoint，生产一定上 LangGraph」。

#### 💡 核心要点
- 数据-heavy 先 LlamaIndex
- 原型 CrewAI
- 生产复杂 Agent LangGraph

#### 🔁 追问怎么接

- **「能说出 trade-off 吗？」** → 每个框架一句话 trade-off：LlamaIndex 检索强但不包编排；LangChain 生态大但复杂流程难表达；CrewAI 快但控不住；LangGraph 稳但重；实际项目常组合使用。
