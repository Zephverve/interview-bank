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

**📖 核心要点**
- Plan 适合报告生成、流程固定
- ReAct 适合探索、工具链不确定
- 混合：plan 粗粒度 react 细执行

**🗣️ 标准口语答案**

选型看任务结构。步骤能预先列清单的——写研报、数据处理流水线——用 Plan-and-Execute，planner 节点出 steps，executor 逐步消费，失败 replanner 改计划。

环境反馈不确定、工具该调啥得边做边想——用 ReAct 环。实际常混合：plan 出粗粒度里程碑，每个 milestone 内嵌 ReAct 子图做细执行。

面试画两张拓扑图比背定义强。
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

**📖 核心要点**
- 独立 validate 节点
- schema 与 tool 定义同源
- 校验失败不进真实 tool

**🗣️ 标准口语答案**

LLM 产 tool_calls 后，不必直接执行。加 validate 节点用 Pydantic 或 jsonschema 校验参数类型范围，失败写 validation_error 进 state，条件边回 agent 让它重生成参数，通过才进真实 tool 节点。

schema 和 @tool 装饰器定义同源，避免两套。高危 tool 还可加 policy 节点检查权限。
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

**📖 核心要点**
- add_edge 扇出到多节点
- super-step 同步点
- ainvoke 提升 IO 密集

**🗣️ 标准口语答案**

两种并行：静态——从同一前驱 add_edge 到多个后继，框架在同一 super-step 并行跑；动态——Send API 按运行时数据 fan-out。

并行后必须 reducer 合并写同一 channel 的结果。IO 密集节点用 async 定义，图用 ainvoke。注意并行不是无脑越多越好，LLM 并发受 rate limit 约束。
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

**📖 核心要点**
- async 节点 + ainvoke 配对
- 阻塞调用用 asyncio.to_thread
- FastAPI 原生 async

**🗣️ 标准口语答案**

节点可以是 async def，compile 后图支持 ainvoke 和 astream，适合并发调多个 LLM 或 HTTP tool。别在 async 节点里直接 requests.get 阻塞，用 httpx async 或 asyncio.to_thread。

FastAPI 路由里 await graph.ainvoke 不堵 worker 线程。同步节点和异步节点可混用，框架会调度。
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

**📖 核心要点**
- 网关层用户级限流
- LLM 调用前 acquire
- 指数退避写重试节点

**🗣️ 标准口语答案**

三层限流：API 网关按 user/tenant 限 QPS；图入口节点检查 quota_state，超限直接 fallback；LLM 节点内 token bucket，工具 429 捕获后写 retry_after 进 state，条件边到 backoff 节点 sleep 再重试。

多租户用 fair queue 或 tenant 级并发上限，避免一租户占满 worker。
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

**📖 核心要点**
- 不进 checkpoint 的运行配置
- 节点 (state, config) 签名
- 适合模型路由和特性开关

**🗣️ 标准口语答案**

configurable 是运行时配置不存 state：invoke(..., config={"configurable": {"model": "gpt-4o", "tenant": "acme"}})。节点函数签名 (state, config)，里读 config["configurable"]["model"] 选 LLM。

适合 A/B 测试 prompt、按租户切模型，不进 checkpoint 避免污染历史。和 state 区别：state 是业务数据跨步持久化，config 是本次运行参数。
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

**📖 核心要点**
- 引用不嵌套大对象
- 副作用在 tool 节点事务提交
- checkpoint 与业务库分离

**🗣️ 标准口语答案**

别把 DB 连接放 state。模式一：state 存 user_id、order_id，节点内查 PostgreSQL 取详情。模式二：图状态管编排进度，业务表管订单状态，用 order_id 关联。

副作用节点用 DB 事务，成功写 executed 标志进 state 再 commit。checkpoint 和业务库是两套存储，恢复时先查业务幂等再 resume 图。
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

**📖 核心要点**
- trim 作为独立节点
- RemoveMessage 删旧消息
- 摘要进 state.summary 字段

**🗣️ 标准口语答案**

在 agent 节点前加 trim 节点：估算 messages token，超预算则保留 system、最近 k 轮，旧的 summarize 到 state.summary 或用 RemoveMessage 删掉。

裁剪后 checkpoint 存的是裁剪后 state，有意控制体积。和压缩节点可串联：先 summarize 再 trim。
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

**📖 核心要点**
- 端到端+轨迹断言
- 节点级黄金输入输出
- 回归 CI 夜间跑

**🗣️ 标准口语答案**

评测分两级。端到端：黄金问题集 batch invoke，比最终答案和 citation 格式；高级断言期望轨迹包含 grade→rewrite 等节点序列。节点级：单独测 intent 分类准确率、retrieve recall。

LangSmith experiment 记录每版图变化。非确定性用 LLM-as-judge 或结构匹配。和百度面经评测闭环结合答更完整。
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

**📖 核心要点**
- 命名空间隔离 checkpoint
- 租户级 rate limit 和模型
- 向量库 metadata filter

**🗣️ 标准口语答案**

thread_id 设计为 tenant/user/task 组合，checkpointer 按 tenant 分区存储。configurable 传 tenant_config：可用工具列表、模型、prompt 变体。

检索节点加 metadata filter tenant_id。防止 tenant A 的 thread 加载 tenant B 数据靠网关层校验 config。
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

**📖 核心要点**
- 入口 sanitize 节点
- tool 按角色授权
- interrupt 敏感写操作

**🗣️ 标准口语答案**

安全分层：输入节点检测注入和 PII；工具层白名单+参数校验；高危写操作 interrupt 审批；输出节点内容策略过滤；API key 走 config/secrets 不进 checkpoint。

提示注入靠 system 边界+检索内容隔离+不要 tool 结果直接当 system。和百度 Guardrails 输入输出可一起讲。
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

**📖 核心要点**
- 消息队列消费触发
- 图一次编译反复 invoke
- 事件 id 作幂等键

**🗣️ 标准口语答案**

事件驱动场景：Kafka 消息到达，worker invoke 图，初始 state 含 event_payload，固定拓扑 enrich→decide→act→emit。每事件 event_id 作 thread 或幂等键，防重复消费。

和 cron 结合：定时器触发 batch 子图处理积压。图编译一次，每事件一次 invoke，state 隔离。
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

**📖 核心要点**
- Mermaid/PNG 导出
- stream_mode=values
- 断点单步 invoke

**🗣️ 标准口语答案**

可视化用 compiled graph 的 get_graph().draw_mermaid_png() 或 print_ascii 面试白板画拓扑。调试用 stream_mode="values" 看每步 state，或 LangSmith trace。

单节点调试 mock state 直接调节点函数，不必跑全图。面试带一张自己项目的 Mermaid 图很加分。
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

**📖 核心要点**
- 多级降级链
- LLM 失败换小模型
- 检索失败换关键词搜索

**🗣️ 标准口语答案**

降级是分级：首选 GPT-4o+向量检索；超时走 GPT-4o-mini+缓存；再失败走模板回复+人工入口。条件边实现多级路由，每级是不同节点链。

fallback 是终极出口；degradation 是沿途有备用方案。state 记 degradation_level 供监控统计各级占比。
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

**📖 核心要点**
- intent 变化触发重摘要
- 相关轮次保留
- 外置 mem0/向量存长期

**🗣️ 标准口语答案**

不是无脑砍旧消息，而是根据当前 intent 选保留哪些轮次——聊订单就保留订单相关轮，闲聊轮压缩。compress 节点读 current_intent，挑相关 messages 留，其余 summarize。

长期记忆外置 mem0/Postgres，retrieve 节点按意图回填。字节面经长期记忆召回可接这个答法。
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

**📖 核心要点**
- 节点级超时
- 图级 SLA watchdog
- 超时后 checkpoint 可恢复

**🗣️ 标准口语答案**

节点内 asyncio.wait_for(llm.ainvoke(...), timeout=30)，超时捕获写 timeout_error 进 state，条件边 fallback。图级 API 设总 SLA，超时 cancel asyncio task，checkpoint 留最后完成步可续。

告诉用户「处理超时，可继续等待或简化问题」比 504 裸错误好。
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

**📖 核心要点**
- 多实例共存
- 路由层选版本
- 回滚=切流量+停新 thread

**🗣️ 标准口语答案**

部署多 graph 实例 v1 v2，config 或 header 带 graph_version 路由。新会话用 v2，进行中的 v1 thread 用 v1 实例 finish，避免 mid-flight 迁移。

Shadow mode：同输入跑 v2 不返回用户，对比 trace 和答案。回滚是流量切回 v1+停开 v2 thread。schema 版本跟 graph 版本一起走。
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

**📖 核心要点**
- intent+长度估计复杂度
- configurable 模型名
- token_budget 写 state

**🗣️ 标准口语答案**

入口 router 判断简单问答/复杂推理，条件边到不同 LLM 节点绑不同 model。state 维护 token_spent，超 budget 后续节点强制 mini 或模板。

字节面经成本题：估 thousand-line code token 数×单价，说优化方向是压缩、缓存、小模型路由。成本感知是 router 节点的业务规则。
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

**📖 核心要点**
- 10 行核心骨架
- 加 tool 变 ReAct 环
- 加 MemorySaver 即多轮

**🗣️ 标准口语答案**

白板题骨架：TypedDict messages Annotated[list, add_messages]；llm_node 调 llm.invoke(state["messages"]) 返回 {"messages": [response]}；StateGraph add_node set_entry_point add_edge END compile。

加 tool：加 tool_node 和 should_continue 条件边，tool→llm 回边。加 memory：compile(checkpointer=MemorySaver())，invoke 传 thread_id。

ModelEngine 社区说要点全中：reducer、START/END、返回 dict 合并。面试能脱稿写加分。
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

**📖 核心要点**
- 黑盒：工具+目标全自动
- 白盒：节点边显式
- 可控性换设计成本

**🗣️ 标准口语答案**

早期 LangChain Agent 给工具和目标，内部怎么一步步走你看不清，难 debug 难审计。LangGraph 白盒：每个节点做什么、每条边什么条件，全显式，trace 逐步对齐图结构。

代价是设计成本——你得自己画流程，不能全扔给 LLM 自主。生产环境要审计、合规、排障，白盒是必须的，这就是 LangGraph 取代黑盒 Agent 的原因。
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

**📖 核心要点**
- 数据-heavy 先 LlamaIndex
- 原型 CrewAI
- 生产复杂 Agent LangGraph

**🗣️ 标准口语答案**

决策树：主要是 RAG 数据接入和索引——LlamaIndex；简单线性 LLM 链——LangChain LCEL；快速多角色原型——CrewAI；要循环、checkpoint、HITL、细控制流——LangGraph。

Trade-off：CrewAI 快但控不住；LangGraph 稳但重；LlamaIndex 检索强但不包全流程。实际项目常 LlamaIndex 检索 + LangGraph 编排。面试说 trade-off 比背名字强。
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

**📖 核心要点**
- 固定边=工作流
- 条件边可纯规则
- checkpoint 是优势

**🗣️ 标准口语答案**

可以。全部 add_edge 固定跳转，条件边路由函数读 state 标量做 if-else 不调 LLM，就是确定性 Workflow，仍有 checkpoint、stream、HITL。

和 Airflow 比：LangGraph 更轻、和 LLM 节点混排自然，适合 AI 流水线；重 ETL 还是 Airflow。很多团队用 LangGraph 管「含 LLM 步骤」的工作流，纯数据用传统调度。
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

**📖 核心要点**
- checkpointer 可插拔
- Postgres 支持查询 thread 列表
- TTL 策略各后端不同

**🗣️ 标准口语答案**

持久化策略分层：开发 MemorySaver 零配置；单机演示 SQLiteSaver；生产 PostgresSaver 支持并发和查询；要极速 Redis，注意序列化大小。

选型看 checkpoint 频率、保留多久、要不要 SQL 查询 thread 状态。v4 checkpointer keep_latest TTL 自动裁剪旧快照，生产要配。
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

**📖 核心要点**
- 12 项 checklist
- 先跑 shadow traffic
- state 约定写进 wiki

**🗣️ 标准口语答案**

上线 checklist 我背十二项：图全局 compile；Postgres checkpointer；thread 租户隔离；tool 幂等；高危 interrupt；recursion+fallback；节点 trace；黄金集回归；输入输出 Guardrails；API 限流；降级链；graph/schema 版本。

上线前最后一项：用生产流量 shadow 跑 v2 对比 trace，看节点失败率和 token。state reducer 约定写进 wiki，oncall 能看懂。

这道题把分散工程点串起来，二面收尾常考。
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="real">← 📋 LangGraph · 真实面经</a>

</div>
