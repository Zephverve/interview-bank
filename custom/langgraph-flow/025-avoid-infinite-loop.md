---
title: "LangGraph 怎么避免死循环？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 控制流]
point: "死循环"
source: CSDN + 牛客
---

**题目**：LangGraph 怎么避免死循环？

**结论句（15 秒）**：recursion_limit + state 内 step_count + 语义级查重（如重复 tool call）+ 平滑 fallback 而非抛 500。

**追问方向**：工具一直返回空怎么办？ · 人类如何介入终止？

### 回答

**优先级**：P0 · 3+ 篇

#### 🗣️ 先用大白话说

Agent 死循环最常见的情况是：工具一直返回空，LLM 不死心反复重试，图就在 agent→tool→agent 之间空转。防法要设三道防线：框架级 recursion_limit 硬上限、state 里 step_count 软路由到 fallback、语义查重发现「同一工具同一参数调了 N 次」直接阻断。关键是不能让用户看到 GraphRecursionError 的 500，要在条件边里优雅降级，比如转人工或提示简化问题。

#### 📖 面试展开（详细版）

**是什么**：死循环指图在环里无限执行，super-step 不断增长直到触发 recursion_limit 或耗尽 token/时间预算。ReAct Agent 里最常见诱因是工具返回空/错误，LLM 换汤不换药地重试。

**为什么危险**：生产环境直接抛 GraphRecursionError 给用户是灾难体验；更隐蔽的是 token 和 API 费用持续燃烧，P99 延迟飙升，监控才发现已经跑了几十轮。

**三道防线**：第一，recursion_limit 在 invoke config 里显式设小（如 15-25），这是框架硬上限。第二，state 维护 step_count，每轮 +1，条件边里超过阈值走 fallback 而非硬砍。第三，语义查重：记录 last_tool_call，如果连续 N 次相同参数调同一失败工具，直接路由到 human_fallback。

**项目例子**：RAG Agent 检索一直为空，LLM 反复调 search 工具。我们在 smart_router 里加规则：同一 query 检索 2 次仍为空，走 query_rewrite 节点换关键词；rewrite 2 次还不行，fallback 返回「未找到相关资料，建议换个问法」。

**踩坑**：只依赖 recursion_limit 不设 fallback，用户看到 500；step_count 忘了在节点里递增导致软路由失效；语义查重太严误杀合理重试。

#### 💡 核心要点
- 框架 recursion_limit 默认 1000，应调低
- state 维护 step_count 路由到 fallback
- 比对 last_tool_call 阻断重复撞墙

#### 📝 代码/配置示例

```python
def smart_router(state):
    if state.get("step_count", 0) >= 15:
        return "fallback"
    last = state.get("last_tool_call")
    current = extract_tool_call(state["messages"][-1])
    if last == current and state.get("repeat_count", 0) >= 2:
        return "human_fallback"
    return "continue"

def agent_node(state):
    return {"step_count": state.get("step_count", 0) + 1}

app.invoke(input, config={"recursion_limit": 20})
```

#### 🔁 追问怎么接

**「工具一直返回空怎么办？」**——分层处理：先 query_rewrite 换关键词重检；rewrite 仍失败走 fallback 坦诚告知；记录 failure_reason 进监控。

**「人类如何介入？」**——step_count 超阈值或 repeat_count 触发时，条件边路由到 interrupt 节点挂起，前端展示当前 state 让人工接管或终止。
