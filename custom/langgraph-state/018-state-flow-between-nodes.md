---
title: "每个节点之间的状态流转是什么样的？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 状态]
point: "状态流转"
source: 牛客 · 阿里淘天
---

**题目**：每个节点之间的状态流转是什么样的？

**结论句（15 秒）**：节点读当前 state → 返回 partial update → reducer 合并 → 条件边决定下一节点；本质是 S_{t+1} = merge(S_t, node_output)。

**追问方向**：怎么保证节点效果？ · 复杂对象怎么传？

### 回答

**优先级**：P0 · 3+ 篇面经

#### 🗣️ 先用大白话说

阿里淘天一面原题。状态流转是：框架把当前完整 state 传给节点，节点返回只含变更字段的 dict，框架用 reducer 合并，然后根据边定义决定下一个节点。比如 intent_node 写 current_intent → 条件边路由到 rag_node 或 tool_node → rag_node append retrieval_docs → summarize_node 读 docs 生成答案。讲流转时最好画一张图，标出每个节点读写哪些字段。

#### 📖 面试展开（详细版）

**① 是什么**

状态流转公式：S_{t+1} = merge(S_t, node_output)。节点是纯函数：读 state，返回 partial update，不 mutate。合并后完整 state 传给下一节点或条件边路由函数。

**② 为什么重要**

阿里淘天一面核心项目题，结合「怎么保证节点效果」考工程深度。能画流转图 + 标字段策略是加分项。

**③ 怎么用 / 四步设计**

画业务流程 → 定义 schema 和 reducer → 节点纯函数返回 update → 条件边读合并后 state 路由。保证节点效果：独立 IO 契约、路由逻辑单测、线上监控节点耗时和失败率。

**④ 项目例子（EvoAgent）**

用户输入 → intent_node 写 current_intent → 条件边：research 走 rag_node append retrieval_docs → grade_node 写 quality_score → 条件边：不够 rewrite_node 改 query 回 rag_node，够了 generate_node append AIMessage → citation_check_node → interrupt 或 END。

**⑤ 常见坑**

节点内 mutate state；条件边读的是合并前旧 state（实际不会，但要理解时序）；临时字段不清空污染下游。

#### 💡 核心要点
- 节点不 mutate state，只返回 dict
- 合并后整条 state 传给下一节点
- 条件边读合并后的 state 做路由

#### 📝 代码/配置示例

```python
# S_{t+1} = merge(S_t, node_output)
def intent_node(state: AgentState) -> dict:
    intent = classify(state["messages"][-1].content)
    return {"current_intent": intent}  # 只返回变更

# 条件边读合并后的 state
def route(state) -> str:
    return "rag" if state["current_intent"] == "research" else "chat"
```

#### 🔁 追问怎么接

- 「保证节点效果」：IO 契约 + 单测 + 线上监控 + bad case 回流评测
- 「复杂对象」：传 ID 不传全文；编排 state 和领域 data 分离
- 「排查节点差」：LangSmith trace 看输入输出 state diff
