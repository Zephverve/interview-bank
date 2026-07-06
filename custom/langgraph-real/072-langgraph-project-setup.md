---
title: "说说你们 AI Agent 项目 LangGraph 怎么搭的？"
round: 一面/二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 面经]
point: "项目架构"
source: 编程导航面经
---

**题目**：说说你们 AI Agent 项目 LangGraph 怎么搭的？

**结论句（15 秒）**：定义 state schema → 纯函数节点 → 条件边编排 → compile 注入 checkpointer → FastAPI 暴露 stream → LangSmith 监控。

**追问方向**：最强节点是哪个？ · 重构过什么？

### 回答

**优先级**：P0 · 2 篇面经

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

编程导航一面/二面 P0 原题，**五步法**必须能脱稿背诵，再结合自己项目替换节点名。

**Step 1：定义 AgentState**
```
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]  # append-only
    intent: str                              # 覆盖写
    docs: list                               # 覆盖写
    retry_count: int                         # 覆盖写
```
每个字段注明 reducer 策略，列表用 `add_messages`，标量直接覆盖。

**Step 2：纯函数节点**——每个能力一个 node：`retrieve`、`grade`、`rewrite`、`generate`、`cite_check`。节点只做一件事，输入 state 返回 partial update，副作用放 tool 节点。

**Step 3：条件边编排**——`grade` 不过 → `rewrite` → 回 `retrieve`；`cite_check` 不过 → 回 `generate`；超过 retry 上限 → `fallback`。

**Step 4：compile 注入**——`PostgresSaver` 做 checkpoint；`interrupt_before=["publish"]` 做 HITL 审批。

**Step 5：API 层**——FastAPI `astream` 暴露 SSE；LangSmith 看节点级 trace 和 token 消耗。

**替换点**：说成自己的科研问答/简历项目，每个节点准备一个 data point（grade 阈值 0.7、rewrite 最多 3 次、P99 延迟 2.3s）。

