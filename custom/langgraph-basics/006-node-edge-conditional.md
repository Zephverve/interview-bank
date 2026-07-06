---
title: "Node、Edge、Conditional Edge 分别是什么？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 基础]
point: "图三要素"
source: CSDN + 官方文档
---

**题目**：Node、Edge、Conditional Edge 分别是什么？

**结论句（15 秒）**：Node 是处理 state 的函数；Edge 是固定跳转；Conditional Edge 用路由函数根据 state 动态选择下一节点。

**追问方向**：Node 能放什么逻辑？ · 条件边不稳定怎么办？

### 回答

**优先级**：P0 · 4+ 篇

#### 🗣️ 先用大白话说

Node 是图里的工作单元，本质就是 Python 函数：接收当前 state，返回要合并的更新字典，可以是 LLM 调用、工具执行或规则判断。普通 Edge 表示 A 跑完一定去 B。Conditional Edge 是 A 跑完后调用路由函数读 state，返回值查表决定下一跳——这是 Agent 动态决策的关键，比如看最后一条 message 有没有 tool_calls。START 和 END 是虚拟入口和终止节点。

#### 📖 面试展开（详细版）

**① 是什么**

Node：(state) -> partial_update dict，不应直接 mutate state。Edge：固定跳转 add_edge("A", "B")。Conditional Edge：add_conditional_edges("A", route_fn, path_map)，route_fn 是纯函数，只读 state 返回 key。

**② 为什么重要**

三要素是构图的基本词汇，阿里淘天一面爱结合「状态流转」考。条件边是 ReAct Agent「继续调工具 vs 结束」的核心机制。

**③ 怎么用 / 执行流程**

ReAct 典型：agent_node 调 LLM → 条件边看 response 有没有 tool_calls → 有则去 tools_node → 普通边回 agent_node → 循环直到条件边路由到 END。

**④ 项目例子**

科研 Agent 的 grade_node 后条件边：quality_score >= 0.7 → generate，否则 → rewrite。路由函数只读 retrieval_docs 和 score，便于单测。

**⑤ 常见坑**

节点内直接改 state 而非返回 update；条件边路由函数不稳定（LLM 输出飘）；路由 map 漏 key 导致 KeyError；节点里做不可重试的副作用（发邮件）无幂等。

#### 💡 核心要点
- Node：同步/异步 Python 函数，返回 partial state dict
- 普通 Edge：A 执行完必定去 B
- Conditional Edge：path_function(state) 返回 key，映射到目标节点

#### 📝 代码/配置示例

```python
def route(state) -> str:
    last = state["messages"][-1]
    if last.tool_calls:
        return "tools"
    return "end"

graph.add_conditional_edges("agent", route, {"tools": "tools", "end": END})
graph.add_edge("tools", "agent")
```

#### 🔁 追问怎么接

- 「Node 能放什么」：LLM、工具、规则、任意 Python，但副作用要幂等
- 「条件边不稳定」：加 fallback 边、step_count 上限、规则兜底
- 「多个出口」：路由 map 里多个 key 指向 END 或不同分支
