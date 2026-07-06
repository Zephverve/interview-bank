---
title: "LangGraph 和 Agent 的关系是什么？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 基础]
point: "概念关系"
source: 高德面经
---

**题目**：LangGraph 和 Agent 的关系是什么？

**结论句（15 秒）**：Agent 是「能感知、决策、行动」的系统；LangGraph 是编排 Agent 循环、工具调用和分支的引擎，不是 Agent 本身。

**追问方向**：能否用 LangGraph 实现确定性 Workflow？ · 黑盒 Agent 和白盒图区别？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

Agent 是系统能力：能根据目标自主调用工具、多轮推理、处理反馈。LangGraph 不负责「让 LLM 变聪明」，它负责把 Agent 的执行流程搭成可观测、可恢复的状态机。早期 LangChain Agent 是黑盒——给工具和目标它自己跑，中间难控；LangGraph 是白盒——每个节点、每条边你都显式定义。固定边就是 Workflow，LLM 决策的条件边就是 Agent。

#### 📖 面试展开（详细版）

**① 是什么**

Agent = LLM + 工具 + 记忆 + 规划循环（感知→决策→行动）。LangGraph = 编排引擎，提供循环（回边）、路由（条件边）、持久化（checkpoint）、人机协同（interrupt）的运行时。

**② 为什么重要**

高德面经原题，考察概念清晰度。把 LangGraph 等同于 Agent 会显得基础不牢；说 LangGraph 只是 Workflow 又忽略了 Agent 编排能力。

**③ 怎么用 / 关系**

LangGraph 不生成答案，它组织「谁什么时候调 LLM、什么时候调工具、失败了从哪重试」。用固定边 + 无 LLM 路由 → 确定性 Workflow。用条件边 + ReAct 回边 → Agent。

**④ 项目例子**

EvoAgent：Agent 能力由 LLM+检索工具+引用校验组成；LangGraph 编排 intent→rag→grade→generate→check 的流程，并在 check 前 interrupt 等人确认。

**⑤ 常见坑**

以为 LangGraph 替代 LLM；黑盒 AgentExecutor 和 LangGraph 白盒图混为一谈；用 LangGraph 但所有决策仍塞 prompt 里（图退化为直线）。

#### 💡 核心要点
- Agent = LLM + 工具 + 记忆 + 规划循环
- LangGraph 提供循环、路由、状态持久化的运行时
- 可用 LangGraph 实现 Workflow（固定边）或 Agent（条件边）

#### 📝 代码/配置示例

```python
# Agent 循环：条件边 + 回边
graph.add_node("agent", call_llm_with_tools)
graph.add_node("tools", execute_tools)
graph.add_conditional_edges("agent", has_tool_calls, {"yes": "tools", "no": END})
graph.add_edge("tools", "agent")
```

#### 🔁 追问怎么接

- 「确定性 Workflow」：能，全部用普通边、无 LLM 路由即可
- 「黑盒 vs 白盒」：AgentExecutor 黑盒；LangGraph 每步可见可测
- 「LangGraph 是 Agent 吗」：不是，是 Agent 的运行时/编排层
