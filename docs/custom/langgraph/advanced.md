---
custom: true
partTitle: LangGraph 面经题库 · LangGraph · 进阶扩展
partColor: #6366f1
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #6366f1">

# 🔬 LangGraph · 进阶扩展

<p class="part-desc">LangGraph 面经题库 · 第 8/8 章 · 24 题</p>
<span class="part-round custom-tag">面试问答</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="real">← 📋 LangGraph · 真实面经</a>

</div>

<div class="question-card ai100-card interview-card compact-card" id="077-react-vs-plan-execute">

<h2 class="question-title"><span class="q-badge ai100-badge">Q77</span><span class="question-text">ReAct 和 Plan-and-Execute 在 LangGraph 里怎么选？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：模式选型</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：步骤清晰可预知用 Plan-and-Execute；环境反馈不确定、需频繁调工具用 ReAct；可混合 planner+react 子图。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：能画两种拓扑吗？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：任务步骤能预先列清单 → Plan-and-Execute；得边做边想、工具调用不确定 → ReAct；实际常混合用。

**打个比方**：Plan-and-Execute 像按菜谱做菜（先列步骤再执行）；ReAct 像侦探破案（推理→行动→观察→再推理，下一步取决于上一步结果）。

#### 📖 面试展开（详细版）

Agent 架构模式选型题，考察**能否根据任务结构选模式**，而不是背定义。

**Plan-and-Execute 适用场景**：
- 步骤可预先列清单：写研报、数据处理流水线、多章节文档生成
- 拓扑：planner 节点输出 `steps[]` → executor 节点逐步消费 → 某步失败 → replanner 修改剩余计划
- 优势：token 效率高（plan 一次，execute 多次）；轨迹可预测
- 劣势：计划可能过时（环境变化后原计划不适用）

**ReAct 适用场景**：
- 环境反馈不确定：开放式研究、代码 debug、工具链不确定
- 拓扑：agent → tool → agent 环，每轮 LLM 看 tool 结果再决定下一步
- 优势：灵活适应；劣势：token 消耗高、可能死循环

**混合模式**（生产常见）：planner 出粗粒度里程碑（3-5 步）→ 每个 milestone 内嵌 ReAct 子图做细粒度执行。例如「写研报」plan 出「收集数据→分析→撰写→审核」，「收集数据」这一步内部用 ReAct 调多个搜索 tool。

**面试技巧**：画两张拓扑图——Plan 是 DAG+replanner 回边；ReAct 是 agent↔tool 环——比背定义强十倍。

#### 💡 核心要点
- Plan 适合报告生成、流程固定
- ReAct 适合探索、工具链不确定
- 混合：plan 粗粒度 react 细执行

#### 📝 代码/配置示例

```python
# Plan-and-Execute 骨架
def planner_node(state):
    steps = llm.invoke(f"为任务 '{state['goal']}' 列出步骤")
    return {"plan": steps, "current_step": 0}

def executor_node(state):
    step = state["plan"][state["current_step"]]
    result = execute_step(step)
    return {"results": [result], "current_step": state["current_step"] + 1}
```

#### 🔁 追问怎么接

- **「能画两种拓扑吗？」** → Plan：planner → executor → (条件边) replanner/下一步/END；ReAct：agent ↔ tool 环 + should_continue 条件边；混合：plan 出 milestones，每个 milestone 是 ReAct 子图。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="078-tool-validation">

<h2 class="question-title"><span class="q-badge ai100-badge">Q78</span><span class="question-text">如何实现工具参数校验（Tool Validation）？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：工具校验</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：在 tool 节点前加 validate 节点用 Pydantic 校验 LLM 输出参数，不通过写 error 回 agent 重试。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 JSON schema 关系？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：LLM 生成的 tool 参数不能 blindly 执行——加 validate 节点用 Pydantic 校验，不过就回 agent 让它重生成，过了才调真实 tool。

**打个比方**：像银行转账前的二次确认——不是用户说转多少就转多少，先校验金额格式、账户合法性，不对就退回让用户重新输入。

#### 📖 面试展开（详细版）

工具参数校验是**生产安全的基础防线**——LLM 生成的 tool_calls 参数可能是错的、越界的、甚至恶意的。

**为什么在 tool 节点前加 validate 节点**：
- LLM 可能 hallucinate 参数（类型错、范围越界、必填缺失）
- 直接执行可能导致：调错 API、写错数据库、安全风险
- validate 节点是**纯函数**，不执行副作用，失败成本为零

**实现方式**：
1. tool 定义时用 Pydantic model 或 @tool 装饰器的 args_schema
2. validate 节点读取 LLM 的 tool_calls，用同一 schema 校验
3. 失败：写 `validation_error` 进 state，条件边回 agent 节点让它重生成
4. 通过：条件边进真实 tool 节点

**schema 同源原则**：@tool 装饰器的 args_schema 和 validate 节点用同一个 Pydantic model，避免两套定义不一致。

**高危 tool 额外加 policy 节点**：检查用户权限（这个 user 能调 delete 吗？）、参数范围（删除数量 < 100？）、操作频率（5 分钟内不超过 3 次？）。

#### 💡 核心要点
- 独立 validate 节点
- schema 与 tool 定义同源
- 校验失败不进真实 tool

#### 📝 代码/配置示例

```python
class SearchArgs(BaseModel):
    query: str = Field(min_length=1, max_length=200)
    top_k: int = Field(ge=1, le=20, default=5)

def validate_node(state):
    call = state["messages"][-1].tool_calls[0]
    try:
        SearchArgs(**call["args"])
        return {"validation_passed": True}
    except ValidationError as e:
        return {"validation_error": str(e), "validation_passed": False}

def route_after_validate(state):
    return "tool" if state["validation_passed"] else "agent"
```

#### 🔁 追问怎么接

- **「和 JSON schema 关系？」** → Pydantic model 自动生成 JSON schema；@tool 装饰器的 args_schema 就是 JSON schema；validate 节点和 tool 定义同源，LLM 看到的 schema 和校验用的 schema 一致。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="079-parallel-node-execution">

<h2 class="question-title"><span class="q-badge ai100-badge">Q79</span><span class="question-text">并行节点执行（Parallel Node Execution）怎么实现？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：并行执行</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：同一 super-step 多个无依赖节点自动并行；或 Send API fan-out；结果靠 reducer 合并。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：异步 ainvoke 注意什么？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：LangGraph 并行有两种——静态扇出（同一前驱连多个后继自动并行）和动态 fan-out（Send API 按运行时数据分发）；结果靠 reducer 合并。

**打个比方**：静态并行像同时派三个侦察兵去不同方向；动态并行像根据敌人数量决定派几个兵，数量运行时才知道。

#### 📖 面试展开（详细版）

并行执行是 LangGraph **性能优化的关键手段**，考察对 super-step 模型的理解。

**方式一：静态并行（fan-out）**
- 从同一前驱 `add_edge` 到多个无依赖的后继节点
- 框架在同一 super-step 自动并行执行这些节点
- 例如：retrieve 完成后同时跑 `grade_node` 和 `summarize_node`

**方式二：动态并行（Send API）**
- 一个节点返回多个 `Send` 对象，每个指向不同 worker 节点
- 适合批量处理：10 个文档 → 10 个 Send → 10 个 embed worker 并行
- Map-Reduce 模式：map 阶段 Send 分发，reduce 阶段汇总

**reducer 合并**：并行节点如果写同一 state channel（如 `results[]`），必须配 reducer（如 `operator.add`）合并，否则后执行的覆盖先执行的。

**super-step 同步点**：同一 super-step 的所有并行节点完成后，才进入下一个 super-step。这是 LangGraph 的 BSP（Bulk Synchronous Parallel）模型。

**注意事项**：IO 密集节点用 async def + ainvoke；LLM 并发受 rate limit 约束，不是无脑越多越好；并行节点的 state 写入冲突靠 reducer 解决。

#### 💡 核心要点
- add_edge 扇出到多节点
- super-step 同步点
- ainvoke 提升 IO 密集

#### 📝 代码/配置示例

```python
# 静态并行：fan-out
builder.add_edge("retrieve", "grade")
builder.add_edge("retrieve", "summarize")  # 同一 super-step 并行

# 动态并行：Send API
def dispatch_embed(state):
    return [Send("embed_worker", {"chunk": c}) for c in state["chunks"]]

class State(TypedDict):
    results: Annotated[list, operator.add]  # reducer 合并
```

#### 🔁 追问怎么接

- **「异步 ainvoke 注意什么？」** → 节点定义 async def，图用 ainvoke/astream；别在 async 节点里调阻塞 IO（用 httpx async 或 asyncio.to_thread）；FastAPI 路由里 await graph.ainvoke 不堵 worker。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="080-async-nodes">

<h2 class="question-title"><span class="q-badge ai100-badge">Q80</span><span class="question-text">异步节点（Async Nodes）有什么要注意的？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐ · 标签：LangGraph, 进阶 · 考察点：异步</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：节点定义 async def，图用 ainvoke/astream；避免在 async 节点里调阻塞 IO。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和线程池关系？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：节点可以是 async def，图用 ainvoke 调用；但别在 async 节点里写阻塞代码（如 requests.get），会堵死 event loop。

**打个比方**：async 节点像异步电话——可以同时打多个电话等回复；但在异步电话里用对讲机（阻塞 IO）会卡住所有线路。

#### 📖 面试展开（详细版）

异步节点是 LangGraph **高并发场景的基础**，考察对 Python async 的理解。

**基本用法**：
- 节点定义 `async def node_fn(state, config)`
- compile 后图支持 `ainvoke` 和 `astream`
- 适合 IO 密集场景：并发调多个 LLM、并行 HTTP tool 调用

**关键注意事项**：
1. **async 节点 + ainvoke 配对**——定义 async 节点但用 sync invoke 也能跑，但发挥不出并发优势
2. **别在 async 节点里调阻塞 IO**——`requests.get`、`time.sleep` 会阻塞 event loop，拖慢所有并发请求
3. **正确做法**：HTTP 用 `httpx.AsyncClient`；阻塞库用 `asyncio.to_thread()`；sleep 用 `asyncio.sleep()`

**FastAPI 集成**：路由里 `await graph.ainvoke(...)` 不阻塞 worker 线程，一个 worker 可以同时处理多个请求的等待阶段。

**同步/异步混用**：LangGraph 支持 sync 和 async 节点混在同一图里，框架自动调度。但建议 IO 密集的全用 async，CPU 密集的可保持 sync。

**和线程池关系**：`asyncio.to_thread` 把阻塞调用放到线程池，不阻塞 event loop；适合必须用的同步库（如某些 DB driver）。

#### 💡 核心要点
- async 节点 + ainvoke 配对
- 阻塞调用用 asyncio.to_thread
- FastAPI 原生 async

#### 📝 代码/配置示例

```python
# 正确：async 节点 + async HTTP
async def search_node(state):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"https://api.example.com/search?q={state['query']}")
    return {"search_results": resp.json()}

# 错误：async 节点里阻塞 IO
async def bad_node(state):
    resp = requests.get(...)  # 阻塞 event loop！
    return {"results": resp.json()}

# FastAPI 集成
@app.post("/chat")
async def chat(req):
    result = await graph.ainvoke(input, config)  # 不堵 worker
```

#### 🔁 追问怎么接

- **「和线程池关系？」** → asyncio.to_thread 把阻塞调用（如同步 DB driver）放到线程池执行，不阻塞 event loop；适合不得不用同步库的场景；但首选原生 async 库（httpx、aiohttp、asyncpg）。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="081-rate-limiting">

<h2 class="question-title"><span class="q-badge ai100-badge">Q81</span><span class="question-text">Agent 执行怎么做限流（Rate Limiting）？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：限流</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：入口 API 限流 + 节点内 token bucket 调 LLM 前等待 + 工具 429 写 state 退避重试。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：多租户公平调度？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：限流分三层——API 网关限用户 QPS、图入口检查 quota、LLM 节点内 token bucket；429 错误走退避重试而不是硬怼。

**打个比方**：像高速公路收费站——入口限流（网关）、路段限速（节点内）、堵车了绕道（429 fallback），不能一辆车堵死整条路。

#### 📖 面试展开（详细版）

限流是**生产级 Agent 的必答题**，考察多层防御思维。

**三层限流架构**：

**Layer 1：API 网关**
- 按 user/tenant 限 QPS（如每用户 10 req/min）
- 超限直接返回 429，不进图
- 工具：Nginx limit_req、Kong rate limiting、自研 middleware

**Layer 2：图入口节点**
- 检查 `quota_state`（用户今日剩余额度）
- 超限走 fallback 节点（「今日额度已用完，请明天再试」）
- 适合按 token 计费的场景

**Layer 3：LLM/Tool 节点内**
- LLM 调用前 token bucket acquire（控制并发请求数）
- tool 返回 429 时：捕获 → 写 `retry_after` 进 state → 条件边到 backoff 节点 → sleep → 重试
- 指数退避：1s → 2s → 4s → 8s，最多 3 次

**多租户公平调度**：
- fair queue：多租户请求排队，每个 tenant 保证最小配额
- tenant 级并发上限：tenant A 最多 5 并发，tenant B 最多 3 并发
- 避免「一个大租户占满所有 worker」

**监控**：限流触发次数、429 比例、backoff 重试成功率——这些指标进 dashboard。

#### 💡 核心要点
- 网关层用户级限流
- LLM 调用前 acquire
- 指数退避写重试节点

#### 📝 代码/配置示例

```python
async def llm_node(state, config):
    await token_bucket.acquire()  # Layer 3
    try:
        return {"messages": [await llm.ainvoke(state["messages"])]}
    except RateLimitError as e:
        return {"retry_after": e.retry_after}

def route_after_llm(state):
    if "retry_after" in state:
        return "backoff"
    return "next_node"
```

#### 🔁 追问怎么接

- **「多租户公平调度？」** → fair queue 保证每 tenant 最小配额；tenant 级并发上限；监控每 tenant 的 QPS/token 消耗，异常 tenant 自动降级。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="082-configurable-params">

<h2 class="question-title"><span class="q-badge ai100-badge">Q82</span><span class="question-text">configurable 参数怎么传到节点？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐ · 标签：LangGraph, 进阶 · 考察点：配置</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：invoke 时 config.configurable 传 model_name、temperature 等，节点第二参数 config 读取，支持 A/B 和租户差异。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 state 区别？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：configurable 是「本次运行的配置」——模型名、温度、租户 ID——通过 invoke 传入，节点从 config 参数读取，不进 checkpoint。

**打个比方**：state 是病人的病历（要存档），configurable 是今天用哪个科室的医生（临时指定，不需要写进病历）。

#### 📖 面试展开（详细版）

configurable 是 LangGraph **运行时配置的标准机制**，考察对 state vs config 划界的理解。

**用法**：
```python
result = graph.invoke(
    input_state,
    config={"configurable": {"model": "gpt-4o", "tenant": "acme", "temperature": 0.7}}
)
```

**节点读取**：
```python
def llm_node(state, config):
    model_name = config["configurable"]["model"]
    llm = get_llm(model_name)
    return {"messages": [llm.invoke(state["messages"])]}
```

**典型场景**：
- **A/B 测试**：同一图，config 传不同 model/prompt 版本，对比效果
- **租户差异**：tenant A 用 GPT-4o，tenant B 用 GPT-4o-mini
- **特性开关**：`config["configurable"]["enable_rerank"]` 控制是否走 rerank 节点

**和 state 的核心区别**：
| | state | configurable |
|---|---|---|
| 持久化 | 进 checkpoint | 不进 checkpoint |
| 生命周期 | 跨 step 演化 | 单次 invoke |
| 内容 | 业务数据 | 运行参数 |
| 用途 | 任务推进 | 模型路由/特性开关 |

**最佳实践**：configurable 放「运行环境参数」，state 放「业务数据」；不要把 model_name 写进 state，否则 checkpoint 会污染历史。

#### 💡 核心要点
- 不进 checkpoint 的运行配置
- 节点 (state, config) 签名
- 适合模型路由和特性开关

#### 📝 代码/配置示例

```python
def llm_node(state, config):
    cfg = config.get("configurable", {})
    model = cfg.get("model", "gpt-4o-mini")
    llm = ChatOpenAI(model=model, temperature=cfg.get("temperature", 0))
    return {"messages": [llm.invoke(state["messages"])]}

# 调用
graph.invoke(state, config={"configurable": {"model": "gpt-4o", "tenant": "acme"}})
```

#### 🔁 追问怎么接

- **「和 state 区别？」** → state 是业务数据、跨 step 持久化、进 checkpoint；configurable 是运行参数、单次 invoke、不进 checkpoint；model_name/tenant_id 放 configurable，query/docs 放 state。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="083-external-db-state">

<h2 class="question-title"><span class="q-badge ai100-badge">Q83</span><span class="question-text">LangGraph state 如何与外部数据库集成？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：外部集成</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：state 存 ID，节点内按需查库；或用 checkpointer 存图状态、业务库存单据，两边用业务键关联。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：双写一致性？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：state 里存 ID 不存大对象，节点内按需查库；图状态管编排进度，业务库管业务数据，用业务键关联。

**打个比方**：state 像工作台的便签纸（只写订单号），详细信息去档案柜（数据库）查；便签纸轻方便携，档案柜存完整记录。

#### 📖 面试展开（详细版）

外部数据库集成考察**图状态与业务数据的划界**，是系统设计高频题。

**原则：别把 DB 连接/大对象放 state**
- state 要序列化进 checkpoint，DB connection 不能序列化
- 大对象（完整用户 profile、1000 条历史）会让 checkpoint 膨胀

**模式一：state 存 ID，节点内按需查库**
```
state = {"user_id": "u123", "order_id": "o456"}
→ node 内: user = db.query(User, user_id)
```
- 适合：节点需要最新数据（用户余额可能变了）
- 注意：查询结果不写回 state（除非必要），避免 checkpoint 膨胀

**模式二：双存储，业务键关联**
- checkpointer 存图编排状态（current_step、messages、retry_count）
- 业务 DB 存业务数据（订单状态、支付记录）
- 用 `order_id` 关联：state 里有 order_id，业务表也有 order_id

**副作用节点的 DB 事务**：
1. 开始 DB 事务
2. 执行业务操作（扣款、发邮件）
3. 成功 → 写 `executed=True` 进 state → commit
4. 失败 → rollback → 写 error 进 state

**恢复时的幂等**：resume 图之前，先查业务 DB「这个 order_id 的操作是否已执行」，已执行则跳过副作用节点。

#### 💡 核心要点
- 引用不嵌套大对象
- 副作用在 tool 节点事务提交
- checkpoint 与业务库分离

#### 📝 代码/配置示例

```python
class AgentState(TypedDict):
    order_id: str
    user_id: str
    payment_executed: bool  # 幂等标志

async def payment_node(state):
    if state.get("payment_executed"):
        return {}  # 已执行，跳过（幂等）
    async with db.transaction():
        await charge(state["user_id"], state["order_id"])
    return {"payment_executed": True}
```

#### 🔁 追问怎么接

- **「双写一致性？」** → checkpoint 和业务库是两套存储，不追求强一致；用业务键关联 + 幂等标志（executed=True）；resume 前先查业务库确认副作用是否已发生，已发生则跳过。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="084-message-trimming">

<h2 class="question-title"><span class="q-badge ai100-badge">Q84</span><span class="question-text">对话历史在图里怎么做裁剪（Message Trimming）？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：消息裁剪</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：专用 trim 节点在进 LLM 前按 token 预算保留 system+最近 k 轮+可选 summary。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 checkpoint 冲突吗？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：在 agent 节点前加 trim 节点，按 token 预算保留 system + 最近 k 轮，旧的 summarize 或删除，控制送进 LLM 的上下文大小。

**打个比方**：像整理桌面——只留当前任务需要的文件（最近 k 轮），旧文件归档到文件夹（summary 字段）或扔掉（RemoveMessage）。

#### 📖 面试展开（详细版）

Message Trimming 是**控制 token 成本和上下文窗口的关键手段**，字节/阿里面经高频。

**实现方式：专用 trim 节点**
- 放在 agent/LLM 节点**之前**
- 估算 `state["messages"]` 的 token 数
- 超预算时：保留 system prompt + 最近 k 轮对话
- 旧消息处理：summarize 到 `state["summary"]` 或 RemoveMessage 删除

**Trim 策略**：
1. **保留 system**：第一条 system message 永远保留
2. **保留最近 k 轮**：用户+助手各 k 条
3. **摘要旧消息**：旧对话 LLM summarize 后写入 `state["summary"]`，generate 节点 template 注入
4. **RemoveMessage**：LangGraph 提供的消息删除机制，从 messages 列表移除指定消息

**和 checkpoint 的关系**：
- 裁剪后 checkpoint 存的是**裁剪后** state——这是有意的设计，控制 checkpoint 体积
- 如果需要完整历史，外置到 PostgreSQL/Redis，trim 节点只影响送进 LLM 的上下文

**和压缩节点串联**：先 compress（summarize 旧消息）→ 再 trim（按 token 硬截断），双保险。

#### 💡 核心要点
- trim 作为独立节点
- RemoveMessage 删旧消息
- 摘要进 state.summary 字段

#### 📝 代码/配置示例

```python
def trim_node(state):
    messages = state["messages"]
    token_count = count_tokens(messages)
    if token_count <= MAX_TOKENS:
        return {}
    # 保留 system + 最近 k 轮
    trimmed = [messages[0]] + messages[-(K_ROUNDS * 2):]
    return {"messages": trimmed, "trimmed": True}

builder.add_edge("trim", "agent")  # trim 在 agent 前
```

#### 🔁 追问怎么接

- **「和 checkpoint 冲突吗？」** → 不冲突，裁剪后 checkpoint 存裁剪后的 state 是有意设计；完整历史外置存储，trim 只影响送进 LLM 的上下文；resume 时从裁剪后的 state 继续，不会恢复已删消息。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="085-agent-evaluation">

<h2 class="question-title"><span class="q-badge ai100-badge">Q85</span><span class="question-text">LangGraph Agent 怎么做评测（Evaluation）？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：评测</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：LangSmith dataset 跑批量 invoke，断言最终答案和中间轨迹（经过哪些节点）；节点级指标单独评。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：非确定性怎么评？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：LangGraph 评测分两级——端到端看最终答案+轨迹，节点级看每个 node 的输入输出；LangSmith 跑批量回归。

**打个比方**：端到端像考最终成绩，节点级像考每科分数——总分高但数学不及格，说明 generate 节点有问题。

#### 📖 面试展开（详细版）

LangGraph Agent 评测考察**是否理解图编排的评测优势**——能评轨迹，不只是评最终答案。

**Level 1：端到端评测**
- 黄金问题集（50-200 条）batch invoke
- 断言最终答案：内容正确性、citation 格式、是否调了正确 tool
- **轨迹断言**（LangGraph 独有优势）：期望经过 `intent → retrieve → grade → generate`，如果走了 `fallback` 则标记失败
- 工具：LangSmith dataset + experiment

**Level 2：节点级评测**
- 单独测每个 node：intent 分类准确率、retrieve recall@k、grade 通过率
- 方法：mock 上游 state，只跑单个 node，对比期望输出
- 好处：定位问题节点，不用等端到端失败才发现

**LangSmith 集成**：
```python
results = evaluate(
    graph.invoke,
    data=dataset,
    evaluators=[answer_correctness, trajectory_match],
)
```

**非确定性处理**：
- LLM-as-judge：用另一个 LLM 评答案质量（1-5 分）
- 结构匹配：不断言 exact text，断言 JSON schema / 关键词 / citation 数量
- 多次采样：同一问题跑 3 次，成功率 > 66% 算 pass

**CI 集成**：夜间跑回归集，节点级 + 端到端，失败自动通知 + block merge。

#### 💡 核心要点
- 端到端+轨迹断言
- 节点级黄金输入输出
- 回归 CI 夜间跑

#### 📝 代码/配置示例

```python
# 轨迹断言
def trajectory_match(run, example):
    expected_nodes = ["retrieve", "grade", "generate"]
    actual_nodes = [s["node"] for s in run.steps]
    return {"score": all(n in actual_nodes for n in expected_nodes)}

# 节点级单测
def test_grade_node():
    state = {"docs": [mock_doc], "query": "test"}
    result = grade_node(state)
    assert result["grade_score"] > 0.7
```

#### 🔁 追问怎么接

- **「非确定性怎么评？」** → LLM-as-judge 评质量；结构匹配（JSON schema/关键词/citation 数）；多次采样取成功率；节点级评测用 mock state 测确定性部分（如 intent 分类）。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="086-multi-tenant">

<h2 class="question-title"><span class="q-badge ai100-badge">Q86</span><span class="question-text">多租户 Agent 怎么设计？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：多租户</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：thread_id 含 tenant_id；checkpointer 表分区；configurable 注入租户配置和工具权限。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：数据隔离怎么做？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：多租户靠三层隔离——thread_id 含 tenant_id、checkpointer 分区存储、configurable 注入租户配置和工具权限。

**打个比方**：像 SaaS 公寓——每个租户有自己的房间号（thread_id）、自己的储物柜（checkpoint 分区）、自己的门禁权限（tool 白名单）。

#### 📖 面试展开（详细版）

多租户设计是**B 端 Agent 产品的必答题**，考察数据隔离和配置隔离。

**Layer 1：thread_id 命名空间**
- 格式：`{tenant_id}/{user_id}/{task_id}`
- 保证 tenant A 的 thread 不会加载 tenant B 的 checkpoint
- 网关层校验：请求里的 tenant_id 和用户身份匹配

**Layer 2：checkpointer 分区**
- Postgres checkpointer 按 tenant_id 分区或加 tenant_id 列
- 查询 thread 列表时 WHERE tenant_id = ?
- TTL 策略可以 tenant 级别不同（免费 tenant 7 天，付费 90 天）

**Layer 3：configurable 注入租户配置**
```python
config = {"configurable": {
    "tenant_id": "acme",
    "allowed_tools": ["search", "summarize"],  # 不含 delete
    "model": "gpt-4o-mini",  # 免费 tenant 用小模型
    "prompt_variant": "acme_v2",
}}
```

**数据隔离**：
- 向量库：检索节点加 `metadata filter: tenant_id = acme`
- 业务 DB：所有查询带 tenant_id WHERE 条件
- 工具权限：tenant A 不能调 tenant B 的内部 API

**租户级 rate limit 和模型**：免费 tenant 限 10 req/day + mini 模型；付费 tenant 1000 req/day + 4o 模型。

#### 💡 核心要点
- 命名空间隔离 checkpoint
- 租户级 rate limit 和模型
- 向量库 metadata filter

#### 📝 代码/配置示例

```python
# thread_id 命名空间
thread_id = f"{tenant_id}/{user_id}/{task_id}"

# 检索节点 tenant 隔离
def retrieve_node(state, config):
    tenant = config["configurable"]["tenant_id"]
    docs = vectorstore.similarity_search(
        state["query"], filter={"tenant_id": tenant}
    )
    return {"docs": docs}
```

#### 🔁 追问怎么接

- **「数据隔离怎么做？」** → 向量库 metadata filter tenant_id；业务 DB 所有查询带 tenant_id；checkpointer 分区存储；网关层校验 tenant_id 与用户身份匹配；工具权限按 tenant 白名单。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="087-agent-security">

<h2 class="question-title"><span class="q-badge ai100-badge">Q87</span><span class="question-text">LangGraph Agent 安全怎么保障？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：安全</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：输入 Guardrails 节点、工具权限白名单、HITL 高危操作、输出过滤、secret 不进 state。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：提示注入怎么防？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：Agent 安全分五层——输入过滤、工具白名单、HITL 审批、输出过滤、secret 不进 state。

**打个比方**：像机场安检——入口安检（输入过滤）、登机口验票（工具权限）、危险品需额外审批（HITL）、出口检查（输出过滤）、机密文件不进普通行李（secret 隔离）。

#### 📖 面试展开（详细版）

Agent 安全是**生产上线的硬性要求**，考察多层防御思维。

**五层安全架构**：

**Layer 1：输入 Guardrails 节点**（图入口）
- 检测 prompt 注入（「忽略上面所有指令」）
- 检测 PII（身份证、手机号）→ 脱敏或拒绝
- 检测恶意 payload（超长输入、特殊字符 flood）
- 工具：NeMo Guardrails、自研 regex + LLM classifier

**Layer 2：工具权限白名单**
- 每个 user/role 只能调白名单内的 tool
- validate 节点校验参数范围
- 高危 tool（delete、transfer）额外 policy 检查

**Layer 3：HITL 高危操作**
- 写操作（发邮件、下单、删数据）→ interrupt 等人工审批
- compile 时 `interrupt_before=["publish", "delete"]`
- 审批记录进 audit log

**Layer 4：输出内容过滤**
- 输出节点检查：敏感信息泄露、有害内容、格式合规
- 不通过 → 重写或返回安全默认回复

**Layer 5：Secret 管理**
- API key、DB password 走 config/secrets manager
- **绝不进 state/checkpoint**——否则持久化后泄露

**提示注入防御**：system prompt 边界清晰 + 检索内容用 user 角色注入（不当 system）+ tool 结果不直接拼进 system prompt。

#### 💡 核心要点
- 入口 sanitize 节点
- tool 按角色授权
- interrupt 敏感写操作

#### 📝 代码/配置示例

```python
def sanitize_node(state):
    user_input = state["messages"][-1].content
    if detect_injection(user_input):
        return {"blocked": True, "reason": "prompt_injection"}
    if detect_pii(user_input):
        return {"messages": [redact_pii(state["messages"][-1])]}
    return {}

graph = builder.compile(
    interrupt_before=["delete", "publish"],
    checkpointer=PostgresSaver(...),
)
```

#### 🔁 追问怎么接

- **「提示注入怎么防？」** → system 边界清晰 + 检索内容用 user 角色注入 + tool 结果不当 system + 输入 Guardrails 节点检测注入模式 + 输出过滤敏感信息。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="088-event-driven">

<h2 class="question-title"><span class="q-badge ai100-badge">Q88</span><span class="question-text">事件驱动 Agent（Event-Driven）怎么用 LangGraph？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：事件驱动</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：外部事件触发 invoke 带初始 state；图固定 enrich→decide→act→persist；每事件新 thread 或续 thread。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 cron 结合？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：事件驱动 = 外部事件（Kafka/Webhook）触发 invoke 图，每事件一个新 thread，event_id 做幂等键防重复。

**打个比方**：像外卖订单系统——每来一个订单（事件）触发一次处理流程（invoke 图），订单号（event_id）防重复下单。

#### 📖 面试展开（详细版）

事件驱动 Agent 考察**图编排与非交互式场景的结合**。

**架构模式**：
1. **事件源**：Kafka/RabbitMQ/Webhook/SQS
2. **Worker**：消费事件 → 构造初始 state → invoke 图
3. **图拓扑**（固定）：enrich（补充上下文）→ decide（LLM 决策）→ act（调 tool）→ persist（写结果）
4. **每事件一次 invoke**，state 隔离

**初始 state 设计**：
```python
initial_state = {
    "event_id": "evt_123",       # 幂等键
    "event_type": "order_created",
    "event_payload": {...},      # 原始事件数据
    "enriched_context": None,    # enrich 节点填充
}
```

**幂等设计**：
- `event_id` 作为 thread_id 或幂等键
- 重复消费同一 event_id → 查 checkpoint 发现已处理 → 跳过
- 或：业务 DB 记录 `processed_events` 表

**和 cron 结合**：
- 定时器（每 5 分钟）触发 batch 子图
- 批量处理积压事件：query 未处理事件 → Send API fan-out → 每个事件一个 worker
- 适合：非实时、允许延迟的场景

**关键原则**：图 compile 一次（应用启动时），每事件一次 invoke，不 per-event compile。

#### 💡 核心要点
- 消息队列消费触发
- 图一次编译反复 invoke
- 事件 id 作幂等键

#### 📝 代码/配置示例

```python
# Worker 消费 Kafka 事件
async def handle_event(event):
    initial_state = {
        "event_id": event.id,
        "event_payload": event.data,
    }
    config = {"configurable": {"thread_id": event.id}}
    result = await graph.ainvoke(initial_state, config)

# 幂等：event_id 作 thread_id
# 重复消费 → checkpoint 已存在 → 跳过
```

#### 🔁 追问怎么接

- **「和 cron 结合？」** → 定时器触发 batch 子图：query 积压事件 → Send API fan-out 并行处理；适合非实时场景；cron 负责「什么时候跑」，图负责「怎么跑」。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="089-visualize-debug">

<h2 class="question-title"><span class="q-badge ai100-badge">Q89</span><span class="question-text">怎么可视化和调试 LangGraph？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐ · 标签：LangGraph, 进阶 · 考察点：可视化</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：app.get_graph().draw_mermaid_png() 导出图；stream values 模式看 state；LangSmith 看轨迹。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：给面试官画过图吗？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：可视化用 draw_mermaid_png 导出图结构；调试用 stream_mode="values" 看每步 state 变化；LangSmith 看完整轨迹。

**打个比方**：可视化像看地图（图结构），调试像看行车记录仪（每步 state 变化），LangSmith 像黑匣子（完整轨迹回放）。

#### 📖 面试展开（详细版）

可视化和调试是**开发效率的关键**，也是面试加分项。

**可视化方法**：
1. `graph.get_graph().draw_mermaid_png()` → 导出 PNG 图片
2. `graph.get_graph().print_ascii()` → 终端打印 ASCII 图
3. Mermaid 语法 → 放文档/README/面试 PPT

**调试方法**：

**方法 1：stream_mode="values"**
```python
for step in graph.stream(input, stream_mode="values"):
    print(step)  # 每步完整 state
```
- 看到每步 state 怎么变化
- 定位哪一步出了问题

**方法 2：LangSmith trace**
- 自动记录每步 node 输入输出、耗时、token
- 线上 bad case 回溯
- 对比不同版本的 trace

**方法 3：单节点调试**
```python
mock_state = {"messages": [...], "docs": [...]}
result = grade_node(mock_state)  # 直接调，不跑全图
```
- 快速验证单个节点逻辑
- 单元测试的基础

**面试加分**：带一张自己项目的 Mermaid 图，30 秒画完 ReAct 环或 RAG 流程，比纯口述强十倍。

#### 💡 核心要点
- Mermaid/PNG 导出
- stream_mode=values
- 断点单步 invoke

#### 📝 代码/配置示例

```python
# 可视化
png_bytes = graph.get_graph().draw_mermaid_png()
with open("graph.png", "wb") as f:
    f.write(png_bytes)

# 调试：逐步看 state
for event in graph.stream(input, stream_mode="values"):
    print(f"Step: {event}")

# 单节点调试
result = grade_node({"docs": mock_docs, "query": "test"})
```

#### 🔁 追问怎么接

- **「给面试官画过图吗？」** → 准备一张自己项目的 Mermaid 图（PNG 或手绘）；面试时 30 秒画完核心拓扑（3-5 个节点 + 条件边）；重点展示环（ReAct）或回边（grade→rewrite）。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="090-graceful-degradation">

<h2 class="question-title"><span class="q-badge ai100-badge">Q90</span><span class="question-text">Graceful Degradation 优雅降级怎么实现？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：降级</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：主路径失败条件边走备用模型/简化检索/模板回答，保证用户总有结构化响应。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 fallback 区别？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：优雅降级是「主路径不行走备用路径，备用还不行走兜底」——用户总能拿到结构化响应，不是 500 错误。

**打个比方**：像GPS导航——首选高速（GPT-4o+向量检索），高速堵了走国道（mini+缓存），国道也堵了给你文字指引（模板回复），总比说「找不到路」强。

#### 📖 面试展开（详细版）

优雅降级考察**生产环境的容错设计**——用户感知到的是「慢/简/缺」，不是「挂了」。

**多级降级链**（条件边实现）：

**Level 0（主路径）**：GPT-4o + 向量检索 + 完整 RAG 链
↓ 超时/失败
**Level 1（降级 1）**：GPT-4o-mini + 缓存命中（之前问过类似问题）
↓ 失败
**Level 2（降级 2）**：GPT-4o-mini + 关键词搜索（不用向量）
↓ 失败
**Level 3（兜底）**：模板回复 + 人工入口（「暂时无法回答，请转人工客服」）

**实现方式**：
```python
def route_by_health(state):
    if state.get("llm_timeout"):
        return "degraded_llm"  # Level 1
    if state.get("retrieval_empty"):
        return "keyword_search"  # Level 2
    return "primary_path"
```

**和 fallback 的区别**：
- **Degradation**：沿途有备用方案，质量逐步降低但仍有价值
- **Fallback**：终极出口，通常是无 LLM 的模板/人工

**监控**：`state["degradation_level"]` 记录当前级别，统计各级占比——如果 Level 2/3 占比 > 10%，说明主路径有问题需要修。

#### 💡 核心要点
- 多级降级链
- LLM 失败换小模型
- 检索失败换关键词搜索

#### 📝 代码/配置示例

```python
def route_after_primary(state):
    if state.get("llm_timeout"):
        return "degraded_llm"
    if state.get("retrieval_empty"):
        return "keyword_fallback"
    return END

# 监控
state["degradation_level"] = 0  # primary
state["degradation_level"] = 1  # degraded_llm
state["degradation_level"] = 2  # keyword_fallback
```

#### 🔁 追问怎么接

- **「和 fallback 区别？」** → degradation 是沿途多级备用（质量逐步降但仍有价值）；fallback 是终极出口（模板/人工）；degradation 是「尽量服务」，fallback 是「不服务了但给个交代」。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="091-memory-compression">

<h2 class="question-title"><span class="q-badge ai100-badge">Q91</span><span class="question-text">上下文感知记忆压缩（Context-Aware Memory Compression）？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：记忆压缩</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：按当前任务意图选择性保留相关历史，无关轮次压缩进 summary 或归档外置记忆。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和字节动态长期记忆？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：不是无脑删旧消息，而是根据当前意图选择性保留相关历史——聊订单保留订单轮次，闲聊压缩掉。

**打个比方**：像整理笔记本——不是把旧页全撕了，而是当前写数学就只留数学相关页，语文笔记归档到文件夹。

#### 📖 面试展开（详细版）

上下文感知记忆压缩是**比简单 trim 更智能的策略**，字节面经长期记忆考点。

**核心思想**：不是按时间截断（「保留最近 k 轮」），而是按**相关性**选择性保留。

**实现方式**：
1. **compress 节点**读取 `current_intent`（当前任务意图）
2. 遍历历史 messages，计算每条与 current_intent 的相关性
3. 相关的保留，无关的 summarize 到 `state["summary"]` 或归档
4. intent 变化时（从「查订单」切到「写报告」）触发重新压缩

**示例**：
- 当前 intent = 「查询订单 12345 状态」
- 保留：涉及订单 12345 的对话轮次
- 压缩：之前聊天气、问公司地址的轮次 → summarize

**长期记忆外置**：
- 压缩后的摘要 + 关键事实 → 写入 mem0 / PostgreSQL / 向量库
- retrieve 节点按 current_intent 回填相关记忆
- 图内 state 只留当前任务必需的上下文

**和字节动态长期记忆的关系**：
- 字节考点：动态召回 + 选择性保留 + 沉淀机制
- LangGraph 实现：compress 节点（选择性压缩）+ retrieve 节点（按意图回填）+ 外置存储（长期记忆）
- 图内管「当前任务上下文」，图外管「跨会话记忆」

#### 💡 核心要点
- intent 变化触发重摘要
- 相关轮次保留
- 外置 mem0/向量存长期

#### 📝 代码/配置示例

```python
def compress_node(state):
    intent = state["current_intent"]
    relevant, irrelevant = [], []
    for msg in state["messages"]:
        if is_relevant(msg, intent):
            relevant.append(msg)
        else:
            irrelevant.append(msg)
    summary = llm.invoke(f"摘要以下对话：{irrelevant}")
    return {"messages": relevant, "archived_summary": summary}
```

#### 🔁 追问怎么接

- **「和字节动态长期记忆？」** → 同一思想：compress 节点按 intent 选择性压缩 + retrieve 节点按 intent 回填 + 外置 mem0/Postgres 存长期记忆；字节考动态召回，LangGraph 考节点实现。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="092-timeout-handling">

<h2 class="question-title"><span class="q-badge ai100-badge">Q92</span><span class="question-text">超时处理（Timeout Handling）怎么做？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：超时</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：asyncio.wait_for 包节点调用；超时写 state 走 fallback；端到端 SLA 在 API 层 cancel task。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：cancel 后 checkpoint 状态？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：超时处理分两层——节点级用 asyncio.wait_for 限时，超时走 fallback；图级 API 设总 SLA，超时 cancel 任务。

**打个比方**：像外卖配送——每道工序有截止时间（节点级），整个订单有总时限（图级 SLA），超时不取消订单而是告知用户「还在做，可继续等或换简餐」。

#### 📖 面试展开（详细版）

超时处理是**用户体验的关键**，考察节点级和图级两层超时设计。

**Layer 1：节点级超时**
```python
async def llm_node(state):
    try:
        result = await asyncio.wait_for(
            llm.ainvoke(state["messages"]),
            timeout=30.0  # 单节点 30 秒
        )
        return {"messages": [result]}
    except asyncio.TimeoutError:
        return {"llm_timeout": True}
```
- 超时 → 写 `timeout_error` 进 state → 条件边走 fallback/degraded 路径
- 不同节点可设不同 timeout（LLM 30s，tool 10s，retrieve 5s）

**Layer 2：图级 SLA**
- API 层设总 SLA（如 60 秒）
- 超时 → cancel asyncio task
- checkpoint 保留最后完成的 step → 可 resume

**cancel 后 checkpoint 状态**：
- 被取消的 step **不会写入** checkpoint
- checkpoint 里是 cancel 前最后成功完成的 state
- resume 时从那个 state 继续，被取消的 step 重跑

**用户体验**：
- 不要返回裸 504 → 返回「处理超时，您可以选择继续等待或简化问题」
- 提供「继续等待」（resume）和「简化问题」（走 degraded 路径）两个选项

**监控**：超时率按节点统计，P99 延迟超 SLA 比例进 alert。

#### 💡 核心要点
- 节点级超时
- 图级 SLA watchdog
- 超时后 checkpoint 可恢复

#### 📝 代码/配置示例

```python
async def llm_node(state):
    try:
        result = await asyncio.wait_for(llm.ainvoke(state["messages"]), timeout=30)
        return {"messages": [result]}
    except asyncio.TimeoutError:
        return {"llm_timeout": True}

def route_after_llm(state):
    return "fallback" if state.get("llm_timeout") else "next"
```

#### 🔁 追问怎么接

- **「cancel 后 checkpoint 状态？」** → 被取消的 step 不写入 checkpoint；checkpoint 保留 cancel 前最后成功的 state；resume 从那个 state 继续，被取消的 step 重跑；不会丢数据也不会重复执行已完成的 step。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="093-version-graph">

<h2 class="question-title"><span class="q-badge ai100-badge">Q93</span><span class="question-text">图版本管理与回滚怎么做？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：版本管理</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：graph_version 绑编译实例；新 thread 用新版；旧 thread 用旧版 finish；shadow mode 对比新旧轨迹。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：schema 版本一起管吗？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：图版本管理 = 多实例共存 + 路由层选版本 + 新 thread 用新版、旧 thread 用旧版 finish。

**打个比方**：像手机系统升级——新买家用新系统（新 thread → v2），老用户可以选择不升级直到当前任务完成（旧 thread → v1 finish）。

#### 📖 面试展开（详细版）

图版本管理是**生产迭代的必答题**，考察零停机升级思维。

**核心原则：进行中的 thread 不能 mid-flight 迁移**

**部署架构**：
```python
graphs = {
    "v1": compile_v1(checkpointer),
    "v2": compile_v2(checkpointer),
}

def get_graph(config):
    version = config["configurable"].get("graph_version", "v2")
    return graphs[version]
```

**路由策略**：
- **新 thread** → 最新版本（v2）
- **已有 thread** → 创建时的版本（v1 finish，不迁移）
- 路由层（API gateway）根据 thread_id 查版本，或 config 显式指定

**Shadow Mode（灰度验证）**：
- 同一份输入同时跑 v1（返回用户）和 v2（不返回，只记录）
- 对比 trace、答案质量、token 消耗、延迟
- v2 指标全面优于 v1 才切流量

**回滚流程**：
1. 流量切回 v1（路由层改默认版本）
2. 停止新开 v2 thread
3. 已有 v2 thread 让其 finish 或强制迁移（需评估风险）

**schema 版本一起管**：
- state schema 变更必须向后兼容（新增字段给默认值）
- graph_version 和 schema_version 绑定发布
- 不兼容变更 → 新 graph_version + 迁移脚本

#### 💡 核心要点
- 多实例共存
- 路由层选版本
- 回滚=切流量+停新 thread

#### 📝 代码/配置示例

```python
# 多版本共存
graphs = {"v1": graph_v1, "v2": graph_v2}

@app.post("/chat")
async def chat(req):
    version = get_thread_version(req.thread_id) or "v2"
    graph = graphs[version]
    return await graph.ainvoke(req.input, config)
```

#### 🔁 追问怎么接

- **「schema 版本一起管吗？」** → 是，graph_version 和 schema_version 绑定发布；新增字段给默认值（向后兼容）；不兼容变更需要新 graph_version + 迁移脚本；旧 thread 的 checkpoint schema 不能 break。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="094-cost-aware-routing">

<h2 class="question-title"><span class="q-badge ai100-badge">Q94</span><span class="question-text">成本感知路由（Cost-Aware Routing）怎么实现？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：成本</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：router 节点根据任务复杂度选模型：简单走 mini，复杂走 4o；state 累计 token 超预算降级。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：字节问百万 token 成本怎么答？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：成本感知路由 = 简单问题用小模型，复杂问题用大模型，超预算强制降级——在 router 节点做决策。

**打个比方**：像打车——短途走路/骑车（mini），长途打专车（4o），月预算花完了就只能走路（模板回复）。

#### 📖 面试展开（详细版）

成本感知路由考察**商业意识和工程优化能力**，字节面经百万 token 成本是经典题。

**实现方式**：

**Step 1：入口 router 判断复杂度**
```python
def router_node(state):
    query = state["query"]
    complexity = classify_complexity(query)  # simple / complex
    return {"complexity": complexity}
```
- 简单：FAQ、格式化、翻译 → GPT-4o-mini
- 复杂：推理、代码生成、多步分析 → GPT-4o
- 判断依据：intent 分类 + query 长度 + 关键词

**Step 2：条件边路由到不同 LLM 节点**
```python
def route_by_complexity(state):
    return "llm_4o" if state["complexity"] == "complex" else "llm_mini"
```

**Step 3：token 预算控制**
- `state["token_spent"]` 累计消耗
- 超 budget → 后续节点强制 mini 或模板回复
- configurable 注入 budget 上限（按 tenant 不同）

**字节百万 token 成本题**：
- 估算：1000 行代码 ≈ 3000 token × $0.03/1K = $0.09/次
- 100 万次/天 = $90K/天 → 优化方向：
  1. 压缩（trim/compress 减 input token）
  2. 缓存（相同 query 命中缓存）
  3. 小模型路由（80% 简单 query 走 mini，成本降 10x）

**监控**：每 tenant 日 token 消耗、模型分布、成本/请求比。

#### 💡 核心要点
- intent+长度估计复杂度
- configurable 模型名
- token_budget 写 state

#### 📝 代码/配置示例

```python
def router_node(state):
    complexity = "complex" if len(state["query"]) > 200 else "simple"
    return {"complexity": complexity, "token_spent": 0}

def route_by_cost(state):
    if state["token_spent"] > TOKEN_BUDGET:
        return "template_fallback"
    return "llm_4o" if state["complexity"] == "complex" else "llm_mini"
```

#### 🔁 追问怎么接

- **「字节问百万 token 成本怎么答？」** → 估算 token 数 × 单价 × 调用量；优化三板斧：压缩（减 input）、缓存（命中重复 query）、小模型路由（80% 简单 query 走 mini）；给出具体数字显得有商业意识。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="095-build-minimal-agent">

<h2 class="question-title"><span class="q-badge ai100-badge">Q95</span><span class="question-text">面试常考：手写最小可用 LangGraph 聊天 Agent</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：手写代码</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：MessagesState + llm_node + START→LLM→END；messages 用 add_messages；返回 dict 自动合并。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：加 tool 怎么改？ · 加 memory 怎么改？</div>
</div>

**优先级**：P0 · 3+ 篇

#### 🗣️ 先用大白话说

**一句话**：最小 Agent 就 10 行——MessagesState + llm_node + START→LLM→END；加 tool 变 ReAct 环，加 MemorySaver 变多轮。

**打个比方**：最小 Agent 像「Hello World」——证明你理解核心概念；加 tool 是「Hello World with input」，加 memory 是「Hello World with persistence」。

#### 📖 面试展开（详细版）

手写最小 Agent 是**一面 P0 白板题**，必须能脱稿写。

**10 行核心骨架**：
```python
from langgraph.graph import StateGraph, START, END, MessagesState

def llm_node(state):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

builder = StateGraph(MessagesState)
builder.add_node("llm", llm_node)
builder.add_edge(START, "llm")
builder.add_edge("llm", END)
graph = builder.compile()
```

**关键概念**：
- `MessagesState`：内置 state，messages 字段已配 add_messages reducer
- 节点返回 `{"messages": [response]}`：partial update，框架自动 merge
- `START` / `END`：图的入口和出口

**加 tool → ReAct 环**：
```python
builder.add_node("tools", ToolNode(tools))
builder.add_conditional_edges("llm", should_continue)  # 有 tool_calls → tools
builder.add_edge("tools", "llm")  # 回边
```

**加 memory → 多轮对话**：
```python
graph = builder.compile(checkpointer=MemorySaver())
graph.invoke(input, config={"configurable": {"thread_id": "session_1"}})
```

**ModelEngine 社区要点**：reducer（add_messages）、START/END、返回 dict 自动合并——全中。面试能脱稿写加分，加讲每步含义更加分。

#### 💡 核心要点
- 10 行核心骨架
- 加 tool 变 ReAct 环
- 加 MemorySaver 即多轮

#### 📝 代码/配置示例

```python
from langgraph.graph import StateGraph, START, END, MessagesState
from langgraph.prebuilt import ToolNode

def llm_node(state):
    return {"messages": [llm.invoke(state["messages"])]}

builder = StateGraph(MessagesState)
builder.add_node("llm", llm_node)
builder.add_edge(START, "llm")
builder.add_edge("llm", END)
graph = builder.compile()
```

#### 🔁 追问怎么接

- **「加 tool 怎么改？」** → 加 ToolNode + should_continue 条件边（有 tool_calls → tools，没有 → END）+ tools→llm 回边，变成 ReAct 环。
- **「加 memory 怎么改？」** → compile 时传 checkpointer=MemorySaver()，invoke 时 config 传 thread_id，同 thread_id 自动加载历史 messages。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="096-blackbox-vs-whitebox">

<h2 class="question-title"><span class="q-badge ai100-badge">Q96</span><span class="question-text">LangGraph 和早期 LangChain Agent 黑盒白盒区别？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：范式对比</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：早期 Agent 是黑盒自主循环；LangGraph 是白盒显式图，每步可测可审计，工程可控性根本提升。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：白盒代价是什么？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：早期 Agent 是黑盒（给工具和目标，内部怎么跑看不清）；LangGraph 是白盒（每个节点、每条边都显式），可测可审计。

**打个比方**：黑盒像自动售货机（投币出饮料，不知道内部机制）；白盒像开放式厨房（每道工序看得见），出问题能定位到哪一步。

#### 📖 面试展开（详细版）

黑盒 vs 白盒是**理解 LangGraph 价值的根本问题**。

**早期 LangChain Agent（黑盒）**：
- 给 LLM 一组 tools 和一个 goal
- LLM 自主决定：调哪个 tool → 看什么结果 → 下一步做什么
- 内部循环：while not done → llm.think() → tool.execute() → llm.think()
- **问题**：看不清中间步骤、难 debug、难审计、行为不可预测

**LangGraph（白盒）**：
- 每个步骤是显式 node：retrieve、grade、generate、cite_check
- 每条跳转是显式 edge：grade 不过 → rewrite，cite 不过 → generate
- trace 逐步对齐图结构：LangSmith 里看到「走了哪些节点、每个节点输入输出」
- **优势**：可测（单节点单测）、可审计（每步有记录）、可控（条件边是确定性规则）

**白盒的代价**：
- **设计成本**：你得先画流程图再写代码，不能全扔给 LLM 自主
- **灵活性降低**：LLM 不能随意跳步，必须走你定义的边
- **前期投入大**：State schema、reducer 约定、节点契约都要先设计

**为什么生产选白盒**：审计（金融/医疗必须知道 AI 做了什么）、合规（每步可追溯）、排障（bad case 定位到具体 node）、评测（节点级回归）。这就是 LangGraph 取代黑盒 Agent 的根本原因。

#### 💡 核心要点
- 黑盒：工具+目标全自动
- 白盒：节点边显式
- 可控性换设计成本

#### 🔁 追问怎么接

- **「白盒代价是什么？」** → 设计成本（先画流程再写代码）、灵活性降低（LLM 不能随意跳步）、前期投入大（State/reducer/节点契约）；但生产环境的审计/合规/排障需求使白盒成为必选项。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="097-framework-selection-tree">

<h2 class="question-title"><span class="q-badge ai100-badge">Q97</span><span class="question-text">LangGraph / LangChain / LlamaIndex / CrewAI 选型决策树？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：框架决策树</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：LlamaIndex 偏数据索引；LangChain 偏组件链；CrewAI 快速多角色；LangGraph 复杂可控流程；可组合使用。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：能说出 trade-off 吗？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：选型看核心需求——数据索引用 LlamaIndex，简单链用 LangChain，快速原型用 CrewAI，复杂可控流程用 LangGraph；可以组合使用。

**打个比方**：像选交通工具——运货用卡车（LlamaIndex），短途用自行车（LangChain），团建包车用巴士（CrewAI），复杂物流调度用调度系统（LangGraph）。

#### 📖 面试展开（详细版）

框架选型决策树是**二面 P1 题**，考察全局视野而非只会一个框架。

**决策树**：

```
核心需求是什么？
├── 数据接入/索引/检索 → LlamaIndex
│   └── 100+ 数据源 connector、高级索引策略
├── 简单线性 LLM 链 → LangChain LCEL
│   └── retriever → prompt → LLM → parser，20 行搞定
├── 快速多角色原型 → CrewAI
│   └── 定义 role + goal + backstory，自动协作
└── 复杂可控 Agent 流程 → LangGraph
    └── 循环、checkpoint、HITL、条件分支、子图
```

**Trade-off 对比**：

| 框架 | 优势 | 劣势 | 适合 |
|---|---|---|---|
| LlamaIndex | 检索强、数据 connector 多 | 不包全流程编排 | RAG-heavy 项目 |
| LangChain | 生态大、组件全 | 复杂流程难表达 | 简单链、原型 |
| CrewAI | 快速、多角色开箱即用 | 控制流黑盒、难定制 | 快速验证想法 |
| LangGraph | 可控、可测、生产特性全 | 学习曲线陡、前期设计成本高 | 生产 Agent |

**组合使用**（实际项目最常见）：
- LlamaIndex 做检索 + LangGraph 做编排
- LangChain 组件（message、retriever、tool）+ LangGraph 图
- CrewAI 快速验证 → 生产迁移到 LangGraph

**面试技巧**：说 trade-off 比背名字强——「CrewAI 适合快速验证，但如果要 HITL 和 checkpoint，生产一定上 LangGraph」。

#### 💡 核心要点
- 数据-heavy 先 LlamaIndex
- 原型 CrewAI
- 生产复杂 Agent LangGraph

#### 🔁 追问怎么接

- **「能说出 trade-off 吗？」** → 每个框架一句话 trade-off：LlamaIndex 检索强但不包编排；LangChain 生态大但复杂流程难表达；CrewAI 快但控不住；LangGraph 稳但重；实际项目常组合使用。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="098-llm-mode-binding">

<h2 class="question-title"><span class="q-badge ai100-badge">Q98</span><span class="question-text">LangGraph 能否实现确定性 Workflow 而非 Agent？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐ · 标签：LangGraph, 进阶 · 考察点：Workflow 模式</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：可以，全部用普通边固定路由、条件边用规则函数不调 LLM，就是确定性 Workflow，仍享受 checkpoint 能力。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 Airflow 区别？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：LangGraph 可以不当 Agent 用——固定边 + 规则条件边（不调 LLM）就是确定性 Workflow，仍有 checkpoint 和 HITL 能力。

**打个比方**：LangGraph 像瑞士军刀——能当 Agent 用（LLM 决策），也能当 Workflow 用（固定流程），还能混合用（前面固定后面 Agent）。

#### 📖 面试展开（详细版）

这道题考察**对 LangGraph 定位的理解**——它不只是 Agent 框架，也是 Workflow 引擎。

**确定性 Workflow 实现**：
- 全部用 `add_edge` 固定跳转（A → B → C → D）
- 条件边路由函数读 state 标量做 if-else，**不调 LLM**
```python
def route_by_status(state):
    if state["status"] == "approved":
        return "publish"
    elif state["status"] == "rejected":
        return "notify_rejection"
    return "wait"
```
- 部分节点调 LLM（如 generate 步骤），部分节点是纯函数（如 format、send_email）

**仍享受 LangGraph 能力**：
- checkpoint：步骤间断点续跑
- interrupt：HITL 审批
- stream：逐步推送进度
- 子图：模块化

**和 Airflow 的区别**：

| | LangGraph | Airflow |
|---|---|---|
| 定位 | 含 LLM 步骤的 AI 流水线 | 通用数据 ETL 调度 |
| 重量 | 轻，嵌入式 | 重，独立调度系统 |
| LLM 集成 | 原生 | 需要额外包装 |
| 适合 | retrieve→LLM→format | 大数据 ETL、定时批处理 |

**实际用法**：很多团队用 LangGraph 管「含 LLM 步骤」的工作流（如内容审核：上传→LLM 审核→人工审批→发布），纯数据 ETL 仍用 Airflow。

#### 💡 核心要点
- 固定边=工作流
- 条件边可纯规则
- checkpoint 是优势

#### 📝 代码/配置示例

```python
# 确定性 Workflow：条件边不调 LLM
def route_by_status(state):
    return {"approved": "publish", "rejected": "notify"}[state["status"]]

builder.add_edge("upload", "llm_review")
builder.add_conditional_edges("llm_review", route_by_status)
builder.add_edge("publish", END)
```

#### 🔁 追问怎么接

- **「和 Airflow 区别？」** → LangGraph 轻量、原生 LLM 集成、适合含 AI 步骤的流水线；Airflow 是通用 ETL 调度、重量、适合大数据批处理；实际常组合：Airflow 调度触发 LangGraph 图。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="099-state-persistence-strategies">

<h2 class="question-title"><span class="q-badge ai100-badge">Q99</span><span class="question-text">State 持久化策略有哪些？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：持久化策略</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Memory 开发；SQLite 单机；Postgres 生产；Redis 高速；按 checkpoint 频率和查询需求选。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：自定义 Redis checkpointer 要点？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：checkpointer 可插拔——开发用 Memory、单机用 SQLite、生产用 Postgres、要极速用 Redis；按 checkpoint 频率和查询需求选。

**打个比方**：像选存储方案——开发用内存（MemorySaver），小项目用本地硬盘（SQLite），生产用云数据库（Postgres），缓存用 Redis。

#### 📖 面试展开（详细版）

State 持久化策略考察**生产选型的工程判断**。

**四种 checkpointer 对比**：

| Checkpointer | 场景 | 优势 | 劣势 |
|---|---|---|---|
| MemorySaver | 开发/测试 | 零配置、最快 | 进程重启丢失 |
| SQLiteSaver | 单机演示 | 持久化、轻量 | 不支持高并发 |
| PostgresSaver | 生产 | 并发、SQL 查询 thread | 需要 PG 实例 |
| Redis | 高速场景 | 极快读写 | 序列化大小限制、TTL 需自管 |

**选型三问**：
1. **checkpoint 频率**：每 step 都存 vs 里程碑存 → 高频用 Redis，低频用 Postgres
2. **保留多久**：7 天 vs 90 天 → 影响存储成本，需 TTL 策略
3. **要不要 SQL 查询**：「列出用户所有 thread」「查某 thread 最后状态」→ 必须 Postgres

**Postgres 生产配置**：
```python
from langgraph.checkpoint.postgres import PostgresSaver
checkpointer = PostgresSaver.from_conn_string("postgresql://...")
graph = builder.compile(checkpointer=checkpointer)
```

**TTL 策略**（v0.4+ keep_latest）：
- 自动裁剪旧 checkpoint，只保留最新 N 个
- 生产必须配 TTL，否则 checkpoint 表无限膨胀

**自定义 Redis checkpointer 要点**：
- 序列化：state 可能很大，考虑压缩（gzip）
- TTL：每个 checkpoint 设 expire
- 命名空间：thread_id 作 key prefix

#### 💡 核心要点
- checkpointer 可插拔
- Postgres 支持查询 thread 列表
- TTL 策略各后端不同

#### 📝 代码/配置示例

```python
# 生产 Postgres
from langgraph.checkpoint.postgres import PostgresSaver
checkpointer = PostgresSaver.from_conn_string(DB_URL)
graph = builder.compile(checkpointer=checkpointer)

# 开发 Memory
from langgraph.checkpoint.memory import MemorySaver
graph = builder.compile(checkpointer=MemorySaver())
```

#### 🔁 追问怎么接

- **「自定义 Redis checkpointer 要点？」** → 序列化大小（state 可能很大，考虑 gzip 压缩）；TTL 每个 checkpoint 设 expire；命名空间 thread_id 作 key prefix；注意 Redis 单 value 大小限制（512MB）。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="100-production-checklist">

<h2 class="question-title"><span class="q-badge ai100-badge">Q100</span><span class="question-text">LangGraph 生产上线 Checklist 有哪些？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：LangGraph, 进阶 · 考察点：上线清单</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：编译单例、PG checkpoint、幂等、HITL、限流、监控、评测集、降级、schema 版本、secrets 管理、文档化 state 约定。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：上线前最后一项检查什么？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：生产上线 12 项 checklist——编译单例、PG checkpoint、幂等、HITL、限流、监控、评测、降级、版本、secrets、文档化 state 约定。

**打个比方**：像飞机起飞检查清单——12 项全绿才放行；漏一项可能不是立即坠机，但会在某个恶劣条件下暴露。

#### 📖 面试展开（详细版）

生产上线 Checklist 是**二面收尾题**，考察能否把分散工程点串成体系。

**12 项 Checklist**：

**① 图全局 compile 单例**
- 应用启动时 compile 一次，全局复用
- 绝不 per-request compile

**② Postgres checkpointer**
- 生产不用 MemorySaver
- 配 TTL 防膨胀

**③ thread 租户隔离**
- thread_id 含 tenant_id
- 网关层校验

**④ tool 幂等**
- 副作用 tool 配幂等键
- resume 前先查业务库

**⑤ 高危 interrupt**
- 写操作 interrupt_before 审批
- audit log 记录

**⑥ recursion_limit + fallback**
- 防死循环
- 超限走 fallback 不是 500

**⑦ 节点级 trace**
- LangSmith / 自研 trace
- 每 node 耗时、token、失败率

**⑧ 黄金集回归**
- 上线前跑离线评测集
- 节点级 + 端到端

**⑨ 输入输出 Guardrails**
- 入口 sanitize
- 出口内容过滤

**⑩ API 限流**
- 网关 QPS 限制
- 节点内 token bucket

**⑪ 降级链**
- 主路径 → 备用 → 模板
- 用户总有响应

**⑫ graph/schema 版本**
- 多版本共存
- 新 thread 新版、旧 thread 旧版 finish

**上线前最后一项**：用生产流量 shadow 跑新版本，对比 trace/失败率/token，确认无退化才切流量。

**state 约定文档化**：reducer 规则、字段含义、生命周期写进 wiki，oncall 能看懂。

#### 💡 核心要点
- 12 项 checklist
- 先跑 shadow traffic
- state 约定写进 wiki

#### 📝 代码/配置示例

```python
# 生产 compile 单例
graph = None
def get_graph():
    global graph
    if graph is None:
        graph = builder.compile(
            checkpointer=PostgresSaver.from_conn_string(DB_URL),
            interrupt_before=["publish"],
        )
    return graph

# 上线前 shadow
async def shadow_test(prod_input):
    v1_result = await graph_v1.ainvoke(prod_input)
    v2_result = await graph_v2.ainvoke(prod_input)  # 不返回用户
    compare_traces(v1_result, v2_result)
```

#### 🔁 追问怎么接

- **「上线前最后一项检查什么？」** → shadow traffic：用生产真实输入跑新版本，对比 trace/节点失败率/token 消耗/答案质量，确认无退化才切流量；同时确认 state reducer 约定已文档化，oncall 能看懂。
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="real">← 📋 LangGraph · 真实面经</a>

</div>
