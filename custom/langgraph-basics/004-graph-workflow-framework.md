---
title: "为什么 LangGraph 被称为图状工作流框架？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 基础]
point: "图编排本质"
source: CSDN 高频题
---

**题目**：为什么 LangGraph 被称为图状工作流框架？

**结论句（15 秒）**：因为它用 Node+Edge+State 显式建模控制流，支持条件分支、并行、循环，比隐式 Chain 更可审计、可测试。

**追问方向**：和普通 Workflow 引擎差在哪？ · 图灵完备意味着什么？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

被称为「图状工作流」，是因为 LangGraph 不把 Agent 当成黑盒循环，而是把执行流程显式画成有向图：State 是共享数据，Node 是读 state、写更新的函数，Edge 决定下一步去哪。普通边固定跳转，条件边根据 state 动态路由。这和传统 Workflow 的差别在于：原生支持环（ReAct、重试）、状态自动合并（reducer）、compile 时可注入 checkpointer 变成可暂停的状态机。

#### 📖 面试展开（详细版）

**① 是什么**

「图状工作流框架」指用 Node + Edge + State 三元组建模控制流，而非隐式的函数嵌套或 prompt 内规划。每个节点是计算单元，边是路由逻辑，条件边让 LLM 或规则动态决定下一跳。

**② 为什么重要**

显式图比黑盒 Agent 更可审计、可测试、可观测。面试官加分点：能说出 super-step 执行模型——每个 super-step 里所有就绪节点并行跑，跑完同步 state，类似 Pregel/Bulk Synchronous Parallel。

**③ 怎么用 / 执行流程**

构建：StateGraph(AgentState) → add_node → add_edge / add_conditional_edges → compile。运行：从 START 出发，按边跳转，遇到回边形成循环，直到路由到 END。compile 期做结构检查（孤立节点等）。

**④ 项目例子**

科研 Agent 的 grade_node 用条件边：检索质量够 → generate，不够 → rewrite → 回 retrieve。整张图可视化后，新人能一眼看懂流程，比读嵌套 Python 快得多。

**⑤ 常见坑**

条件边路由不稳定（LLM 返回意外 key）导致跑飞；没画 END 出口；不理解 super-step 导致并发写 state 冲突。

#### 💡 核心要点
- 有向图：节点是计算单元，边是路由逻辑
- 条件边让 LLM/规则动态决定下一步
- 编译期检查孤立节点，运行期 super-step 同步状态

#### 📝 代码/配置示例

```python
graph.add_conditional_edges(
    "router",
    lambda s: s["next_step"],  # 纯函数读 state
    {"rag": "rag", "tool": "tool", "end": END},
)
```

#### 🔁 追问怎么接

- 「和普通 Workflow 差在哪」：原生环 + reducer + checkpoint
- 「图灵完备」：条件边 + 回边可表达任意控制流，但应克制使用
- 加分：提 super-step 并行同步模型
