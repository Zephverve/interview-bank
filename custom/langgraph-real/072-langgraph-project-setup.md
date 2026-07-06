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

#### 🗣️ 先用大白话说

**一句话**：搭 LangGraph 项目有固定五步法——定义 State → 写纯函数节点 → 条件边连接 → compile 绑 checkpointer → API 层暴露 stream。

**打个比方**：像搭乐高——先定底板规格（State schema），再拼每个模块（node），用卡扣决定连接方式（条件边），最后装电池（checkpointer）和遥控器（FastAPI stream）。

#### 📖 面试展开（详细版）

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

#### 💡 核心要点
- 五步法可背诵
- 结合自己项目替换节点名
- 强调可测试和可恢复

#### 📝 代码/配置示例

```python
builder = StateGraph(AgentState)
builder.add_node("retrieve", retrieve_node)
builder.add_node("grade", grade_node)
builder.add_conditional_edges("grade", route_after_grade)
builder.set_entry_point("retrieve")

graph = builder.compile(
    checkpointer=PostgresSaver.from_conn_string(DB_URL),
    interrupt_before=["publish"],
)

# FastAPI 暴露
@app.post("/chat")
async def chat(req: ChatRequest):
    async for event in graph.astream(input, config={"thread_id": req.session_id}):
        yield sse_event(event)
```

#### 🔁 追问怎么接

- **「最强节点是哪个？」** → 选有技术深度的节点（如 grade 或 cite_check），讲设计理由 + 评测指标 + 优化过程；避免说「都重要」。
- **「重构过什么？」** → 准备一个真实重构 story：如「最初 messages 没配 reducer 被覆盖，后来改成 add_messages + 外置历史」；体现踩坑和迭代。
