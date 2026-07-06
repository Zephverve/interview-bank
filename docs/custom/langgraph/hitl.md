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

**📖 核心要点**
- checkpoint = 可重放的状态机快照
- compile 时注入 checkpointer
- 生产用 PostgresSaver

**🗣️ 标准口语答案**

checkpoint 是图执行到某 super-step 后的 state 快照，checkpointer 是持久化后端。compile(checkpointer=...) 后，每次 invoke 传 thread_id，框架自动存取。

开发用 MemorySaver，生产用 PostgresSaver 或 Redis。价值：跨请求对话延续、崩溃恢复、HITL 挂起几天后 resume、时间旅行调试。

百度面经强调：checkpoint 不是简单存档，是可重放快照——恢复时要讲清哪些 channel 写入、pending 边是否重跑。
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

**📖 核心要点**
- config.configurable.thread_id
- 编排 id ≠ 领域 id
- 恢复时业务幂等键独立管理

**🗣️ 标准口语答案**

thread_id 在 invoke config 里传：{"configurable": {"thread_id": "user-123-session-456"}}。同一 thread_id 的调用会加载历史 checkpoint，实现多轮延续。

百度面经建议分开：thread_id 给 LangGraph 编排用；订单号、任务 id 放 state 业务字段。恢复时用业务键检查外部副作用是否已执行，避免和框架状态糊在一起。

多租户可在 thread_id 加 tenant 前缀，checkpointer 表按 tenant 分区。一个用户可有多 thread 对应不同任务。
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

**📖 核心要点**
- interrupt 是生产级 Agent 分水岭
- interrupt_before 防高危操作
- update_state 可改 state 或强制跳转

**🗣️ 标准口语答案**

HITL 靠 checkpointer 存快照 + interrupt 挂起。编译时 interrupt_before=["execute"] 或节点内 interrupt({...}) 暂停，把控制权交还应用层，前端展示中间结果等人操作。

人工批准后 stream(None, config) 或 Command(resume=...) 继续；也可 update_state 改错 SQL 再恢复。interrupt_before 是防患于未然，interrupt_after 是审阅打回。

百度面经会追问：恢复时 pending 边是否重跑、发邮件扣款有没有幂等键。这是区分玩具和生产的分水岭。
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

**📖 核心要点**
- before = Guardrails
- after = Review
- compile 时或动态配置

**🗣️ 标准口语答案**

interrupt_before=["execute_node"] 在节点执行前暂停，适合高危操作——还没删库、还没转账，人先看 plan。interrupt_after=["draft_node"] 在节点跑完后暂停，适合生成类——报告写完了人改几句再继续。

选点取决于风险在时间线的哪一侧。金融审批、批量邮件用 before；内容创作、方案生成用 after。LangGraph 1.0 用 interrupt() 函数更灵活，可带上下文给审批 UI。
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

**📖 核心要点**
- 外部操作配 idempotency_key
- 记录 executed_actions 进 state
- resume 前查业务主键状态

**🗣️ 标准口语答案**

百度面经深挖题。interrupt 恢复时要交代：哪些 channel 已写入 checkpoint、哪些外部副作用已发生、pending 边 resume 时是否重跑节点。

工具调用涉及发邮件、下单、扣款，必须幂等键——用业务 id 做 dedup，恢复时先查是否已成功。state 里可维护 executed_actions 列表，副作用节点先查再执行。

thread_id 恢复是编排层；业务恢复是领域层——两者都要答才完整。
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

**📖 核心要点**
- 每 super-step checkpoint
- 异步 ainvoke + 任务队列
- stream 或 webhook 推进度

**🗣️ 标准口语答案**

长任务不能指望一次 HTTP 跑完。模式是：启动时 invoke 传 thread_id，图按节点 checkpoint；HTTP 立即返回 task_id；客户端轮询 get_state 或订阅 stream 看进度。

更重任务放 Celery/ARQ worker 里 ainvoke，每步 checkpoint 后释放 worker。失败从最后 checkpoint 续跑，不从头来。几天级任务还要考虑 checkpoint TTL 和状态压缩。

LangGraph 1.0 的 durable execution 就是面向这个场景。
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

**📖 核心要点**
- stream_mode 选 values 看完整 state
- messages 模式推 token
- 生产用 WebSocket/SSE

**🗣️ 标准口语答案**

用 app.stream(input, config, stream_mode="updates") 拿每节点 state 更新；stream_mode="messages" 推 LLM token；values 看每步完整 state，调试好用。

生产 FastAPI 包 SSE：async for event in graph.astream(...) yield。多 thread 靠不同 thread_id 隔离，各 stream 独立。

面试可提 node 级流式让用户看到「正在检索」「正在生成」，比干等最终答案体验好。
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

**📖 核心要点**
- 每个 checkpoint 有 checkpoint_id
- update_state 从旧点 fork 新分支
- 开发利器，生产慎用随意回滚

**🗣️ 标准口语答案**

时间旅行指 get_state_history(thread_config) 列出该 thread 所有历史 checkpoint，可以选中某个 checkpoint_id 用 update_state 从该点 fork 新执行分支，复现「如果当时走了另一条路」的行为。

开发调试神器：用户报 bug 时回到出错前一步，改 state 或改路由重跑。LangSmith 可视化每步 state 变化，和时间旅行互补。

生产环境回滚要谨慎，涉及已发生的副作用；开发环境可随意实验。
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

**📖 核心要点**
- interrupt() 带上下文给审批 UI
- 条件满足才暂停
- LangGraph 1.0 推荐方式

**🗣️ 标准口语答案**

动态断点用节点内 interrupt(payload) 实现——比如金额超过阈值才 interrupt，小额直接过。比 compile 时写死 interrupt_before 更灵活，审批 UI 能拿到 payload 里的详情。

静态列表适合「这几个节点永远要审」；动态适合「视 state 内容决定要不要人看」。1.0 后 interrupt/Command 是一等公民，面试提到说明跟过新版本。
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="flow">← 🔀 LangGraph · 控制流</a>

<a class="chapter-nav-link chapter-nav-next" href="multi">👥 LangGraph · 多 Agent →</a>

</div>
