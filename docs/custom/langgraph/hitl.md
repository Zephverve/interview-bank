---
custom: true
partTitle: LangGraph 面经题库 · LangGraph · 持久化与 HITL
partColor: #6366f1
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #6366f1">

# ⏸️ LangGraph · 持久化与 HITL

<p class="part-desc">LangGraph 面经题库 · 第 4/8 章 · 9 题</p>
<span class="part-round custom-tag">面试问答</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="flow">← 🔀 LangGraph · 控制流</a>

<a class="chapter-nav-link chapter-nav-next" href="multi">👥 LangGraph · 多 Agent →</a>

</div>

<div class="question-card ai100-card interview-card compact-card" id="035-checkpointer">

<h2 class="question-title"><span class="q-badge ai100-badge">Q35</span><span class="question-text">checkpoint / checkpointer 是什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LangGraph, HITL · 考察点：持久化</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：checkpointer 在每个 super-step 后持久化 state 快照；支持 Memory/SQLite/Postgres，配合 thread_id 实现会话恢复。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和数据库事务关系？ · 自定义 checkpointer？</div>
</div>

**优先级**：P0 · 4+ 篇面经

#### 🗣️ 先用大白话说

checkpoint 是图执行到某一步之后的「状态快照」，checkpointer 是存这些快照的后端（内存、SQLite、Postgres 都行）。compile 时注入 checkpointer，invoke 时传 thread_id，框架自动存取。它的价值不只是断点续聊，更是崩溃恢复、HITL 挂起几天后 resume、以及开发时的时间旅行调试。百度面经强调：checkpoint 不是简单存档，是可重放的状态机快照。

#### 📖 面试展开（详细版）

**是什么**：checkpoint 是图执行完一个 super-step 后整个 state 的序列化快照，包含各 channel 的值和执行指针（pending 边等）。checkpointer 是持久化这些快照的存储后端。

**为什么不是简单存档**：普通存档只保存结果；checkpoint 保存的是状态机的完整上下文，恢复时可以精确继续执行、fork 新分支、或回滚到历史点。这是 LangGraph 做生产级 Agent 的核心能力。

**怎么用**：graph.compile(checkpointer=MemorySaver()) 编译时注入；invoke 时传 config={"configurable": {"thread_id": "xxx"}} 标识会话。开发用 MemorySaver，生产用 PostgresSaver 或 Redis 等持久化后端。

**核心场景**：跨请求多轮对话延续；进程崩溃后从最后 checkpoint 恢复；HITL interrupt 挂起数小时/数天后 resume；开发调试时 get_state_history 查看历史。

**防止膨胀**：图内 state 只放当前任务必需数据（最近几轮对话、路由标志位）；跨会话历史、海量检索结果走外置存储；设 TTL 和里程碑裁剪（只保留最近 N 个 checkpoint）。

**踩坑**：什么都往 state 里塞导致 checkpoint 体积膨胀；thread_id 和业务主键混用；恢复时不考虑 pending 边是否重跑。

#### 💡 核心要点
- checkpoint = 可重放的状态机快照
- compile 时注入 checkpointer
- 生产用 PostgresSaver

#### 📝 代码/配置示例

```python
from langgraph.checkpoint.memory import MemorySaver
from langgraph.checkpoint.postgres import PostgresSaver

# 开发
memory = MemorySaver()
app = graph.compile(checkpointer=memory)

# 生产
# saver = PostgresSaver.from_conn_string(DB_URL)
# app = graph.compile(checkpointer=saver)

config = {"configurable": {"thread_id": "user-123-session-1"}}
result = app.invoke({"messages": [HumanMessage("你好")]}, config)
```

#### 🔁 追问怎么接

**「和数据库事务关系？」**——checkpoint 是应用层状态快照，不是 DB 事务；但 checkpointer 后端可以用 Postgres，两者正交。副作用操作仍需业务层幂等。

**「自定义 checkpointer？」**——实现 BaseCheckpointSaver 接口，对接公司内部 KV/对象存储。强调序列化格式和 TTL 策略。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="036-thread-id">

<h2 class="question-title"><span class="q-badge ai100-badge">Q36</span><span class="question-text">thread_id 怎么设计？和业务主键什么关系？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, HITL · 考察点：会话隔离</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：thread_id 是编排会话槽，用于 checkpoint 隔离；业务主键（订单号等）放 state 字段，恢复时用业务键做幂等。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：多租户怎么隔离？ · 一个用户多个 thread？</div>
</div>

**优先级**：P0 · 3+ 篇面经

#### 🗣️ 先用大白话说

thread_id 是 LangGraph 的「会话槽」，传在 invoke config 里，同一 thread_id 会加载历史 checkpoint 实现多轮延续。百度面经建议它和业务主键分开：thread_id 给框架编排用，订单号/任务 id 放 state 字段。恢复时用业务键检查外部副作用是否已执行。多租户可在 thread_id 加 tenant 前缀，一个用户也可以有多个 thread 对应不同任务。

#### 📖 面试展开（详细版）

**是什么**：thread_id 是 checkpointer 用来隔离不同会话的标识符，传在 config.configurable.thread_id 里。同一 thread_id 的多次 invoke 会加载/追加同一串 checkpoint。

**为什么和业务主键分开**：thread_id 是编排层的会话概念，可能因用户「新建对话」而变；业务主键（订单号、支付 id）是领域层的唯一标识，生命周期更长、语义不同。混在一起会导致恢复时无法正确判断外部副作用是否已执行。

**设计实践**：thread_id 格式如 "{tenant_id}:{user_id}:{session_uuid}"；业务主键放 state.order_id、state.task_id 等字段；副作用操作以业务主键做幂等键。

**多租户隔离**：thread_id 加 tenant 前缀；checkpointer 表按 tenant 分区或加索引；不同租户绝不共享 thread_id。

**一用户多 thread**：完全合理。用户可能同时有「写报告」和「查订单」两个独立任务，各用不同 thread_id，互不干扰。

**恢复时的双重检查**：编排层用 thread_id 加载 checkpoint 继续执行；领域层用业务主键查外部系统（「这笔订单是否已扣款」）决定副作用是否跳过。

**踩坑**：用订单号当 thread_id 导致会话无法「新建对话」；多租户 thread_id 碰撞；恢复只看 thread_id 不查业务状态导致重复副作用。

#### 💡 核心要点
- config.configurable.thread_id
- 编排 id ≠ 领域 id
- 恢复时业务幂等键独立管理

#### 📝 代码/配置示例

```python
config = {
    "configurable": {
        "thread_id": f"{tenant_id}:{user_id}:{session_uuid}",
    }
}

# state 里放业务主键
def start_node(state):
    return {
        "order_id": state.get("order_id") or generate_order_id(),
        "task_status": "started",
    }

# 恢复时双重检查
def execute_payment(state):
    if payment_already_done(state["order_id"]):
        return {"payment_status": "already_done"}
    return charge(state["order_id"])
```

#### 🔁 追问怎么接

**「多租户怎么隔离？」**——thread_id 加 tenant 前缀 + checkpointer 表分区 + 访问鉴权。绝不跨租户共享 thread。

**「一个用户多个 thread？」**——完全可以，每个独立任务一个 thread。举例「写报告」和「查订单」分开。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="037-human-in-the-loop">

<h2 class="question-title"><span class="q-badge ai100-badge">Q37</span><span class="question-text">LangGraph 如何实现 Human-in-the-loop？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：LangGraph, HITL · 考察点：HITL</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：checkpointer + interrupt_before/after 或 interrupt() 挂起，人工审批后 Command/stream(None) 恢复，可用 update_state 纠偏。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：审批拒绝怎么走？ · 外部副作用幂等？</div>
</div>

**优先级**：P0 · 3+ 篇面经

#### 🗣️ 先用大白话说

HITL 靠两件事：checkpointer 存快照 + interrupt 挂起执行。编译时设 interrupt_before=["execute"] 或在节点内调 interrupt()，执行到这儿就暂停，把控制权还给应用层，前端展示中间结果等人操作。人批准后 stream(None) 或 Command(resume=...) 继续；也可以 update_state 改错的数据再恢复。这是区分「调过 demo」和「上过线」的分水岭——百度面经会深挖恢复时 pending 边是否重跑、副作用有没有幂等键。

#### 📖 面试展开（详细版）

**是什么**：Human-in-the-loop（HITL）让人类在 Agent 执行过程中介入审批、修改或终止。LangGraph 通过 interrupt 机制原生支持，不需要自己写轮询或状态机。

**核心依赖**：必须有 checkpointer——interrupt 时框架把当前 state 存入 checkpoint 并挂起；没有 checkpointer，interrupt 无法跨请求持久化。

**实现方式**：编译时 interrupt_before=["node_name"] 在节点执行前暂停；interrupt_after=["node_name"] 在节点执行后暂停；节点内 interrupt(payload) 动态按条件暂停（LangGraph 1.0 推荐）。

**恢复流程**：应用层展示 interrupt 时的 state/payload；用户操作后调用 app.stream(None, config) 或 Command(resume=user_input) 继续。也可用 update_state 修改 checkpoint 里的 state 后恢复。

**工程要点**：挂起时交代清楚哪些副作用已发生、哪些还没；恢复时 pending 边是否重跑要有明确策略；审批涉及的外部操作（发邮件、扣款）必须配幂等键。

**项目例子**：生成 SQL 后 interrupt 让人审核，人改了几处再用 Command(resume=modified_sql) 继续执行；金额超阈值 interrupt 展示详情给审批人。

**踩坑**：没配 checkpointer 导致 interrupt 无法跨请求；恢复后副作用重复执行；审批拒绝没有设计正常路由当异常处理。

#### 💡 核心要点
- interrupt 是生产级 Agent 分水岭
- interrupt_before 防高危操作
- update_state 可改 state 或强制跳转

#### 📝 代码/配置示例

```python
from langgraph.types import interrupt, Command

def draft_plan(state):
    plan = llm_generate_plan(state)
    return {"plan": plan}

def execute_plan(state):
    # 动态 interrupt：金额超阈值才暂停
    if state["plan"]["amount"] > 10000:
        approval = interrupt({"plan": state["plan"], "reason": "high_amount"})
        if not approval.get("approved"):
            return Command(goto="apology")
    return run_plan(state["plan"])

app = graph.compile(
    checkpointer=PostgresSaver.from_conn_string(DB_URL),
    interrupt_before=["execute_plan"],
)
```

#### 🔁 追问怎么接

**「审批拒绝怎么走？」**——Command(resume={"approved": False}) 或 Command(goto="apology")，条件边读标志位路由。拒绝是正常业务路径。

**「外部副作用幂等？」**——idempotency_key + executed_actions 列表 + 恢复前查外部系统状态。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="038-interrupt-before-after">

<h2 class="question-title"><span class="q-badge ai100-badge">Q38</span><span class="question-text">interrupt_before 和 interrupt_after 的区别？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, HITL · 考察点：中断点</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：before：操作发生前拦截（转账、删库）；after：产出后审阅打回（生成报告、写代码）。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：能否运行时动态设 interrupt？ · 和 breakpoint 废弃 API？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

interrupt_before 在节点执行「之前」暂停，适合高危操作——还没删库、还没转账，人先看 plan 再决定让不让执行。interrupt_after 在节点跑「完之后」暂停，适合生成类——报告写完了人改几句再继续。选哪个取决于风险在时间线的哪一侧。LangGraph 1.0 的 interrupt() 函数更灵活，可以运行时按 state 条件动态决定要不要暂停。

#### 📖 面试展开（详细版）

**interrupt_before**：在指定节点执行前挂起。节点内的逻辑还没跑，state 里是前置节点产出的结果。适合「防患于未然」场景——转账、删库、批量发邮件等不可逆操作，人先看计划再批准执行。

**interrupt_after**：在指定节点执行完后挂起。节点逻辑已跑完，结果已在 state 里。适合「审阅打回」场景——报告生成、代码草稿、营销文案，人修改后再继续下游。

**选择原则**：风险在操作前 → before（Guardrails）；风险在产出质量 → after（Review）。金融审批、权限变更用 before；内容创作、方案生成用 after。

**动态 interrupt**：LangGraph 1.0 推荐在节点内用 interrupt(payload)，按运行时条件决定是否暂停（如金额超阈值才 interrupt），比编译时写死列表更灵活。

**和 breakpoint 废弃 API**：旧 breakpoint 语义模糊，1.0 用 interrupt/Command 统一替代。面试提到说明跟过新版本。

**踩坑**：before 和 after 选错导致该审的没审到；编译时写死列表无法应对动态条件；interrupt 后没设计拒绝路径。

#### 💡 核心要点
- before = Guardrails
- after = Review
- compile 时或动态配置

#### 📝 代码/配置示例

```python
# 编译时静态配置
app = graph.compile(
    checkpointer=saver,
    interrupt_before=["transfer_money", "delete_records"],
    interrupt_after=["generate_report", "draft_email"],
)

# 节点内动态 interrupt（1.0 推荐）
def transfer_node(state):
    if state["amount"] > 5000:
        interrupt({"amount": state["amount"], "to": state["recipient"]})
    return do_transfer(state)
```

#### 🔁 追问怎么接

**「能否运行时动态设？」**——可以，节点内 interrupt() 按 state 条件动态暂停，比编译时列表灵活。举例金额阈值。

**「和 breakpoint 废弃 API？」**——1.0 用 interrupt/Command 替代，语义更清晰。提到说明跟过新版本。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="039-resume-idempotency">

<h2 class="question-title"><span class="q-badge ai100-badge">Q39</span><span class="question-text">中断恢复时如何保证幂等？外部副作用怎么处理？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：LangGraph, HITL · 考察点：幂等</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：恢复前检查副作用是否已执行；工具层幂等键；区分已提交 state 和 pending 边；resume 可能重跑节点需防护。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：pending 边会不会重跑？ · thread 恢复和业务恢复区别？</div>
</div>

**优先级**：P0 · 2+ 篇面经

#### 🗣️ 先用大白话说

百度面经深挖题。interrupt 恢复时要交代清楚：checkpoint 里哪些 channel 已写入、哪些外部副作用已发生、resume 时 pending 边会不会重跑节点。涉及发邮件、下单、扣款的工具必须配幂等键，恢复前先查是否已成功。state 里可维护 executed_actions 列表。thread_id 恢复是编排层，业务主键恢复是领域层——两层都要答才完整。

#### 📖 面试展开（详细版）

**核心问题**：interrupt 恢复后，框架可能重跑 pending 边的节点。如果该节点有外部副作用（发邮件、扣款、写数据库），重跑就会导致重复执行。

**幂等三层防护**：第一，工具层 idempotency_key——用业务主键（order_id）做 dedup key，外部 API 保证同一 key 只执行一次。第二，state 层 executed_actions 列表——副作用节点执行前查列表，已存在则跳过。第三，恢复前查外部系统——resume 之前查「这笔订单是否已扣款」，已扣则跳过。

**pending 边是否重跑**：resume 时，被 interrupt 暂停的节点可能重新执行（取决于 interrupt 位置和 LangGraph 版本行为）。工程上假设「可能重跑」，所有副作用节点都做幂等防护。

**thread 恢复 vs 业务恢复**：thread_id 恢复是编排层——加载 checkpoint 继续图执行；业务恢复是领域层——用 order_id 等查外部系统判断副作用状态。两者正交，都要做。

**已提交 state vs pending 边**：checkpoint 里已提交的 channel 值不会丢；但 pending 边指向的节点 resume 时可能再跑。副作用节点应放在 interrupt 之后且做好幂等，或放在 interrupt 之前确保已审才执行。

**踩坑**：假设 resume 不会重跑节点导致重复扣款；只用 thread_id 不做业务层检查；executed_actions 没持久化到 checkpoint。

#### 💡 核心要点
- 外部操作配 idempotency_key
- 记录 executed_actions 进 state
- resume 前查业务主键状态

#### 📝 代码/配置示例

```python
def send_email_node(state):
    action_id = f"email:{state['order_id']}:confirmation"
    if action_id in state.get("executed_actions", []):
        return {"email_status": "already_sent"}
    if external_email_sent(state["order_id"]):
        return {
            "email_status": "already_sent",
            "executed_actions": [action_id],
        }
    send_email(idempotency_key=action_id, to=state["email"])
    return {
        "email_status": "sent",
        "executed_actions": [action_id],
    }
```

#### 🔁 追问怎么接

**「pending 边会不会重跑？」**——可能会，工程上假设会重跑，所有副作用节点做幂等。具体行为取决于 interrupt 位置。

**「thread 恢复和业务恢复区别？」**——thread 是编排层加载 checkpoint；业务是用 order_id 查外部系统。两层正交都要答。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="040-long-running-tasks">

<h2 class="question-title"><span class="q-badge ai100-badge">Q40</span><span class="question-text">长时间运行任务怎么处理？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, HITL · 考察点：长任务</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：checkpoint 分段持久化 + 异步节点 + 后台 worker 轮询 thread 状态，避免 HTTP 长连接超时。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：任务跑几天怎么设计？ · 进度怎么给前端？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

长任务不能指望一次 HTTP 请求跑完。标准模式是：启动时 invoke 传 thread_id，图按节点 checkpoint；HTTP 立即返回 task_id；客户端轮询 get_state 或订阅 stream 看进度。更重的任务放 Celery/ARQ worker 里 ainvoke，每步 checkpoint 后释放 worker。失败从最后 checkpoint 续跑，不从头来。几天级任务还要考虑 checkpoint TTL 和状态压缩。

#### 📖 面试展开（详细版）

**问题**：Agent 任务可能跑几分钟到几小时（批量处理、多轮 ReAct、大文档分析），HTTP 长连接会超时，进程崩溃会丢失进度。

**分段 checkpoint**：图每经过一个节点自动 checkpoint，任意时刻崩溃都能从最后保存点恢复，不需要从头跑。

**异步架构**：API 层收到请求后，往 Celery/ARQ 队列丢任务，worker 里 ainvoke 执行图，HTTP 立即返回 task_id + thread_id。客户端用 task_id 轮询状态。

**进度推送**：app.get_state(config) 返回当前 state 和 next 节点，前端展示「正在检索」「正在生成」。更好的体验用 app.stream() 或 WebSocket 实时推送节点级事件。

**几天级任务**：checkpoint TTL 避免存储爆炸；state 压缩（消息 summarization）；考虑把重计算步骤拆成独立子图，每步完成释放资源。

**LangGraph 1.0 durable execution**：面向长任务的持久执行能力，节点失败自动从 checkpoint 重试，适合生产级长任务。

**踩坑**：HTTP 同步等待长任务超时；没 checkpoint 崩溃后从头跑；进度不推送用户以为卡死。

#### 💡 核心要点
- 每 super-step checkpoint
- 异步 ainvoke + 任务队列
- stream 或 webhook 推进度

#### 📝 代码/配置示例

```python
# API 层：异步提交
@app.post("/tasks")
async def start_task(req: TaskRequest):
    task_id = str(uuid4())
    thread_id = f"task-{task_id}"
    celery_app.send_task("run_graph", args=[req.input, thread_id])
    return {"task_id": task_id, "thread_id": thread_id}

# Worker 层
def run_graph(input_data, thread_id):
    config = {"configurable": {"thread_id": thread_id}}
    return app.invoke(input_data, config)

# 前端轮询进度
state = app.get_state({"configurable": {"thread_id": thread_id}})
progress = state.values.get("current_step", "unknown")
```

#### 🔁 追问怎么接

**「任务跑几天怎么设计？」**——checkpoint TTL + state 压缩 + 子图拆分 + durable execution。每天自动 summarization 减 state 体积。

**「进度怎么给前端？」**——get_state 轮询简单；stream/WebSocket 实时体验好。展示 current_step 和百分比。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="041-streaming">

<h2 class="question-title"><span class="q-badge ai100-badge">Q41</span><span class="question-text">LangGraph 流式输出怎么实现？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LangGraph, HITL · 考察点：流式</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：graph.stream() 支持 values/updates/messages 等 mode，可 SSE 推节点级或 token 级事件给前端。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：多 thread 并发 stream？ · 和 LangChain callback 关系？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

用 app.stream(input, config, stream_mode=...) 可以流式拿到执行过程。stream_mode="updates" 看每节点 state 更新；"messages" 推 LLM token 级输出；"values" 看每步完整 state 适合调试。生产环境用 FastAPI 包 SSE 或 WebSocket 推给前端，让用户看到「正在检索」「正在生成」比干等体验好很多。

#### 📖 面试展开（详细版）

**是什么**：LangGraph 的 stream API 在执行图时逐步 yield 事件，而不是等全部跑完才返回。支持同步 stream() 和异步 astream()。

**stream_mode 选择**："updates"——每节点执行后的 state 增量更新，适合展示进度（「检索完成，正在生成」）。"messages"——LLM 的 token 级流式输出，适合打字机效果。"values"——每步完整 state，适合开发调试。"debug"——更详细的执行信息。

**生产实现**：FastAPI 用 StreamingResponse 包 SSE：async for event in graph.astream(...) yield f"data: {json.dumps(event)}\n\n"。前端 EventSource 或 WebSocket 接收。

**多 thread 并发**：每个 stream 绑定不同 thread_id 的 config，各自独立，互不干扰。注意 checkpointer 后端的并发读写性能。

**和 LangChain callback 关系**：LangGraph 的 messages 模式底层走 LangChain 的 streaming callback 机制；节点级 updates 是 LangGraph 独有的图级事件。

**踩坑**：stream 没处理异常导致前端一直等；混用多种 stream_mode 不清楚各自用途；生产没用 SSE 缓冲导致事件丢失。

#### 💡 核心要点
- stream_mode 选 values 看完整 state
- messages 模式推 token
- 生产用 WebSocket/SSE

#### 📝 代码/配置示例

```python
from fastapi.responses import StreamingResponse

async def stream_agent(query: str, thread_id: str):
    config = {"configurable": {"thread_id": thread_id}}
    async for event in app.astream(
        {"messages": [HumanMessage(query)]},
        config,
        stream_mode=["updates", "messages"],
    ):
        yield f"data: {json.dumps(event, default=str)}\n\n"

@app.get("/chat/stream")
async def chat_stream(q: str, thread_id: str):
    return StreamingResponse(stream_agent(q, thread_id), media_type="text/event-stream")
```

#### 🔁 追问怎么接

**「多 thread 并发 stream？」**——各 stream 独立 config/thread_id，checkpointer 后端注意并发性能。

**「和 LangChain callback 关系？」**——messages 模式走 LC callback；updates 是 LangGraph 图级事件。两者可组合。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="042-time-travel-debug">

<h2 class="question-title"><span class="q-badge ai100-badge">Q42</span><span class="question-text">时间旅行调试（Time Travel）是什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, HITL · 考察点：调试</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：通过 get_state_history 查看历史 checkpoint，可回滚到任意 super-step 重新 fork 执行，便于复现 bug。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 LangSmith 关系？ · 生产能开吗？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

时间旅行就是 get_state_history(thread_config) 列出该 thread 所有历史 checkpoint，选中某个 checkpoint_id 用 update_state 从该点 fork 新执行分支。开发时特别好用：用户报了 bug，回到出错前一步，改 state 或改路由重跑，看「如果当时走了另一条路」会怎样。LangSmith 可视化每步 state 变化，和时间旅行互补。生产环境回滚要谨慎，涉及已发生的副作用。

#### 📖 面试展开（详细版）

**是什么**：Time Travel 利用 checkpointer 保存的历史 checkpoint，可以查看、回滚、fork 任意 super-step 的执行状态，是从历史点重新执行或修改后重跑的能力。

**怎么用**：app.get_state_history(config) 返回该 thread 所有 checkpoint 列表，每个有 checkpoint_id 和对应 state。选中某个历史点，用 app.update_state(historical_config, new_values) 从该点 fork 新分支，再用 stream/invoke 继续执行。

**开发场景**：复现用户 bug——回到出错前一步，修改 state（如换一个检索结果）重跑；A/B 测试不同路由策略；调试条件边逻辑。

**和 LangSmith 关系**：LangSmith 提供可视化 trace 和时间线，Time Travel 是运行时操作能力。两者互补：LangSmith 看全局，Time Travel 在本地 fork 重跑。

**生产能开吗**：get_state_history 查看可以开（注意权限和脱敏）；随意回滚 fork 生产慎用——回滚点之后可能已有不可逆副作用（已发邮件、已扣款）。开发/预发环境可随意实验。

**踩坑**：生产环境随意 fork 导致副作用重复；history 太多不清理占存储；回滚后不更新代码版本导致行为不一致。

#### 💡 核心要点
- 每个 checkpoint 有 checkpoint_id
- update_state 从旧点 fork 新分支
- 开发利器，生产慎用随意回滚

#### 📝 代码/配置示例

```python
config = {"configurable": {"thread_id": "debug-thread-1"}}

# 查看历史
history = list(app.get_state_history(config))
for i, snap in enumerate(history):
    print(i, snap.config["configurable"]["checkpoint_id"], snap.values.get("current_step"))

# 从第 3 步 fork 新分支
old_config = history[3].config
app.update_state(old_config, {"route_key": "alternative_path"})
for event in app.stream(None, old_config):
    print(event)
```

#### 🔁 追问怎么接

**「和 LangSmith 关系？」**——LangSmith 可视化 trace；Time Travel 是运行时 fork 重跑能力。互补。

**「生产能开吗？」**——查看 history 可以（注意权限）；随意 fork 回滚生产慎用，副作用可能已发生。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="043-dynamic-breakpoints">

<h2 class="question-title"><span class="q-badge ai100-badge">Q43</span><span class="question-text">Dynamic Breakpoints 动态断点怎么用？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, HITL · 考察点：断点</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：节点内 interrupt() 可按运行时条件动态挂起，比编译时固定 interrupt_before 更灵活。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和静态 interrupt 列表取舍？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

动态断点用节点内 interrupt(payload) 实现——比如金额超过阈值才 interrupt，小额直接过。比 compile 时写死 interrupt_before 列表灵活得多，审批 UI 还能拿到 payload 里的详情（金额、收款人等）。静态列表适合「这几个节点永远要审」；动态适合「视 state 内容决定要不要人看」。1.0 后 interrupt/Command 是一等公民，面试提到说明跟过新版本。

#### 📖 面试展开（详细版）

**是什么**：Dynamic Breakpoints 指在节点执行过程中，根据运行时 state 条件动态决定是否 interrupt 挂起，而非编译时固定 interrupt 列表。

**实现**：在节点函数内调用 interrupt(payload)，如果执行到这行，框架挂起并将 payload 返回给应用层。条件判断在 interrupt 之前：if amount > threshold: interrupt({...})。

**payload 作用**：传给审批 UI 的上下文——金额、收款人、操作类型等，让人做 informed decision，而不是看空白审批页。

**和静态 interrupt 列表取舍**：静态 interrupt_before/after 适合「这几个节点永远要审」的固定合规要求；动态 interrupt 适合「视内容决定」的场景，如金额阈值、敏感词检测、风险评分。

**恢复**：应用层收到 payload 展示审批界面；用户操作后 Command(resume=...) 继续；resume 值传回 interrupt 调用处作为返回值。

**LangGraph 1.0**：interrupt/Command 是一等公民 API，替代旧 breakpoint。面试主动提到说明技术跟进及时。

**踩坑**：interrupt 条件写错导致该审的不审；payload 信息不足审批人无法判断；动态和静态 interrupt 混用逻辑混乱。

#### 💡 核心要点
- interrupt() 带上下文给审批 UI
- 条件满足才暂停
- LangGraph 1.0 推荐方式

#### 📝 代码/配置示例

```python
from langgraph.types import interrupt

def transfer_node(state):
    amount = state["amount"]
    recipient = state["recipient"]

    # 动态：仅大额需要审批
    if amount > 10000:
        approval = interrupt({
            "action": "transfer",
            "amount": amount,
            "recipient": recipient,
            "risk_score": calc_risk(state),
        })
        if not approval.get("approved"):
            return {"status": "rejected"}
        amount = approval.get("modified_amount", amount)

    return execute_transfer(amount, recipient)
```

#### 🔁 追问怎么接

**「和静态 interrupt 列表取舍？」**——静态适合固定合规（永远要审的节点）；动态适合条件触发（金额阈值、风险评分）。可以组合使用。

**补充**：提到 1.0 interrupt/Command 替代旧 breakpoint，说明跟进新版本。
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="flow">← 🔀 LangGraph · 控制流</a>

<a class="chapter-nav-link chapter-nav-next" href="multi">👥 LangGraph · 多 Agent →</a>

</div>
