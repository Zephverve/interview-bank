---
title: "LangGraph 相比普通 Workflow 的最大价值是什么？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 基础]
point: "Workflow 对比"
source: 高德 AI 应用面经
sourceUrl: https://blog.csdn.net/weixin_43726381/article/details/161294938
---

**题目**：LangGraph 相比普通 Workflow 的最大价值是什么？

**结论句（15 秒）**：Workflow 线性 A→B→C，卡住只能整体重试；LangGraph 有环、有共享 State、有 checkpoint 和 HITL，适合多轮决策任务。

**追问方向**：什么时候不必用 LangGraph？ · 迁移成本多大？

### 回答

**优先级**：P0 · 3+ 篇

#### 🗣️ 先用大白话说

普通 Workflow 或 LCEL Chain 是线性的：检索、生成、格式化三步走完，中间某步失败通常只能整链重试，不能「回到某步换策略」，也没有跨请求 state 持久化。LangGraph 把流程变成有向图，价值在三方面：可循环可跳转（代码生成→运行→改错）、显式 State 跨节点共享、interrupt 任意节点等人审批。高德面经观点：先用 Workflow 跑通，遇到循环/回溯痛点再迁 LangGraph。

#### 📖 面试展开（详细版）

**① 是什么**

Workflow（含 LCEL Chain、Airflow 式线性 DAG）：A→B→C 单向，无原生环和 checkpoint。LangGraph：有向图 + State + checkpointer + interrupt，是「可暂停的状态机 Workflow」。

**② 为什么重要**

高德、CSDN 面经高频题，考察「不必用 LangGraph」的判断力。答「什么都用 LangGraph」和答「永远不用」都不好。

**③ 怎么用 / 选型**

必须用 LangGraph：循环（ReAct/代码修复）、HITL（审批）、多 Agent 有依赖。不必用：固定三步（检索→生成→格式化），Workflow 二十行搞定。迁移：先 Workflow 跑通 MVP，痛点出现再逐步节点化。

**④ 项目例子**

保存草稿：上传→解析→存库，Workflow 够用。科研 Agent：检索→评估→改写→再检索→生成→校验，必须 LangGraph。EvoAgent 先做线性 RAG Chain，加 citation 校验失败后重生成时才迁 Graph。

**⑤ 常见坑**

固定流程硬上图；该用 Graph 时用 while 裸循环；迁移时不做 state schema 设计直接翻译代码。

#### 💡 核心要点
- Workflow：无状态、线性、难中断
- LangGraph：可循环、可回溯、可人工介入
- 固定三步任务 Workflow 20 行搞定，不必上图

#### 📝 代码/配置示例

```python
# Workflow：线性，无环
chain = retriever | grader | generator

# LangGraph：带环 + checkpoint
graph.add_edge("run_code", "agent")  # 失败回 agent 改代码
app = graph.compile(checkpointer=saver)
```

#### 🔁 追问怎么接

- 「不必用」：固定三步、无环、无审批、无跨请求恢复
- 「迁移成本」：重构图结构 + 定义 State + 配 checkpointer，1-3 天视复杂度
- 「能否用 Graph 做确定性 Workflow」：能，固定边即可，但简单场景过重
