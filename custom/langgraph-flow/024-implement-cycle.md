---
title: "LangGraph 怎么实现循环？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 控制流]
point: "循环"
source: CSDN 高频题
---

**题目**：LangGraph 怎么实现循环？

**结论句（15 秒）**：通过回边 add_edge("tool", "agent") 形成 ReAct 闭环，条件边 should_continue 决定是否继续或 END。

**追问方向**：和 while True 区别？ · 多出口循环怎么画？

### 回答

**优先级**：P0 · 3+ 篇

#### 🗣️ 先用大白话说

LangGraph 的循环不是靠外面套 while True，而是在图里画一条「回头路」——比如 tool 节点执行完，用 add_edge 连回 agent 节点，形成 ReAct 闭环。每转一圈，state 都会更新，还能被 checkpoint 存下来。条件边 should_continue 就像路口红绿灯：有 tool_calls 就去调工具，没有就 END 结束。这比裸 while 强在：循环边界看得见、每轮状态可持久化、任意轮可以 interrupt 挂起等人审批。

#### 📖 面试展开（详细版）

**是什么**：LangGraph 的循环通过「回边」（back edge）实现——节点 A 执行完后，边可以指回之前的节点 B，形成环。经典 ReAct 模式是 agent_node → 条件边判断 → tool_node → 回边回到 agent_node，直到 LLM 不再发起 tool_calls 才走 END。

**为什么不用 while**：外面套 while True 也能循环，但状态管理、断点恢复、人工介入都靠自己写胶水代码。LangGraph 把每一轮循环当成图的一个 super-step，天然支持 checkpoint 和 interrupt，循环边界画在图上，团队一眼能看懂控制流。

**怎么用**：定义 should_continue 路由函数，读 state 里最后一条 message 有没有 tool_calls；有则返回 "tools" 映射到 tool_node，没有返回 END。tool_node 执行完用 add_edge("tools", "agent") 连回去。多出口循环可以在 mapping 里加 "retry"、"fallback"、"end" 等 key。

**项目例子**：科研问答 Agent 里，Retrieve → Grade → 分数不够就 Rewrite 回 Retrieve，这就是带环的图。如果用 Chain 写，要嵌套多层 if-else 和 try-except；用 LangGraph 一张图表达，每个节点可单独单测。

**踩坑**：只画回边不设退出条件，必然死循环；务必配合 recursion_limit 和业务级 step_count 双保险。另一个坑是 tool_node 回边写错方向，导致跳过 agent 直接无限调工具。

#### 💡 核心要点
- tool_node 执行完回到 agent_node
- 条件边判断有无 tool_calls
- 业务完成标志 + recursion_limit 双保险

#### 📝 代码/配置示例

```python
from langgraph.graph import StateGraph, END

def should_continue(state):
    last = state["messages"][-1]
    if getattr(last, "tool_calls", None):
        return "tools"
    return END

graph = StateGraph(AgentState)
graph.add_node("agent", agent_node)
graph.add_node("tools", tool_node)
graph.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
graph.add_edge("tools", "agent")  # 回边形成循环
app = graph.compile()
```

#### 🔁 追问怎么接

**「和 while True 区别？」**——强调三点：图上循环可 checkpoint/interrupt；每轮 state 显式演化；条件边可单测。while 适合脚本，LangGraph 适合要上线的 Agent。

**「多出口循环怎么画？」**——条件边 mapping 里定义多个出口：retry 回上一节点、fallback 降级、end 正常结束。举例说明「检索失败走 rewrite 回 retrieve，重试 3 次后走 fallback」。
