---
title: "LangGraph 里怎么集成 RAG？"
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 工程]
point: "RAG 集成"
source: 牛客 · 阿里淘天
---

**题目**：LangGraph 里怎么集成 RAG？

**结论句（15 秒）**：RAG 作为 retrieve/grade/generate 节点嵌入图，质量门控不通过走 rewrite 环，比线性 RAG Chain 更可控。

**追问方向**：CRAG/Self-RAG 怎么画？ · 和科研问答项目怎么讲？

### 回答

**优先级**：P1 · 3+ 篇面经

#### 🗣️ 先用大白话说

**一句话**：RAG 在 LangGraph 里不是外挂插件，而是「检索→评判→不够好就改写重查→生成→校验引用」的节点链，每个环节是一条边，不够好可以回退重试。

**打个比方**：线性 RAG Chain 像单行道——检索完只能往前生成；LangGraph RAG 像环岛——检索不满意可以绕回去换关键词再检索。

#### 📖 面试展开（详细版）

RAG 与 LangGraph 的集成是 Agent 岗面经最高频的捆绑考点（阿里淘天、某大厂、编程导航均有）。核心思路：RAG 不是 LangGraph 的外挂插件，而是嵌入图内的节点链，每个环节是一个 node，环节之间的质量门控是条件边。

标准 RAG 图拓扑：retrieve_node 调向量库/混合检索，结果写入 state.retrieval_docs；grade_node 用 LLM 评判检索结果与 query 的相关性，写入 state.grade_score；条件边——score 低于阈值则路由到 rewrite_query_node（改写 query 写回 state.query）再回到 retrieve_node 形成环；score 够高则路由到 generate_node 基于 retrieval_docs 生成 answer；可选 cite_check_node 校验 answer 是否有 retrieval_docs 支撑，不通过则回 generate_node 重写。

比线性 RAG Chain 的核心优势：检索失败能改写 query 重试（而非带着空结果让 LLM 幻觉）；生成质量不够能据引用校验回流；每个节点可独立单测和监控；checkpoint 让「检索→评判→改写→再检索」的完整轨迹可追溯。

科研问答项目讲法：意图路由（intent_node 决定走向量 RAG 还是 GraphRAG）+ 质量门控（grade + rewrite 环）+ 引用校验（cite_check 环）。面试最好画 state 字段（query、retrieval_docs、grade_score、answer）和边。阿里淘天捆绑问的 RAG 分块、重叠、embedding 选型，可接在 retrieve_node 实现细节后讲。

#### 💡 核心要点
- retrieve → grade → 分支
- 不够好 rewrite query 回 retrieve
- cite_check 再环

#### 📝 代码/配置示例

```python
builder.add_node("retrieve", retrieve_node)
builder.add_node("grade", grade_node)
builder.add_node("rewrite", rewrite_query_node)
builder.add_node("generate", generate_node)

builder.add_edge("retrieve", "grade")
builder.add_conditional_edges("grade", lambda s: "rewrite" if s["grade_score"] < 0.7 else "generate", {
    "rewrite": "rewrite", "generate": "generate"
})
builder.add_edge("rewrite", "retrieve")  # 回边形成环
builder.add_edge("generate", END)
```

#### 🔁 追问怎么接

- **CRAG/Self-RAG 怎么画**：CRAG 加 web_search 补检索；Self-RAG 生成带自评 token 回流
- **科研问答怎么讲**：意图路由 + grade/rewrite 环 + cite_check 环，画 state 和边
- **加分项**：对比线性 Chain 优势、每节点可单测、阿里淘天 RAG 分块可接 retrieve 细节
