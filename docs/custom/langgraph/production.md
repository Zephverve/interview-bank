---
custom: true
partTitle: LangGraph 面经题库 · LangGraph · 工程实践
partColor: #6366f1
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #6366f1">

# 🚀 LangGraph · 工程实践

<p class="part-desc">LangGraph 面经题库 · 第 6/8 章 · 12 题</p>
<span class="part-round custom-tag">面试问答</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="multi">← 👥 LangGraph · 多 Agent</a>

<a class="chapter-nav-link chapter-nav-next" href="real">📋 LangGraph · 真实面经 →</a>

</div>

<div class="question-card ai100-card interview-card compact-card" id="053-pitfalls">

<h2 class="question-title"><span class="q-badge ai100-badge">Q53</span><span class="question-text">LangGraph 踩过什么坑？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LangGraph, 工程 · 考察点：踩坑</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：高频坑：并发覆盖 state、没配 reducer、死循环、每请求 compile、checkpoint 膨胀、条件路由不稳定。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：怎么监控发现？ · 哪个坑印象最深？</div>
</div>

**优先级**：P0 · 4+ 篇面经

**🗣️ 标准口语答案**

我踩过最疼的一个坑是状态管理。LangGraph 里每个节点都能读写共享 state，但有些节点是并发执行的。有一次两个节点同时修改 state 里同一个字段，后执行的直接把先执行的覆盖了，完全没有警告。后来我们给列表类字段配了 Annotated reducer，比如 messages 用 add_messages，从「覆盖写」改成「合并写」。

第二个坑是死循环。ReAct Agent 如果工具一直返回空结果，模型可能无限重试。我们加了 recursion_limit 和自定义的 should_continue 条件，超过 N 轮就路由到 fallback 节点。

第三个坑是生产环境重复编译图。compile 应该在应用启动时做一次，全局单例复用，而不是每个请求都 compile，否则延迟会很高。

第四个坑和 checkpoint 有关：一开始什么都往 state 里塞，导致 checkpoint 体积膨胀、恢复变慢。后来我们把跨会话的历史和知识库检索结果外置，图里只留当前任务推进必需的状态。【替换点：换成你真实踩过的坑】
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="054-node-quality">

<h2 class="question-title"><span class="q-badge ai100-badge">Q54</span><span class="question-text">如何保证某个节点的效果？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LangGraph, 工程 · 考察点：节点质量</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：节点输入输出契约 + 单元测试 + 离线评测集 + 线上节点级成功率/延迟监控 + bad case 回流。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：节点效果不好怎么排查？ · prompt 怎么迭代？</div>
</div>

**优先级**：P0 · 3+ 篇面经

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

阿里淘天一面原题，考察的是「节点级质量保障体系」而非「调 prompt 碰运气」。我习惯四件事闭环：

第一，定义清晰 IO 契约。每个节点文档化：读哪些 state 字段、写哪些 partial update、字段更新策略（append/覆盖/merge）。intent_node 读 query 写 intent；retrieve_node 读 intent 写 retrieval_docs。契约写在代码注释或 README，团队共识「这个节点负责什么、不负责什么」。

第二，mock state 单测节点函数。节点函数是纯函数（输入 state 返回 partial update），不依赖整图 compile 和 LLM 真实调用。传 mock state 断言返回的 update 结构和字段值。intent_node 测「给定 query X，intent 应为 vector_rag」。这步成本最低、收益最高。

第三，离线评测集。为该节点建黄金集——intent 节点 100 条标注 query→intent 映射，retrieve 节点测 Recall@k。定期跑回归，prompt 改动前后对比指标。比端到端测更精准定位问题节点。

第四，线上节点级监控。LangSmith 或自研按 node_name 聚合：成功率、P99 耗时、token 消耗、错误类型分布。bad case 自动入库回流评测集。

效果不好排查顺序：输入 state 是否被上游污染 → prompt 是否漂移（版本对比）→ reducer 合并是否丢数据 → 下游是否误读该节点输出。prompt 迭代必须版本化，A/B 对比节点输出指标再全量发布。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="055-node-monitoring">

<h2 class="question-title"><span class="q-badge ai100-badge">Q55</span><span class="question-text">节点级监控怎么做？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 工程 · 考察点：监控</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：trace_id 贯穿、每节点记录耗时/输入输出摘要/错误类型，LangSmith 或自研看板按 node 聚合。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和整体 Agent 监控区别？ · 告警阈值怎么定？</div>
</div>

**优先级**：P0 · 2+ 篇面经

**🗣️ 标准口语答案**

上线 Agent 图时，我会把可观测性和失败路径放在和主流程同一优先级。

阿里淘天面经原题「如何做监控」，以及百度面经强调的评测闭环，都指向节点级可观测性。实现分三层：

trace 贯穿：每次 invoke 生成 trace_id 写入 config.configurable，所有节点和 LLM/tool 调用共享同一 trace_id。用户投诉或告警触发时，用 trace_id 拉完整执行轨迹。

节点 span 记录：每个节点入口/出口打 span（LangSmith 自动记录，或 OpenTelemetry 自研），属性包含：node_name、duration_ms、state 关键字段摘要（如 intent 值、retrieval_docs 数量，不是全量 state）、是否异常、attempt 次数（重试场景）、token 消耗。LangSmith 按图结构自动展示节点拓扑和耗时瀑布图；自研方案导出 Prometheus 指标，Grafana 按 node 聚合。

和整体 Agent 监控的核心区别：端到端只知道「回答超时 30s」，节点级能定位「retrieve_node P99 25s、generate_node P99 3s」——问题在检索不在生成。这是生产排障的关键能力。

告警阈值：单节点失败率环比突增（如今日 5% vs 昨日 1%）；P99 延迟超 SLA；token 消耗突增（可能 prompt 膨胀或死循环）；attempt 次数异常（重试风暴）。告警触发后自动采样 bad case 入库离线评测集，形成监控→评测→改进闭环。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="056-testing-agents">

<h2 class="question-title"><span class="q-badge ai100-badge">Q56</span><span class="question-text">怎么测试 LangGraph Agent？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 工程 · 考察点：测试</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：三层：节点单测 mock state；子图集成测；端到端黄金集 + mock LLM/tool 固定输出。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：怎么 mock 非确定性 LLM？ · CI 怎么跑？</div>
</div>

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

上线 Agent 图时，我会把可观测性和失败路径放在和主流程同一优先级。

LangGraph Agent 测试的核心优势是「图结构可分层测」——不必每次改 prompt 都跑完整 E2E。我习惯三层策略：

单元测试（节点级）：每个 node 函数是纯函数，传 mock state 断言返回的 partial update。不依赖 compile、不调用真实 LLM。intent_node 测分类准确性；should_continue 条件函数测路由逻辑。成本最低，CI 每次 commit 都跑。

集成测试（图级）：compile 图，但 mock LLM 和 tools 返回固定响应。测条件边走向是否符合预期——「mock LLM 返回 tool_call → 应路由到 tool_node → 再回 agent_node」。snapshot 对比 state 演化轨迹。CI 每次 commit 跑，成本可控。

E2E 测试（端到端）：黄金问题集（50-100 条），用 recorded LLM responses（录播模式）或 contract test（只断言输出结构、不断言原文）。对比 state 轨迹 snapshot 或最终 answer 质量指标。夜间 CI 跑，成本较高。

mock 非确定性 LLM 的两种策略：recorded responses——首次运行录下 LLM 输出，后续 replay；contract test——断言「回答包含引用来源」「intent 字段存在」等结构约束，不断言具体措辞。CI 策略：单元+集成每次 PR 跑，E2E 夜间或 pre-release 跑。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="057-deployment">

<h2 class="question-title"><span class="q-badge ai100-badge">Q57</span><span class="question-text">LangGraph 生产环境怎么部署？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 工程 · 考察点：部署</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：FastAPI 暴露 invoke/stream；图全局 compile 单例；Postgres checkpointer；worker 队列处理长任务。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：LangGraph Platform 了解吗？ · 多副本 state 怎么存？</div>
</div>

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

上线 Agent 图时，我会把可观测性和失败路径放在和主流程同一优先级。

LangGraph 生产部署的核心架构是「无状态 API + 有状态 checkpointer」，实现水平扩展。

应用层：FastAPI/Flask 暴露 REST 或 WebSocket 接口。应用启动时（lifespan/startup 事件）compile 图存 app.state.graph 全局单例，请求路径只 invoke/astream，绝不 compile。POST /chat 接收 user_message + thread_id，调用 app.astream(input, config) 流式返回；config 带 thread_id 实现会话隔离。

checkpointer 层：开发用 MemorySaver，生产用 PostgresSaver（或 Redis）。多个 API 副本共享同一个 Postgres checkpointer 实例——任何副本都能加载任意 thread_id 的历史 checkpoint，实现无会话粘滞的负载均衡。thread_id 由客户端或 API 层生成，与业务主键分离。

长任务处理：超过 30s 的 Agent 任务不应阻塞 HTTP 连接。模式：API 接收请求后立即返回 task_id，任务丢 Celery/RQ worker 异步执行，结果写 checkpointer；客户端轮询或 WebSocket 推送进度。worker 同样共享 Postgres checkpointer。

其他生产要点：secrets（API key）走环境变量，不进 state（checkpoint 会序列化 state）；stream 用 SSE 或 WebSocket；Guardrails 输入输出安全在部署层（API gateway）和图内节点双层配合；可选 LangGraph Platform 托管，自研方案是 Docker + K8s + 共享 PG + LangSmith trace。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="058-no-recompile-per-request">

<h2 class="question-title"><span class="q-badge ai100-badge">Q58</span><span class="question-text">为什么生产环境不能每个请求都 compile 图？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐ · 标签：LangGraph, 工程 · 考察点：性能</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：compile 有结构检查和对象构建开销，应应用启动时一次，请求只 invoke 已编译实例。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：热更新图怎么做？ · 多版本图共存？</div>
</div>

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

上线 Agent 图时，我会把可观测性和失败路径放在和主流程同一优先级。

这是 CSDN 工程实践类面经的常考题，考察对 LangGraph 生命周期的理解。compile() 不是轻量操作——它做这些事：图结构验证（孤立节点检查、边完整性）；绑定 checkpointer 和 interrupt 配置；构建内部执行计划和节点调度表；创建 CompiledGraph 对象。整体开销从毫秒到秒级，取决于图复杂度。

每请求 compile 的问题：QPS 100 时每秒 compile 100 次，CPU 大量浪费在重复的结构检查上；P99 延迟抖动——compile 时间不稳定；无法享受编译后的内部优化缓存。在 serverless（Lambda/Cloud Functions）冷启动场景下尤其致命——compile 可能占冷启动时间的大头。

正确做法：应用 lifespan/startup 事件里 compile 一次，存 app.state.graph 或模块级全局变量。请求路由里直接 app.state.graph.ainvoke(input, config)，零 compile 开销。FastAPI 用 @asynccontextmanager lifespan；Flask 用 before_first_request（已废弃）或应用工厂模式。

热更新和多版本：加载 graph_v2 实例与 v1 并存，按 request header、tenant_id 或 thread 创建时间路由到对应版本。旧 thread 用旧图 finish，新 thread 用新图。灰度期间新旧并行，全量切换后下线旧实例。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="059-graph-migration">

<h2 class="question-title"><span class="q-badge ai100-badge">Q59</span><span class="question-text">图定义变更后旧 thread 怎么办？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 工程 · 考察点：迁移</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：state schema 向后兼容；新字段默认值；删字段写迁移；灰度期间按 thread 版本路由到对应图。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：会不会毒化既有 thread？ · 官方迁移指引？</div>
</div>

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

LangGraph 支持在启用 checkpointer 时迁移图定义。关键是 state schema 向后兼容——新增字段给默认值，删除字段要有迁移脚本。生产上建议版本化图定义，灰度期间新旧图并行，按 thread_id 路由到对应版本。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="060-langgraph-rag">

<h2 class="question-title"><span class="q-badge ai100-badge">Q60</span><span class="question-text">LangGraph 里怎么集成 RAG？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 工程 · 考察点：RAG 集成</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：RAG 作为 retrieve/grade/generate 节点嵌入图，质量门控不通过走 rewrite 环，比线性 RAG Chain 更可控。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：CRAG/Self-RAG 怎么画？ · 和科研问答项目怎么讲？</div>
</div>

**优先级**：P1 · 3+ 篇面经

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

RAG 与 LangGraph 的集成是 Agent 岗面经最高频的捆绑考点（阿里淘天、某大厂、编程导航均有）。核心思路：RAG 不是 LangGraph 的外挂插件，而是嵌入图内的节点链，每个环节是一个 node，环节之间的质量门控是条件边。

标准 RAG 图拓扑：retrieve_node 调向量库/混合检索，结果写入 state.retrieval_docs；grade_node 用 LLM 评判检索结果与 query 的相关性，写入 state.grade_score；条件边——score 低于阈值则路由到 rewrite_query_node（改写 query 写回 state.query）再回到 retrieve_node 形成环；score 够高则路由到 generate_node 基于 retrieval_docs 生成 answer；可选 cite_check_node 校验 answer 是否有 retrieval_docs 支撑，不通过则回 generate_node 重写。

比线性 RAG Chain 的核心优势：检索失败能改写 query 重试（而非带着空结果让 LLM 幻觉）；生成质量不够能据引用校验回流；每个节点可独立单测和监控；checkpoint 让「检索→评判→改写→再检索」的完整轨迹可追溯。

科研问答项目讲法：意图路由（intent_node 决定走向量 RAG 还是 GraphRAG）+ 质量门控（grade + rewrite 环）+ 引用校验（cite_check 环）。面试最好画 state 字段（query、retrieval_docs、grade_score、answer）和边。阿里淘天捆绑问的 RAG 分块、重叠、embedding 选型，可接在 retrieve_node 实现细节后讲。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="061-crag-self-rag-adaptive">

<h2 class="question-title"><span class="q-badge ai100-badge">Q61</span><span class="question-text">Corrective RAG / Self-RAG / Adaptive RAG 怎么用 LangGraph 实现？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：LangGraph, 工程 · 考察点：高级 RAG</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：CRAG：grade 后不好则 web_search 补检索；Self-RAG：生成带自评 token 条件回流；Adaptive：入口 router 选 RAG 策略。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和科研问答 grade_retrieval 关系？</div>
</div>

**优先级**：P2 · 1 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

这三种高级 RAG 变体在 LangGraph 里的实现差异，本质上是「图拓扑不同」——论文里的算法 = 图上的节点和条件边。面试讲清楚这一点，比背论文公式更有说服力。

Corrective RAG (CRAG)：在标准 RAG 的 grade 节点之后，如果相关度低，条件边不是简单 rewrite query，而是路由到 web_search 节点补充外部资料，再通过 merge_context 节点把 web 结果和原有 retrieval_docs 合并，然后 generate。拓扑：retrieve → grade → [低分] → web_search → merge → generate。科研问答项目的 grade_retrieval + rewrite 就是 CRAG 的简化版。

Self-RAG：generate 节点输出 answer 的同时输出自评 token（is_supported、is_relevant 等），critique 节点解析自评结果，条件边——不支持则回 retrieve 或 rewrite；支持但不够相关则回 generate 重写；全通过则 END。比 CRAG 多了「生成后自评」的环节，形成 generate → critique → [不通过] → retrieve/rewrite 的内环。

Adaptive RAG：入口多一个 router 节点，根据问题类型（事实问答/推理/闲聊/结构化查询）选择不同 RAG 策略——vector RAG 路径、GraphRAG 路径、直答（不用 RAG）、SQL 查询路径。每种策略是图上的一个分支，router 是入口条件边。适合问题类型差异大的综合问答系统。

三种模式可以组合：Adaptive 选策略 → CRAG 质量门控 → Self-RAG 生成自评。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="062-context-compression">

<h2 class="question-title"><span class="q-badge ai100-badge">Q62</span><span class="question-text">LangGraph 里上下文压缩怎么做？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LangGraph, 工程 · 考察点：上下文</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：在图中加 trim/summarize 节点，进 LLM 前裁剪 messages；可多层：工具结果摘要、滚动摘要、长期记忆检索回填。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：压缩过度怎么发现？ · 字节三层压缩怎么答？</div>
</div>

**优先级**：P1 · 3+ 篇面经

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

某大厂和字节面经都考「上下文压缩方式及优劣」，在 LangGraph 里压缩是显式节点而非隐式 hack，这是关键差异。

基础压缩节点：before_llm_node 在每次调 LLM 前执行——估算当前 messages 的 token 数（写 state.estimated_tokens），超过阈值则触发压缩：用 summarize 模型把旧 messages 压缩成 state.conversation_summary，trim messages 只保留 system prompt + 最近 k 轮对话 + summary。压缩后 estimated_tokens 重新估算，仍超标则进一步 trim k 值。

字节追问的「三层压缩」答法：第一层，工具输出摘要——tool_node 返回的大段 JSON/日志在写入 messages 前先经 summarize_tool_output 节点压缩，因为工具输出信息密度低、冗余多；第二层，对话滚动摘要——多轮对话后 before_llm 节点把旧 messages 压缩成 summary，保留最近 k 轮；第三层，长期记忆——跨会话的用户偏好和历史不在 messages 里，存在外置向量库，需要时 retrieve 回填。三层触发条件和保留策略不同，因为信息密度不同。

压缩过度的发现方式：离线评测集 answer 质量指标下降（尤其需要长上下文记忆的问题）；线上用户追问「你忘了刚才说的」；监控 summary 中关键实体（人名、订单号）丢失数量。压缩策略需要可配置——k 值、阈值、summary 模型选型都可以 A/B 测试。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="063-langsmith-observability">

<h2 class="question-title"><span class="q-badge ai100-badge">Q63</span><span class="question-text">LangGraph 与 LangSmith 可观测性怎么集成？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 工程 · 考察点：可观测</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：设 LANGCHAIN_TRACING 环境变量自动 trace 每节点；可看轨迹、评测、对比 prompt 版本。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：不用 LangSmith 怎么自建？ · 成本数据从哪来？</div>
</div>

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

LangSmith 与 LangGraph 同属 LangChain 生态，集成成本极低但价值很大——是生产级 Agent 可观测性的默认方案。

自动 trace：设置环境变量 LANGCHAIN_TRACING_V2=true 和 LANGCHAIN_API_KEY，每次 graph.invoke/astream 自动记录完整 trace——每个节点的输入 state 摘要、输出 partial update、耗时；每次 LLM 调用的 prompt、response、token 数、延迟；每次 tool 调用的参数、返回值、延迟。trace 按 thread_id 组织，可在 LangSmith UI 按图拓扑瀑布图查看。

核心用途：debug——用户投诉「回答不对」时，用 thread_id 拉 trace 看走了哪条边、哪个节点产出异常；prompt 版本对比——同一输入在不同 prompt 版本下的 node 输出 diff；dataset 回归——从线上 trace 采样 good/bad case 入库，定期跑回归评测；成本分析——从 LLM callback 聚合 token 消耗，按 node/用户/时间段统计。

不用 LangSmith 的自建方案：OpenTelemetry 标准——节点入口/出口打 span，属性带 thread_id、node_name、duration_ms；LLM callback 记录 token；导出到 Jaeger/Grafana/Prometheus。成本更高但无 vendor lock-in。

百度面经强调评测闭环：LangSmith 的核心价值是把在线 trace 沉淀成离线评测集的桥梁——线上 bad case → 一键入库 → 离线回归 → prompt 改进 → 上线验证。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="064-production-ready">

<h2 class="question-title"><span class="q-badge ai100-badge">Q64</span><span class="question-text">如何构建生产级（Production-Ready）LangGraph Agent？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：LangGraph, 工程 · 考察点：生产级</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：清单：全局 compile、Postgres checkpoint、HITL 高危操作、分层重试、节点监控、评测集、限流熔断、schema 版本化。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和生产 demo 最大差别？ · 第一优先级做什么？</div>
</div>

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

上线 Agent 图时，我会把可观测性和失败路径放在和主流程同一优先级。

GitHub Production Guide 和多家面经（百度、阿里、编程导航）共同指向的生产级 checklist，按优先级排列：

第一优先级——可恢复：应用启动时 compile 图全局单例；Postgres checkpointer 多副本共享；thread_id 会话隔离；recursion_limit + fallback 防死循环；state schema 版本管理 + 图迁移策略。这是「崩溃后不能丢状态」的底线。

第二优先级——可观测：LangSmith 或 OpenTelemetry 节点级 trace；按 node 聚合成功率、P99 延迟、token 消耗；告警阈值（失败率环比、延迟突增）；trace_id 贯穿。这是「出问题能定位」的能力。

第三优先级——可评测：离线黄金集定期回归；线上 bad case 自动入库；prompt 版本化 A/B 对比；节点级离线评测（不只端到端）。这是「持续改进」的闭环。

第四优先级——安全与韧性：高危操作（发邮件、扣款、删数据）interrupt 人工审批；tool 调用幂等键；输入输出 Guardrails（部署层 + 图内双层）；限流熔断（连续失败 N 次转人工）；secrets 不进 state。

GitMMQ 生产指南核心观点：LangGraph 价值是把黑盒循环变成可审计状态机。推荐路径：先用简单 Workflow/Chain 验证业务需求，遇到状态管理/循环/审批痛点再迁 LangGraph——不要为了炫技提前上图编排。

和 demo 的最大差别：demo 是 invoke 能跑通；生产级考虑了崩溃恢复、幂等、监控、bad case 闭环、schema 版本化。面试按「可恢复 > 可观测 > 可评测 > 安全韧性」顺序讲，体现工程优先级感。
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="multi">← 👥 LangGraph · 多 Agent</a>

<a class="chapter-nav-link chapter-nav-next" href="real">📋 LangGraph · 真实面经 →</a>

</div>
