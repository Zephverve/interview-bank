/** LangGraph · 进阶扩展（覆盖 GitHub 100 题剩余考点） */
export default [
  {
    slug: '077-react-vs-plan-execute',
    title: 'ReAct 和 Plan-and-Execute 在 LangGraph 里怎么选？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '模式选型',
    priority: 'P1',
    freq: '2 篇',
    source: 'Agent 架构 15 问',
    conclusion: '步骤清晰可预知用 Plan-and-Execute；环境反馈不确定、需频繁调工具用 ReAct；可混合 planner+react 子图。',
    followups: '能画两种拓扑吗？',
    keyPoints: ['Plan 适合报告生成、流程固定', 'ReAct 适合探索、工具链不确定', '混合：plan 粗粒度 react 细执行'],
    oralAnswer: `选型看任务结构。步骤能预先列清单的——写研报、数据处理流水线——用 Plan-and-Execute，planner 节点出 steps，executor 逐步消费，失败 replanner 改计划。

环境反馈不确定、工具该调啥得边做边想——用 ReAct 环。实际常混合：plan 出粗粒度里程碑，每个 milestone 内嵌 ReAct 子图做细执行。

面试画两张拓扑图比背定义强。`,
  },
  {
    slug: '078-tool-validation',
    title: '如何实现工具参数校验（Tool Validation）？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '工具校验',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub 100 Questions',
    conclusion: '在 tool 节点前加 validate 节点用 Pydantic 校验 LLM 输出参数，不通过写 error 回 agent 重试。',
    followups: '和 JSON schema 关系？',
    keyPoints: ['独立 validate 节点', 'schema 与 tool 定义同源', '校验失败不进真实 tool'],
    oralAnswer: `LLM 产 tool_calls 后，不必直接执行。加 validate 节点用 Pydantic 或 jsonschema 校验参数类型范围，失败写 validation_error 进 state，条件边回 agent 让它重生成参数，通过才进真实 tool 节点。

schema 和 @tool 装饰器定义同源，避免两套。高危 tool 还可加 policy 节点检查权限。`,
  },
  {
    slug: '079-parallel-node-execution',
    title: '并行节点执行（Parallel Node Execution）怎么实现？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '并行执行',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub 100 Questions',
    conclusion: '同一 super-step 多个无依赖节点自动并行；或 Send API fan-out；结果靠 reducer 合并。',
    followups: '异步 ainvoke 注意什么？',
    keyPoints: ['add_edge 扇出到多节点', 'super-step 同步点', 'ainvoke 提升 IO 密集'],
    oralAnswer: `两种并行：静态——从同一前驱 add_edge 到多个后继，框架在同一 super-step 并行跑；动态——Send API 按运行时数据 fan-out。

并行后必须 reducer 合并写同一 channel 的结果。IO 密集节点用 async 定义，图用 ainvoke。注意并行不是无脑越多越好，LLM 并发受 rate limit 约束。`,
  },
  {
    slug: '080-async-nodes',
    title: '异步节点（Async Nodes）有什么要注意的？',
    round: '二面',
    difficulty: '⭐⭐',
    point: '异步',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub 100 Questions',
    conclusion: '节点定义 async def，图用 ainvoke/astream；避免在 async 节点里调阻塞 IO。',
    followups: '和线程池关系？',
    keyPoints: ['async 节点 + ainvoke 配对', '阻塞调用用 asyncio.to_thread', 'FastAPI 原生 async'],
    oralAnswer: `节点可以是 async def，compile 后图支持 ainvoke 和 astream，适合并发调多个 LLM 或 HTTP tool。别在 async 节点里直接 requests.get 阻塞，用 httpx async 或 asyncio.to_thread。

FastAPI 路由里 await graph.ainvoke 不堵 worker 线程。同步节点和异步节点可混用，框架会调度。`,
  },
  {
    slug: '081-rate-limiting',
    title: 'Agent 执行怎么做限流（Rate Limiting）？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '限流',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub 100 Questions',
    conclusion: '入口 API 限流 + 节点内 token bucket 调 LLM 前等待 + 工具 429 写 state 退避重试。',
    followups: '多租户公平调度？',
    keyPoints: ['网关层用户级限流', 'LLM 调用前 acquire', '指数退避写重试节点'],
    oralAnswer: `三层限流：API 网关按 user/tenant 限 QPS；图入口节点检查 quota_state，超限直接 fallback；LLM 节点内 token bucket，工具 429 捕获后写 retry_after 进 state，条件边到 backoff 节点 sleep 再重试。

多租户用 fair queue 或 tenant 级并发上限，避免一租户占满 worker。`,
  },
  {
    slug: '082-configurable-params',
    title: 'configurable 参数怎么传到节点？',
    round: '二面',
    difficulty: '⭐⭐',
    point: '配置',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub 100 Questions',
    conclusion: 'invoke 时 config.configurable 传 model_name、temperature 等，节点第二参数 config 读取，支持 A/B 和租户差异。',
    followups: '和 state 区别？',
    keyPoints: ['不进 checkpoint 的运行配置', '节点 (state, config) 签名', '适合模型路由和特性开关'],
    oralAnswer: `configurable 是运行时配置不存 state：invoke(..., config={"configurable": {"model": "gpt-4o", "tenant": "acme"}})。节点函数签名 (state, config)，里读 config["configurable"]["model"] 选 LLM。

适合 A/B 测试 prompt、按租户切模型，不进 checkpoint 避免污染历史。和 state 区别：state 是业务数据跨步持久化，config 是本次运行参数。`,
  },
  {
    slug: '083-external-db-state',
    title: 'LangGraph state 如何与外部数据库集成？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '外部集成',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub 100 Questions',
    conclusion: 'state 存 ID，节点内按需查库；或用 checkpointer 存图状态、业务库存单据，两边用业务键关联。',
    followups: '双写一致性？',
    keyPoints: ['引用不嵌套大对象', '副作用在 tool 节点事务提交', 'checkpoint 与业务库分离'],
    oralAnswer: `别把 DB 连接放 state。模式一：state 存 user_id、order_id，节点内查 PostgreSQL 取详情。模式二：图状态管编排进度，业务表管订单状态，用 order_id 关联。

副作用节点用 DB 事务，成功写 executed 标志进 state 再 commit。checkpoint 和业务库是两套存储，恢复时先查业务幂等再 resume 图。`,
  },
  {
    slug: '084-message-trimming',
    title: '对话历史在图里怎么做裁剪（Message Trimming）？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '消息裁剪',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub 100 Questions',
    conclusion: '专用 trim 节点在进 LLM 前按 token 预算保留 system+最近 k 轮+可选 summary。',
    followups: '和 checkpoint 冲突吗？',
    keyPoints: ['trim 作为独立节点', 'RemoveMessage 删旧消息', '摘要进 state.summary 字段'],
    oralAnswer: `在 agent 节点前加 trim 节点：估算 messages token，超预算则保留 system、最近 k 轮，旧的 summarize 到 state.summary 或用 RemoveMessage 删掉。

裁剪后 checkpoint 存的是裁剪后 state，有意控制体积。和压缩节点可串联：先 summarize 再 trim。`,
  },
  {
    slug: '085-agent-evaluation',
    title: 'LangGraph Agent 怎么做评测（Evaluation）？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '评测',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub 100 Questions',
    conclusion: 'LangSmith dataset 跑批量 invoke，断言最终答案和中间轨迹（经过哪些节点）；节点级指标单独评。',
    followups: '非确定性怎么评？',
    keyPoints: ['端到端+轨迹断言', '节点级黄金输入输出', '回归 CI 夜间跑'],
    oralAnswer: `评测分两级。端到端：黄金问题集 batch invoke，比最终答案和 citation 格式；高级断言期望轨迹包含 grade→rewrite 等节点序列。节点级：单独测 intent 分类准确率、retrieve recall。

LangSmith experiment 记录每版图变化。非确定性用 LLM-as-judge 或结构匹配。和百度面经评测闭环结合答更完整。`,
  },
  {
    slug: '086-multi-tenant',
    title: '多租户 Agent 怎么设计？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '多租户',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub 100 Questions',
    conclusion: 'thread_id 含 tenant_id；checkpointer 表分区；configurable 注入租户配置和工具权限。',
    followups: '数据隔离怎么做？',
    keyPoints: ['命名空间隔离 checkpoint', '租户级 rate limit 和模型', '向量库 metadata filter'],
    oralAnswer: `thread_id 设计为 tenant/user/task 组合，checkpointer 按 tenant 分区存储。configurable 传 tenant_config：可用工具列表、模型、prompt 变体。

检索节点加 metadata filter tenant_id。防止 tenant A 的 thread 加载 tenant B 数据靠网关层校验 config。`,
  },
  {
    slug: '087-agent-security',
    title: 'LangGraph Agent 安全怎么保障？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '安全',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub 100 Questions',
    conclusion: '输入 Guardrails 节点、工具权限白名单、HITL 高危操作、输出过滤、secret 不进 state。',
    followups: '提示注入怎么防？',
    keyPoints: ['入口 sanitize 节点', 'tool 按角色授权', 'interrupt 敏感写操作'],
    oralAnswer: `安全分层：输入节点检测注入和 PII；工具层白名单+参数校验；高危写操作 interrupt 审批；输出节点内容策略过滤；API key 走 config/secrets 不进 checkpoint。

提示注入靠 system 边界+检索内容隔离+不要 tool 结果直接当 system。和百度 Guardrails 输入输出可一起讲。`,
  },
  {
    slug: '088-event-driven',
    title: '事件驱动 Agent（Event-Driven）怎么用 LangGraph？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '事件驱动',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub 100 Questions',
    conclusion: '外部事件触发 invoke 带初始 state；图固定 enrich→decide→act→persist；每事件新 thread 或续 thread。',
    followups: '和 cron 结合？',
    keyPoints: ['消息队列消费触发', '图一次编译反复 invoke', '事件 id 作幂等键'],
    oralAnswer: `事件驱动场景：Kafka 消息到达，worker invoke 图，初始 state 含 event_payload，固定拓扑 enrich→decide→act→emit。每事件 event_id 作 thread 或幂等键，防重复消费。

和 cron 结合：定时器触发 batch 子图处理积压。图编译一次，每事件一次 invoke，state 隔离。`,
  },
  {
    slug: '089-visualize-debug',
    title: '怎么可视化和调试 LangGraph？',
    round: '一面',
    difficulty: '⭐⭐',
    point: '可视化',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub 100 Questions',
    conclusion: 'app.get_graph().draw_mermaid_png() 导出图；stream values 模式看 state；LangSmith 看轨迹。',
    followups: '给面试官画过图吗？',
    keyPoints: ['Mermaid/PNG 导出', 'stream_mode=values', '断点单步 invoke'],
    oralAnswer: `可视化用 compiled graph 的 get_graph().draw_mermaid_png() 或 print_ascii 面试白板画拓扑。调试用 stream_mode="values" 看每步 state，或 LangSmith trace。

单节点调试 mock state 直接调节点函数，不必跑全图。面试带一张自己项目的 Mermaid 图很加分。`,
  },
  {
    slug: '090-graceful-degradation',
    title: 'Graceful Degradation 优雅降级怎么实现？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '降级',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub 100 Questions',
    conclusion: '主路径失败条件边走备用模型/简化检索/模板回答，保证用户总有结构化响应。',
    followups: '和 fallback 区别？',
    keyPoints: ['多级降级链', 'LLM 失败换小模型', '检索失败换关键词搜索'],
    oralAnswer: `降级是分级：首选 GPT-4o+向量检索；超时走 GPT-4o-mini+缓存；再失败走模板回复+人工入口。条件边实现多级路由，每级是不同节点链。

fallback 是终极出口；degradation 是沿途有备用方案。state 记 degradation_level 供监控统计各级占比。`,
  },
  {
    slug: '091-memory-compression',
    title: '上下文感知记忆压缩（Context-Aware Memory Compression）？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '记忆压缩',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub 100 Questions',
    conclusion: '按当前任务意图选择性保留相关历史，无关轮次压缩进 summary 或归档外置记忆。',
    followups: '和字节动态长期记忆？',
    keyPoints: ['intent 变化触发重摘要', '相关轮次保留', '外置 mem0/向量存长期'],
    oralAnswer: `不是无脑砍旧消息，而是根据当前 intent 选保留哪些轮次——聊订单就保留订单相关轮，闲聊轮压缩。compress 节点读 current_intent，挑相关 messages 留，其余 summarize。

长期记忆外置 mem0/Postgres，retrieve 节点按意图回填。字节面经长期记忆召回可接这个答法。`,
  },
  {
    slug: '092-timeout-handling',
    title: '超时处理（Timeout Handling）怎么做？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '超时',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub 100 Questions',
    conclusion: 'asyncio.wait_for 包节点调用；超时写 state 走 fallback；端到端 SLA 在 API 层 cancel task。',
    followups: 'cancel 后 checkpoint 状态？',
    keyPoints: ['节点级超时', '图级 SLA watchdog', '超时后 checkpoint 可恢复'],
    oralAnswer: `节点内 asyncio.wait_for(llm.ainvoke(...), timeout=30)，超时捕获写 timeout_error 进 state，条件边 fallback。图级 API 设总 SLA，超时 cancel asyncio task，checkpoint 留最后完成步可续。

告诉用户「处理超时，可继续等待或简化问题」比 504 裸错误好。`,
  },
  {
    slug: '093-version-graph',
    title: '图版本管理与回滚怎么做？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '版本管理',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub 100 Questions',
    conclusion: 'graph_version 绑编译实例；新 thread 用新版；旧 thread 用旧版 finish；shadow mode 对比新旧轨迹。',
    followups: 'schema 版本一起管吗？',
    keyPoints: ['多实例共存', '路由层选版本', '回滚=切流量+停新 thread'],
    oralAnswer: `部署多 graph 实例 v1 v2，config 或 header 带 graph_version 路由。新会话用 v2，进行中的 v1 thread 用 v1 实例 finish，避免 mid-flight 迁移。

Shadow mode：同输入跑 v2 不返回用户，对比 trace 和答案。回滚是流量切回 v1+停开 v2 thread。schema 版本跟 graph 版本一起走。`,
  },
  {
    slug: '094-cost-aware-routing',
    title: '成本感知路由（Cost-Aware Routing）怎么实现？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '成本',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub 100 Questions',
    conclusion: 'router 节点根据任务复杂度选模型：简单走 mini，复杂走 4o；state 累计 token 超预算降级。',
    followups: '字节问百万 token 成本怎么答？',
    keyPoints: ['intent+长度估计复杂度', 'configurable 模型名', 'token_budget 写 state'],
    oralAnswer: `入口 router 判断简单问答/复杂推理，条件边到不同 LLM 节点绑不同 model。state 维护 token_spent，超 budget 后续节点强制 mini 或模板。

字节面经成本题：估 thousand-line code token 数×单价，说优化方向是压缩、缓存、小模型路由。成本感知是 router 节点的业务规则。`,
  },
  {
    slug: '095-build-minimal-agent',
    title: '面试常考：手写最小可用 LangGraph 聊天 Agent',
    round: '一面',
    difficulty: '⭐⭐⭐',
    point: '手写代码',
    priority: 'P0',
    freq: '3+ 篇',
    source: 'ModelEngine + GitHub',
    conclusion: 'MessagesState + llm_node + START→LLM→END；messages 用 add_messages；返回 dict 自动合并。',
    followups: '加 tool 怎么改？ · 加 memory 怎么改？',
    keyPoints: ['10 行核心骨架', '加 tool 变 ReAct 环', '加 MemorySaver 即多轮'],
    oralAnswer: `白板题骨架：TypedDict messages Annotated[list, add_messages]；llm_node 调 llm.invoke(state["messages"]) 返回 {"messages": [response]}；StateGraph add_node set_entry_point add_edge END compile。

加 tool：加 tool_node 和 should_continue 条件边，tool→llm 回边。加 memory：compile(checkpointer=MemorySaver())，invoke 传 thread_id。

ModelEngine 社区说要点全中：reducer、START/END、返回 dict 合并。面试能脱稿写加分。`,
  },
  {
    slug: '096-blackbox-vs-whitebox',
    title: 'LangGraph 和早期 LangChain Agent 黑盒白盒区别？',
    round: '一面',
    difficulty: '⭐⭐⭐',
    point: '范式对比',
    priority: 'P1',
    freq: '2 篇',
    source: 'Agent 架构 15 问',
    conclusion: '早期 Agent 是黑盒自主循环；LangGraph 是白盒显式图，每步可测可审计，工程可控性根本提升。',
    followups: '白盒代价是什么？',
    keyPoints: ['黑盒：工具+目标全自动', '白盒：节点边显式', '可控性换设计成本'],
    oralAnswer: `早期 LangChain Agent 给工具和目标，内部怎么一步步走你看不清，难 debug 难审计。LangGraph 白盒：每个节点做什么、每条边什么条件，全显式，trace 逐步对齐图结构。

代价是设计成本——你得自己画流程，不能全扔给 LLM 自主。生产环境要审计、合规、排障，白盒是必须的，这就是 LangGraph 取代黑盒 Agent 的原因。`,
  },
  {
    slug: '097-framework-selection-tree',
    title: 'LangGraph / LangChain / LlamaIndex / CrewAI 选型决策树？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '框架决策树',
    priority: 'P1',
    freq: '2 篇',
    source: 'Agent 架构 15 问',
    conclusion: 'LlamaIndex 偏数据索引；LangChain 偏组件链；CrewAI 快速多角色；LangGraph 复杂可控流程；可组合使用。',
    followups: '能说出 trade-off 吗？',
    keyPoints: ['数据-heavy 先 LlamaIndex', '原型 CrewAI', '生产复杂 Agent LangGraph'],
    oralAnswer: `决策树：主要是 RAG 数据接入和索引——LlamaIndex；简单线性 LLM 链——LangChain LCEL；快速多角色原型——CrewAI；要循环、checkpoint、HITL、细控制流——LangGraph。

Trade-off：CrewAI 快但控不住；LangGraph 稳但重；LlamaIndex 检索强但不包全流程。实际项目常 LlamaIndex 检索 + LangGraph 编排。面试说 trade-off 比背名字强。`,
  },
  {
    slug: '098-llm-mode-binding',
    title: 'LangGraph 能否实现确定性 Workflow 而非 Agent？',
    round: '一面',
    difficulty: '⭐⭐',
    point: 'Workflow 模式',
    priority: 'P1',
    freq: '2 篇',
    source: 'Agent 架构 15 问',
    conclusion: '可以，全部用普通边固定路由、条件边用规则函数不调 LLM，就是确定性 Workflow，仍享受 checkpoint 能力。',
    followups: '和 Airflow 区别？',
    keyPoints: ['固定边=工作流', '条件边可纯规则', 'checkpoint 是优势'],
    oralAnswer: `可以。全部 add_edge 固定跳转，条件边路由函数读 state 标量做 if-else 不调 LLM，就是确定性 Workflow，仍有 checkpoint、stream、HITL。

和 Airflow 比：LangGraph 更轻、和 LLM 节点混排自然，适合 AI 流水线；重 ETL 还是 Airflow。很多团队用 LangGraph 管「含 LLM 步骤」的工作流，纯数据用传统调度。`,
  },
  {
    slug: '099-state-persistence-strategies',
    title: 'State 持久化策略有哪些？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '持久化策略',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub Premium Questions',
    conclusion: 'Memory 开发；SQLite 单机；Postgres 生产；Redis 高速；按 checkpoint 频率和查询需求选。',
    followups: '自定义 Redis checkpointer 要点？',
    keyPoints: ['checkpointer 可插拔', 'Postgres 支持查询 thread 列表', 'TTL 策略各后端不同'],
    oralAnswer: `持久化策略分层：开发 MemorySaver 零配置；单机演示 SQLiteSaver；生产 PostgresSaver 支持并发和查询；要极速 Redis，注意序列化大小。

选型看 checkpoint 频率、保留多久、要不要 SQL 查询 thread 状态。v4 checkpointer keep_latest TTL 自动裁剪旧快照，生产要配。`,
  },
  {
    slug: '100-production-checklist',
    title: 'LangGraph 生产上线 Checklist 有哪些？',
    round: '二面',
    difficulty: '⭐⭐⭐⭐',
    point: '上线清单',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub Production Guide + 面经汇总',
    conclusion: '编译单例、PG checkpoint、幂等、HITL、限流、监控、评测集、降级、schema 版本、secrets 管理、文档化 state 约定。',
    followups: '上线前最后一项检查什么？',
    keyPoints: ['12 项 checklist', '先跑 shadow traffic', 'state 约定写进 wiki'],
    oralAnswer: `上线 checklist 我背十二项：图全局 compile；Postgres checkpointer；thread 租户隔离；tool 幂等；高危 interrupt；recursion+fallback；节点 trace；黄金集回归；输入输出 Guardrails；API 限流；降级链；graph/schema 版本。

上线前最后一项：用生产流量 shadow 跑 v2 对比 trace，看节点失败率和 token。state reducer 约定写进 wiki，oncall 能看懂。

这道题把分散工程点串起来，二面收尾常考。`,
  },
]
